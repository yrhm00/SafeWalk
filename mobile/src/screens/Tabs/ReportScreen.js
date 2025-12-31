import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { TEXTS } from '../../constants/texts';
import { API_URL } from '../../config';

export default function ReportScreen({ navigation }) {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  // États du formulaire
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [image, setImage] = useState(null); // Base64 ou URI

  // États API locaux (remplace Redux Thunks)
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [zones, setZones] = useState([]);

  // Gestion de la fenêtre de choix (Modal)
  const [modalVisible, setModalVisible] = useState(false);

  // Récupération de la position et des données initiales (Types, Zones)
  useEffect(() => {
    (async () => {
      // 1. Permissions et Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de la localisation pour le signalement.');
        setLoadingLocation(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoadingLocation(false);

      // 2. Récupérer les données depuis l'API (Types et Zones) avec AXIOS DIRECT
      if (token) {
        try {
          const typesRes = await axios.get(`${API_URL}/report-types`);
          if (Array.isArray(typesRes.data)) setIncidentTypes(typesRes.data);

          const zonesRes = await axios.get(`${API_URL}/zones`);
          if (Array.isArray(zonesRes.data)) setZones(zonesRes.data);
        } catch (e) {
          console.log("Erreur chargement types/zones", e);
        }
      }
    })();
  }, [token]);

  const pickImage = () => {
    Alert.alert(
      "Add Photo",
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
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
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
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Envoi du formulaire avec AXIOS DIRECT
  const handleSubmit = async () => {
    if (!incidentType) {
      Alert.alert(TEXTS.report.errorTitle, "Veuillez sélectionner un type d'incident.");
      return;
    }
    if (!location) {
      Alert.alert(TEXTS.report.errorTitle, "Position introuvable.");
      return;
    }
    if (!token) {
      Alert.alert(TEXTS.report.errorTitle, "Vous devez être connecté.");
      return;
    }

    try {
      const selectedTypeObj = incidentTypes.find(t => t.label === incidentType);
      const defaultZoneId = zones.length > 0 ? zones[0].id : 1;

      // Préparation de l'image en Base64
      let imageBase64 = null;
      if (image && image.base64) {
        imageBase64 = `data:image/jpeg;base64,${image.base64}`;
      }

      const payload = {
        title: incidentType,
        description: description,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        image_url: imageBase64,
        type_id: selectedTypeObj ? selectedTypeObj.id : 1,
        zone_id: defaultZoneId,
        severity: isEmergency ? 'high' : 'low'
      };

      // APPEL DIRECT AXIOS
      await axios.post(`${API_URL}/reports`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert(TEXTS.report.successTitle, TEXTS.report.successMsg);

      // Refresh la liste globale via Redux pour que la map soit à jour
      // Note: fetchReports removed. We could dispatch an optimistic update or let MapScreen auto-refresh.
      // For now, simpler is better.

      navigation.navigate('Incidents');

      // Reset local fields
      setDescription('');
      setIncidentType(null);
      setIsEmergency(false);
      setImage(null);

    } catch (e) {
      console.error("Erreur envoi", e);
      Alert.alert(TEXTS.report.errorTitle, "Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.headerTitle}>{TEXTS.report.title}</Text>

        {/* 1. TYPE D'INCIDENT */}
        <Text style={styles.label}>{TEXTS.report.typeLabel}</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={incidentType ? styles.selectorText : styles.placeholderText}>
            {incidentType || TEXTS.report.typePlaceholder}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* 2. DESCRIPTION */}
        <Text style={styles.label}>{TEXTS.report.descLabel}</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={TEXTS.report.descPlaceholder}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        <Text style={styles.label}>{TEXTS.report.photoLabel}</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={32} color="#666" />
              <Text style={styles.photoText}>{TEXTS.report.photoLabel}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 4. LOCALISATION */}
        <Text style={styles.label}>Current Location</Text>
        <View style={styles.locationBox}>
          <Ionicons name="location-sharp" size={24} color="#007AFF" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.locationTitle}>Ma position</Text>
            {loadingLocation ? (
              <Text style={styles.locationCoords}>Locating...</Text>
            ) : location ? (
              <Text style={styles.locationCoords}>
                Lat: {location.coords.latitude.toFixed(4)}, Lng: {location.coords.longitude.toFixed(4)}
              </Text>
            ) : (
              <Text style={styles.locationCoords}>Position unavailable</Text>
            )}
          </View>
        </View>

        {/* 5. URGENCE */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsEmergency(!isEmergency)}
        >
          <Ionicons
            name={isEmergency ? "checkbox" : "square-outline"}
            size={24}
            color={isEmergency ? "red" : "#666"}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.checkboxLabel, isEmergency && { color: 'red' }]}>
              {TEXTS.report.emergencyLabel}
            </Text>
            <Text style={styles.checkboxSubLabel}>Requires immediate attention</Text>
          </View>
        </TouchableOpacity>

        {/* BOUTON ENVOYER */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{TEXTS.report.submitButton}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* --- MODAL DE SÉLECTION --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Type</Text>
            {incidentTypes.map((typeObj) => (
              <TouchableOpacity
                key={typeObj.id}
                style={styles.modalItem}
                onPress={() => {
                  setIncidentType(typeObj.label);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{typeObj.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 15, color: '#333' },
  selector: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 15,
    backgroundColor: '#F9F9F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  selectorText: { fontSize: 16, color: '#333' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  photoButton: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    backgroundColor: '#fff',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    borderStyle: 'dashed'
  },
  photoText: {
    color: '#666',
    marginTop: 5,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  placeholderText: { fontSize: 16, color: '#999' },
  textAreaContainer: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, backgroundColor: '#F9F9F9', padding: 10,
  },
  textArea: { fontSize: 16, height: 80 },
  charCount: { textAlign: 'right', color: '#999', fontSize: 12 },
  uploadBox: {
    borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', borderRadius: 10,
    height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA',
  },
  uploadText: { color: '#007AFF', fontWeight: '600', marginTop: 10 },
  locationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', padding: 15, borderRadius: 10 },
  locationTitle: { fontWeight: 'bold', color: '#333' },
  locationCoords: { color: '#666', fontSize: 12 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 25, padding: 10, borderRadius: 10 },
  checkboxLabel: { fontSize: 16, color: '#333', fontWeight: '600' },
  checkboxSubLabel: { fontSize: 12, color: '#666' },
  submitButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontSize: 16, textAlign: 'center' },
  modalCancel: { marginTop: 20, paddingVertical: 15, backgroundColor: '#F5F5F5', borderRadius: 10 },
  modalCancelText: { textAlign: 'center', fontWeight: 'bold', color: 'red' },
});