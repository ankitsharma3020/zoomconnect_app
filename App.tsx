import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RouteManager from './Src/navigation/routemanager';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#934790" />
      <NavigationContainer>
        <RouteManager />
      </NavigationContainer>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});