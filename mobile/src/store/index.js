// javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

if (!authReducer || typeof authReducer !== 'function') {
  throw new Error('authReducer est undefined ou invalide. Vérifier l\'export dans mobile/src/store/slices/authSlice.js');
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});