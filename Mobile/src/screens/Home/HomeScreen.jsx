import { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Marker, Callout } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

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

  // ✅ UTILISATION DES REPORTS REDUX (plus de fakeReports)
  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.severity === filter);

  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

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
      {/* MAP FULL SCREEN */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapRef}
        showsUserLocation
        initialRegion={{ // Namur
          latitude: 50.4674,
          longitude: 4.8718,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        radius={40}
        extent={512}
        animationEnabled = {false}
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

      {/* HEADER */}
      <View style={styles.header}>
        <SafeWalkHeader />
      </View>

      {/* SEARCH BAR */}
      <View style={[styles.search, { top: searchTop }]}>
        <Text style={styles.searchPlaceholder}>🔍 Search location...</Text>
      </View>

      {/* FILTERS */}
      <FilterBar
        active={filter}
        onChange={setFilter}
        style={{ top: filtersTop }}
      />
    </View>
  );
}

const HEADER_HEIGHT = 56;
const SEARCH_HEIGHT = 44;

const styles = {
  container: {
    flex: 1,
  },

  /* MAP FULL SCREEN */
  map: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E5F4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    color: colors.textSecondary,
    fontSize: 16,
  },

  /* OVERLAYS */
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

  filters: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },

  filterChip: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
  },

  callout: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    minWidth: 140,
  },
};
