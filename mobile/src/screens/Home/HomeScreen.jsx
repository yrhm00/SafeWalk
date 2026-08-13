import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import { setLoading, setReports, REPORTS_LIMIT } from "../../store/reportSlice";
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

const HEADER_HEIGHT = 56;
const REGION_DELTA = 0.02;

const FALLBACK_REGION = {
  latitude: 50.4674,
  longitude: 4.8718,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.list);
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [initialRegion, setInitialRegion] = useState(null);

  const loadReports = async () => {
    setError("");
    dispatch(setLoading(true));
    try {
      const response = await api.get("/reports", {
        params: { limit: REPORTS_LIMIT, offset: 0 },
      });
      dispatch(
        setReports({
          reports: response.data.data,
          hasMore: response.data.pagination.hasMore,
        })
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      dispatch(setLoading(false));
    }
  };

  const loadInitialRegion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location access denied. Showing the default area.");
        setInitialRegion(FALLBACK_REGION);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: REGION_DELTA,
        longitudeDelta: REGION_DELTA,
      });
    } catch (locationError) {
      setError("Could not get your location. Showing the default area.");
      setInitialRegion(FALLBACK_REGION);
    }
  };

  useEffect(() => {
    if (reports.length === 0) {
      loadReports();
    }
    loadInitialRegion();
  }, []);

  const centerOnUser = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "SafeWalk needs location access to show your position on the map.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: REGION_DELTA,
        longitudeDelta: REGION_DELTA,
      });
    } catch (locationError) {
      Alert.alert("Location error", "Could not get your current location.");
    }
  };

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((report) => report.severity === filter);

  const filtersTop = insets.top + HEADER_HEIGHT + spacing.sm;

  if (!initialRegion) {
    return (
      <View style={globalStyles.screen}>
        <SafeWalkHeader />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
      >
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            pinColor={markerColors[report.severity] || colors.textMuted}
            tracksViewChanges={false}
          >
            <Callout
              tooltip
              onPress={() =>
                navigation.navigate("DangerDetails", { reportId: report.id })
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

      <FilterBar
        active={filter}
        onChange={setFilter}
        style={[styles.filters, { top: filtersTop }]}
      />

      {error !== "" && (
        <View style={[styles.errorBanner, { top: filtersTop + 60 }]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.recenterButton}
        onPress={centerOnUser}
        accessibilityRole="button"
        accessibilityLabel="Center the map on my position"
      >
        <Ionicons name="locate" size={26} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 50 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  filters: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
  },
  callout: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    minWidth: 140,
  },
  errorBanner: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: 10,
    ...shadows.card,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 13,
  },
  recenterButton: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.lg + 20,
    backgroundColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
    elevation: 5,
  },
});
