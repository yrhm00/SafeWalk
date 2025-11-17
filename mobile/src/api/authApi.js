// javascript
    // `mobile/src/api/authApi.js`
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { apiRequest } from '../api/httpClient';

    export async function login({ email, password }) {
      await AsyncStorage.setItem('basic_email', email);
      await AsyncStorage.setItem('basic_password', password);
      const me = await apiRequest('/users/me');
      return me;
    }

    export async function logout() {
      await AsyncStorage.removeItem('basic_email');
      await AsyncStorage.removeItem('basic_password');
    }

    export async function registerUser(payload) {
      try {
        return await apiRequest('/users', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.log('Register error payload =>', payload);
        console.log('Register error message =>', e.message);
        throw e;
      }
    }

    export async function getCurrentUser() {
      return apiRequest('/users/me');
    }