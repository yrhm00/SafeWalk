import React, { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { API_URL } from '../../config';
import { COLORS } from '../../constants/theme';
import { styles } from '../../styles/LoginScreen.styles';
import { TEXTS } from '../../constants/texts';
export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert(TEXTS.errors.fillFields);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/users/login`, { email, password });

      const { user, token } = response.data;
      dispatch(setCredentials({ user, token }));

      // Persist data securely
      await SecureStore.setItemAsync('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      navigation.replace('Home');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || error.response.data.error || TEXTS.errors.generic);
      } else {
        alert(TEXTS.errors.network);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={COLORS.gradients.login}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🛡️</Text>
            </View>
            <Text style={styles.title}>{TEXTS.appName}</Text>
            <Text style={styles.subtitle}>{TEXTS.auth.loginSubtitle}</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder={TEXTS.auth.emailPlaceholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder={TEXTS.auth.passwordPlaceholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              <LinearGradient
                colors={[COLORS.secondary, COLORS.info]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{TEXTS.auth.signInButton}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.footerLink}>
              <Text style={styles.footerText}>
                {TEXTS.auth.noAccount}<Text style={styles.highlight}>{TEXTS.auth.signupTitle}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
