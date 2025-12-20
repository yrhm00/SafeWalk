import { TouchableOpacity, Text } from "react-native";
import { colors, spacing, typography } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

export default function SelectField({ value, placeholder, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={value ? typography.body : typography.caption}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
