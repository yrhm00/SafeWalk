import { apiRequest } from './httpClient';

export function listReports({ page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiRequest(`/reports?${params.toString()}`);
}

export function getReportById(id) {
  return apiRequest(`/reports/${id}`);
}

export function createReport(payload) {
  return apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

