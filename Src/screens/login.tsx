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
  Modal,
  Image,
  Switch,
  Platform, // <-- ADD THIS
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import DotPattern from '../component/Pattern';

const { height } = Dimensions.get('window');

const START_HEIGHT = height * 0.45;
const END_HEIGHT = START_HEIGHT / 1.5;
const OVERLAP = 28;

const Images = {
  gmail: require('../../assets/Google.png'),
  microsoft: require('../../assets/micosoft.png'),
};

const Login = () => {
  const [loginMode, setLoginMode] = useState<'phone' | 'email' | 'employee'>('phone');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [trackW, setTrackW] = useState(0);
  const toggleAnim = useRef(new Animated.Value(loginMode === 'phone' ? 1 : 0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current; // moves content up when keyboard shows

useEffect(() => {
  const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

  const onShow = (e: any) => {
    const h = e?.endCoordinates?.height ?? 0;
    Animated.timing(keyboardOffset, {
      toValue: -Math.max(0, h - 40), // lift the card up; subtract a bit so it doesn't jump too high
      duration: Platform.OS === 'ios' ? 250 : 200,
      useNativeDriver: true,
    }).start();
  };

  const onHide = () => {
    Animated.timing(keyboardOffset, {
      toValue: 0,
      duration: Platform.OS === 'ios' ? 250 : 200,
      useNativeDriver: true,
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
    if (loginMode === 'employee') return;
    Animated.timing(toggleAnim, {
      toValue: loginMode === 'phone' ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [loginMode]);

  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(topSectionHeightAnim, {
      toValue: END_HEIGHT,
      duration: 600,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleSetLoginMode = (mode: 'phone' | 'email' | 'employee') => {
    setLoginMode(mode);
    setUsername('');
    setPassword('');
    setShowPass(false);
  };

  let usernamePlaceholder = 'Phone Number';
  let keyboardType: any = 'phone-pad';
  if (loginMode === 'email') {
    usernamePlaceholder = 'Email Address';
    keyboardType = 'email-address';
  } else if (loginMode === 'employee') {
    usernamePlaceholder = 'Employee Code';
    keyboardType = 'default';
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#7E49A3" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Background layers */}
          <Animated.View style={[styles.topBackground, { height: topSectionHeightAnim }]}>
            <LinearGradient
              colors={['#F2A7A6', '#8A79F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomBackground, { top: topSectionHeightAnim }]} />

          {/* TOP: only Back button */}
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim }]}>
            <DotPattern color="#FFFFFF" opacity={0.12} />
            <View style={styles.topBar}>
              <TouchableOpacity>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.topLogoWrap}>
  <Image
    source={require('../../assets/WhiteNewZoomConnectlogo.png')}
    style={styles.topLogo}
    resizeMode="contain"
  />
</View>
          </Animated.View>

          {/* BOTTOM CARD */}
        <Animated.View
  style={[
    styles.bottomSection,
    { 
      top: Animated.subtract(topSectionHeightAnim, OVERLAP),
      transform: [{ translateY: keyboardOffset }], // <-- ADD THIS
    },
  ]}
>
            {/* FF0066, 6A0066, 934790, E8D4B7 */}
            <Text style={styles.welcomeTitle}>
  <Text style={{ color: '#F2A7A6' }}>Welcome </Text>
  <Text style={{ color: '#8A79F0' }}>Back</Text>
</Text>


            {/* Email / Mobile toggle */}
            {loginMode !== 'employee' && (
              <View
                style={styles.pillTrack3D}
                onLayout={e => setTrackW(e.nativeEvent.layout.width - 6)}
              >
                {/* 3D glossy thumb */}
                <Animated.View
                  style={[
                    styles.pillThumb3D,
                    {
                      width: trackW > 0 ? trackW / 2 : 0,
                      transform: [
                        {
                          translateX: toggleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [3, trackW > 0 ? trackW / 2 + 3 : 3],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {/* Gradient fill */}
                  <LinearGradient
                    colors={['#F2A7A6', '#8A79F0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
                  />
                  {/* Active label ON the thumb */}
                  <View style={styles.thumbLabelWrap}>
                    <Text style={styles.pillLabelActive}>
                      {loginMode === 'email' ? 'Email' : 'Mobile'}
                    </Text>
                  </View>
                </Animated.View>

                {/* Track labels */}
                <View style={styles.pillLabelsRow}>
                  <TouchableOpacity style={styles.pillHalf} activeOpacity={0.9} onPress={() => handleSetLoginMode('email')}>
                    {loginMode !== 'email' && <Text style={styles.pillLabelIdle}>Email</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.pillHalf} activeOpacity={0.9} onPress={() => handleSetLoginMode('phone')}>
                    {loginMode !== 'phone' && <Text style={styles.pillLabelIdle}>Mobile</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Username */}
            <View style={styles.inputGroup}>
              <View style={styles.inputPill}>
                <TextInput
                  style={styles.inputField}
                  placeholder={usernamePlaceholder}
                  keyboardType={keyboardType}
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor="#9AA0A6"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password + Forgot */}
            {loginMode === 'employee' && (
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.inputPill}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Password"
                      secureTextEntry={!showPass}
                      value={password}
                      onChangeText={setPassword}
                      placeholderTextColor="#9AA0A6"
                    />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass((s) => !s)}>
                      <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.forgotRow}>
                  <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* CTA */}
            <LinearGradient
              colors={['#F2A7A6', '#8A79F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Log In</Text>
            </LinearGradient>

            {/* Info text under login */}
            {loginMode !== 'employee' ? (
              <Text style={styles.infoText}>
                Don't have email or mobile?{' '}
                <Text style={styles.empCodeLink} onPress={() => handleSetLoginMode('employee')}>
                  TRY EMP CODE
                </Text>
              </Text>
            ) : (
              <Text style={styles.infoText}>
                Using Employee Code. Switch to{' '}
                <Text style={styles.empCodeLink} onPress={() => handleSetLoginMode('email')}>Email</Text>
                {' '}or{' '}
                <Text style={styles.empCodeLink} onPress={() => handleSetLoginMode('phone')}>Mobile</Text>.
              </Text>
            )}

            {/* Divider */}
            <View style={styles.orLoginWithContainer}>
              <View style={styles.line} />
              <Text style={styles.orLoginWithText}>Sign in with</Text>
              <View style={styles.line} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRowTwo}>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={Images.gmail} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Image source={Images.microsoft} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>

            <Text style={styles.poweredByText}>Powered by Novel Healthtech</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F7F7F9', position: 'relative' },

  // Backgrounds
  topBackground: { position: 'absolute', top: 0, left: 0, right: 0 },
  // bottomBackground: { position: 'absolute', left: 0, right: 0, bottom: 0, },

  // Top section
  topSection: {
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'visible',
    zIndex: 1,
  },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 38,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  backText: { color: '#333', fontSize: 17, fontWeight: '700' },

  // Bottom card
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: height * 0.04,
    paddingHorizontal: 22,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
   borderTopLeftRadius: 44,   // was 28
  borderTopRightRadius: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
    zIndex: 3,
  },

  // Titles
  welcomeTitle: { fontSize: 35, color: '#8A79F0', fontWeight: '800', textAlign: 'center' },

  // Inputs
  inputGroup: { width: '100%', marginBottom: 16, alignItems: 'center' },
  inputPill: {
    marginTop: 15,
    width: '90%',
    justifyContent: 'center',
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FBFBFD',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: { flex: 1, fontSize: 16, color: '#202124' },
  eyeBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  eyeText: { fontSize: 18 },

  // Info text
  infoText: {
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12.5,
    marginTop: 12,
    marginBottom: 6,
  },
  empCodeLink: { color: '#934790', fontWeight: '800' },

  // Forgot
  forgotRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 6,
    marginBottom: 6,
    paddingHorizontal: 22,
  },
  forgotPasswordText: { fontSize: 13, color: '#934790', fontWeight: '600' },

  // CTA
  loginBtn: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 17,
    borderRadius: 22,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },

  // Divider
  orLoginWithContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 14, marginTop: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#E6E8EC' },
  orLoginWithText: { fontSize: 13, color: '#8B9096', marginHorizontal: 10 },

  // Socials
  socialRowTwo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 75,
    marginBottom: 8,
  },
  socialBtn: {
    width: 64,
    height: 64,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: '#E3E5E8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialIcon: { width: 34, height: 34, resizeMode: 'contain' },

  poweredByText: {
    position: 'absolute',
    bottom: 64,
    fontSize: 12,
    color: '#888',
    alignSelf: 'center',
  },

  // Toggle track
  pillTrack3D: {
    alignSelf: 'center',
    width: '80%',
    height: 48,
    borderRadius: 24,
    padding: 3,
    marginTop: 16,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E9EAF0',
  },

  // Labels container
  pillLabelsRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabelIdle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },

  // 3D thumb
  pillThumb3D: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  thumbLabelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabelActive: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  topLogoWrap: {
  width: '100%',
  // height: 100,
  alignItems: 'center',
  marginTop: 60, // tweak as you like
},
topLogo: {
  width: 300,
  height: 90,
},

});