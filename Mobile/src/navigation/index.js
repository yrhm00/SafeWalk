import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession } from "../store/authSlice";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function Navigation() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isAuthenticated = !!token;

  return (
    <NavigationContainer>
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
