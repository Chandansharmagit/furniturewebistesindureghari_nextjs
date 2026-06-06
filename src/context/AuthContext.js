"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Clear auth data helper function
  const clearAuthData = useCallback(() => {
    console.log('🧹 Clearing auth data');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    setUser(null);
    setIsAuthenticated(false);
    // Sync with authService
    authService.setAuthState(false, null);
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth state...');
        
        const storedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        const userPassword = localStorage.getItem('userPassword');
        
        console.log('📦 Checking stored auth data:', {
          hasUser: !!storedUser,
          hasToken: !!authToken,
          hasEmail: !!userEmail,
          hasPassword: !!userPassword
        });
        
        // Check if we have valid authentication data
        if (storedUser && (authToken || (userEmail && userPassword))) {
          try {
            const userData = JSON.parse(storedUser);
            
            // Validate user data structure
            if (userData && userData.email && userData.role) {
              console.log('✅ Valid auth data found, restoring session:', userData.email, userData.role);
              setUser(userData);
              setIsAuthenticated(true);
              
              // Sync with authService
              authService.setAuthState(true, userData);
            } else {
              console.log('❌ Invalid user data structure, clearing auth');
              clearAuthData();
            }
          } catch (parseError) {
            console.error('❌ Error parsing stored user data:', parseError);
            clearAuthData();
          }
        } else {
          console.log('ℹ️ No valid auth data found in localStorage');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth state:', error);
        clearAuthData();
      } finally {
        console.log('✅ Auth initialization complete');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuthData]);

  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting login...');
      
      const result = await authService.login(credentials);
      
      if (result.success) {
        console.log('✅ Login successful, updating auth state:', result.data.user);
        setUser(result.data.user);
        setIsAuthenticated(true);
        
        // Sync with authService
        authService.setAuthState(true, result.data.user);
        
        // Verify the data was stored correctly
        const storedUser = localStorage.getItem('user');
        const storedEmail = localStorage.getItem('userEmail');
        console.log('📦 Verification - Data stored:', {
          hasUser: !!storedUser,
          hasEmail: !!storedEmail
        });
        
        return result;
      } else {
        console.log('❌ Login failed:', result.error);
        setUser(null);
        setIsAuthenticated(false);
        return result;
      }
    } catch (error) {
      console.error('❌ Login error in context:', error);
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 Logging out...');
    authService.logout();
    clearAuthData();
    console.log('✅ Logout complete');
  }, [clearAuthData]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const checkAuthStatus = useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    
    if (!storedUser || !(authToken || (userEmail && userPassword))) {
      return false;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      return userData && userData.email && userData.role;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuthStatus
  }), [user, isAuthenticated, isLoading, login, logout, updateUser, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
