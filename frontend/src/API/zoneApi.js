import apiClient from './http.js';

export async function listZones({ limit = 20, offset = 0, search = '' } = {}) {
  const response = await apiClient.get('/zones', { params: { limit, offset, search, t: Date.now() } });
  return response.data;
}

export async function getZoneById(id) {
  const response = await apiClient.get(`/zones/${id}`, { params: { t: Date.now() } });
  return response.data;
}

export async function createZone(payload) {
  const response = await apiClient.post('/zones', payload);
  return response.data;
}

export async function updateZone(id, payload) {
  const response = await apiClient.patch(`/zones/${id}`, payload);
  return response.data;
}

export async function deleteZone(id) {
  await apiClient.delete(`/zones/${id}`);
}

