import { TouchableOpacity, Text, View } from "react-native";
import { colors, spacing, typography } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

export default function UploadBox({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.lg,
        alignItems: "center",
      }}
    >
      <Ionicons name="cloud-upload-outline" size={28} color={colors.textMuted} />
      <Text style={[typography.caption, { marginTop: spacing.sm }]}>
        Tap to upload a photo
      </Text>
      <Text style={typography.small}>JPG, PNG up to 10MB</Text>
    </TouchableOpacity>
  );
}
