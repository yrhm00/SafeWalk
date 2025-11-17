import { apiRequest } from './apiClient.js';

export function listUsers({ limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  return apiRequest(`/users?${params.toString()}`);
}

export function getUserById(id) {
  return apiRequest(`/users/${id}`);
}

export function createUser(payload) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUser(payload) {
  return apiRequest('/users', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteUser(id) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}

