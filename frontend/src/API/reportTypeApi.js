import apiClient from './http.js';

export async function listReportTypes() {
  const response = await apiClient.get('/report-types', { params: { t: Date.now() } });
  return response.data;
}

export async function getReportTypeById(id) {
  const response = await apiClient.get(`/report-types/${id}`, { params: { t: Date.now() } });
  return response.data;
}

export async function createReportType(payload) {
  const response = await apiClient.post('/report-types', payload);
  return response.data;
}

export async function updateReportType(id, payload) {
  const response = await apiClient.patch(`/report-types/${id}`, payload);
  return response.data;
}

export async function deleteReportType(id) {
  await apiClient.delete(`/report-types/${id}`);
}

