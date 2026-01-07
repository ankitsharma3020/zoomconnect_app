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
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path based on context

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- CONSTANTS ---
// Adjusted to ensure the card sits in the vertical center
const START_HEIGHT = hp(50); 
const OVERLAP = hp(25); // Large overlap to pull card up into center

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

// --- HEADER PATTERN COMPONENT ---
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
        left: -wp(12), 
        width: wp(150), 
        height: hp(25), 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        transform: [{ rotate: '-15deg' }] 
      }} />
    </View>
  );
};

// --- CARD PATTERN COMPONENT ---
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
            top: -hp(12), 
            right: -wp(25), 
            width: wp(60), 
            height: wp(60), 
            transform: [{ rotate: '-45deg' }] 
          }}
        />
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(1); 

  // Page 1 Data
  const userData = {
    name: 'Brijesh Chaubey',
    email: 'email@example.com',
    code: '00UNH72089',
    gender: 'Male'
  };

  // Page 2 Data
  const [mobilenumber, setMobilenumber] = useState('');
  const [dp, setDP] = useState(null);

  // --- ANIMATIONS ---
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  // --- KEYBOARD HANDLING ---
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, {
        toValue: -Math.max(0, h * 0.15), 
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

  // Handle Step Transition
  const goToStep2 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep(2);
  };

  const goToStep1 = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentStep(1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          {/* --- TOP SECTION --- */}
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
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
            {/* Pattern inside card */}
            <CardPattern />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              bounces={false}
            >
              
              {/* Header: Avatar & Title */}
              <View style={styles.headerGroup}>
                 <View style={{flex: 1}}>
                    <Text style={styles.cardTitle}>Verify Details</Text>
                    <Text style={styles.cardSubtitle}>Step {currentStep} of 2</Text>
                 </View>
                 
                 <View style={styles.avatarWrapper}>
                    <Image
                      source={dp ? { uri: dp } : require('../../assets/user.png')}
                      style={styles.avatar}
                    />
                    {currentStep === 2 && (
                        <TouchableOpacity style={styles.editIconBadge} activeOpacity={0.8}>
                        <Icon name="camera" size={hp(1.8)} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                 </View>
              </View>

              {/* --- STEP 1: READ ONLY TEXT ROWS --- */}
              {currentStep === 1 && (
                <View style={styles.infoContainer}>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{userData.name}</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Employee Code:</Text>
                    <Text style={styles.infoValue}>{userData.code}</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Gender:</Text>
                    <Text style={styles.infoValue}>{userData.gender}</Text>
                  </View>
                  <View style={styles.divider} />

                  {/* Next Button */}
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={goToStep2}
                    style={styles.buttonShadow}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.submitBtn}
                    >
                      <Text style={styles.submitBtnText}>Next</Text>
                      <Icon name="arrow-right" size={hp(2.5)} color={COLORS.white} style={{marginLeft: wp(2)}} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* --- STEP 2: MOBILE INPUT ONLY --- */}
              {currentStep === 2 && (
                <View>
                  {/* Mobile Number Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholder="Enter mobile number"
                        placeholderTextColor="#BBB"
                        onChangeText={setMobilenumber}
                        value={mobilenumber}
                        keyboardType="numeric"
                        style={styles.input}
                        autoFocus={true}
                      />
                    </View>
                  </View>

                  {/* Get OTP Button */}
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Otp')}
                    style={styles.buttonShadow}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.submitBtn}
                    >
                      <Text style={styles.submitBtnText}>Get OTP</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Back to Step 1 */}
                  <TouchableOpacity onPress={goToStep1} style={styles.prevStepButton}>
                    <Icon name="arrow-left" size={hp(2)} color={COLORS.primary} />
                    <Text style={styles.prevStepText}>Previous Step</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Footer */}
              <View style={styles.footerContainer}>
                 <Text style={styles.poweredByText}>Powered by Novel Healthtech</Text>
              </View>
              
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
    // Shift logo up slightly to sit nicely above card
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
    paddingTop: hp(3.7), // approx 30
    paddingBottom: hp(2.5),
  },

  // --- Header Inside Card ---
  headerGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  cardTitle: {
    fontSize: hp(2.4), // approx 24
    fontFamily: 'Montserrat-Bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: hp(1.6), // approx 13
    color: COLORS.primary,
    marginTop: hp(0.5),
    fontFamily: 'Montserrat-SemiBold',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: wp(15), // approx 60
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
    width: wp(5.5), // approx 22
    height: wp(5.5),
    borderRadius: wp(2.75),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // --- Info Display (Step 1) ---
  infoContainer: {
    marginTop: hp(1.2),
    marginBottom: hp(2.5),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.5), // approx 12
  },
  infoLabel: {
    fontSize: hp(1.5), // approx 15
    color: COLORS.textLight,
    fontFamily: 'Montserrat-SemiBold',
  },
  infoValue: {
    fontSize: hp(1.6), // approx 16
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

  // --- Input Styles (Step 2) ---
  inputGroup: {
    marginBottom: hp(3),
    marginTop: hp(1.2),
  },
  label: {
    fontSize: hp(1.8), // approx 14
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
    borderRadius: wp(3), // approx 12
    height: hp(6.2), // approx 50
  
    paddingHorizontal: wp(3),
    backgroundColor: 'rgba(255,255,255,0.9)', 
  },
  input: {
    flex: 1,
    fontSize: hp(1.7), // approx 15
    color: COLORS.text,
    fontFamily: 'Montserrat-SemiBold',
    height: '100%',
  },

  // --- Button ---
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
    height: hp(6), // approx 52
    borderRadius: wp(3), // approx 12
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: hp(1.8), // approx 17
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },

  // --- Previous Step Button ---
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

  // --- Footer ---
  footerContainer: {
    alignItems: 'center',
    marginTop: hp(1.8),
  },
  poweredByText: {
    fontSize: hp(1.4), // approx 11
    color: '#CCC',
    fontFamily: 'Montserrat-Regular',
  },
});