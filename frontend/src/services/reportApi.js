import apiClient from './apiClient.js';

export function listReports({ page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  return apiClient.get(`/reports?${params.toString()}`).then(res => res.data);
}

export function getReportById(id) {
  return apiClient.get(`/reports/${id}`).then(res => res.data);
}

export function createReport(payload) {
  return apiClient.post('/reports', payload).then(res => res.data);
}

export function updateReport(id, payload) {
  return apiClient.patch(`/reports/${id}`, { id, ...payload }).then(res => res.data);
}

export function deleteReport(id) {
  return apiClient.delete(`/reports/${id}`);
}

