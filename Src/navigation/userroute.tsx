import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/dashboard';

const Stack = createNativeStackNavigator();

export const UserRoute = () => (
  <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={Dashboard} />
  </Stack.Navigator>
);