import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import { authStore } from "../store/authStore";
import { View, Text } from "react-native";

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenue dans l'app !</Text>
    </View>
  );
}

export default function RootNavigator() {
  const token = authStore((state) => state.token);

  return (
    <NavigationContainer>
      {token ? <HomeScreen /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
