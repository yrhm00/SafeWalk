import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { listReports } from '../api/reportApi';

const { width } = Dimensions.get('window');

const initialRegion = {
  latitude: 46.5197, // exemple: Lausanne
  longitude: 6.6323,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const sampleIncidents = [
  { id: 1, title: 'Crime', description: 'Aggression signalée', latitude: 46.52, longitude: 6.63 },
  { id: 2, title: 'Harassment', description: 'Harcèlement verbal', latitude: 46.518, longitude: 6.628 },
  { id: 3, title: 'Poor Lighting', description: 'Zone mal éclairée', latitude: 46.521, longitude: 6.635 },
];

export default function MapScreen() {
  const [region, setRegion] = useState(initialRegion);
  const [reports, setReports] = useState(sampleIncidents);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getCurrentPositionAsync({});
          setRegion(r => ({
            ...r,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        }
      } catch (e) {
        console.warn('Erreur localisation', e);
      }
    })();

    (async () => {
      try {
        const data = await listReports({ page: 1, size: 50 });
        setReports(
          data.items || data || []
        );
      } catch (e) {
        console.warn('Erreur chargement reports', e);
      }
    })();
  }, []);

  const handleCenterOnUser = async () => {
    try {
      const pos = await Location.getCurrentPositionAsync({});
      setRegion(r => ({
        ...r,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }));
    } catch (e) {
      console.warn('Erreur recentrage', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.appTitle}>SafeWalk</Text>
        <Text style={styles.subtitle}>Current Location | City Center</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchPlaceholder}>Search location...</Text>
      </View>

      <View style={styles.tagsRow}>
        <View style={[styles.tag, { backgroundColor: '#ff4d4f' }]}>
          <Text style={styles.tagText}>Crime</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: '#faad14' }]}>
          <Text style={styles.tagText}>Harassment</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: '#722ed1' }]}>
          <Text style={styles.tagText}>Poor Lighting</Text>
        </View>
      </View>

      <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {reports.map(report => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude || initialRegion.latitude,
              longitude: report.longitude || initialRegion.longitude,
            }}
            title={report.title || report.type}
            description={report.description}
          />
        ))}
      </MapView>
      <TouchableOpacity style={styles.gpsButton} onPress={handleCenterOnUser}>
        <Text style={styles.gpsButtonText}>◎</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchPlaceholder: {
    color: '#999',
  },
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  map: {
    width: width - 32,
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gpsButton: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  gpsButtonText: {
    fontSize: 20,
  },
});
