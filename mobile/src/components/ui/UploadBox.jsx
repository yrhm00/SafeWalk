import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../../styles";

const ACCEPTED_FORMATS = "JPG, PNG, WEBP or GIF, up to 2MB";

export default function UploadBox({ onPress, onRemove, photo }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.box}>
      {photo ? (
        <>
          <Image
            source={{ uri: photo.uri }}
            style={styles.preview}
            resizeMode="cover"
            pointerEvents="none"
          />

          <View pointerEvents="none" style={styles.editBadge}>
            <Ionicons name="pencil" size={16} color={colors.white} />
          </View>

          <TouchableOpacity
            style={styles.removeBadge}
            onPress={onRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={16} color={colors.white} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Ionicons
            name="cloud-upload-outline"
            size={28}
            color={colors.textMuted}
          />
          <Text style={[typography.caption, styles.label]}>
            Tap to upload a photo
          </Text>
          <Text style={typography.small}>{ACCEPTED_FORMATS}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
  editBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
  removeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.danger,
    borderRadius: 20,
    padding: 6,
  },
  label: {
    marginTop: spacing.sm,
  },
});
