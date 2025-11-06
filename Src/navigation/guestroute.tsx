import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Login from '../screens/login';
import OTP from '../screens/Otp';
import Forgetpassword from '../screens/Forgetpassword';
import Splash from '../../splash';

const Stack = createNativeStackNavigator();

export const GuestRoute = () => (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom', // 👈 built-in smooth transition
      }}
    >
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Login" component={Login} />

    <Stack.Screen name="Otp" component={OTP} />
    <Stack.Screen name="ForgotPassword" component={Forgetpassword} />
  </Stack.Navigator>
);