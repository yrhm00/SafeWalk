import { View, TouchableOpacity, Text } from "react-native";
import { colors, spacing, typography, severityColor } from "../../styles";

const filters = [
  { key: "all", label: "All" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

export default function FilterBar({ active, onChange, style }) {
  return (
    <View style={[styles.container, style]}>
      {filters.map((f) => {
        const isActive = active === f.key;

         // 🎯 couleur dynamique
        const activeColor =
          f.key === "all"
            ? colors.primary
            : severityColor[f.key];

        return (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.chip,
              isActive && {backgroundColor: activeColor},
            ]}
            onPress={() => onChange(f.key)}
          >
            <Text
              style={[
                typography.caption,
                isActive && styles.activeText,
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

const styles = {
  container: {
    position: "absolute",
    top: 120,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeText: {
    color: colors.white,
  },
};
