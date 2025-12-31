import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView // Pour pouvoir scroller si le clavier cache le bouton
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // On réutilise les icônes
import { API_URL } from '../../config';
import { TEXTS } from '../../constants/texts';

export default function SignupScreen({ navigation }) {
  // Les états pour stocker les données du formulaire
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false); // Est-ce que la case est cochée ?

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return TEXTS.errors.passwordLength;
    if (!/[A-Z]/.test(pwd)) return TEXTS.errors.passwordCase;
    if (!/[a-z]/.test(pwd)) return TEXTS.errors.passwordCase;
    if (!/[0-9]/.test(pwd)) return TEXTS.errors.passwordNumber;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return TEXTS.errors.passwordSpecial;
    return null;
  };

  const handleSignup = async () => {
    if (!agreed) {
      alert(TEXTS.errors.acceptTerms);
      return;
    }
    if (!name || !username || !email || !password) {
      alert(TEXTS.errors.fillFields);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users`, {
        name,
        username,
        email,
        password
      });

      if (response.status === 201) {
        alert("Account created! Please log in.");
        navigation.navigate('Login');
      }
    } catch (e) {
      console.error(e);
      if (e.response) {
        alert(e.response.data.error || TEXTS.errors.generic);
      } else {
        alert(TEXTS.errors.network);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{TEXTS.appName}</Text>
          <Text style={styles.subtitle}>{TEXTS.auth.signupSubtitle}</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder={TEXTS.auth.namePlaceholder}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder={TEXTS.auth.usernamePlaceholder}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder={TEXTS.auth.emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder={TEXTS.auth.passwordPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Case à cocher personnalisée */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <Ionicons
              name={agreed ? "checkbox" : "square-outline"}
              size={24}
              color={agreed ? "#007AFF" : "#666"}
            />
            <Text style={styles.checkboxLabel}>{TEXTS.auth.agreeTerms}</Text>
          </TouchableOpacity>

          {/* Bouton Créer Compte */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>{TEXTS.auth.signUpButton}</Text>
          </TouchableOpacity>

          {/* Lien retour vers Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{TEXTS.auth.hasAccount}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>{TEXTS.auth.signInButton}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});