import { apiRequest } from './httpClient';

export function getMe() {
  return apiRequest('/users/me');
}

export function updateMe(payload) {
  return apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

