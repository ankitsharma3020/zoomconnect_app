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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

// --- CONSTANTS ---
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
  text: '#333333',
  textLight: '#888',
  inputBorder: '#EADDF2',
  inputBg: '#FAFAFC',
};

// --- PATTERNS ---
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

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Check if user is logged in
   const isLoggedIn = useSelector((state) => state.user.user);

  // --- STATE ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        toValue: -Math.max(0, h * 0.2), 
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

  const handleSubmit = () => {
    console.log("Reset Password Clicked");
    // Add validation and API call here
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
            <CardPattern />

            <ScrollView 
              contentContainerStyle={styles.scrollContent} 
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeTitle}>
                    <Text style={{ color: COLORS.primaryDark }}>Reset </Text>
                    <Text style={{ color: COLORS.primary }}>Password</Text>
                    </Text>
                    <View style={styles.titleUnderline} />
                </View>

                {/* --- CONDITIONAL FIELD: CURRENT PASSWORD --- */}
                {isLoggedIn && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholder="Enter current password"
                        placeholderTextColor="#BBB"
                        onChangeText={setCurrentPassword}
                        value={currentPassword}
                        secureTextEntry={!showCurrent}
                        style={styles.input}
                      />
                      <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeIcon}>
                        <Icon name={showCurrent ? "eye-off" : "eye"} size={hp(2.5)} color="#BBB" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

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
                <TouchableOpacity 
                    onPress={handleSubmit}
                    style={styles.buttonShadow}
                    activeOpacity={0.8}
                >
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginBtn}
                >
                    <Text style={styles.loginBtnText}>Reset Password</Text>
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

export default ResetPassword;

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