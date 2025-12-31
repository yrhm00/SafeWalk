import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Still need for manual clear if wanted, or rely on slice
import { API_URL } from '../../config';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(null); // Base64 or URI

  // Sync state with Redux user change
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await AsyncStorage.removeItem('user');
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const pickImage = () => {
    Alert.alert(
      "Update Profile Picture",
      "Choose a source",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Gallery", onPress: pickFromGallery },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera permission is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.3,
      base64: true,
      aspect: [1, 1], // Square for profile
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Gallery permission is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.3,
      base64: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const saveProfile = async () => {
    // Logic to update profile on backend would go here.
    // Since we might not have a PUT /users/me endpoint ready, we will just update local state/storage for demo.

    const updatedUser = { ...user, username, email };
    // If backend accepted update:
    // await axios.put(...)

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setAvatar(null); // Reset pending avatar change unless we persisted it
    Alert.alert("Success", "Profile updated!");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>My Profile</Text>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={isEditing ? pickImage : null}>
            {avatar ? (
              <Image source={{ uri: avatar.uri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}
            {isEditing && (
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Username</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          ) : (
            <Text style={styles.value}>{user?.username || 'N/A'}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.value}>{user?.email || 'N/A'}</Text>
          )}
        </View>

        <View style={styles.actions}>
          {isEditing ? (
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 15, backgroundColor: '#5856D6' }]}
              onPress={async () => {
                try {
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: "🔔 Test Notification",
                      body: "This is a test notification to demonstrate the feature.",
                    },
                    trigger: null,
                  });
                  Alert.alert("Sent!", "Check your notification center.");
                } catch (e) {
                  Alert.alert("Error", "Could not trigger notification.");
                }
              }}
            >
              <Text style={styles.saveButtonText}>Test Notification</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingTop: 50, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  avatarContainer: { marginBottom: 30, position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  placeholderAvatar: { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff'
  },
  infoContainer: { width: '100%', marginBottom: 30 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 15, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 18, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  input: { fontSize: 18, color: '#333', borderBottomWidth: 1, borderBottomColor: '#007AFF', paddingBottom: 10 },
  actions: { width: '100%' },
  editButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  editButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#ffe5e5', padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutButtonText: { color: 'red', fontSize: 16, fontWeight: 'bold' }
});