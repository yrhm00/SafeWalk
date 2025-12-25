import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Librairie d'icônes standard d'Expo

// 1. On importe les 5 écrans que tu viens de créer
import MapScreen from '../screens/Tabs/MapScreen';
import IncidentListScreen from '../screens/Tabs/IncidentListScreen';
import ReportScreen from '../screens/Tabs/ReportScreen';
import AlertsScreen from '../screens/Tabs/AlertsScreen';
import ProfileScreen from '../screens/Tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // On cache le titre par défaut en haut (ex: "MapScreen")
        tabBarActiveTintColor: '#007AFF', // Couleur active (Bleu maquette)
        tabBarInactiveTintColor: 'gray',  // Couleur inactive
        
        // Fonction pour choisir l'icône selon le nom de la page
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Incidents') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            size = 32; // On grossit un peu le bouton central (+)
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 2. On définit nos 5 onglets */}
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Incidents" component={IncidentListScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}