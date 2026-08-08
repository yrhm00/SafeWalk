import apiClient from './http.js';

export async function listReports({ limit = 20, offset = 0, search = '' } = {}) {
  const params = new URLSearchParams({ limit, offset, search });
  const response = await apiClient.get(`/reports?${params.toString()}`);
  return response.data;
}

export async function getReportById(id) {
  const response = await apiClient.get(`/reports/${id}`);
  return response.data;
}

export async function createReport(payload) {
  const response = await apiClient.post('/reports', payload);
  return response.data;
}

export async function updateReport(id, payload) {
  const response = await apiClient.patch(`/reports/${id}`, payload);
  return response.data;
}

export async function deleteReport(id) {
  await apiClient.delete(`/reports/${id}`);
}

