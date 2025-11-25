import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../config/apiConfig';

const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs globales
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || 'Erreur réseau';
        console.log('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message,
        });
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
