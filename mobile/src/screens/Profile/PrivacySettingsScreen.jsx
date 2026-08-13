import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { SUPPORT_EMAIL } from "../../utils/constants";
import { globalStyles, colors, spacing, typography } from "../../styles";

const COLLECTED_DATA = [
  {
    icon: "location-outline",
    title: "Location",
    description:
      "Used to center the map and to position the incidents you report. It is sent only when you create a report.",
  },
  {
    icon: "camera-outline",
    title: "Photos",
    description:
      "Only the pictures you explicitly attach to a report are uploaded to our server.",
  },
  {
    icon: "person-outline",
    title: "Account",
    description:
      "Your name, username and email address, used to identify your reports and comments.",
  },
];

export default function PrivacySettingsScreen() {
  const openAppSettings = () => {
    Linking.openSettings();
  };

  const requestAccountDeletion = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=Account deletion request`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "No email app found",
        `Please send your request to ${SUPPORT_EMAIL}.`
      );
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Privacy Settings" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, styles.pageTitle]}>Data & Privacy</Text>

        <Text style={[typography.h3, styles.sectionTitle]}>
          What SafeWalk collects
        </Text>

        {COLLECTED_DATA.map((item) => (
          <Card key={item.title} style={styles.dataCard}>
            <View style={styles.dataRow}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
              <Text style={[typography.h3, styles.dataTitle]}>
                {item.title}
              </Text>
            </View>
            <Text style={[typography.caption, styles.dataDescription]}>
              {item.description}
            </Text>
          </Card>
        ))}

        <Text style={[typography.h3, styles.sectionTitle]}>Permissions</Text>
        <Card>
          <Text style={typography.caption}>
            Location, camera and photo library access are granted from your
            device settings. You can revoke them at any time.
          </Text>
          <View style={styles.buttonWrapper}>
            <PrimaryButton title="Open app settings" onPress={openAppSettings} />
          </View>
        </Card>

        <Text style={[typography.h3, styles.sectionTitle]}>Delete account</Text>
        <Card style={styles.dangerCard}>
          <Text style={typography.caption}>
            Account deletion is handled by an administrator. Your reports and
            comments are removed along with your account, and the action cannot
            be undone.
          </Text>
          <TouchableOpacity
            onPress={requestAccountDeletion}
            style={styles.dangerButton}
          >
            <Text style={styles.dangerText}>Request account deletion</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  pageTitle: { marginBottom: spacing.md },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  dataCard: { marginBottom: spacing.sm },
  dataRow: { flexDirection: "row", alignItems: "center" },
  dataTitle: { marginLeft: spacing.sm },
  dataDescription: { marginTop: spacing.xs },
  buttonWrapper: { marginTop: spacing.md },
  dangerCard: { borderWidth: 1, borderColor: colors.danger },
  dangerButton: { marginTop: spacing.md, alignItems: "center" },
  dangerText: { color: colors.danger, fontWeight: "600" },
});
