import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import {
  globalStyles,
  typography,
  spacing,
  colors,
  shadows,
} from "../../styles";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const { login, user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  // Log uniquement quand user change
  useEffect(() => {
    console.log("🔍 user a changé :", user);
  }, [user]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={globalStyles.screen}>
        <View style={styles.container}>
          {/* Header / Branding */}
          <View style={styles.header}>
            <Text style={typography.h1}>SafeWalk</Text>
            <Text style={typography.caption}>Your safety companion</Text>
          </View>

          {/* Card Login */}
          <View style={styles.card}>
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TextField
              placeholder="Password"
              value={password}
              secure
              onChangeText={setPassword}
            />

            <PrimaryButton
              title="Sign In"
              onPress={() => login({ email }, "fake-jwt")}
            />

            <View style={styles.footer}>
              <Text style={typography.small}>No account yet?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>Create an account</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
    gap: spacing.md,
    ...shadows.card,
  },
  footer: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  link: {
    marginTop: 4,
    color: colors.primary,
    ontWeight: "600",
  },
};
