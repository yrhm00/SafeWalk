import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { globalStyles, typography, spacing, colors } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk, clearError } from "../../store/authSlice"; // Ajout de clearError
import Card from "../../components/ui/Card";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const navigation = useNavigation();

  /**
   * Gère l'inscription de l'utilisateur.
   */
  const handleRegister = async () => {
    // Vérification locale avant l'envoi
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    // Dispatch de l'action d'inscription vers Redux
    dispatch(registerThunk({ name, username, email, password }));
  };

  /**
   * Formate l'erreur pour éviter le crash de l'application.
   * Si authError est un objet, on extrait la chaîne de caractères.
   */
  const renderErrorMessage = () => {
    if (!authError) return null;
    
    // ✅ CORRECTION : Empêche le crash si authError est un objet
    const message = typeof authError === "string" 
      ? authError 
      : (authError.error || authError.message || "An error occurred");

    return (
      <Text style={styles.errorText}>
        {message}
      </Text>
    );
  };

  return (
    <View style={globalStyles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={typography.h1}>Create account</Text>
            <Text style={typography.caption}>Join SafeWalk and stay safe</Text>
          </View>

          <Card style={{ gap: spacing.md }}>
            {/* ✅ Affichage sécurisé de l'erreur */}
            {renderErrorMessage()}

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
            
            <View style={{ marginTop: spacing.sm }}>
              <PrimaryButton title="Register" onPress={handleRegister} />
            </View>

            <View style={styles.footer}>
              <Text style={typography.small}>Already have an account?</Text>
              <TouchableOpacity onPress={() => {
                dispatch(clearError()); // Nettoie l'erreur avant de changer de page
                navigation.navigate("Login");
              }}>
                <Text style={styles.link}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: spacing.lg },
  header: { alignItems: "center", marginBottom: spacing.xl },
  footer: { marginTop: spacing.md, alignItems: "center" },
  link: { marginTop: 4, color: colors.primary, fontWeight: "600" },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 13,
    marginBottom: spacing.xs,
  },
});