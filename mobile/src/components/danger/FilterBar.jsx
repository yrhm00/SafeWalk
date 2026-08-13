import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, markerColors } from "../../styles";

const SEVERITY_FILTERS = [
  { key: "all", label: "All" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

export default function FilterBar({
  options = SEVERITY_FILTERS,
  active,
  onChange,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isActive = active === option.key;
        const activeColor =
          option.key === "all"
            ? colors.primary
            : markerColors[option.key] || colors.primary;

        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.chip, isActive && { backgroundColor: activeColor }]}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
          >
            <Text
              style={[
                typography.caption,
                isActive ? styles.activeText : styles.inactiveText,
              ]}
            >
              {option.label}
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
  inactiveText: {
    color: colors.textSecondary,
  },
});
