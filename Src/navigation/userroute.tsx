import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClaimDetailss from '../screens/claimsDetails';
import ProfileScreen from '../screens/profile';
import PolicyDetails from '../screens/policydetails';
import NaturaAddition from '../screens/NaturaAddition';
import chatscreen from '../screens/chatscreen';
import MainTabs from './bottomtab';
import DoctorOnCallScreen from '../screens/nhtConsultant';
import ResetPassword from '../screens/resetPassword';
import SurvayPage from '../screens/SurvayPage';
import SurveyListScreen from '../screens/survayScreen';
import Helpticketlist from '../screens/Helpticketlist';
import NetworkHospitalScreen from '../screens/networkHospital';
import fileClaim from '../screens/fileClaim';
import FileClaimPage from '../screens/fileClaim';
import claimProcess from '../screens/claimProcess';
import ClaimProcessPage from '../screens/claimProcess';
import LoginedesetPassword from '../screens/LoginedResetPass';
import WebRendering from '../screens/webview/webRender';

const Stack = createNativeStackNavigator();

export const UserRoute = () => (
  <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Dashboard" component={MainTabs} />
    <Stack.Screen name="ClaimsDetails" component={ClaimDetailss} />
    <Stack.Screen name="profile" component={ProfileScreen} />
    <Stack.Screen name="policydetails" component={PolicyDetails} />
    <Stack.Screen name="NaturalAddition" component={NaturaAddition} />
    <Stack.Screen name="ChatScreen" component={chatscreen} />
    <Stack.Screen name="DoconCall" component={DoctorOnCallScreen} />
    <Stack.Screen name="ResetPassword" component={LoginedesetPassword} />
    <Stack.Screen name="SurvayDetails" component={SurvayPage} />
    <Stack.Screen name="SurvaylistPage" component={SurveyListScreen} />
    <Stack.Screen name="AllTicketsScreen" component={Helpticketlist} />
    <Stack.Screen name="networkHospitalScreen" component={NetworkHospitalScreen} />
    <Stack.Screen name="fileclaim" component={FileClaimPage} />
    <Stack.Screen name="claimProcess" component={ClaimProcessPage} />
    <Stack.Screen name="Webrendering" component={WebRendering} />









  </Stack.Navigator>
);