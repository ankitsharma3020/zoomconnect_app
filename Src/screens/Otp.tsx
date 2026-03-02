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
  ToastAndroid
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension'; 
import { useLoginemailMutation, useLoginmobileMutation, useOtpVerifyMutation } from '../redux/service/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/service/userSlice';

// --- POLYFILL FOR BUILD STABILITY ---
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    let result = [];
    for (let i = this.length - 1; i >= 0; i--) {
        result.push(this[i]);
    }
    return result;
  };
}

// --- CONSTANTS ---
const START_HEIGHT = hp(32);
const OVERLAP = hp(7);

const COLORS = {
  primary: '#934790',     
  primaryDark: '#6A2C66', 
  primaryLight: '#B565B0',
  secondary: '#FFE8D6',   
  white: '#FFFFFF',
  text: '#434141ff',
  inputBorder: '#EADDF2',
  inputBg: '#FAFAFC',
  success: '#81ce85ff',
  error: '#D32F2F',
};

const ExactShardPattern = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <LinearGradient
      colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']}
      style={{ position: 'absolute', bottom: -hp(10), right: -wp(20), width: wp(150), height: wp(150), transform: [{ rotate: '-35deg' }] }}
    />
    <LinearGradient
      colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.0)']}
      style={{ position: 'absolute', top: -hp(10), left: -wp(20), width: wp(120), height: wp(120), transform: [{ rotate: '25deg' }] }}
    />
  </View>
);

const CardPattern = () => (
  <View style={[StyleSheet.absoluteFill, { borderRadius: wp(6), overflow: 'hidden' }]} pointerEvents="none">
     <LinearGradient colors={['rgba(147,71,144,0.03)', 'rgba(255,255,255,0)']} style={StyleSheet.absoluteFill} />
  </View>
);

