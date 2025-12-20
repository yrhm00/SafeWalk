import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";
import DangerDetailsScreen from "../screens/Home/DangerDetailsScreen";
import CreateReportScreen from "../screens/Report/CreateReportScreen";

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>

      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />

      <Stack.Screen 
        name="DangerDetails" 
        component={DangerDetailsScreen}
        options={{ title: "Danger Details" }}
      />

      <Stack.Screen 
        name="CreateReport" 
        component={CreateReportScreen}
        options={{ title: "New Report" }}
      />

    </Stack.Navigator>
  );
}
