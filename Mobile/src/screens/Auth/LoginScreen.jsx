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
  const authError = useSelector((state) => state.auth.error); // Récupère l'erreur du store

  const handleLogin = async () => {
    dispatch(loginThunk({ email, password }));
  };

  return (
    <View style={globalStyles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={typography.h1}>SafeWalk</Text>
            <Text style={typography.caption}>Your safety companion</Text>
          </View>

          <Card style={{ gap: spacing.md }}>
            {authError && ( // Affiche l'erreur si elle existe
              <Text
                style={{
                  color: colors.danger,
                  textAlign: "center",
                  fontSize: 13,
                }}
              >
                {authError}
              </Text>
            )}
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

const styles = {
  container: { flex: 1, justifyContent: "center", padding: spacing.lg },
  header: { alignItems: "center", marginBottom: spacing.xl },
  footer: { marginTop: spacing.md, alignItems: "center" },
  link: { marginTop: 4, color: colors.primary, fontWeight: "600" },
};
