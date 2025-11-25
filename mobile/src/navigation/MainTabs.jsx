import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import IncidentsScreen from '../screens/IncidentsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportScreen from '../screens/ReportScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2563eb', // Blue color from screenshot
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 80, // Taller tab bar
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Incidents') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Report') {
            iconName = 'add';
            return <Ionicons name="add" size={32} color="#fff" />;
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Incidents" component={IncidentsScreen} />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: 'Report',
        }}
      />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
