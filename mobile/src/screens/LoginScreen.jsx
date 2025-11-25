import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError, setUser, setToken } from '../store/slices/authSlice';
import { login } from '../api/authApi';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    dispatch(setLoading(true));
    try {
      const { token } = await login({ email, password });
      await AsyncStorage.setItem('token', token);
      dispatch(setToken(token));

      // Fetch user profile to get role/details
      // Assuming we have a userApi.getMyProfile or similar, 
      // but for now let's just dispatch success and let navigation handle it.
      // Ideally we should fetch the user here.

      dispatch(setError(null));
    } catch (e) {
      dispatch(setError(e.message || 'Échec de la connexion'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeWalk</Text>
      <Text style={styles.subtitle}>Your safety companion</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9fb3ff"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9fb3ff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.footerLink}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0053b8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#d6e4ff',
    marginBottom: 32,
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 16,
    padding: 16,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0053b8',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: '#ffccc7',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerText: {
    marginTop: 16,
    color: '#d6e4ff',
  },
  footerLink: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
