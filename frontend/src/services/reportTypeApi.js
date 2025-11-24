import { apiRequest } from './apiClient.js';

export function listReportTypes() {
  return apiRequest('/report-types');
}

export function getReportTypeById(id) {
  return apiRequest(`/report-types/${id}`);
}

export function createReportType(payload) {
  return apiRequest('/report-types', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateReportType(payload) {
  return apiRequest('/report-types', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteReportType(id) {
  return apiRequest(`/report-types/${id}`, {
    method: 'DELETE',
  });
}

