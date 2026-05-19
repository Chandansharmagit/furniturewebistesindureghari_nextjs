import axios from 'axios';

import { API_BASE_URL as API_BASE } from '../config/api';
const API_BASE_URL = `${API_BASE}/api`;

// Create axios instance for recommendations
const recommendationApi = axios.create({
  baseURL: `${API_BASE_URL}/recommendations`,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include JWT Authorization header
recommendationApi.interceptors.request.use(
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

// Add response interceptor for error handling
recommendationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Recommendation API Error:', error);
    return Promise.reject(error);
  }
);

class RecommendationService {
  // Get personalized product recommendations
  static async getPersonalizedRecommendations(sessionId = null, limit = 10) {
    try {
      const endpoint = sessionId ? `/products/${sessionId}` : '/products';
      const response = await recommendationApi.get(endpoint, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      throw error;
    }
  }

  // Get similar products based on a specific product
  static async getSimilarProducts(productId, limit = 5) {
    try {
      const response = await recommendationApi.get(`/similar/${productId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get similar products:', error);
      throw error;
    }
  }

  // Get trending products
  static async getTrendingProducts(limit = 10, days = 7) {
    try {
      const response = await recommendationApi.get('/trending', {
        params: { limit, days }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get trending products:', error);
      throw error;
    }
  }
}

export default RecommendationService;