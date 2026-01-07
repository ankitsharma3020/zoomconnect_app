import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Login from '../screens/login';
import OTP from '../screens/Otp';
import Forgetpassword from '../screens/Forgetpassword';
import Splash from '../../splash';
import Dashboard from '../screens/dashboard';
import MainTabs from './bottomtab';
import ClaimDetailss from '../screens/claimsDetails';
import ProfileScreen from '../screens/profile';
import Policydetails from '../screens/policydetails';
import NaturaAddition from '../screens/NaturaAddition';
import chatscreen from '../screens/chatscreen';
import RegisterScreen from '../screens/firstRegister';
import ResetPassword from '../screens/resetPassword';
// import PolicyDetailsScreen from '../component/pociynewcard';

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
    <Stack.Screen name="FirstRegister" component={RegisterScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />









  </Stack.Navigator>
);