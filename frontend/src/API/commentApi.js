import apiClient from './http.js';

export function listComments(reportId) {
    return apiClient.get(`/comments/report/${reportId}`).then(res => res.data);
}

export function createComment(payload) {
    return apiClient.post('/comments', payload).then(res => res.data);
}

export function updateComment(id, content) {
    return apiClient.patch(`/comments/${id}`, { content }).then(res => res.data);
}

export function deleteComment(id) {
    return apiClient.delete(`/comments/${id}`);
}
