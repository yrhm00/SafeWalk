import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { globalStyles, typography, spacing } from "../../styles";
import { logoutThunk } from "../../store/authSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Profile" />

      <View style={{ padding: spacing.lg }}>
        <Text style={typography.h2}>Account</Text>

        <Text style={{ marginTop: spacing.md }}>
          Email: {user?.email}
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}
