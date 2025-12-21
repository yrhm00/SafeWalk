import { View, Text, StyleSheet} from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import { colors, spacing, globalStyles } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  return (

      <View style={globalStyles.container}>

        {/* MAP (placeholder) */}
        <View style={styles.map}>
          <Text style={styles.mapText}>🗺️ Interactive Map View</Text>
        </View>

        {/* HEADER */}
        <View style={styles.header}>
          <SafeWalkHeader />
        </View>

        {/* SEARCH BAR */}
        <View style={styles.search}>
          <Text style={styles.searchText}>
              🔍 Search location...
            </Text>
        </View>

        {/* FILTERS */}
        <View style={styles.filters}>
          {["Crime", "Harassment", "Poor Lighting", "All"].map((item) => (
            <View key={item} style={styles.filterChip}>
              <Text style={styles.filterText}>{item}</Text>
            </View>
          ))}
        </View>

      </View>

  );
}

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
    top: 90,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    elevation: 4,
  },

  searchText: {
    color: colors.textMuted,
  },

  filters: {
    position: "absolute",
    top: 150,
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
};

