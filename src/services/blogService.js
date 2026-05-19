import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import authService from './authService';

const BLOG_URL = `${API_BASE_URL}/api/blogs`;

const blogService = {
  // Get all published blogs
  getAllBlogs: async () => {
    try {
      const response = await axios.get(BLOG_URL);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch blogs' };
    }
  },

  // Get current user's blogs
  getMyBlogs: async () => {
    try {
      const credentials = authService.getCredentials();
      const response = await axios.get(`${BLOG_URL}/user`, { headers: credentials });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch your blogs' };
    }
  },

  // Get all blogs (Admin only)
  getAdminBlogs: async () => {
    try {
      const credentials = authService.getCredentials();
      const response = await axios.get(`${BLOG_URL}/admin/all`, { headers: credentials });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch admin blogs' };
    }
  },

  // Get single blog by slug
  getBlogBySlug: async (slug) => {
    try {
      const response = await axios.get(`${BLOG_URL}/${slug}`);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Blog post not found' };
    }
  },

  // Create blog post
  createBlog: async (formData) => {
    try {
      const credentials = authService.getCredentials();
      const response = await axios.post(BLOG_URL, formData, {
        headers: {
          ...credentials,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create blog post' };
    }
  },

  // Update blog post
  updateBlog: async (id, formData) => {
    try {
      const credentials = authService.getCredentials();
      const response = await axios.put(`${BLOG_URL}/${id}`, formData, {
        headers: {
          ...credentials,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update blog post' };
    }
  },

  // Delete blog post
  deleteBlog: async (id) => {
    try {
      const credentials = authService.getCredentials();
      const response = await axios.delete(`${BLOG_URL}/${id}`, { headers: credentials });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete blog post' };
    }
  }
};

export default blogService;
