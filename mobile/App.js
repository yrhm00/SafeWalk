// File: mobile/App.js
import React from 'react';
import { Provider } from 'react-redux'; // bien depuis 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store'; // importer l'objet exporté

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}