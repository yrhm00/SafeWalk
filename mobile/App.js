import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import { hydrate } from './src/store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import NetworkBanner from './src/components/NetworkBanner';

// Import des écrans d'authentification
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignupScreen from './src/screens/Auth/SignupScreen';
import AnimatedSplashScreen from './src/screens/Auth/AnimatedSplashScreen';

// Import du navigateur du bas
import TabNavigator from './src/navigation/TabNavigator';

import IncidentDetailScreen from './src/screens/Tabs/IncidentDetailScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      let user;
      try {
        token = await SecureStore.getItemAsync('token');
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) user = JSON.parse(userStr);
      } catch (e) {
        // Restoring token failed
      }
      dispatch(hydrate({ token, user }));
    };

    bootstrapAsync();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <NetworkBanner />
      <Stack.Navigator initialRouteName="Splash">

        {/* Écran de chargement animé (Splash) */}
        <Stack.Screen
          name="Splash"
          component={AnimatedSplashScreen}
          options={{ headerShown: false }}
        />

        {/* Groupe 1 : Écrans de connexion (Pas de menu en bas ici) */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />

        {/* Groupe 2 : L'application principale (Le TabNavigator gère ses propres écrans) */}
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} options={{ headerShown: false, presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}