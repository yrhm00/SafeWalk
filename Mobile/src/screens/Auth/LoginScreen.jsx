import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image, // Importation nécessaire pour le logo
  StyleSheet,
} from "react-native";
import { useState } from "react";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { globalStyles, typography, spacing, colors } from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../store/authSlice";
import Card from "../../components/ui/Card";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);

  const handleLogin = async () => {
    dispatch(loginThunk({ email, password }));
  };

  /**
   * ✅ Affiche l'erreur sans faire planter l'application
   * si le serveur renvoie un objet au lieu d'une chaîne.
   */
  const renderErrorMessage = () => {
    if (!authError) return null;
    const message = typeof authError === "string" 
      ? authError 
      : (authError.error || authError.message || "Login failed");
    return <Text style={styles.errorText}>{message}</Text>;
  };

  return (
    <View style={globalStyles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            {/* ✅ AJOUT DU LOGO (Mockup) */}
            <Image 
              source={require("../../../assets/logo.png")} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={typography.h1}>SafeWalk</Text>
            <Text style={typography.caption}>Your safety companion</Text>
          </View>

          <Card style={{ gap: spacing.md }}>
            {renderErrorMessage()}
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
            <PrimaryButton title="Sign In" onPress={handleLogin} />
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
  container: { flex: 1, justifyContent: "center", padding: spacing.lg },
  header: { alignItems: "center", marginBottom: spacing.xl },
  // ✅ Style pour le logo circulaire
  logo: {
    width: 150,
    height: 150,
    marginBottom: spacing.md,
  },
  footer: { marginTop: spacing.md, alignItems: "center" },
  link: { marginTop: 4, color: colors.primary, fontWeight: "600" },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 13,
    marginBottom: spacing.xs,
  },
});