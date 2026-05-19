import axios from 'axios';
import { buildApiUrl } from '../config/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if we're not already on the login page
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password' || currentPath === '/new-password';
      
      if (!isAuthPage) {
        // Credentials invalid - clear auth data but don't force redirect
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        console.log('Favorites service: Auth failed, credentials cleared');
        // Let the component handle the redirect instead of forcing a page refresh
      }
    }
    return Promise.reject(error);
  }
);

const favoritesService = {
  // Get user's favorites
  async getFavorites() {
    try {
      const response = await apiClient.get(buildApiUrl('/api/favorites'));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get favorites error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch favorites'
      };
    }
  },

  // Add product to favorites
  async addToFavorites(productId) {
    try {
      const response = await apiClient.post(buildApiUrl(`/api/favorites/${productId}`));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Add to favorites error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add to favorites'
      };
    }
  },

  // Remove product from favorites
  async removeFromFavorites(productId) {
    try {
      const response = await apiClient.delete(buildApiUrl(`/api/favorites/${productId}`));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Remove from favorites error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to remove from favorites'
      };
    }
  },

  // Check if product is in favorites
  async checkFavoriteStatus(productId) {
    try {
      const response = await apiClient.get(buildApiUrl(`/api/favorites/check/${productId}`));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Check favorite status error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check favorite status'
      };
    }
  },

  // Get favorites count
  async getFavoritesCount() {
    try {
      const response = await apiClient.get(buildApiUrl('/api/favorites/count'));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get favorites count error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get favorites count'
      };
    }
  },

  // Toggle favorite status
  async toggleFavorite(productId) {
    try {
      const statusResult = await this.checkFavoriteStatus(productId);
      if (!statusResult.success) {
        return statusResult;
      }

      const isFavorite = statusResult.data.isFavorite;
      
      if (isFavorite) {
        return await this.removeFromFavorites(productId);
      } else {
        return await this.addToFavorites(productId);
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return {
        success: false,
        error: error.message || 'Failed to toggle favorite status'
      };
    }
  }
};

export default favoritesService;