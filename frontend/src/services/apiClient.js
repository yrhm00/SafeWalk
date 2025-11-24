const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiRequest(path, options = {}) {
  const email = localStorage.getItem('basic_email');
  const password = localStorage.getItem('basic_password');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (email && password) {
    const encoded = btoa(`${email}:${password}`);
    headers['Authorization'] = `Basic ${encoded}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    // pas de body JSON
  }

  if (!res.ok) {
    const message = body?.error || body?.message || `Erreur HTTP ${res.status}`;
    throw new Error(message);
  }

  return body;
}
