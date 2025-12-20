import { View } from "react-native";
import { colors, spacing, shadows } from "../../styles";

export default function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: 16,
          padding: spacing.md,
          marginBottom: spacing.md,
          ...shadows.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
