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

const { height, width } = Dimensions.get('window');

const START_HEIGHT = height * 0.45;
const END_HEIGHT = START_HEIGHT / 1.5;
// CHANGED: Increased overlap to ensure proper layering
const OVERLAP = 50; 

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

const Forgetpassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const COLORS = COLORS_DEF;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(topSectionHeightAnim, {
      toValue: END_HEIGHT,
      duration: 600,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, {
        toValue: -Math.max(0, h - 40),
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: false, // <--- CHANGE THIS TO FALSE
      }).start();
    };

    const onHide = () => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: false, // <--- CHANGE THIS TO FALSE
      }).start();
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [keyboardOffset]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* --- TOP SECTION --- */}
          {/* zIndex 1 to stay behind */}
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
             <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
                start={{ x: 0, y: 0.5 }} 
                end={{ x: 1, y: 0.5 }}   
                style={StyleSheet.absoluteFill}
              />
            
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
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

          {/* --- BOTTOM CARD --- */}
          {/* zIndex 10 to sit on top */}
          <Animated.View
            style={[
              styles.bottomSection,
              {
                // Pulls the card UP over the top section
                top: Animated.subtract(topSectionHeightAnim, OVERLAP),
                transform: [{ translateY: keyboardOffset }],
                zIndex: 10, 
              },
            ]}
          >
               <View style={styles.titleContainer}>
            <Text style={styles.welcomeTitle}>
              <Text style={{ color: COLORS.primaryDark}}>Forgot </Text>
              <Text style={{ color: COLORS.primary }}>Password</Text>
              
            </Text>
            <View style={styles.titleUnderline} />
            </View>
             

            {/* Email input only */}
            <View style={styles.inputGroup}>
              <View style={styles.inputPill}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor={COLORS.placeholder}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity onPress={() => navigation.navigate('Otp')}>
               <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Send Reset Link</Text>
            </LinearGradient>

            </TouchableOpacity>
           
            {/* Divider (Optional, kept empty structure to maintain layout if needed) */}
            <View style={styles.orLoginWithContainer}>
              <View style={styles.line} />
              <View style={styles.line} />
            </View>

            <Text style={styles.poweredByText}>Powered by Novel Healthtech</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Forgetpassword;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS_DEF.primaryDark },
  container: { flex: 1, backgroundColor: COLORS_DEF.bg },

  // Top section
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // Removed border radius here to let the bottom card do the masking/overlap effect
    overflow: 'hidden',
  },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 38,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  backText: { color: COLORS_DEF.white, fontSize: 17, fontWeight: '700' },

  topLogoWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
  },
  topLogo: {
    width: 300,
    height: 90,
  },

  // Bottom card
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 40, // Increased top padding for better visual spacing
    paddingHorizontal: 22,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40, // Matches Login screen
    borderTopRightRadius: 40,
    // Soft Shadow
    shadowColor: COLORS_DEF.primary,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 25,
  },

  // Titles
  welcomeTitle: { 
    fontSize: 32, 
    fontWeight: '800', 
    textAlign: 'center',
    marginBottom: 15,
  },

  // Inputs
  inputGroup: { width: '100%', marginBottom: 16, alignItems: 'center' },
  inputPill: {
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS_DEF.inputBorder,
    backgroundColor: COLORS_DEF.inputBg,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: { flex: 1, fontSize: 16, color: '#333' },

  // CTA
  loginBtn: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 17,
    borderRadius: 29,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 6,
    // Shadow
    shadowColor: COLORS_DEF.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', letterSpacing: 1 },

  // Divider
  orLoginWithContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 14, marginTop: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },

  poweredByText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#AAAAAA',
    alignSelf: 'center',
  },
    titleUnderline: {
      width: 80,
      height: 4,
      backgroundColor: COLORS_DEF.secondary, // Accent color
      // marginTop: 5,
      borderRadius: 2,
  },
    titleContainer: {
      marginTop: 30,
      alignItems: 'center',
      marginBottom: 20,
  },
});