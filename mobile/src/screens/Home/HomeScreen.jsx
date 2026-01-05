import { useState, useRef, useEffect, useCallback } from "react";
// Ajout de TouchableOpacity dans l'import react-native
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native"; 
import { Marker, Callout } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons"; // Import pour l'icône de recentrage

import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import FilterBar from "../../components/danger/FilterBar";

import {
  colors,
  spacing,
  globalStyles,
  shadows,
  markerColors,
  typography,
} from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../../store/reportSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.list);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchReports());
    }, [dispatch])
  );

  const insets = useSafeAreaInsets();
  const headerOffset = insets.top + HEADER_HEIGHT;
  const searchTop = headerOffset + spacing.sm;
  const filtersTop = searchTop + SEARCH_HEIGHT + spacing.sm;

  const [filter, setFilter] = useState("all");
  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.severity === filter);

  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  // Fonction pour recentrer la carte sur l'utilisateur
  const recenterMap = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation(location.coords);
      mapRef.current?.animateToRegion(coords, 1000); // Animation fluide
    } catch (error) {
      Alert.alert("Error", "Could not fetch your current location.");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Location access is needed to show nearby dangers."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  return (
    <View style={globalStyles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapRef}
        showsUserLocation
        initialRegion={{
          latitude: 50.4674,
          longitude: 4.8718,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        radius={40}
        extent={512}
        animationEnabled={false}
      >
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            pinColor={markerColors[report.severity]}
            tracksViewChanges={false}
          >
            <Callout
              tooltip
              onPress={() =>
                navigation.navigate("DangerDetails", {
                  reportId: report.id,
                })
              }
            >
              <View style={styles.callout}>
                <Text style={typography.h3}>{report.title}</Text>
                <Text style={typography.small}>
                  Severity: {report.severity}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.header}>
        <SafeWalkHeader />
      </View>

      <View style={[styles.search, { top: searchTop }]}>
        <Text style={styles.searchPlaceholder}>🔍 Search location...</Text>
      </View>

      <FilterBar
        active={filter}
        onChange={setFilter}
        style={{ top: filtersTop }}
      />

      {/* BOUTON RECENTER */}
      <TouchableOpacity 
        style={[styles.recenterButton, { bottom: spacing.lg + 20 }]} 
        onPress={recenterMap}
      >
        <Ionicons name="locate" size={26} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const HEADER_HEIGHT = 56;
const SEARCH_HEIGHT = 44;

const styles = {
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  search: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    height: SEARCH_HEIGHT,
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    ...shadows.card,
    justifyContent: "center",
  },
  searchPlaceholder: {
    color: colors.textMuted,
    fontSize: 15,
  },
  callout: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    minWidth: 140,
  },
  // Style pour le bouton de recentrage
  recenterButton: {
    position: "absolute",
    right: spacing.md,
    backgroundColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
    elevation: 5,
  },
};