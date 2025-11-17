import { apiRequest } from './apiClient.js';

export function listZones() {
  return apiRequest('/zones');
}

export function getZoneById(id) {
  return apiRequest(`/zones/${id}`);
}

export function createZone(payload) {
  return apiRequest('/zones', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateZone(payload) {
  return apiRequest('/zones', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteZone(id) {
  return apiRequest(`/zones/${id}`, {
    method: 'DELETE',
  });
}

