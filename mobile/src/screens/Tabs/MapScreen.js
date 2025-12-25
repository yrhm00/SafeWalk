import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';

// 2. Liste des filtres disponibles -> Doit matcher avec la DB (initDB.sql)
const FILTERS = ['All', 'Poor lighting', 'Icy road', 'Broken sidewalk', 'Suspicious activity', 'Flooded area'];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Locating...");
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Données réelles
  const [reports, setReports] = useState([]);
  const mapRef = React.useRef(null);

  // Charger les signalements à chaque fois qu'on affiche l'écran
  useFocusEffect(
    React.useCallback(() => {
      fetchReports();
    }, [])
  );

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/reports`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (e) {
      console.log("Erreur chargement reports", e);
    }
  };

  // Filtrage des incidents à afficher
  const displayedIncidents = reports.filter(incident => {
    if (selectedFilter === 'All') return true;
    return incident.type_label === selectedFilter;
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission refusée');
        return;
      }

      // Utiliser watchPositionAsync pour suivre la position en temps réel
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (newLocation) => {
          setLocation(newLocation);

          // Reverse Geocoding pour avoir le nom de la ville
          try {
            let geocode = await Location.reverseGeocodeAsync({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude
            });
            if (geocode.length > 0) {
              setAddress(`${geocode[0].city}, ${geocode[0].isoCountryCode}`);
            }
          } catch (e) {
            console.log(e);
          }
        }
      );
    })();
  }, []);

  const navigation = useNavigation();

  const recenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER & FILTRES */}
      <View style={styles.headerContainer}>
        {/* ... (Existing Header Code) ... */}
        <View style={styles.topRow}>
          <Text style={styles.appName}>SafeWalk</Text>
          <Text style={styles.locationText}>
            Current Location | {errorMsg ? errorMsg : address}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search location..."
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CARTE */}
      {location ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
            showsUserLocation={true}
          >
            {/* On affiche uniquement les incidents filtrés */}
            {displayedIncidents.map((incident) => (
              <Marker
                key={incident.id}
                coordinate={{
                  latitude: parseFloat(incident.latitude),
                  longitude: parseFloat(incident.longitude)
                }}

                // Petite astuce pour changer la couleur selon le type
                pinColor={
                  incident.type_label === "Suspicious activity" ? "red" :
                    incident.type_label === "Flooded area" ? "blue" :
                      incident.type_label === "Icy road" ? "cyan" :
                        incident.type_label === "Poor lighting" ? "gold" : "orange"
                }
              >
                <Callout onPress={() => navigation.navigate('IncidentDetail', { incident })}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{incident.title}</Text>
                    <Text style={styles.calloutSubtitle}>{incident.type_label}</Text>
                    <Text style={styles.calloutLink}>Tap for details ></Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* RECENTER BUTTON */}
          <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  topRow: { marginBottom: 10 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  locationText: { fontSize: 12, color: '#666' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },
  filtersScroll: { flexDirection: 'row', paddingBottom: 5 },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  filterChipActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#333', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  map: { width: Dimensions.get('window').width, height: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  calloutContainer: { width: 150, padding: 5 },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  calloutSubtitle: { fontSize: 12, color: '#666', marginBottom: 2 },
  calloutLink: { fontSize: 12, color: '#007AFF', marginTop: 2 },
  recenterButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});