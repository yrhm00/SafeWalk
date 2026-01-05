import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, markerColors } from "../../styles";

// 1. On définit les filtres de sévérité par défaut ici
const severityFilters = [
  { key: "all", label: "All" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

export default function FilterBar({ options = severityFilters, active, onChange, style }) {
  return (
    <View style={[styles.container, style]}>
      {options.map((f) => {
        const isActive = active === f.key;

        // Choix de la couleur : markerColors pour la sévérité, sinon primary
        const activeColor =
          f.key === "all"
            ? colors.primary
            : markerColors[f.key] || colors.primary;

        return (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.chip,
              isActive && { backgroundColor: activeColor },
            ]}
            onPress={() => onChange(f.key)}
          >
            <Text
              style={[
                typography.caption,
                isActive ? styles.activeText : { color: colors.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeText: {
    color: colors.white,
    fontWeight: "600",
  },
});