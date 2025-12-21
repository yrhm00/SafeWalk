import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import {
  globalStyles,
  typography,
  spacing,
  colors,
  shadows,
} from "../../styles";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleRegister = () => {
    console.log("REGISTER", { name, email, password, confirmPassword });
    // plus tard : appel API
  };

  return (
  
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={globalStyles.screen}>
   
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={typography.h1}>Create account</Text>
            <Text style={typography.caption}>Join SafeWalk and stay safe</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <TextField placeholder="Name" value={name} onChangeText={setName} />

            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
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

            <PrimaryButton title="Register" onPress={handleRegister} />

            <View style={styles.footer}>
              <Text style={typography.small}>Already have an account?</Text>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.link}>Sign in</Text>
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
    fontWeight: "600",
  },
};
