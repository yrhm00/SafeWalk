import apiClient from './http.js';

export function listReportTypes() {
  return apiClient.get('/report-types').then(res => res.data);
}

export function getReportTypeById(id) {
  return apiClient.get(`/report-types/${id}`).then(res => res.data);
}

export function createReportType(payload) {
  return apiClient.post('/report-types', payload).then(res => res.data);
}

export function updateReportType(id, payload) {
  return apiClient.patch(`/report-types/${id}`, payload).then(res => res.data);
}

export function deleteReportType(id) {
  return apiClient.delete(`/report-types/${id}`);
}

