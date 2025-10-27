import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Splash from './splash'
import Login from './login'
import Otp from './Otp'
import ForgotPassword from './Forgetpassword'
import RegisterScreen from './firstRegister'

const App = () => {
  console.log('App')
  return (
    <View style={{flex:1}}>
    <StatusBar barStyle="light-content" backgroundColor="#934790" />
    {/* <Login/> */}
    <Otp/>
    {/* <RegisterScreen/> */}
    {/* <ForgotPassword/> */}
   {/* <Splash/> */}
   </View>
  )
}

export default App

const styles = StyleSheet.create({})