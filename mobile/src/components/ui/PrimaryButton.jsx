import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../../styles";

export default function PrimaryButton({ title, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: colors.textMuted,
  },
  text: {
    color: colors.white,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});
