import axios from 'axios';
import { clearSession } from './session.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function logoutAndRedirect() {
  clearSession();
  window.location.href = '/login';
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post(`${API_URL}/users/refresh`, { refreshToken });
  localStorage.setItem('token', response.data.token);
  return response.data.token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response && error.response.status === 401;

    if (isUnauthorized && !config.retriedAuth) {
      config.retriedAuth = true;

      try {
        const newToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(config);
      } catch (refreshError) {
        logoutAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    const retryDelays = [1000, 2000, 4000];
    const maxRetries = retryDelays.length;

    config.retryCount = config.retryCount || 0;

    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500 && error.response.status < 600;
    const isPostRequest = config.method === 'post';

    if ((isNetworkError || isServerError) && config.retryCount < maxRetries) {
      if (isPostRequest && !isNetworkError) {
        return Promise.reject(error);
      }

      const delay = retryDelays[config.retryCount];
      config.retryCount += 1;

      await new Promise((resolve) => setTimeout(resolve, delay));

      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
