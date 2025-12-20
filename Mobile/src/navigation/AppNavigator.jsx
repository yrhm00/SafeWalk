import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  return token ? <TabNavigator /> : <AuthNavigator />;
}
