import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Platform,
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/service/userSlice';
import { wp, hp } from '../utilites/Dimension'; // Using your dynamic utilities
import { useLoginemailMutation, useLoginmobileMutation, useLoginemcodeMutation } from '../redux/service/user/user';
import { ActivityIndicator, ToastAndroid } from 'react-native';

const { height } = Dimensions.get('window');

// --- CONSTANTS ---
const START_HEIGHT = hp(45); // Replaced height * 0.45
const END_HEIGHT = START_HEIGHT / 1.5;
const OVERLAP = hp(6); // Approx 50

// --- Colors ---
const COLORS_DEF = {
  primary: '#934790',     
  primaryDark: '#6A2C66', 
  primaryLight: '#B565B0',
  secondary: '#FFE8D6',
  white: '#FFFFFF',
  bg: '#FDF8F5', 
  text: '#4A4A4A',
  placeholder: '#A0A0A0',
  inputBorder: '#EADDF2',
  inputBg: '#FAFAFC',
};

const Images = {
  gmail: require('../../assets/Google.png'),
  microsoft: require('../../assets/micosoft.png'),
};

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Emaillogin] = useLoginemailMutation();
  const [Mobilelogin] = useLoginmobileMutation();
  // console.log('Logging in with useLoginmobileMutation:', Mobilelogin);
  // const [Emcodelogin] = useLoginemcodeMutation();
  const [loginMode, setLoginMode] = useState('phone');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [trackW, setTrackW] = useState(0);
  const toggleAnim = useRef(new Animated.Value(loginMode === 'phone' ? 1 : 0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;
  const [loading, setLoading] = useState(false);

  // Handle login based on mode
  const handleLogin = async () => {
    if (!username || (loginMode === 'employee' && !password)) {
      ToastAndroid.show('Please fill all required fields', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    try {
      let response;
      if (loginMode === 'email') {
        response = await Emaillogin({ email: username, password }).unwrap();
      } else if (loginMode === 'phone') {
        console.log('Logging in with mobile:', username);
        response = await Mobilelogin({ mobile: username }).unwrap();
      } else if (loginMode === 'employee') {
        // response = await Emcodelogin({ empcode: username, password }).unwrap();
      }
      // Success validation (customize as per your API response)
       console.log('Login response:', response);
      if (response && (response.success || response.token || response.status === 'success')) {
        
        navigation.navigate('Otp',{ data: username, mode: loginMode });
      } else {
        ToastAndroid.show('Login failed. Please check your credentials.', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Login failed. Please try again.', ToastAndroid.SHORT);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // State


  // Animations


  // Local Colors reference
  const COLORS = COLORS_DEF;

  // Keyboard Handling
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, {
        toValue: -Math.max(0, h - hp(5)), // Dynamic offset approx 40
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: false, 
      }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 250 : 200,
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

  // Toggle Animation
  useEffect(() => {
    if (loginMode === 'employee') return;
    Animated.timing(toggleAnim, {
      toValue: loginMode === 'phone' ? 1 : 0,
      duration: 250,
      useNativeDriver: false, 
    }).start();
  }, [loginMode]);

  // Entrance Animation
  useEffect(() => {
    Animated.timing(topSectionHeightAnim, {
      toValue: END_HEIGHT,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSetLoginMode = (mode) => {
    setLoginMode(mode);
    setUsername('');
    setPassword('');
    setShowPass(false);
  };

  let usernamePlaceholder = 'Phone Number';
  let keyboardType = 'phone-pad';
  if (loginMode === 'email') {
    usernamePlaceholder = 'Email Address';
    keyboardType = 'email-address';
  } else if (loginMode === 'employee') {
    usernamePlaceholder = 'Employee Code';
    keyboardType = 'default';
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* --- TOP SECTION --- */}
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
              start={{ x: 0, y: 0.5 }} 
              end={{ x: 1, y: 0.5 }}   
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.topContentContainer}>
              <View style={styles.topLogoWrap}>
                <Image
                  source={require('../../assets/WhiteNewZoomConnectlogo.png')}
                  style={styles.topLogo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Animated.View>

          {/* --- BOTTOM CARD --- */}
          <Animated.View
            style={[
              styles.bottomSection,
              {
                top: Animated.subtract(topSectionHeightAnim, OVERLAP),
                transform: [{ translateY: keyboardOffset }],
                zIndex: 10 
              },
            ]}
          >
            {/* Welcome Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.welcomeTitle}>
                <Text style={{ color: COLORS.primaryDark }}>Welcome </Text>
                <Text style={{ color: COLORS.primary }}>Back</Text> 
                </Text>
                <View style={styles.titleUnderline} />
            </View>

            {/* TOGGLE SWITCH */}
            {loginMode !== 'employee' && (
              <View
                style={styles.pillTrack}
                onLayout={(e) => setTrackW(e.nativeEvent.layout.width - wp(1.5))} // Approx 6
              >
                {/* Animated Thumb */}
                <Animated.View
                  style={[
                    styles.pillThumb,
                    {
                      width: trackW > 0 ? trackW / 2 : 0,
                      transform: [
                        {
                          translateX: toggleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [wp(0.8), trackW > 0 ? trackW / 2 + wp(0.8) : wp(0.8)], // approx 3
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.thumbLabelCenter}>
                     <Text style={styles.pillLabelActive}>
                      {loginMode === 'email' ? 'Email' : 'Mobile'}
                    </Text>
                  </View>
                </Animated.View>

                {/* Clickable Labels */}
                <View style={styles.pillLabelsRow}>
                  <TouchableOpacity
                    style={styles.pillHalf}
                    activeOpacity={0.8}
                    onPress={() => handleSetLoginMode('email')}
                  >
                   {loginMode !== 'email' && <Text style={styles.pillLabelIdle}>Email</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pillHalf}
                    activeOpacity={0.8}
                    onPress={() => handleSetLoginMode('phone')}
                  >
                   {loginMode !== 'phone' && <Text style={styles.pillLabelIdle}>Mobile</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Input Fields */}
            <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.inputField}
                    placeholder={usernamePlaceholder}
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType={keyboardType}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                </View>

                {loginMode === 'employee' && (
                <>
                    <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Password"
                        placeholderTextColor={COLORS.placeholder}
                        secureTextEntry={!showPass}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPass((s) => !s)}
                    >
                        <Text style={{ fontSize: hp(2.2) }}>{showPass ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                    </View>

                    <View style={styles.forgotRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('FirstRegister')}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    </View>
                </>
                )}
            </View>

            {/* Login Button */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={loading ? undefined : handleLogin}
        style={styles.shadowWrapper}
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
            <Text style={styles.loginBtnText}>Log In</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

            {/* Switch Mode Links */}
            <View style={styles.infoTextContainer}>
                {loginMode !== 'employee' ? (
                <Text style={styles.infoText}>
                    Don't have an account?{' '}
                    <Text
                    style={styles.linkText}
                    onPress={() => handleSetLoginMode('employee')}
                    >
                    Try Employee Code
                    </Text>
                </Text>
                ) : (
                <Text style={styles.infoText}>
                    Switch back to{' '}
                    <Text style={styles.linkText} onPress={() => handleSetLoginMode('email')}>
                    Email
                    </Text>{' '}
                    or{' '}
                    <Text style={styles.linkText} onPress={() => handleSetLoginMode('phone')}>
                    Mobile
                    </Text>
                </Text>
                )}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Sign in with</Text>
              <View style={styles.line} />
            </View>

            {/* Social Icons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={Images.gmail} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={Images.microsoft} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
                 <Text style={styles.poweredByText}>Powered by Novel Healthtech</Text>
            </View>

          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS_DEF.primaryDark }, 
  container: { flex: 1, backgroundColor: COLORS_DEF.bg }, 

  // --- Top Section ---
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  topContentContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(5), // approx 40
  },
  topLogoWrap: {
    width: '100%',
    alignItems: 'center',
  },
  topLogo: {
    width: wp(70),   // replaced 280
    height: hp(10),  // replaced 80
  },

  // --- Bottom Card ---
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(10), // approx 40
    borderTopRightRadius: wp(10),
    paddingHorizontal: wp(6),    // approx 24
    paddingTop: hp(4),           // approx 32
    paddingBottom: hp(2.5),      // approx 20
    shadowColor: COLORS_DEF.primary,
    shadowOffset: { width: 0, height: -hp(1) },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 25,
    zIndex: 10, 
  },

  // Title
  titleContainer: {
      alignItems: 'center',
      marginBottom: hp(2.5), // approx 20
  },
  welcomeTitle: {
    fontSize: hp(3.2), // approx 32
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleUnderline: {
      width: wp(10), // approx 40
      height: hp(0.5), // approx 4
      backgroundColor: COLORS_DEF.secondary, 
      marginTop: hp(1), // approx 8
      borderRadius: wp(0.5),
  },

  // --- TOGGLE SWITCH ---
  pillTrack: {
    width: '85%', 
    alignSelf: 'center',
    height: hp(6), // approx 50
    backgroundColor: '#E9EAF0', 
    borderRadius: wp(6), // approx 25
    padding: wp(0.8), // approx 3
    marginBottom: hp(3), // approx 24
    flexDirection: 'row',
    position: 'relative',
  },
  pillThumb: {
    position: 'absolute',
    top: wp(0.8), // approx 3
    bottom: wp(0.8), // approx 3
    borderRadius: wp(5.5), // approx 22
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.2) },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  thumbLabelCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  pillLabelsRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  pillHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillLabelActive: {
    color: '#FFFFFF',
    fontSize: hp(1.5), // approx 15
    fontFamily: 'Montserrat-Bold', // Applied font
  },
  pillLabelIdle: {
    color: '#6B7280', 
    fontSize: hp(1.5), // approx 15
    fontFamily: 'Montserrat-SemiBold', // Applied font
  },

  // Form
  formContainer: {
      marginBottom: hp(1.2), // approx 10
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS_DEF.inputBg,
    borderWidth: 1,
    borderColor: COLORS_DEF.inputBorder, 
    borderRadius: wp(4), // approx 16
    height: hp(6.4), // approx 56
    paddingHorizontal: wp(4), // approx 16
    marginBottom: hp(2), // approx 16
  },
  inputField: {
    flex: 1,
    fontSize: hp(1.5), // approx 16
    fontFamily: 'Montserrat-Regular', // Applied font
    color: '#333',
    height: '100%',
  },
  eyeBtn: {
    padding: wp(2), // approx 8
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: hp(1.2), // approx 10
  },
  forgotPasswordText: {
    color: COLORS_DEF.primary,
    fontSize: hp(1.5), // approx 14
    fontFamily: 'Montserrat-SemiBold',
  },

  // CTA Button
  shadowWrapper: {
      shadowColor: COLORS_DEF.primary,
      shadowOffset: { width: 0, height: hp(1) },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
      marginTop: hp(1.2),
      marginBottom: hp(2.5),
  },
  loginBtn: {
    height: hp(6.5), // approx 58
    borderRadius: wp(6), // approx 25
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: hp(2), // approx 20
    fontFamily: 'Montserrat-Bold', // Applied font
    letterSpacing: 1,
  },

  // Info Text
  infoTextContainer: {
      alignItems: 'center',
      marginBottom: hp(3.8), // approx 30
  },
  infoText: {
    color: '#888',
    fontSize: hp(1.5), // approx 14
    fontFamily: 'Montserrat-Regular',
  },
  linkText: {
    color: COLORS_DEF.primary,
    fontFamily: 'Montserrat-Bold',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5), // approx 20
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: wp(4), // approx 16
    color: '#999',
    fontSize: hp(1.8), // approx 14
    fontFamily: 'Montserrat-SemiBold',
  },

  // Socials
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: wp(5), // approx 20
    marginBottom: hp(3.8), // approx 30
  },
  socialBtn: {
    width: wp(15), // approx 60
    height: wp(15), // approx 60
    borderRadius: wp(7.5), // approx 30
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    width: wp(7), // approx 28
    height: wp(7),
    resizeMode: 'contain',
  },

  // Footer
  footerContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: hp(1.2), // approx 10
  },
  poweredByText: {
    fontSize: hp(1.2), // approx 12
    fontFamily: 'Montserrat-Regular',
    color: '#AAAAAA',
  },
});