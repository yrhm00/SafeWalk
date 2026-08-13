import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import { updateUser } from "../../store/authSlice";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { globalStyles, spacing, typography, colors } from "../../styles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const HIDDEN_PASSWORD = "••••••••";

export default function EditProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const emailChanged = email.trim() !== (user?.email || "");
  const passwordChanged = newPassword !== "";
  const requiresCurrentPassword = emailChanged || passwordChanged;

  const cancelSecurityEdit = () => {
    setIsEditingSecurity(false);
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const validateForm = () => {
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (emailChanged && !EMAIL_REGEX.test(email.trim())) {
      return "The email address is not valid.";
    }
    if (passwordChanged && newPassword.length < PASSWORD_MIN_LENGTH) {
      return `New password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
    }
    if (passwordChanged && newPassword !== confirmPassword) {
      return "The two passwords do not match.";
    }
    if (requiresCurrentPassword && currentPassword === "") {
      return "Enter your current password to confirm these changes.";
    }
    return "";
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    const validationError = validateForm();
    if (validationError !== "") {
      setSuccess("");
      setError(validationError);
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        username: username.trim(),
      };

      if (emailChanged) {
        payload.email = email.trim();
      }
      if (passwordChanged) {
        payload.password = newPassword;
      }
      if (requiresCurrentPassword) {
        payload.currentPassword = currentPassword;
      }

      const response = await api.patch("/users/me", payload);

      dispatch(updateUser(response.data));
      setIsEditingSecurity(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Profile updated successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Edit Profile" showBack />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <Text style={typography.h3}>Full Name</Text>
            <View style={styles.field}>
              <TextField
                value={name}
                onChangeText={setName}
                placeholder="Your name"
              />
            </View>

            <Text style={[typography.h3, styles.label]}>Username</Text>
            <View style={styles.field}>
              <TextField
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
              />
            </View>
          </Card>

          <Card>
            <View style={styles.sectionHeader}>
              <Text style={typography.h3}>Security</Text>
              <TouchableOpacity
                onPress={
                  isEditingSecurity
                    ? cancelSecurityEdit
                    : () => setIsEditingSecurity(true)
                }
              >
                <Text style={styles.link}>
                  {isEditingSecurity ? "Cancel" : "Unlock"}
                </Text>
              </TouchableOpacity>
            </View>

            {isEditingSecurity ? (
              <>
                <Text style={[typography.small, styles.hint]}>
                  Enter your current password to confirm any change below.
                </Text>
                <View style={styles.field}>
                  <TextField
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current password"
                    secure
                    autoCapitalize="none"
                  />
                </View>

                <Text style={[typography.caption, styles.label]}>Email</Text>
                <View style={styles.field}>
                  <TextField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Text style={[typography.caption, styles.label]}>
                  New password
                </Text>
                <Text style={typography.small}>
                  Leave empty to keep your current password.
                </Text>
                <View style={styles.field}>
                  <TextField
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New password"
                    secure
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.field}>
                  <TextField
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secure
                    autoCapitalize="none"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={[typography.caption, styles.label]}>Email</Text>
                <Text style={typography.body}>{user?.email}</Text>

                <Text style={[typography.caption, styles.label]}>Password</Text>
                <Text style={styles.hiddenPassword}>{HIDDEN_PASSWORD}</Text>
              </>
            )}
          </Card>

          {error !== "" && <Text style={styles.errorText}>{error}</Text>}
          {success !== "" && <Text style={styles.successText}>{success}</Text>}

          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title={saving ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={saving}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  field: { marginTop: spacing.sm },
  label: { marginTop: spacing.md },
  hint: { marginTop: spacing.xs },
  buttonWrapper: { marginTop: spacing.xl },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hiddenPassword: {
    fontSize: 18,
    letterSpacing: 2,
    color: colors.textSecondary,
  },
  link: { color: colors.primary, fontWeight: "600" },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginTop: spacing.md,
  },
  successText: {
    color: colors.success,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
