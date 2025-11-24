import { getApiBaseUrl } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

function encodeBasicAuth(email, password) {
  // Btoa maison compatible RN
  const str = `${email}:${password}`;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let i = 0;
  while (i < str.length) {
    const chr1 = str.charCodeAt(i++);
    const chr2 = str.charCodeAt(i++);
    const chr3 = str.charCodeAt(i++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output +=
      chars.charAt(enc1) +
      chars.charAt(enc2) +
      chars.charAt(enc3) +
      chars.charAt(enc4);
  }
  return output;
}

async function buildAuthHeader() {
  const email = await AsyncStorage.getItem('basic_email');
  const password = await AsyncStorage.getItem('basic_password');

  if (email && password) {
    const encoded = encodeBasicAuth(email, password);
    return `Basic ${encoded}`;
  }
  return null;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const auth = await buildAuthHeader();
  if (auth) {
    headers['Authorization'] = auth;
  }

  const url = `${getApiBaseUrl()}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let body = null;
    try {
      body = await res.json();
    } catch (e) {
      // pas de JSON
    }

    if (!res.ok) {
      const message = body?.error || body?.message || `Erreur HTTP ${res.status}`;
      throw new Error(message);
    }

    return body;
  } catch (e) {
    console.log('API error', { url, method: options.method || 'GET', message: e.message });
    throw e;
  }
}
