import apiClient from './http.js';

export async function login(credentials) {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
}
