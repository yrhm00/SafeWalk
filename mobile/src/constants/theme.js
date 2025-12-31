import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
    primary: '#0A2540',
    secondary: '#007AFF',
    accent: '#FFD700',
    background: '#F0F2F5',
    text: '#333333',
    textLight: '#FFFFFF',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    gradients: {
        primary: ['#0A2540', '#183B5E'],
        login: ['#000428', '#004e92'],
    }
};

export const SIZES = {
    padding: 20,
    radius: 12,
    h1: 30,
    h2: 24,
    h3: 18,
    body: 14,
    width,
    height,
};
