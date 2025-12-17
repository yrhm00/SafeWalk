import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View>
      <Text>Profil</Text>
      <Text>{user?.email}</Text>
      <Button title="Déconnexion" onPress={logout} />
    </View>
  );
}
