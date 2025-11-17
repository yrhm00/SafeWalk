import { apiRequest } from './apiClient.js';

export function listReports({ page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  return apiRequest(`/reports?${params.toString()}`);
}

export function getReportById(id) {
  return apiRequest(`/reports/${id}`);
}

export function updateReport(id, payload) {
  return apiRequest(`/reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ id, ...payload }),
  });
}

export function deleteReport(id) {
  return apiRequest(`/reports/${id}`, {
    method: 'DELETE',
  });
}

