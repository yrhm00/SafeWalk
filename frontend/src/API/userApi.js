import apiClient from './http.js';

export async function getMyProfile() {
  const response = await apiClient.get('/users/me');
  return response.data;
}

export async function listUsers({ limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  const response = await apiClient.get(`/users?${params.toString()}`);
  return response.data;
}

export async function getUserById(id) {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
}

export async function createUser(payload) {
  const response = await apiClient.post('/users', payload);
  return response.data;
}

export async function updateUser(id, payload) {
  const response = await apiClient.patch(`/users/${id}`, payload);
  return response.data;
}

export async function deleteUser(id) {
  await apiClient.delete(`/users/${id}`);
}

