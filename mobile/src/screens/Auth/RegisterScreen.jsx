import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import { saveToken, saveRefreshToken } from "../../services/secureStore";
import { setCredentials } from "../../store/authSlice";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Card from "../../components/ui/Card";
import { globalStyles, typography, spacing, colors } from "../../styles";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const validateForm = () => {
    if (
      name.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      return "Please fill in all fields.";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return "The email address is not valid.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleRegister = async () => {
    if (submitting) {
      return;
    }

    const validationError = validateForm();
    if (validationError !== "") {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await api.post("/users/register", {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      const loginResponse = await api.post("/users/login", {
        email: email.trim(),
        password,
      });
      const { token, refreshToken } = loginResponse.data;
      await saveToken(token);
      await saveRefreshToken(refreshToken);

      const profileResponse = await api.get("/users/me");
      dispatch(setCredentials({ token, user: profileResponse.data }));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={typography.h1}>Create account</Text>
            <Text style={typography.caption}>Join SafeWalk and stay safe</Text>
          </View>

          <Card style={styles.card}>
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            <TextField placeholder="Name" value={name} onChangeText={setName} />
            <TextField
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextField
              placeholder="Password"
              secure
              value={password}
              onChangeText={setPassword}
            />
            <TextField
              placeholder="Confirm password"
              secure
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <PrimaryButton
              title={submitting ? "Creating account..." : "Register"}
              onPress={handleRegister}
              disabled={submitting}
            />

            <View style={styles.footer}>
              <Text style={typography.small}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: { alignItems: "center", marginBottom: spacing.xl },
  logo: { width: 150, height: 150, marginBottom: spacing.md },
  card: { gap: spacing.md },
  footer: { marginTop: spacing.md, alignItems: "center" },
  link: { marginTop: 4, color: colors.primary, fontWeight: "600" },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 13,
    marginBottom: spacing.xs,
  },
});
