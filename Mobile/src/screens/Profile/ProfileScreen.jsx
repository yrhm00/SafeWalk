import { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { globalStyles, typography, spacing } from "../../styles";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Profile" />

      <View style={styles.container}>
        <Text style={typography.h2}>My account</Text>

        <Text style={typography.body}>
          Email: {user?.email ?? "Unknown"}
        </Text>

        <View style={{ marginTop: spacing.lg }}>
          <PrimaryButton title="Log out" onPress={logout} />
        </View>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.md,
  },
};
