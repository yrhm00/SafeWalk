import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import RootNavigator from "./RootNavigator";

export default function Navigation() {
  const token = useSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      {token ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
