import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OpeningScreen from '../screens/OpeningScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Stack d'authentification basique : écran d'ouverture, login, inscription
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Opening" component={OpeningScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

