import { Text, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "../../styles";

export default function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
};
