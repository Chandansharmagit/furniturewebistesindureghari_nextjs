import React, { useState } from 'react';
import authService from '../../services/authService';
import dashboardService from '../../services/dashboardService';

const AuthDebug = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const log = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testLogin = async () => {
    setLoading(true);
    log('🔍 Testing login flow...', 'info');
    
    try {
      const result = await authService.login({
        email: 'admin@furniture.com',
        password: 'admin123'
      });
      
      if (result.success) {
        log('✅ Login successful!', 'success');
        log(`Token: ${result.data.token.substring(0, 50)}...`, 'info');
        log(`User: ${result.data.user.email} (${result.data.user.role})`, 'info');
        
        // Check localStorage
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken) {
          log('✅ Token stored in localStorage', 'success');
        } else {
          log('❌ Token NOT stored in localStorage', 'error');
        }
        
        if (storedUser) {
          log('✅ User data stored in localStorage', 'success');
        } else {
          log('❌ User data NOT stored in localStorage', 'error');
        }
      } else {
        log(`❌ Login failed: ${result.error}`, 'error');
      }
    } catch (error) {
      log(`❌ Login error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testDashboard = async () => {
    setLoading(true);
    log('🔍 Testing dashboard API...', 'info');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        log('❌ No token found in localStorage', 'error');
        setLoading(false);
        return;
      }
      
      log(`Using token: ${token.substring(0, 50)}...`, 'info');
      
      const result = await dashboardService.getOverview();
      
      if (result.success) {
        log('✅ Dashboard API successful!', 'success');
        log(`KPIs: Revenue: ₹${result.data.kpis.total_revenue}, Customers: ${result.data.kpis.active_customers}`, 'info');
      } else {
        log(`❌ Dashboard API failed: ${result.error}`, 'error');
      }
    } catch (error) {
      log(`❌ Dashboard API error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    log('🔍 Checking authentication status...', 'info');
    
    const isAuth = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    const token = authService.getToken();
    
    log(`Is Authenticated: ${isAuth}`, isAuth ? 'success' : 'error');
    
    if (user) {
      log(`Current User: ${user.email} (${user.role})`, 'success');
    } else {
      log('No current user found', 'error');
    }
    
    if (token) {
      log(`Token exists: ${token.substring(0, 50)}...`, 'success');
    } else {
      log('No token found', 'error');
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    log('✅ Storage cleared', 'info');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Authentication Debug Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
        
        <button 
          onClick={testDashboard} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Test Dashboard
        </button>
        
        <button 
          onClick={checkAuth} 
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Check Auth Status
        </button>
        
        <button 
          onClick={clearStorage} 
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Clear Storage
        </button>
        
        <button 
          onClick={clearLogs} 
          style={{ padding: '10px 20px' }}
        >
          Clear Logs
        </button>
      </div>
      
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '5px', 
        padding: '15px', 
        maxHeight: '400px', 
        overflowY: 'auto',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>Debug Logs:</h3>
        {logs.length === 0 ? (
          <p style={{ color: '#666' }}>No logs yet. Click a button to start testing.</p>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '5px',
                color: log.type === 'error' ? 'red' : log.type === 'success' ? 'green' : 'black',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
            >
              <span style={{ color: '#666' }}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthDebug;