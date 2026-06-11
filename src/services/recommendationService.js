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
  static normalizeText(value) {
    return String(value || '').toLowerCase().trim();
  }

  static tokenizeProduct(product = {}) {
    const text = [
      product.name,
      product.title,
      product.category,
      product.categoryName,
      product.material,
      product.wooden_type,
      product.product_color,
      product.style,
      product.description,
      ...(Array.isArray(product.tags) ? product.tags : [])
    ].filter(Boolean).join(' ');

    return new Set(
      this.normalizeText(text)
        .split(/[^a-z0-9]+/i)
        .filter((word) => word.length > 2)
    );
  }

  static getPrice(product = {}) {
    return Number(product.new_price || product.salePrice || product.price || 0);
  }

  static scoreProductMatch(currentProduct = {}, candidate = {}) {
    const currentId = String(currentProduct.id || currentProduct._id || '');
    const candidateId = String(candidate.id || candidate._id || '');
    if (!candidateId || currentId === candidateId) return -1;

    let score = 0;
    const currentCategory = this.normalizeText(currentProduct.category || currentProduct.categoryName);
    const candidateCategory = this.normalizeText(candidate.category || candidate.categoryName);
    const currentCategoryId = String(currentProduct.categoryId || currentProduct.category_id || '');
    const candidateCategoryId = String(candidate.categoryId || candidate.category_id || '');
    const currentMaterial = this.normalizeText(currentProduct.material || currentProduct.wooden_type);
    const candidateMaterial = this.normalizeText(candidate.material || candidate.wooden_type);
    const currentColor = this.normalizeText(currentProduct.product_color || currentProduct.color);
    const candidateColor = this.normalizeText(candidate.product_color || candidate.color);

    if (currentCategoryId && candidateCategoryId && currentCategoryId === candidateCategoryId) score += 8;
    if (currentCategory && candidateCategory && currentCategory === candidateCategory) score += 6;
    if (currentMaterial && candidateMaterial && currentMaterial === candidateMaterial) score += 4;
    if (currentColor && candidateColor && currentColor === candidateColor) score += 2;

    const currentPrice = this.getPrice(currentProduct);
    const candidatePrice = this.getPrice(candidate);
    if (currentPrice > 0 && candidatePrice > 0) {
      const differenceRatio = Math.abs(currentPrice - candidatePrice) / currentPrice;
      if (differenceRatio <= 0.15) score += 4;
      else if (differenceRatio <= 0.35) score += 2;
      else if (differenceRatio <= 0.6) score += 1;
    }

    const currentTokens = this.tokenizeProduct(currentProduct);
    const candidateTokens = this.tokenizeProduct(candidate);
    let sharedTokens = 0;
    candidateTokens.forEach((token) => {
      if (currentTokens.has(token)) sharedTokens += 1;
    });

    score += Math.min(sharedTokens, 8);
    score += Number(candidate.rating || 0) > 0 ? Math.min(Number(candidate.rating), 5) / 2 : 0;

    return score;
  }

  static getContextualRecommendations(currentProduct = {}, products = [], limit = 6) {
    if (!currentProduct || !Array.isArray(products)) return [];

    return products
      .map((product) => ({
        ...product,
        recommendationScore: this.scoreProductMatch(currentProduct, product)
      }))
      .filter((product) => product.recommendationScore >= 0)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

  static async getCatalogProducts(limit = 80) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { limit, sort: 'newest' }
      });
      return Array.isArray(response.data) ? response.data : response.data?.products || [];
    } catch (error) {
      console.error('Failed to get catalog products for recommendations:', error);
      throw error;
    }
  }

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
