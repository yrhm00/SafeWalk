import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import { clearSession } from "../../services/secureStore";
import { logout } from "../../store/authSlice";
import { globalStyles, colors, spacing, typography } from "../../styles";

function ProfileItem({ icon, label, onPress }) {
  return (
    <Card>
      <TouchableOpacity onPress={onPress} style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <View style={styles.itemIcon}>
            <Ionicons name={icon} size={20} color={colors.primary} />
          </View>
          <Text style={typography.body}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </Card>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await clearSession();
    dispatch(logout());
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Profile" />

      <View style={styles.header}>
        <Text style={[typography.h2, styles.headerName]}>
          {user?.name || user?.username || "User"}
        </Text>
        <Text style={[typography.caption, styles.headerEmail]}>
          {user?.email}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => navigation.navigate("EditProfile")}
        />
        <ProfileItem
          icon="document-text-outline"
          label="My reports"
          onPress={() => navigation.navigate("MyReports")}
        />
        <ProfileItem
          icon="shield-checkmark-outline"
          label="Privacy Settings"
          onPress={() => navigation.navigate("PrivacySettings")}
        />
        <ProfileItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => navigation.navigate("HelpSupport")}
        />

        <Card style={styles.logoutCard}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  headerName: { color: colors.white },
  headerEmail: { color: colors.white, opacity: 0.9 },
  scrollContent: { paddingBottom: spacing.xl },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  itemIcon: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 10,
    marginRight: spacing.md,
  },
  logoutCard: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.surface,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "600",
    marginLeft: spacing.sm,
  },
});
