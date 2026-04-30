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
  LayoutAnimation,
  UIManager,
  ActivityIndicator, 
  ToastAndroid,      
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../utilites/Dimension'; 
import { useLoginmobileMutation } from '../redux/service/user/user'; 

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- CONSTANTS ---
const START_HEIGHT = hp(50); 
const OVERLAP = hp(25); 

// --- THEME COLORS ---
const COLORS = {
  primary: '#934790',
  primaryDark: '#6A2C66',
  primaryLight: '#B565B0',
  secondary: '#FFE8D6',
  white: '#FFFFFF',
  bg: '#FDF8F5',
  text: '#333333',
  textLight: '#666666',
  inputBorder: '#E0E0E0',
  inputBg: '#FFFFFF',
  inputDisabled: '#F5F5F5',
};

// --- HELPER COMPONENT FOR TOGGLING TEXT ---
const ExpandableText = ({ value }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textStr = value ? String(value) : '-';

  if (textStr.length <= 20) {
    return <Text style={styles.infoValue}>{textStr}</Text>;
  }

  return (
    <Text 
      style={styles.infoValue} 
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
      }}
    >
      {isExpanded ? textStr : `${textStr.substring(0, 20)}...`}
    </Text>
  );
};

const ExactShardPattern = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.02)']} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={{ position: 'absolute', bottom: -hp(10), right: -wp(20), width: wp(150), height: wp(150), transform: [{ rotate: '-35deg' }] }} />
      <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: -hp(10), left: -wp(20), width: wp(120), height: wp(120), transform: [{ rotate: '25deg' }] }} />
      <View style={{ position: 'absolute', top: hp(10), left: -wp(12), width: wp(150), height: hp(25), backgroundColor: 'rgba(0,0,0,0.05)', transform: [{ rotate: '-15deg' }] }} />
    </View>
  );
};

