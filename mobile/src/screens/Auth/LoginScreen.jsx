import { useState } from "react";
import {
  View,
  Text,
  Image,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (submitting) {
      return;
    }

    if (email.trim() === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("The email address is not valid.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await api.post("/users/login", {
        email: email.trim(),
        password,
      });
      const { token, refreshToken } = response.data;
      await saveToken(token);
      await saveRefreshToken(refreshToken);

      const profileResponse = await api.get("/users/me");
      dispatch(setCredentials({ token, user: profileResponse.data }));
    } catch (requestError) {
      if (requestError.response && requestError.response.status === 404) {
        setError("Incorrect email or password.");
      } else {
        setError(getErrorMessage(requestError));
      }
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
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={typography.h1}>SafeWalk</Text>
            <Text style={typography.caption}>Your safety companion</Text>
          </View>

          <Card style={styles.card}>
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextField
              placeholder="Password"
              value={password}
              secure
              onChangeText={setPassword}
            />
            <PrimaryButton
              title={submitting ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              disabled={submitting}
            />
            <View style={styles.footer}>
              <Text style={typography.small}>No account yet?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: spacing.lg },
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
