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
    // Incident Types (Badges & Pins)
    badges: {
        suspicious: '#FF3B30',
        theft: '#FF3B30',
        harassment: '#FF9500',
        lighting: '#FFCC00',
        icy: '#00BCD4',
        flooded: '#007AFF',
        sidewalk: '#8E8E93',
        default: '#007AFF'
    },
    // Grays
    gray: {
        light: '#F5F5F5',
        medium: '#888888',
        dark: '#333333',
        text: '#666666',
        border: '#DDDDDD',
        input: '#EEEEEE'
    },
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