const CardPattern = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius: wp(6), overflow: 'hidden' }]} pointerEvents="none">
       <LinearGradient colors={['rgba(147,71,144,0.03)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
       <LinearGradient colors={['rgba(147,71,144,0.04)', 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ position: 'absolute', top: -hp(12), right: -wp(25), width: wp(60), height: wp(60), transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
};

const RegisterScreen = ({ navigation, route }) => {
  const { user, firstLogin, mode } = route.params;
  const userData = user ? user : null;

  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1); 
  const [mobilenumber, setMobilenumber] = useState('');
  const [loading, setLoading] = useState(false); 

  // --- API MUTATION ---
  const [Mobilelogin] = useLoginmobileMutation(); 

  // --- ANIMATIONS ---
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, { toValue: -Math.max(0, h * 0.15), duration: 250, useNativeDriver: false }).start();
    };
    const onHide = () => {
      Animated.timing(keyboardOffset, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => { subShow.remove(); subHide.remove(); };
  }, [keyboardOffset]);

  const goToStep2 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep(2);
  };

  const goToStep1 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep(1);
  };

  // --- API LOGIC ---
  const handleSendOtp = async (targetMobile) => {
    if (!targetMobile || targetMobile.length < 10) {
      ToastAndroid.show('Please enter a valid mobile number', ToastAndroid.SHORT);
      return;
    }
    
    setLoading(true);
    try {
      const response = await Mobilelogin({ mobile: targetMobile }).unwrap();
      
      if (response && (response.success || response.token || response.status === 'success')) {
        navigation.navigate('FirstloginOtp', { data: targetMobile, firstLogin: true, mode: 'phone' });
      } else {
        ToastAndroid.show(response?.message || 'Failed to send OTP', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(error?.data?.message || 'Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const onStep1Submit = () => {
    if (mode === 'phone') {
      const userMobile = userData?.mobile || userData?.phone_number; 
      navigation.navigate('NonResetPassword',{firstLogin: firstLogin, data: userMobile, mode: mode});
    } else {
      goToStep2();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
            <LinearGradient colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} bounces={false}>
              
              <View style={styles.headerGroup}>
                 <View style={{flex: 1}}>
                    <Text style={styles.cardTitle}>Verify Details</Text>
                    <Text style={styles.cardSubtitle}>
                      Step {currentStep} of {mode === 'number' ? 1 : 2}
                    </Text>
                 </View>
                 
                 <View style={styles.avatarWrapper}>
                    <Image source={userData?.gender === 'male' ? require('../../assets/profileman.png') : require('../../assets/profilewomen.png')} style={styles.avatar} />
                    {currentStep === 2 && (
                        <TouchableOpacity style={styles.editIconBadge} activeOpacity={0.8}>
                        <Icon name="camera" size={hp(1.8)} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                 </View>
              </View>

              {/* --- STEP 1 --- */}
              {currentStep === 1 && (
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <ExpandableText value={userData?.first_name} />
                  </View>
                  <View style={styles.divider} />
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <ExpandableText value={userData?.email} />
                  </View>
                  <View style={styles.divider} />
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Employee Code:</Text>
                    <ExpandableText value={userData?.employee_code} />
                  </View>
                  <View style={styles.divider} />
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Gender:</Text>
                    <ExpandableText value={userData?.gender} />
                  </View>
                  <View style={styles.divider} />

                  <TouchableOpacity activeOpacity={0.8} onPress={loading ? null : onStep1Submit} style={styles.buttonShadow} disabled={loading}>
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                      {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                      ) : (
                        <>
                          <Text style={styles.submitBtnText}>{mode === 'number' ? 'Get OTP' : 'Next'}</Text>
                          {mode !== 'number' && <Icon name="arrow-right" size={hp(2.5)} color={COLORS.white} style={{marginLeft: wp(2)}} />}
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* --- STEP 2 --- */}
              {currentStep === 2 && (
                <View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.inputContainer}>
                      <TextInput placeholder="Enter mobile number" placeholderTextColor="#BBB" onChangeText={setMobilenumber} value={mobilenumber} keyboardType="numeric" style={styles.input} autoFocus={true} />
                    </View>
                  </View>

                  <TouchableOpacity activeOpacity={0.8} onPress={() => !loading && handleSendOtp(mobilenumber)} style={styles.buttonShadow} disabled={loading}>
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                      {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Get OTP</Text>}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={goToStep1} style={styles.prevStepButton} disabled={loading}>
                    <Icon name="arrow-left" size={hp(2)} color={COLORS.primary} />
                    <Text style={styles.prevStepText}>Previous Step</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.footerContainer}><Text style={styles.poweredByText}>Powered by Novel Healthtech</Text></View>
              <View style={{ height: hp(2.5) }} />
            </ScrollView>
          </Animated.View>

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryDark },
  container: { flex: 1, backgroundColor: COLORS.primaryDark },

  topSection: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    overflow: 'hidden',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? hp(7.5) : hp(8.5), 
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
    paddingTop: hp(3.7), 
    paddingBottom: hp(2.5),
  },

  headerGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  cardTitle: {
    fontSize: hp(2.4), 
    fontFamily: 'Montserrat-Bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: hp(1.6), 
    color: COLORS.primary,
    marginTop: hp(0.5),
    fontFamily: 'Montserrat-SemiBold',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: wp(15), 
    height: wp(15),
    borderRadius: wp(7.5),
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    width: wp(5.5), 
    height: wp(5.5),
    borderRadius: wp(2.75),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  infoContainer: {
    marginTop: hp(1.2),
    marginBottom: hp(2.5),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: hp(1), 
  },
  infoLabel: {
    fontSize: hp(1.5), 
    color: COLORS.textLight,
    fontFamily: 'Montserrat-SemiBold',
  },
  infoValue: {
    fontSize: hp(1.4), 
    color: COLORS.text,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'right',
    flex: 1, 
    marginLeft: wp(5), 
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },

  inputGroup: {
    marginBottom: hp(3),
    marginTop: hp(1.2),
  },
  label: {
    fontSize: hp(1.8), 
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
    borderRadius: wp(3), 
    height: hp(6.2), 
    paddingHorizontal: wp(3),
    backgroundColor: 'rgba(255,255,255,0.9)', 
  },
  input: {
    flex: 1,
    fontSize: hp(1.7), 
    color: COLORS.text,
    fontFamily: 'Montserrat-SemiBold',
    height: '100%',
  },

  buttonShadow: {
    marginTop: hp(2.5),
    marginBottom: hp(1.2),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtn: {
    height: hp(6), 
    borderRadius: wp(3), 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: hp(1.8), 
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },

  prevStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
  },
  prevStepText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: wp(1.5),
  },

  footerContainer: {
    alignItems: 'center',
    marginTop: hp(1.8),
  },
  poweredByText: {
    fontSize: hp(1.4), 
    color: '#CCC',
    fontFamily: 'Montserrat-Regular',
  },
});