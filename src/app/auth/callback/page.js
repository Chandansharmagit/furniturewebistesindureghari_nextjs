'use client';

import React, { useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import authService from '@/services/authService';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateUser } = useAuth();
  const processedRef = useRef(false);
  
  useEffect(() => {
    if (processedRef.current) return;
    
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    
    if (token && userStr) {
      processedRef.current = true;
      try {
        console.log('🔑 Processing OAuth callback...');
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Save to localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Legacy fallback
        localStorage.setItem('userEmail', user.email);
        
        // Sync with authService
        authService.setAuthState(true, user);
        
        // Update context
        updateUser(user);
        
        console.log('✅ Auth success, redirecting...', user.email);
        // Redirect to profile or admin
        if (user.email === 'sharma18chandan@gmail.com' || user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/profile');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login?error=InvalidUserData');
      }
    } else {
      // If neither is present, only redirect if we aren't already waiting for them
      if (token || userStr) {
        router.push('/login?error=MissingAuthData');
      }
    }
  }, [searchParams, router, updateUser]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#FAF8F5' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(197, 168, 90, 0.2)', borderTopColor: '#C5A85A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p style={{ fontFamily: '"Outfit", sans-serif', color: '#7E7E8A' }}>Authenticating...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
