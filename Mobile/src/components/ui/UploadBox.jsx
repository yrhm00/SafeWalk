import { TouchableOpacity, Text, View, Image } from "react-native";
import { colors, spacing, typography } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

export default function UploadBox({ onPress, photo }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
      }}
    >
      {photo ? (
        <>
          {/* Aperçu image */}
          <Image
            source={{ uri: photo.uri }}
            style={{
              width: "100%",
              height: 160,
              borderRadius: 10,
            }}
            resizeMode="cover"
            pointerEvents="none"
          />

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 20,
              padding: 6,
            }}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </View>
        </>
      ) : (
        <>
          {/* État vide */}
          <Ionicons
            name="cloud-upload-outline"
            size={28}
            color={colors.textMuted}
          />
          <Text style={[typography.caption, { marginTop: spacing.sm }]}>
            Tap to upload a photo
          </Text>
          <Text style={typography.small}>JPG, PNG up to 10MB</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
