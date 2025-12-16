import apiClient from './http.js';

export function listZones() {
  return apiClient.get('/zones').then(res => res.data);
}

export function getZoneById(id) {
  return apiClient.get(`/zones/${id}`).then(res => res.data);
}

export function createZone(payload) {
  return apiClient.post('/zones', payload).then(res => res.data);
}

export function updateZone(payload) {
  return apiClient.patch('/zones', payload).then(res => res.data);
}

export function deleteZone(id) {
  return apiClient.delete(`/zones/${id}`);
}

