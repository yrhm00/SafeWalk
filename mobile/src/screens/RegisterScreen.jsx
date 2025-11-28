import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { registerUser, login } from '../api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, setLoading, setError } from '../store/slices/authSlice';

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      dispatch(setError('Email et mot de passe sont obligatoires'));
      return;
    }
    dispatch(setLoading(true));
    try {
      const payload = {
        // adapte ici en fonction de ton backend:
        // name ou username, role éventuel, etc.
        name: username,       // si ton backend attend name
        // username: username, // si ton backend attend username à la place
        email,
        password,
        role: 'user',         // enlève si ton schema ne supporte pas role
      };

      await registerUser(payload);

      const me = await login({ email, password });
      dispatch(setUser(me));
      dispatch(setToken('basic-auth'));
      dispatch(setError(null));
    } catch (e) {
      dispatch(setError(e.message || "Échec de l'inscription"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>SafeWalk</Text>
        <Text style={styles.subtitle}>Create your account to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#9ea7b8"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ea7b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ea7b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.footerLink}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0053b8',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  footerLink: {
    color: '#0053b8',
    fontWeight: '600',
  },
});
