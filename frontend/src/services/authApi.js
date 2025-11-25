import apiClient from './apiClient.js';

export async function login(credentials) {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
}
