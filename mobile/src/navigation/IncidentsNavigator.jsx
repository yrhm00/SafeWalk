import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IncidentsScreen from "../screens/Tab/IncidentsScreen";
import DangerDetailsScreen from "../screens/Home/DangerDetailsScreen"; 

const Stack = createNativeStackNavigator();

export default function IncidentsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IncidentsList" component={IncidentsScreen} />
      {/* On enregistre l'écran de détails ici aussi */}
      <Stack.Screen name="DangerDetails" component={DangerDetailsScreen} />
    </Stack.Navigator>
  );
}