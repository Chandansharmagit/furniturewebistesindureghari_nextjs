import axios from 'axios';
import { AI_ENDPOINTS, buildApiUrl } from '../config/api';

const aiApi = axios.create({
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json'
  }
});

aiApi.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

class AiService {
  async chat({ prompt, messages, context } = {}) {
    try {
      const response = await aiApi.post(buildApiUrl(AI_ENDPOINTS.CHAT), {
        prompt,
        messages,
        context
      });

      return {
        success: true,
        data: response.data,
        message: response.data?.message || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to generate AI response'
      };
    }
  }
}

const aiService = new AiService();

export default aiService;
