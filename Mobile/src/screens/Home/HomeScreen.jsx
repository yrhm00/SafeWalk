import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import FilterBar from "../../components/danger/FilterBar";

import { fakeReports } from "../../data/fakeReports";

import {
  colors,
  spacing,
  globalStyles,
  shadows,
  severityColor,
} from "../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const headerOffset = insets.top + HEADER_HEIGHT;
  const searchTop = headerOffset + spacing.sm;
  const filtersTop = searchTop + SEARCH_HEIGHT + spacing.sm;

  const [filter, setFilter] = useState("all");

  const filteredReports =
    filter === "all"
      ? fakeReports
      : fakeReports.filter((r) => r.severity === filter);

  return (
    <View style={globalStyles.container}>
      {/* MAP FULL SCREEN */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            pinColor={severityColor[report.severity]}
          >
            <Callout
              tooltip
              onPress={() => navigation.navigate("DangerDetails", { report })}
            >
              <View style={styles.callout}>
                <Text style={styles.title}>{report.title}</Text>
                <Text style={styles.subtitle}>Severity: {report.severity}</Text>
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
  title: {
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
};
