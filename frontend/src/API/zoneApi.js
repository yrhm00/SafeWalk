import apiClient from './http.js';

export function listZones() {
  return apiClient.get('/zones', { params: { t: Date.now() } }).then(res => res.data);
}

export function getZoneById(id) {
  return apiClient.get(`/zones/${id}`, { params: { t: Date.now() } }).then(res => res.data);
}

export function createZone(payload) {
  return apiClient.post('/zones', payload).then(res => res.data);
}

export function updateZone(id, payload) {
  return apiClient.patch(`/zones/${id}`, payload).then(res => res.data);
}

export function deleteZone(id) {
  return apiClient.delete(`/zones/${id}`);
}

