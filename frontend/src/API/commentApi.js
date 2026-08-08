import apiClient from './http.js';

export async function listComments(reportId) {
    const response = await apiClient.get(`/comments/report/${reportId}`);
    return response.data;
}

export async function createComment(payload) {
    const response = await apiClient.post('/comments', payload);
    return response.data;
}

export async function updateComment(id, content) {
    const response = await apiClient.patch(`/comments/${id}`, { content });
    return response.data;
}

export async function deleteComment(id) {
    await apiClient.delete(`/comments/${id}`);
}
