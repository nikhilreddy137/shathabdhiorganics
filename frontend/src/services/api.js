import axios from 'axios';
import { logger } from '../utils/logger';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Products API
export const productAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data;
    } catch (error) {
      logger.error('Error fetching products:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching product:', error);
      throw error;
    }
  },

  search: async (q, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/products/search`, { params: { q, limit } });
      return response.data;
    } catch (error) {
      logger.error('Error searching products:', error);
      throw error;
    }
  },
};

// Cart API
export const cartAPI = {
  get: async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/cart/${sessionId}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching cart:', error);
      throw error;
    }
  },

  addItem: async (sessionId, item) => {
    try {
      const response = await axios.post(`${API_URL}/cart/${sessionId}/items`, item);
      return response.data;
    } catch (error) {
      logger.error('Error adding to cart:', error);
      throw error;
    }
  },

  updateItem: async (sessionId, productId, selectedSize, quantity) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/${sessionId}/items/${productId}`,
        { quantity },
        { params: { selected_size: selectedSize } }
      );
      return response.data;
    } catch (error) {
      logger.error('Error updating cart item:', error);
      throw error;
    }
  },

  removeItem: async (sessionId, productId, selectedSize) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cart/${sessionId}/items/${productId}`,
        { params: { selected_size: selectedSize } }
      );
      return response.data;
    } catch (error) {
      logger.error('Error removing from cart:', error);
      throw error;
    }
  },

  clear: async (sessionId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/${sessionId}`);
      return response.data;
    } catch (error) {
      logger.error('Error clearing cart:', error);
      throw error;
    }
  },
};

// Categories API
export const categoryAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
  },
};

// Testimonials API
export const testimonialAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/testimonials`, { params });
      return response.data;
    } catch (error) {
      logger.error('Error fetching testimonials:', error);
      throw error;
    }
  },
};
