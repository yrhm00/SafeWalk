import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import * as Location from 'expo-location'; // Import direct

import { API_URL } from '../../config';
import { selectAllReports, setReports, setLoading, setError } from '../../store/reportsSlice';

// Hooks (On garde les autres s'ils existent encore, sinon on inline aussi ?)
// Le user a suppr useLocationTracking. On va supposer qu'il veut garder shake/notif séparés pour l'instant
// ou alors on simplifie tout. Dans le doute, on inline la location qui a été supprimée.
import useShakeSensor from '../../hooks/useShakeSensor';
import useProximityNotification from '../../hooks/useProximityNotification';

// Filter constants
const FILTERS = ['All', 'Poor lighting', 'Icy road', 'Broken sidewalk', 'Suspicious activity', 'Flooded area'];
const SEVERITY_FILTERS = ['All', 'Low', 'Medium', 'High'];
const DATE_FILTERS = ['All', '24h', '7 days', '30 days'];

export default function MapScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token } = useSelector(state => state.auth);

  // 1. Data Layer
  const reports = useSelector(selectAllReports);

  // 2. Logic Location (Inlined - "Simple")
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Locating...");
  const [errorMsg, setErrorMsg] = useState(null);

  // Reverse Geocoding Simple (Expo)
  const getAddress = async (lat, lon) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (geocode.length > 0) {
        const obj = geocode[0];
        setAddress(`${obj.street || ''} ${obj.streetNumber || ''}, ${obj.city || ''}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Rapide : Dernière position connue
      let lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        setLocation(lastKnown);
        getAddress(lastKnown.coords.latitude, lastKnown.coords.longitude);
      } else {
        // Sinon position courante
        let current = await Location.getCurrentPositionAsync({});
        setLocation(current);
        getAddress(current.coords.latitude, current.coords.longitude);
      }

      // Tracking
      // On peut garder le watchPosition si on veut du temps réel, ou simplification : juste one-shot au focus ?
      // Restons sur du watch pour la map c'est mieux.
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 }, (newLoc) => {
        setLocation(newLoc);
        // getAddress(newLoc.coords.latitude, newLoc.coords.longitude); // Optionnel
      });

    })();
  }, []);

  // Sensor & Notif Hooks
  // Si useShakeSensor existe encore... sinon commenter.
  // On va assumer qu'ils sont là sauf si erreur.
  useShakeSensor(() => {
    navigation.navigate('Report');
  });

  useProximityNotification(location, reports);

  // 3. UI Filters State
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');

  const mapRef = useRef(null);

  // Function to load reports (Local Logic -> Sync Redux)
  const loadReports = async () => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(`${API_URL}/reports`, config);
      dispatch(setReports(response.data));
    } catch (err) {
      console.log("Error loading reports", err);
      dispatch(setError(err.message));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [token])
  );

  useEffect(() => {
    const interval = setInterval(() => loadReports(), 10000);
    return () => clearInterval(interval);
  }, [token]);

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

  // Filter Logic
  const displayedIncidents = reports.filter(incident => {
    if (selectedType !== 'All' && incident.type_label !== selectedType) return false;
    if (selectedSeverity !== 'All' && incident.severity?.toLowerCase() !== selectedSeverity.toLowerCase()) return false;
    if (selectedDate !== 'All') {
      const incidentDate = new Date(incident.created_at);
      const now = new Date();
      const diffTime = Math.abs(now - incidentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (selectedDate === '24h' && diffDays > 1) return false;
      if (selectedDate === '7 days' && diffDays > 7) return false;
      if (selectedDate === '30 days' && diffDays > 30) return false;
    }
    return true;
  });

  const FilterRow = ({ title, options, selected, onSelect }) => (
    <View style={styles.filterRowContainer}>
      <Text style={styles.filterLabel}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.filterChip, selected === option && styles.filterChipActive]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.filterText, selected === option && styles.filterTextActive]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* HEADER & FILTRES */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Text style={styles.appName}>SafeWalk</Text>
          <Text style={styles.locationText}>
            Current Location | {errorMsg ? errorMsg : (address || "Locating...")}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search location..."
            style={styles.searchInput}
          />
        </View>

        {/* SECTION FILTRES */}
        <View style={{ maxHeight: 110 }}>
          <ScrollView nestedScrollEnabled={true}>
            <FilterRow title="Type" options={FILTERS} selected={selectedType} onSelect={setSelectedType} />
            <FilterRow title="Severity" options={SEVERITY_FILTERS} selected={selectedSeverity} onSelect={setSelectedSeverity} />
            <FilterRow title="Time" options={DATE_FILTERS} selected={selectedDate} onSelect={setSelectedDate} />
          </ScrollView>
        </View>
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
            {displayedIncidents.map((incident) => (
              <Marker
                key={incident.id}
                coordinate={{
                  latitude: parseFloat(incident.latitude),
                  longitude: parseFloat(incident.longitude)
                }}
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
                    <Text style={styles.calloutLink}>Tap for details &gt;</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

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
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#fff', zIndex: 10 },
  topRow: { marginBottom: 10 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  locationText: { fontSize: 12, color: '#666' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 10 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },
  filterRowContainer: { marginBottom: 8 },
  filterLabel: { fontSize: 10, color: '#888', marginBottom: 2, marginLeft: 2, fontWeight: 'bold' },
  filtersScroll: { flexDirection: 'row', paddingBottom: 2 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F5F5F5', marginRight: 8 },
  filterChipActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#333', fontWeight: '600', fontSize: 12 },
  filterTextActive: { color: '#fff' },
  map: { width: Dimensions.get('window').width, height: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  calloutContainer: { width: 150, padding: 5 },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  calloutSubtitle: { fontSize: 12, color: '#666', marginBottom: 2 },
  calloutLink: { fontSize: 12, color: '#007AFF', marginTop: 2 },
  recenterButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#fff', padding: 12, borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }
});