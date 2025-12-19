import axios from 'axios';

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    const retryDelays = [1000, 2000, 4000];
    const maxRetries = retryDelays.length;

    if (!config) {
      return Promise.reject(error);
    }

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

      console.log(`Retry attempt ${config.retryCount} in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));

      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
