import { View, Text } from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import { typography, spacing, colors, globalStyles } from "../../styles";

export default function DangerDetailsScreen({ route }) {
  const { id } = route.params;

  // Fake data (plus tard : API)
  const danger = {
    id,
    title: "Poor lighting",
    description:
      "Street light broken near the park. Area is very dark at night.",
    severity: "medium",
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader 
        title="Danger details"
        showBack
      />

      <View style={styles.container}>
        <Text style={typography.h1}>{danger.title}</Text>

        <View style={[styles.badge, styles[danger.severity]]}>
          <Text style={styles.badgeText}>{danger.severity}</Text>
        </View>

        <Text style={typography.body}>{danger.description}</Text>

        {/* Placeholder map */}
        <View style={styles.mapPlaceholder}>
          <Text>🗺️ Map preview</Text>
        </View>
      </View>
    </View>
  );
}

const styles = {
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: colors.white,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  low: {
    backgroundColor: colors.success,
  },
  medium: {
    backgroundColor: colors.warning,
  },
  high: {
    backgroundColor: colors.danger,
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
};
