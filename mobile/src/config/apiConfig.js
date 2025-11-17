// mobile/src/config/apiConfig.js
import Constants from 'expo-constants';

export function getApiBaseUrl() {
  const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};
  return extra.apiBaseUrl;
}