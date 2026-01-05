import { TextInput, View } from "react-native";
import { colors, spacing, typography } from "../../styles";

export default function TextField({
  value,
  onChangeText,
  placeholder,
  secure = false,
  keyboardType = "default"
}) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secure}
        style={styles.input}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = {
  container: {
    width: "100%",
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
  },
};
