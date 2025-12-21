import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "./CustomTabBar";

import HomeScreen from "../screens/Home/HomeScreen";
import HomeNavigator from "./HomeNavigator";
import IncidentsScreen from "../screens/Incidents/IncidentsScreen";
import CreateReportScreen from "../screens/Report/CreateReportScreen";
import AlertsScreen from "../screens/Alerts/AlertsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Map"
        component={HomeNavigator}
        options={{
          tabBarIcon: () => "map",
        }}
      />

      <Tab.Screen
        name="Incidents"
        component={IncidentsScreen}
        options={{
          tabBarIcon: () => "alert-circle",
        }}
      />

      {/* TAB CENTRALE */}
      <Tab.Screen
        name="CreateReport"
        component={CreateReportScreen}
        options={{
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: () => "notifications",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => "person",
        }}
      />
    </Tab.Navigator>
  );
}