const Otp = ({ route }) => {
  const { data, mode, firstLogin } = route.params;
  console.log("OTP Screen received params:", { data, mode, firstLogin });
  const firstLoginFlag = firstLogin || false;
  
  // Define dynamic OTP length
  let otpLength = 6;
  if (mode === 'phone') {
      otpLength = 4;
  }

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Emaillogin] = useLoginemailMutation();
  const [Mobilelogin] = useLoginmobileMutation();
  const [otp, setOtp] = useState('');
  const [OtpVerify] = useOtpVerifyMutation();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const textInputRef = useRef(null);
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // --- FOCUS HANDLING ---
  useEffect(() => {
    let focusTimeout = null;
    let timeToWait = 500;
    
    // Pure loop delay alternative to setTimeout if strictly desired, 
    // but React requires asynchronous timeouts for rendering.
    focusTimeout = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, timeToWait);
    
    return () => clearTimeout(focusTimeout);
  }, []);

  useEffect(() => {
    let showEvent = 'keyboardDidShow';
    let hideEvent = 'keyboardDidHide';
    
    if (Platform.OS === 'ios') {
        showEvent = 'keyboardWillShow';
        hideEvent = 'keyboardWillHide';
    }

    const onShow = (e) => {
      let h = 0;
      if (e && e.endCoordinates && e.endCoordinates.height) {
          h = e.endCoordinates.height;
      }
      let targetValue = h * 0.15;
      if (targetValue < 0) {
          targetValue = 0;
      }
      
      Animated.timing(keyboardOffset, {
        toValue: -targetValue,
        duration: 250,
        useNativeDriver: false,
      }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [keyboardOffset]);

  useEffect(() => {
    if (!isResendDisabled || timer === 0) {
      if (timer === 0) setIsResendDisabled(false);
      return;
    }
    const intervalId = setInterval(() => {
        setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isResendDisabled, timer]);

  const handleOnPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleVerifyOTP = async () => {
    // Dynamic validation based on mode length
    if (otp.length < otpLength) {
      triggerShake();
      setStatus('error');
      ToastAndroid.show('Please enter ' + otpLength + '-digit OTP', ToastAndroid.SHORT);
      return;
    }
    
    setLoading(true);
    try {
      let loginType = 'phone';
      if (mode === 'email') {
          loginType = 'email';
      }
      const body = { login_type: loginType=='phone'?'mobile':loginType, login_value: data, otp: otp };
      
      const response = await OtpVerify(body).unwrap();

     console.log("OTP Verify Response:", response);
      
      let isSuccess = false;
      if (response && (response.success || response.status === 'success')) {
          isSuccess = true;
      }

      if (isSuccess) {
        if (response.data && response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
        }
        setStatus('success');

        let isFirstLogin = false;
        if (response.data && response.data.user && response.data.user.first_login === 1) {
            isFirstLogin = true;
        }

        if (isFirstLogin) {
          navigation.navigate('FirstRegister', { user: response.data.user, firstLogin: true, mode: mode }); 
        } else {
       
         dispatch(setUser(true));
        }
       
      } else {
        triggerShake();
        setStatus('error');
      }
    } catch (error) {
      triggerShake();
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

const handleResendotp = async () => {
  if (!data) {
    ToastAndroid.show('Please fill required fields', ToastAndroid.SHORT);
    return;
  }

  // Set UI states for loading and timer
  setIsResendDisabled(true);
  setTimer(30);
  setLoading(true);

  try {
    let response;
    if (mode === 'email') {
      response = await Emaillogin({ email: data }).unwrap();
    } else if (mode === 'phone' || mode === 'mobile') { 
      response = await Mobilelogin({ mobile: data }).unwrap();
    } 

    let isSuccess = false;
    if (response && (response.success || response.token || response.data || response.status === 'success')) {
        isSuccess = true;
    }

    if (isSuccess) {
      // Safely extract user
      let userData = null;
      if (response.data && response.data.user) {
          userData = response.data.user;
      }
      
      console.log('Resend OTP successful, user data:', userData);

      // Safely store token if provided on resend
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        console.log('Token stored from response.data.token');
      } else if (response.token) {
        await AsyncStorage.setItem('token', response.token);
      }
      
      let toastMsg = 'Otp Resent Successfully';
      if (response && response.message) {
          toastMsg = response.message;
      }
      ToastAndroid.show(toastMsg, ToastAndroid.SHORT);
      
    } else {
      let errorMsg = 'Resend Failed';
      if (response && response.message) {
          errorMsg = response.message;
      }
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      
      // Re-enable button if API fails
      setIsResendDisabled(false);
      setTimer(0);
    }
  } catch (error) {
    let catchMsg = 'Something went wrong';
    if (error && error.data && error.data.message) {
        catchMsg = error.data.message;
    }
    ToastAndroid.show(catchMsg, ToastAndroid.SHORT);
    
    // Re-enable button if network/server crashes
    setIsResendDisabled(false);
    setTimer(0);
  } finally {
    setLoading(false);
  }
};

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  // Pure loop to generate OTP boxes dynamically based on otpLength
  let otpBoxElements = [];
  for (let i = 0; i < otpLength; i++) {
    let isFilled = false;
    if (otp[i]) {
        isFilled = true;
    }
    
    let isActive = false;
    if (i === otp.length && status === 'idle') {
        isActive = true;
    }

    otpBoxElements.push(
      <View key={i} style={[
        styles.otpBox,
        isFilled ? styles.otpBoxFilled : null,
        isActive ? styles.otpBoxActive : null,
        status === 'success' ? styles.otpBoxSuccess : null,
        status === 'error' ? styles.otpBoxError : null,
      ]}>
        <Text style={styles.otpText}>{otp[i] || ''}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
            <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} style={StyleSheet.absoluteFill} />
            <ExactShardPattern />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>
            <View style={styles.topLogoWrap}>
              <Image source={require('../../assets/WhiteNewZoomConnectlogo.png')} style={styles.topLogo} resizeMode="contain" />
            </View>
          </Animated.View>

          <Animated.View style={[styles.floatingCard, { top: Animated.subtract(topSectionHeightAnim, OVERLAP), transform: [{ translateY: keyboardOffset }], zIndex: 10 }]}>
            <CardPattern />
            <ScrollView 
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeTitle}>
                      <Text style={{ color: COLORS.primaryDark}}>Enter </Text>
                      <Text style={{ color: COLORS.primary }}>OTP</Text>
                    </Text>
                    <View style={styles.titleUnderline} />
                </View>

                <View style={styles.inputGroup}>
                  <Animated.View style={[styles.otpContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                    <TouchableOpacity style={styles.pressableContainer} onPress={handleOnPress} activeOpacity={1}>
                      {/* Render dynamically generated boxes */}
                      {otpBoxElements}
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <TextInput
                    ref={textInputRef}
                    style={styles.hiddenTextInput}
                    value={otp}
                    onChangeText={(val) => { setStatus('idle'); setOtp(val); }}
                    maxLength={otpLength} 
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoFocus={true}
                  />
                </View>

                <TouchableOpacity onPress={loading ? undefined : handleVerifyOTP} style={styles.buttonShadow} activeOpacity={0.8} disabled={loading}>
                  <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.loginBtn}>
                    <View style={styles.loginBtn1}>
                      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Verify OTP</Text>}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  {isResendDisabled ? (
                    <Text style={styles.resendText}>Resend code in <Text style={{ fontFamily: 'Montserrat-Bold' }}>{timer}s</Text></Text>
                  ) : (
                    <TouchableOpacity onPress={() => handleResendotp() }>
                      <Text style={styles.resendButtonText}>Resend Code</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.footerContainer}><Text style={styles.poweredByText}>Powered by Novel Healthtech</Text></View>
                <View style={{height: hp(2.5)}} />
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryDark },
  container: { flex: 1, backgroundColor: COLORS.primaryDark },
  topSection: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden', alignItems: 'center', paddingTop: hp(8) },
  backButtonAbsolute: { position: 'absolute', top: hp(5), left: wp(5), zIndex: 10, padding: wp(2) },
  backText: { color: COLORS.white, fontSize: hp(2), fontFamily: 'Montserrat-SemiBold' },
  topLogoWrap: { marginTop: hp(5) },
  topLogo: { width: wp(65), height: hp(10) }, 
  floatingCard: { position: 'absolute', left: wp(5), right: wp(5), backgroundColor: '#FFFFFF', borderRadius: wp(6), elevation: 10, overflow: 'hidden' },
  scrollContent: { paddingHorizontal: wp(6), paddingTop: hp(5) },
  titleContainer: { alignItems: 'center', marginBottom: hp(5) },
  welcomeTitle: { fontSize: hp(3), fontFamily: 'Montserrat-Bold' },
  titleUnderline: { width: wp(10), height: hp(0.5), backgroundColor: COLORS.secondary, marginTop: hp(1), borderRadius: wp(0.5) },
  inputGroup: { width: '100%', marginBottom: hp(2), alignItems: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  pressableContainer: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' },
  otpBox: { width: wp(12), height: hp(6.5), borderRadius: wp(2), backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8', borderBottomWidth: 3, borderBottomColor: '#D9D9D9', elevation: 3 },
  otpBoxFilled: { borderColor: COLORS.primary, borderBottomColor: COLORS.primary },
  otpBoxActive: { borderColor: COLORS.primary, borderBottomColor: COLORS.primary, transform: [{ translateY: 2 }], borderBottomWidth: 1 },
  otpBoxSuccess: { borderColor: COLORS.success, borderBottomColor: '#1B5E20' },
  otpBoxError: { borderColor: COLORS.error, borderBottomColor: '#B71C1C' },
  otpText: { fontSize: hp(2.2), fontFamily: 'Montserrat-Bold', color: '#333' },
  hiddenTextInput: { position: 'absolute', opacity: 0.01, width: '100%', height: '100%' },
  buttonShadow: { marginTop: hp(1.5), elevation: 6 },
  loginBtn: { borderRadius: wp(6) },
  loginBtn1: { paddingVertical: hp(1.5), alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontSize: hp(2), fontFamily: 'Montserrat-Bold' },
  resendContainer: { marginTop: hp(2.5), alignItems: 'center' },
  resendText: { fontSize: hp(1.5), color: '#888', fontFamily: 'Montserrat-Regular' },
  resendButtonText: { fontSize: hp(1.5), color: COLORS.primary, fontFamily: 'Montserrat-Bold' },
  footerContainer: { marginTop: hp(4.3), alignItems: 'center' },
  poweredByText: { fontSize: hp(1.2), color: '#AAA' },
});

export default Otp;