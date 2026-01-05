import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { globalStyles, colors, spacing, typography } from "../../styles";
import { logoutThunk } from "../../store/authSlice";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Profile" />

      {/* ===== HEADER PROFILE ===== */}
      <View
        style={{
          backgroundColor: colors.primary,
          paddingVertical: spacing.xl,
          alignItems: "center",
        }}
      >
        {/* Avatar */}
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: user?.avatar || "https://i.pravatar.cc/150?img=47",
            }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              borderWidth: 3,
              borderColor: colors.white,
            }}
          />

          {/* Edit avatar */}
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 6,
            }}
          >
            <Ionicons name="camera" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text
          style={[
            typography.h2,
            { color: colors.white, marginTop: spacing.sm },
          ]}
        >
          {user?.name || "User"}
        </Text>

        {/* Email */}
        <Text
          style={[typography.caption, { color: colors.white, opacity: 0.9 }]}
        >
          {user?.email}
        </Text>
      </View>

      {/* ===== OPTIONS ===== */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileItem icon="person-outline" label="Edit Profile" />
        <ProfileItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => navigation.navigate("Alerts")}
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

        {/* ===== LOGOUT ===== */}
        <Card
          style={{
            marginTop: spacing.lg,
            borderWidth: 1,
            borderColor: colors.danger,
            backgroundColor: "#FFF5F5",
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.md,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text
              style={{
                color: colors.danger,
                fontWeight: "600",
                marginLeft: spacing.sm,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

/* ===== ITEM COMPONENT ===== */
function ProfileItem({ icon, label, onPress }) {
  return (
    <Card>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: colors.surface,
              padding: spacing.sm,
              borderRadius: 10,
              marginRight: spacing.md,
            }}
          >
            <Ionicons name={icon} size={20} color={colors.primary} />
          </View>
          <Text style={typography.body}>{label}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </Card>
  );
}
