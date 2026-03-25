import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension';
import { useResetPasswordMutation } from '../redux/service/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/service/userSlice';

// --- CONSTANTS & THEME (Kept from your original) ---
const START_HEIGHT = hp(32);
const OVERLAP = hp(8);
const COLORS = {
  primary: '#934790',     
  primaryDark: '#6A2C66', 
  primaryLight: '#B565B0',
  secondary: '#FFE8D6',   
  white: '#FFFFFF',
  bg: '#FDF8F5', 
  text: '#333333',
  textLight: '#888',
  inputBorder: '#EADDF2',
  inputBg: '#FAFAFC',
};

// ... ExactShardPattern and CardPattern components remain the same ...

const LoginedesetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
 
  // Extract token from navigation params (passed from previous screen)


  // --- STATE ---
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resetPasswordApi] = useResetPasswordMutation();

  // --- ANIMATIONS ---
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topShift = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  // --- KEYBOARD HANDLING ---
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, { toValue: -Math.max(0, h * 0.2), duration: 250, useNativeDriver: false }).start();
      Animated.timing(topShift, { toValue: -hp(5), duration: 250, useNativeDriver: false }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardOffset, { toValue: 0, duration: 250, useNativeDriver: false }).start();
      Animated.timing(topShift, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => { subShow.remove(); subHide.remove(); };
  }, []);
 const showToastOrAlert = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Required', msg);
    }
  };
  const handleReset = async () => {
    const token = token || await AsyncStorage.getItem('token'); // Fallback to AsyncStorage if not passed via params
    // 1. Validations
    if (!newPassword || !confirmPassword) {
       showToastOrAlert
("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
       showToastOrAlert
("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
       showToastOrAlert("Passwords do not match");
      return;
    }
   

    setLoading(true);
    try {

      const body = {
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword
      };
     
      // 2. API Call with requested body structure
     let response = await resetPasswordApi(body);
      console.log('Reset Password Response:', response);
     if(response?.data?.success===true){
      showToastOrAlert(response?.data.message);
      navigation.pop();
     }else{
      showToastOrAlert(response?.error?.data?.message || "Failed to reset password");
     }
      

      // 3. Success Handling
       
    
       // Clear user data on first login password reset
      
        
      
      
      // Pop the screen back to Login
       
      
    } catch (error) {
      const errorMsg = error?.data?.message || "Failed to reset password";
       showToastOrAlert
(errorMsg, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1, transform: [{ translateY: topShift }] }]}>
            <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
            {/* <ExactShardPattern /> (Keep your pattern components here) */}
            
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>

            <View style={styles.topLogoWrap}>
              <Image source={require('../../assets/WhiteNewZoomConnectlogo.png')} style={styles.topLogo} resizeMode="contain" />
            </View>
          </Animated.View>

          <Animated.View style={[styles.floatingCard, { top: Animated.add(Animated.subtract(topSectionHeightAnim, OVERLAP), topShift), transform: [{ translateY: keyboardOffset }], zIndex: 10 }]}>
            {/* <CardPattern /> (Keep your pattern components here) */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" bounces={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeTitle}>
                      <Text style={{ color: COLORS.primaryDark }}>Reset </Text>
                      <Text style={{ color: COLORS.primary }}>Password</Text>
                    </Text>
                    <View style={styles.titleUnderline} />
                </View>

                {/* --- NEW PASSWORD --- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Enter new password"
                      placeholderTextColor="#BBB"
                      onChangeText={setNewPassword}
                      value={newPassword}
                      secureTextEntry={!showNew}
                      style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                      <Icon name={showNew ? "eye-off" : "eye"} size={hp(2.5)} color="#BBB" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* --- CONFIRM PASSWORD --- */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Confirm new password"
                      placeholderTextColor="#BBB"
                      onChangeText={setConfirmPassword}
                      value={confirmPassword}
                      secureTextEntry={!showConfirm}
                      style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                      <Icon name={showConfirm ? "eye-off" : "eye"} size={hp(2.5)} color="#BBB" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* --- SUBMIT BUTTON --- */}
                <TouchableOpacity onPress={loading ? null : handleReset} style={styles.buttonShadow} activeOpacity={0.8} disabled={loading}>
                  <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtn}>
                    <View style={styles.loginBtn1}>
                      {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                      ) : (
                        <Text style={styles.loginBtnText}>Update Password</Text>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.poweredByText}>Powered by Novel Healthtech</Text>
                </View>
                <View style={{height: hp(2.5)}} />
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginedesetPassword;

// ... Your existing styles remain the same ...

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryDark },
  container: { flex: 1, backgroundColor: COLORS.primaryDark },

  // --- Top Section ---
  topSection: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    overflow: 'hidden',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? hp(7.5) : hp(8.5), // approx 60/70
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'android' ? hp(5) : hp(5),
    left: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    padding: wp(2),
  },
  backText: { 
    color: COLORS.white, 
    fontSize: hp(2), // approx 16
    fontFamily: 'Montserrat-SemiBold' 
  },
  topLogoWrap: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: hp(5), 
  },
  topLogo: { 
    width: wp(65), 
    height: hp(10) 
  }, 

  // --- Floating Card ---
  floatingCard: {
    position: 'absolute',
    left: wp(5), 
    right: wp(5), 
    backgroundColor: '#FFFFFF',
    borderRadius: wp(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    paddingBottom: hp(1.2),
    overflow: 'hidden', 
  },
  scrollContent: {
    paddingHorizontal: wp(6),
    paddingTop: hp(3.8), // approx 30
    paddingBottom: hp(2.5),
  },

  // --- Titles ---
  titleContainer: {
    alignItems: 'center',
    marginBottom: hp(3.8), // approx 30
  },
  welcomeTitle: { 
    fontSize: hp(2.7), // approx 28
    fontFamily: 'Montserrat-Bold', 
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleUnderline: {
      width: wp(10), 
      height: hp(0.5), 
      backgroundColor: COLORS.secondary, 
      marginTop: hp(1),
      borderRadius: wp(0.5),
  },

  // --- Input Styling ---
  inputGroup: {
    marginBottom: hp(2.5), // approx 20
  },
  label: {
    fontSize: hp(1.5), // approx 14
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.textLight,
    marginBottom: hp(1),
    marginLeft: wp(1),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: wp(4), // approx 16
    height: hp(6.5), // approx 52
    paddingHorizontal: wp(4),
    backgroundColor: COLORS.inputBg,
  },
  input: {
    flex: 1,
    fontSize: hp(1.5), // approx 15
    fontFamily: 'Montserrat-Regular',
    color: COLORS.text,
    height: '100%',
  },
  eyeIcon: {
    padding: wp(2),
  },

  // --- Buttons ---
  buttonShadow: {
      marginTop: hp(2.5),
      marginBottom: hp(0.8),
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: hp(0.5) },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
  },
  loginBtn: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: wp(7.2), // approx 29
    alignItems: 'center',
  },
   loginBtn1: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: hp(1.7), // approx 16
    borderRadius: wp(7.2), // approx 29
    alignItems: 'center',
  },
  loginBtnText: { 
    color: '#FFFFFF', 
    fontSize: hp(1.8), // approx 18
    fontFamily: 'Montserrat-Bold', 
    letterSpacing: 1 
  },

  // --- Footer ---
  footerContainer: {
    marginTop: hp(3.8), // approx 30
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: hp(1.2), // approx 12
    fontFamily: 'Montserrat-Regular',
    color: '#AAAAAA',
  },
});