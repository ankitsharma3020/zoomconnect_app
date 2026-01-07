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
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import
import { useOtpVerifyMutation } from '../redux/service/user/user';
import { ActivityIndicator, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/service/userSlice';

// --- CONSTANTS ---
// Matches Register Screen Header Height
const START_HEIGHT = hp(32); // Replaced height * 0.32
const OVERLAP = hp(7); // Replaced height * 0.07

// --- THEME COLORS ---
const COLORS = {
  primary: '#934790',     
  primaryDark: '#6A2C66', 
  primaryLight: '#B565B0',
  secondary: '#FFE8D6',   
  white: '#FFFFFF',
  bg: '#FDF8F5', 
  text: '#434141ff',
  inputBorder: '#EADDF2',
  inputBg: '#FAFAFC',
  success: '#81ce85ff',
  error: '#D32F2F',
  textLight: '#888',
};

// --- HEADER PATTERN (Shard) ---
const ExactShardPattern = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']}
        start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }}
        style={{ 
          position: 'absolute', 
          bottom: -hp(10), 
          right: -wp(20), 
          width: wp(150), 
          height: wp(150), 
          transform: [{ rotate: '-35deg' }] 
        }}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.0)']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ 
          position: 'absolute', 
          top: -hp(10), 
          left: -wp(20), 
          width: wp(120), 
          height: wp(120), 
          transform: [{ rotate: '25deg' }] 
        }}
      />
      <View style={{ 
        position: 'absolute', 
        top: hp(10), 
        left: -50, 
        width: wp(150), 
        height: 200, 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        transform: [{ rotate: '-15deg' }] 
      }} />
    </View>
  );
};

// --- CARD PATTERN ---
const CardPattern = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius: wp(6), overflow: 'hidden' }]} pointerEvents="none">
       <LinearGradient
          colors={['rgba(147,71,144,0.03)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
       <LinearGradient
          colors={['rgba(147,71,144,0.04)', 'transparent']}
          start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
          style={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: wp(60), 
            height: wp(60), 
            transform: [{ rotate: '-45deg' }] 
          }}
        />
    </View>
  );
};

