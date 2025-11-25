import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { createReport, getReportTypes } from '../api/reportApi';

export default function ReportScreen({ navigation }) {
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emergency, setEmergency] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('Locating...');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReportTypes();
    getLocation();
  }, []);

  const fetchReportTypes = async () => {
    try {
      const types = await getReportTypes();
      setReportTypes(types);
    } catch (e) {
      console.warn('Failed to fetch report types', e);
    }
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Permission denied');
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      setCoords(pos.coords);

      // Reverse geocoding to get address (optional, simple mock for now or use Location.reverseGeocodeAsync)
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        setAddress(`${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}`);
      } else {
        setAddress(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
      }

    } catch (e) {
      setAddress('Location unavailable');
      console.warn('Location error', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets?.[0]);
      }
    } catch (e) {
      console.warn('File picker error', e);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTypeId) {
      Alert.alert('Error', 'Please select a report type');
      return;
    }

    setSubmitting(true);
    try {
      // Logic for title: if "Autre" (assuming ID for Autre is handled or it's a special value), use customTitle.
      // Else use the label of the selected type.
      // For this implementation, let's find the selected type label.
      const selectedType = reportTypes.find(t => t.id === selectedTypeId);

      // Check if "Autre" is selected. We can check by label or ID if known. 
      // Let's assume if the user selects the "Autre" item we added manually to the list (if we did).
      // Or we can just check if selectedTypeId is 'other'.

      let titleToSend = selectedType?.label;
      let typeIdToSend = selectedTypeId;

      if (selectedTypeId === 'other') {
        titleToSend = customTitle || 'Autre Incident';
        // If backend requires a valid ID, we might need a default 'Other' type in DB or send null?
        // Assuming backend handles it or we pick the first available type as fallback if 'other' isn't a real ID.
        // Ideally, we should have an 'Autre' type in the DB.
        // For now, let's assume we send type_id=1 (or whatever) if it's 'other', or handle it on backend.
        // Let's try to find a type named 'Autre' in the list, otherwise use the first one.
        const otherTypeInDb = reportTypes.find(t => t.label.toLowerCase() === 'autre');
        typeIdToSend = otherTypeInDb ? otherTypeInDb.id : reportTypes[0]?.id;
      }

      const payload = {
        title: titleToSend,
        description,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        emergency,
        type_id: typeIdToSend,
        // image_url: ... (upload logic would go here)
      };

      await createReport(payload);
      Alert.alert('Success', 'Report submitted successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Incidents') }
      ]);

      // Reset form
      setDescription('');
      setSelectedTypeId(null);
      setCustomTitle('');
      setSelectedFile(null);
      setEmergency(false);

    } catch (e) {
      Alert.alert('Error', 'Failed to submit report');
      console.warn('Submit error', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Report Type Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning" size={20} color="#f59e0b" />
            <Text style={styles.cardTitle}>Report Type</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTypeId}
              onValueChange={(itemValue) => setSelectedTypeId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select incident type" value={null} color="#94a3b8" />
              {reportTypes.map((type) => (
                <Picker.Item key={type.id} label={type.label} value={type.id} />
              ))}
              <Picker.Item label="Autre" value="other" />
            </Picker>
          </View>

          {selectedTypeId === 'other' && (
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              placeholder="Enter incident title"
              value={customTitle}
              onChangeText={setCustomTitle}
            />
          )}
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color="#3b82f6" />
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Please describe the incident in detail..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {description.length}/500
          </Text>
        </View>

        {/* Upload Photo Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="camera" size={20} color="#10b981" />
            <Text style={styles.cardTitle}>Upload Photo (Optional)</Text>
          </View>

          <TouchableOpacity style={styles.uploadBox} onPress={handlePickFile}>
            {selectedFile ? (
              <View style={styles.filePreview}>
                <Ionicons name="image" size={32} color="#3b82f6" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                  <Text style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(0)} KB</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="cloud-upload" size={24} color="#fff" />
                </View>
                <Text style={styles.uploadText}>Tap to upload a photo</Text>
                <Text style={styles.uploadSubText}>JPG, PNG up to 10MB</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color="#ef4444" />
            <Text style={styles.cardTitle}>Current Location</Text>
            <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
              <Ionicons name="refresh" size={16} color="#3b82f6" />
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationBox}>
            <View style={styles.locationIcon}>
              <Ionicons name="navigate" size={20} color="#ef4444" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.locationAddress}>{address}</Text>
              {coords && (
                <Text style={styles.locationCoords}>
                  Lat: {coords.latitude.toFixed(4)}, Lng: {coords.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Emergency Toggle Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="alert" size={20} color="#ef4444" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.cardTitleNoMargin}>Emergency Report</Text>
                <Text style={styles.cardSubtitle}>Requires immediate attention</Text>
              </View>
            </View>
            <Switch
              value={emergency}
              onValueChange={setEmergency}
              trackColor={{ false: '#e2e8f0', true: '#ef4444' }}
              thumbColor={emergency ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Your report will be reviewed within 24 hours
        </Text>

        {/* Spacer for Bottom Tab Bar */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60, // Safe area top
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 8,
    flex: 1,
  },
  cardTitleNoMargin: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    height: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#0f172a',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  uploadSubText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  fileSize: {
    fontSize: 12,
    color: '#64748b',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
    fontWeight: '500',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  locationCoords: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 16,
  },
});
