// Authentication Debugging Utility
// This helps identify authentication issues in the admin dashboard

import authService from '../services/authService';

class AuthDebugger {
  static checkAuthStatus() {
    console.log('🔍 Authentication Debug Report');
    console.log('=' .repeat(50));
    
    // Check localStorage items
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    console.log('📦 LocalStorage Status:');
    console.log(`   authToken: ${authToken ? '✅ Present' : '❌ Missing'}`);
    console.log(`   user: ${userData ? '✅ Present' : '❌ Missing'}`);
    
    if (authToken) {
      console.log(`   Token length: ${authToken.length} characters`);
      console.log(`   Token preview: ${authToken.substring(0, 50)}...`);
    }
    
    // Check user data
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('👤 User Data:');
        console.log(`   Email: ${user.email || 'Not set'}`);
        console.log(`   Role: ${user.role || 'Not set'}`);
        console.log(`   ID: ${user.id || 'Not set'}`);
        console.log(`   Active: ${user.is_active !== undefined ? user.is_active : 'Unknown'}`);
      } catch (error) {
        console.log('❌ User data is corrupted:', error.message);
      }
    }
    
    // Check authentication service status
    console.log('🔐 AuthService Status:');
    console.log(`   isAuthenticated(): ${authService.isAuthenticated()}`);
    console.log(`   validateToken(): ${authService.validateToken()}`);
    
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      console.log(`   Current user role: ${currentUser.role}`);
      console.log(`   Admin access: ${currentUser.role === 'admin' || currentUser.role === 'sales_manager'}`);
    }
    
    // Check for common issues
    console.log('⚠️  Common Issues Check:');
    
    if (!authToken) {
      console.log('   🚨 No authentication token found - User needs to log in');
    }
    
    if (!userData) {
      console.log('   🚨 No user data found - User needs to log in');
    }
    
    if (authToken && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role !== 'admin' && user.role !== 'sales_manager') {
          console.log(`   🚨 Insufficient permissions - User role '${user.role}' cannot access admin dashboard`);
        }
        
        if (user.is_active === false) {
          console.log('   🚨 User account is inactive');
        }
      } catch (error) {
        console.log('   🚨 Corrupted user data in localStorage');
      }
    }
    
    console.log('\n💡 Solutions:');
    console.log('   1. If no token/user data: Log in again');
    console.log('   2. If insufficient permissions: Contact admin for role upgrade');
    console.log('   3. If account inactive: Contact admin to activate account');
    console.log('   4. If data corrupted: Clear localStorage and log in again');
    
    return {
      hasToken: !!authToken,
      hasUserData: !!userData,
      isAuthenticated: authService.isAuthenticated(),
      tokenValid: authService.validateToken(),
      currentUser: currentUser
    };
  }
  
  static async testDashboardAccess() {
    console.log('\n🧪 Testing Dashboard API Access...');
    
    const authStatus = this.checkAuthStatus();
    
    if (!authStatus.isAuthenticated) {
      console.log('❌ Cannot test APIs - User not authenticated');
      return false;
    }
    
    try {
      // Test a simple dashboard endpoint
      const response = await fetch('/api/dashboard/overview?period=7', {
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📊 Dashboard API Test: ${response.status}`);
      
      if (response.status === 200) {
        console.log('✅ Dashboard API access successful');
        return true;
      } else if (response.status === 401 || response.status === 403) {
        console.log('❌ Dashboard API access denied - Authentication issue');
        const errorData = await response.json();
        console.log('Error details:', errorData);
        return false;
      } else {
        console.log(`⚠️  Dashboard API returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log('❌ Dashboard API test failed:', error.message);
      return false;
    }
  }
  
  static clearAuthData() {
    console.log('🧹 Clearing authentication data...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('✅ Authentication data cleared. Please log in again.');
  }
  
  static fixAuthIssues() {
    console.log('🔧 Attempting to fix common authentication issues...');
    
    // Check for token inconsistencies
    const authToken = localStorage.getItem('authToken');
    const oldToken = localStorage.getItem('token');
    
    if (!authToken && oldToken) {
      console.log('🔄 Found old token format, migrating...');
      localStorage.setItem('authToken', oldToken);
      localStorage.removeItem('token');
      console.log('✅ Token migrated from \'token\' to \'authToken\'');
    }
    
    // Validate user data format
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (!user.id || !user.email || !user.role) {
          console.log('⚠️  User data appears incomplete');
          console.log('Current user data:', user);
        }
      } catch (error) {
        console.log('🚨 User data is corrupted, clearing...');
        localStorage.removeItem('user');
      }
    }
    
    return this.checkAuthStatus();
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.AuthDebugger = AuthDebugger;
}

export default AuthDebugger;