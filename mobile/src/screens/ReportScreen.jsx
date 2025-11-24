import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import { createReport } from '../api/reportApi';

export default function ReportScreen() {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [emergency, setEmergency] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({});
          setCoords(pos.coords);
        }
      } catch (e) {
        console.warn('Erreur localisation report', e);
      }
    })();
  }, []);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return; // upload optionnel
      }

      const file = result.assets?.[0];
      setSelectedFile(file || null);
    } catch (e) {
      console.warn('Erreur lors de la sélection de fichier', e);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: reportType || 'Incident',
        description,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        emergency,
      };
      await createReport(payload);
      console.log('Report created');
    } catch (e) {
      console.warn('Erreur création report', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report Incident</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Report Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Select incident type"
          value={reportType}
          onChangeText={setReportType}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please describe the incident in detail..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Upload Photo (Optional)</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickFile}>
          {selectedFile ? (
            <>
              {selectedFile.mimeType?.startsWith('image/') && (
                <Image
                  source={{ uri: selectedFile.uri }}
                  style={styles.preview}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.uploadText}>{selectedFile.name}</Text>
            </>
          ) : (
            <Text style={styles.uploadText}>Tap to upload a photo</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.sectionRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Emergency Report</Text>
          <Text style={styles.helper}>Requires immediate attention</Text>
        </View>
        <Switch value={emergency} onValueChange={setEmergency} />
      </View>

      <Button title="Submit Report" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helper: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    marginTop: 8,
    color: '#555',
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
