import axios from 'axios';
import { buildApiUrl, AUTH_ENDPOINTS } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT Authorization header
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401 || error.response?.status === 403) && typeof window !== 'undefined') {
      // Only redirect if we're not already on the login page and not in the middle of a login attempt
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password' || currentPath === '/new-password';
      const isLoginRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

      // Don't redirect if we're already on an auth page or making an auth request
      if (!isAuthPage && !isLoginRequest) {
        // Check if we actually have auth data before clearing it
        const hasAuthData = localStorage.getItem('user') || localStorage.getItem('authToken');

        // Only redirect if this is an authentication-related endpoint failure
        // Don't redirect for general API failures that might return 401/403
        const isAuthEndpoint = error.config?.url?.includes('/auth/') ||
          error.config?.url?.includes('/profile') ||
          error.config?.url?.includes('/orders/my-orders');

        if (hasAuthData && isAuthEndpoint) {
          console.log('Authentication endpoint failed, clearing auth data and redirecting to login');
          // Token expired or invalid - clear auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userPassword');

          console.log('Auth token expired, user should be redirected to login');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Authentication Service
class AuthService {
  // Login user with proper authentication
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Use the proper login endpoint to authenticate and get user data
      const response = await axios.post(
        buildApiUrl(AUTH_ENDPOINTS.LOGIN),
        {
          email: email,
          password: password
        }
      );

      const { user, token } = response.data;

      // Store the authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Also store email/password for backward compatibility with simple auth
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);

      console.log('Login successful - User role:', user.role);

      return {
        success: true,
        data: { user, token },
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.',
        status: error.response?.status
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post(
        buildApiUrl(AUTH_ENDPOINTS.REGISTER),
        {
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          address: userData.address
        }
      );

      const { user, token } = response.data;

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        data: { user, token },
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.',
        status: error.response?.status
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Clear stored data
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await apiClient.get(buildApiUrl(AUTH_ENDPOINTS.PROFILE));
      return {
        success: true,
        data: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch profile'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(
        buildApiUrl(AUTH_ENDPOINTS.PROFILE),
        profileData
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile'
      };
    }
  }

  // Upload profile picture
  async uploadProfilePicture(formData) {
    try {
      const response = await apiClient.post(
        buildApiUrl('/api/auth/upload-profile-picture'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update stored user data with new profile picture
      const storedUser = this.getCurrentUser();
      if (storedUser) {
        storedUser.profile_picture = response.data.profile_picture;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }

      return {
        success: true,
        data: response.data,
        message: 'Profile picture uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upload profile picture'
      };
    }
  }

  // Verify token
  async verifyToken() {
    try {
      const response = await apiClient.get(buildApiUrl(AUTH_ENDPOINTS.VERIFY));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Token verification failed'
      };
    }
  }

  // Verify Email
  async verifyEmail(token) {
    try {
      const response = await apiClient.post(
        buildApiUrl(AUTH_ENDPOINTS.VERIFY_EMAIL),
        { token }
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Email verification failed. The link may have expired or is invalid.'
      };
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(
        buildApiUrl(AUTH_ENDPOINTS.FORGOT_PASSWORD),
        { email }
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to process request'
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post(
        buildApiUrl(AUTH_ENDPOINTS.CHANGE_PASSWORD),
        passwordData
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to change password'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
    const user = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');

    if (!user) {
      return false;
    }
    
    // If we have an authToken, that's sufficient (e.g. for Google Auth)
    if (authToken) {
      try {
        const userData = JSON.parse(user);
        return !!userData.email;
      } catch (error) {
        return false;
      }
    }

    if (!email || !password) {
      return false;
    }

    try {
      const userData = JSON.parse(user);
      return !!(email && password && userData && userData.email);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  }

  // Set authentication state from AuthContext
  setAuthState(isAuthenticated, user) {
    this._contextAuthState = {
      isAuthenticated,
      user,
      timestamp: Date.now()
    };
  }

  // Check authentication with context awareness
  isAuthenticatedWithContext() {
    if (typeof window === 'undefined') return false;
    // If we have recent context state, use it
    if (this._contextAuthState &&
      (Date.now() - this._contextAuthState.timestamp) < 5000) { // 5 second window
      return this._contextAuthState.isAuthenticated;
    }

    // Fallback to localStorage check
    return this.isAuthenticated();
  }

  // Validate current token
  validateToken() {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token) {
      console.error('No auth token found in localStorage');
      return false;
    }

    if (!user) {
      console.error('No user data found in localStorage');
      return false;
    }

    try {
      const userData = JSON.parse(user);
      console.log('Token validation successful:', {
        tokenLength: token.length,
        userRole: userData.role,
        userEmail: userData.email
      });
      return true;
    } catch (error) {
      console.error('Invalid user data in localStorage:', error);
      return false;
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get stored credentials
  getCredentials() {
    if (typeof window === 'undefined') return {};
    const authToken = localStorage.getItem('authToken');
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
  }

  // Get authentication token (for compatibility with components expecting JWT)
  getToken() {
    if (typeof window === 'undefined') return null;
    // First try to get JWT token if available
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      return authToken;
    }

    // Fallback to basic auth credentials
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');

    if (email && password) {
      // Return a basic auth token format for compatibility
      return btoa(`${email}:${password}`);
    }

    return null;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