const Otp = ({route}) => {
  const { data, mode } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [OtpVerify] = useOtpVerifyMutation();
  const [loading, setLoading] = useState(false);
  
  // --- ANIMATIONS ---
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // --- KEYBOARD HANDLING ---
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, {
        toValue: -Math.max(0, h * 0.15), // Slide slightly
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

  // --- OTP LOGIC ---
  const textInputRef = useRef(null);
  const boxArray = new Array(6).fill(0);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const handleOnPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleOnChangeText = (value) => {
    setStatus('idle');
    setOtp(value);
  };

  const triggerShake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const handleVerifyOTP = async () => {

  if (!otp ) {
      triggerShake();
      setStatus('error');
      ToastAndroid.show('Please enter a valid 6-digit OTP', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    try {
      // You may need to adjust login_type and login_value based on your flow
      const body = {
        login_type: mode === 'email' ? 'email' : 'mobile',
        login_value: data,
        otp: otp,
      };
      
      const response = await OtpVerify(body).unwrap();
      console.log('OTP Verify Response:', response);
      
      if (response && (response.success || response.status === 'success')) {
        // Save token in AsyncStorage if present
        if (response.data && response.data.token) {
          await AsyncStorage.setItem('token', response.data.token);
        }
        setStatus('success');
        ToastAndroid.show('OTP Verified!', ToastAndroid.SHORT);
        dispatch(setUser(true));
        // Navigate or dispatch as needed
        // navigation.navigate('NextScreen');
      } else {
        triggerShake();
        setStatus('error');
        ToastAndroid.show('OTP verification faileda', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      triggerShake();
      setStatus('error');
      ToastAndroid.show(`OTP verification failedcatch ${error}`, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // --- TIMER LOGIC ---
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (!isResendDisabled || timer === 0) {
      if (timer === 0) setIsResendDisabled(false);
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isResendDisabled, timer]);

  const onResendOtp = () => {
    setTimer(30);
    setIsResendDisabled(true);
  };

  const animatedOtpContainerStyle = {
    transform: [{ translateX: shakeAnimation }]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* --- TOP SECTION (Gradient Header) --- */}
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            
            <ExactShardPattern />
            
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.topLogoWrap}>
              <Image
                source={require('../../assets/WhiteNewZoomConnectlogo.png')}
                style={styles.topLogo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* --- BOTTOM SECTION (Floating Card) --- */}
          <Animated.View
            style={[
              styles.floatingCard,
              {
                top: Animated.subtract(topSectionHeightAnim, OVERLAP),
                transform: [{ translateY: keyboardOffset }],
                zIndex: 10,
              },
            ]}
          >
            {/* Inner Pattern */}
            <CardPattern />

            <ScrollView 
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeTitle}>
                    <Text style={{ color: COLORS.primaryDark}}>Enter </Text>
                    <Text style={{ color: COLORS.primary }}>OTP</Text>
                    </Text>
                    <View style={styles.titleUnderline} />
                </View>

                {/* OTP Input */}
                <View style={styles.inputGroup}>
                <Animated.View style={[styles.otpContainer, animatedOtpContainerStyle]}>
                    <TouchableOpacity style={styles.pressableContainer} onPress={handleOnPress} activeOpacity={1}>
                    {boxArray.map((_, index) => {
                        const digit = otp[index] || '';
                        const isFilled = digit !== '';
                        const isActive = index === otp.length;
                        
                        const boxStyle = [
                        styles.otpBox,
                        isFilled && styles.otpBoxFilled,
                        isActive && status === 'idle' && styles.otpBoxActive,
                        status === 'success' && styles.otpBoxSuccess,
                        status === 'error' && styles.otpBoxError,
                        ];
                        
                        return (
                        <View key={index} style={boxStyle}>
                            <Text style={styles.otpText}>{digit}</Text>
                        </View>
                        );
                    })}
                    </TouchableOpacity>
                </Animated.View>
                
                {/* Hidden input */}
        <TextInput
          ref={textInputRef}
          style={styles.hiddenTextInput}
          value={otp}
          onChangeText={handleOnChangeText}
          maxLength={6}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
        />
                </View>

                {/* Verify Button */}
                <TouchableOpacity 
                    onPress={loading ? undefined : handleVerifyOTP}
                    style={styles.buttonShadow}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                  <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.loginBtn}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginBtnText}>Verify OTP</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Resend Link */}
                <View style={styles.resendContainer}>
                {isResendDisabled ? (
                    <Text style={styles.resendText}>
                    Resend code in <Text style={{ fontFamily: 'Montserrat-Bold' }}>{timer}s</Text>
                    </Text>
                ) : (
                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <TouchableOpacity onPress={onResendOtp}>
                        <Text style={styles.resendButtonText}>Resend</Text>
                    </TouchableOpacity>
                    </View>
                )}
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.poweredByText}>Powered by Novel Healthtech</Text>
                </View>

                {/* Spacer */}
                <View style={{height: hp(2.5)}} />
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Otp;

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
    fontSize: hp(2), 
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
    paddingTop: hp(5), // approx 40
    paddingBottom: hp(2.5),
  },

  // --- Titles ---
  titleContainer: {
    alignItems: 'center',
    marginBottom: hp(5),
  },
  welcomeTitle: { 
    fontSize: hp(3), // approx 28
    fontFamily: 'Montserrat-Bold', 
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleUnderline: {
      width: wp(10), // approx 40
      height: hp(0.5), // approx 4
      backgroundColor: COLORS.secondary, // Beige Accent
      marginTop: hp(1),
      borderRadius: wp(0.5),
  },

  // --- Inputs ---
  inputGroup: { width: '100%', marginBottom: hp(2), alignItems: 'center' },

  // --- OTP Box Styling ---
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2.3),
    width: '100%',
  },
  pressableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    width: '100%',
    gap: wp(0.5),
  },
 otpBox: {
    width: wp(12), // smaller width
    height: hp(6.5), // smaller height
    borderRadius: wp(2),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderBottomWidth: 3,
    borderBottomColor: '#D9D9D9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.2) },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: wp(0.5),
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    borderBottomColor: COLORS.primary, // Make ledge purple
    backgroundColor: '#FAFAFA',
  },
  otpBoxActive: {
    borderColor: COLORS.primary,
    borderBottomColor: COLORS.primary,
    backgroundColor: '#FFF',
    transform: [{ translateY: 2 }], // Press down effect (move down by 2px)
    borderBottomWidth: 3, // Reduce ledge height to simulate pressing
    elevation: 2, // Reduce elevation
  },
  otpBoxSuccess: {
    borderColor: COLORS.success,
    borderBottomColor: '#1B5E20',
    backgroundColor: '#F1F8E9',
  },
  otpBoxError: {
    borderColor: COLORS.error,
    borderBottomColor: '#B71C1C',
    backgroundColor: '#FFEBEE',
  },
  otpText: {
    fontSize: hp(2.2), // smaller font
    fontFamily: 'Montserrat-Bold',
    color: COLORS.text,
  },
  hiddenTextInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  // --- CTA Button ---
  buttonShadow: {
      marginTop: hp(1.5),
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
    paddingVertical: hp(1.5), // approx 16
    borderRadius: wp(6), // approx 25
    alignItems: 'center',
  },
  loginBtnText: { 
    color: '#FFFFFF', 
    fontSize: hp(2), // approx 18
    fontFamily: 'Montserrat-Bold', 
    letterSpacing: 1 
  },

  // --- Resend ---
  resendContainer: {
    marginTop: hp(2.5),
    alignItems: 'center',
  },
  resendText: {
    fontSize: hp(1.5), // approx 14
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
  resendButtonText: {
    fontSize: hp(1.5), // approx 14
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
  },

  // --- Footer ---
  footerContainer: {
    marginTop: hp(4.3), // approx 30
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: hp(1.2), // approx 12
    fontFamily: 'Montserrat-Regular',
    color: '#AAAAAA',
  },
});