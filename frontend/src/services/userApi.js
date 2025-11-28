import apiClient from './apiClient.js';

export function getMyProfile() {
  return apiClient.get('/users/me').then(res => res.data);
}

export function listUsers({ limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  return apiClient.get(`/users?${params.toString()}`).then(res => res.data);
}

export function getUserById(id) {
  return apiClient.get(`/users/${id}`).then(res => res.data);
}

export function createUser(payload) {
  return apiClient.post('/users', payload).then(res => res.data);
}

export function updateUser(payload) {
  return apiClient.patch('/users', payload).then(res => res.data);
}

export function deleteUser(id) {
  return apiClient.delete(`/users/${id}`);
}

