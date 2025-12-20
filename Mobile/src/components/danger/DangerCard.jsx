import { View, Text, TouchableOpacity } from "react-native";
import { colors, spacing, typography, shadows } from "../../styles";

export default function DangerCard({ danger, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={typography.h3}>{danger.title}</Text>
      <Text style={typography.caption}>{danger.description}</Text>

      <View style={[styles.badge, styles[danger.severity]]}>
        <Text style={styles.badgeText}>{danger.severity}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  badge: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "600",
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
};
