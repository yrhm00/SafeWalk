import apiClient from './apiClient';

export async function login(credentials) {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
}

export async function register(userData) {
  const response = await apiClient.post('/users/register', userData);
  return response.data;
}