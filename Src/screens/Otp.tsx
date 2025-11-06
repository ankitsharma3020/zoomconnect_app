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
  Image,
  Animated, // --- RE-ADDED ---
  Modal,
  Pressable, 
} from 'react-native';
import FastImage from '@d11/react-native-fast-image'
import React, { useState, useRef, useEffect } from 'react';
import DotPattern from '../component/Pattern';

const { height, width } = Dimensions.get('window');

// Define animation constants
const START_HEIGHT = height * 0.45;
const END_HEIGHT = START_HEIGHT / 1.5; 

// Placeholder for images
const Images = {
  // ... (your images)
  appLogo: require('../../assets/purpleshortlogo.png'),
};

const OTP = () => {
  const [otp, setOtp] = useState('');
  const textInputRef = useRef(null);
  const boxArray = new Array(4).fill(0); // For mapping the 4 boxes

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // --- ADDED: Animation value ---
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  // --- ADDED: Animation logic ---
  useEffect(() => {
    Animated.timing(topSectionHeightAnim, {
      toValue: END_HEIGHT,
      duration: 600, 
      delay: 200,     
      useNativeDriver: false, 
    }).start();
  }, []); 

  // Focus the hidden input on mount
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  // --- useEffect for countdown timer ---
  useEffect(() => {
    if (!isResendDisabled || timer === 0) {
      if(timer === 0) setIsResendDisabled(false);
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isResendDisabled, timer]);

  // --- Handlers ---
  const handleOnPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleOnChangeText = (value) => {
    setStatus('idle'); // Reset status on new input
    setOtp(value);
  };

  // --- Shake animation function ---
  const triggerShake = () => {
    shakeAnimation.setValue(0); // Reset animation
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  // --- Verify OTP function ---
  const handleVerifyOTP = () => {
    if (otp.length !== 4) {
      triggerShake();
      setStatus('error');
      return;
    }
    
    // Simulate API check
    if (otp === '1234') {
      setStatus('success');
      Keyboard.dismiss();
    } else {
      triggerShake();
      setStatus('error');
    }
  };

  // --- Resend OTP function ---
  const onResendOtp = () => {
    console.log("Resending OTP...");
    setTimer(30); // Reset timer to 30 seconds
    setIsResendDisabled(true); // Disable the button
  };

  // --- Animated style for the container ---
  const animatedOtpContainerStyle = {
    transform: [{ translateX: shakeAnimation }]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#934790" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
                {/* --- MODIFIED: Wrapped in Animated.View and applied animated style --- */}
                <Animated.View style={[styles.topBackground, { height: topSectionHeightAnim }]} />
                <Animated.View style={[styles.bottomBackground, { top: topSectionHeightAnim }]} />
          
          {/* --- MODIFIED: Wrapped in Animated.View and applied animated style --- */}
          <Animated.View style={[styles.topSection,{height: topSectionHeightAnim }] }>
            <DotPattern color="#FFFFFF" opacity={0.1} />
           <View style={styles.logoCircle}>
                         <Image source={Images.appLogo} style={styles.logo} resizeMode="contain" />
                       </View>
          
            <Text style={styles.welcomeBackText}>Enter OTP</Text>
          </Animated.View>

          {/* --- MODIFIED: Wrapped in Animated.View and applied animated style --- */}
          <Animated.View
            style={[styles.bottomSection, { top: topSectionHeightAnim }]}
          >
            <Text style={styles.inputLabel}>
               OTP Code
            </Text>
            
            <Animated.View style={[styles.otpContainer, animatedOtpContainerStyle]}>
              <Pressable style={styles.pressableContainer} onPress={handleOnPress}>
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
              </Pressable>
            </Animated.View>

            {/* This is the hidden input that actually handles the text */}
            <TextInput
              ref={textInputRef}
              style={styles.hiddenTextInput}
              value={otp}
              onChangeText={handleOnChangeText}
              maxLength={4}
              keyboardType="number-pad"
              textContentType="oneTimeCode" // For iOS autofill
            />
            
            <TouchableOpacity style={styles.loginBtn} onPress={handleVerifyOTP}>
              <Text style={styles.loginBtnText}>Verify OTP</Text>
            </TouchableOpacity>
              <View style={styles.resendContainer}>
              {isResendDisabled ? (
                <Text style={styles.resendText}>
                  Resend code in <Text style={{fontWeight: 'bold'}}>{timer}s</Text>
                </Text>
              ) : (
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.resendText}>Didn't receive the code? </Text>
                  <TouchableOpacity onPress={onResendOtp}>
                  <Text style={styles.resendButtonText}>Resend</Text>
                </TouchableOpacity>
                </View>
                  
               
              )}
            </View>

            <Text style={styles.poweredByText}>Product by Zoom Insurance Brokers Pvt Ltd</Text>

          </Animated.View>
              
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OTP;

const styles = StyleSheet.create({
  // --- Styles are UNCHANGED ---
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF', 
  },
  bottomBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#934790', 
  },
  topSection: {
    backgroundColor: '#934790', 
    borderBottomRightRadius: 70, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 20, 
    zIndex: 1, 
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '35%',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
  welcomeBackText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50, 
    padding: 24,
    overflow: 'hidden',
    paddingTop: height * 0.10, 
    alignItems: 'center',
    zIndex: 1, 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  
  // --- OTP Styles ---
  inputLabel: {
    fontSize: 16, 
    color: '#333',
    marginBottom: 24, 
    fontWeight: '600',
    alignSelf: 'center', 
  },
  otpContainer: {
    width: '90%',
    // --- MODIFIED: Reduced bottom margin ---
    marginBottom: 20, 
  },
  pressableContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  otpBox: {
    width: 70,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    transitionProperty: 'border-color, transform',
    transitionDuration: '0.2s',
  },
  otpBoxFilled: {
    borderColor: '#333', // Black outline when filled
    borderWidth: 2,
  },
  otpBoxActive: {
    borderColor: '#934790', // Purple outline when active
    borderWidth: 2,
    transform: [{ scale: 1.05 }], // "Pop" animation
  },
  otpBoxSuccess: {
    borderColor: '#2E7D32', // Green
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
  },
  otpBoxError: {
    borderColor: '#D32F2F', // Red
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
  },
  otpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5c5555ff',
  },
  hiddenTextInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  // --- END OTP Styles ---
  
  // --- ADDED: Resend and Powered By Styles ---
  resendContainer: {
     marginTop: 20,
   // Space before the verify button
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#888',
  },
  resendButtonText: {
    fontSize: 14,
    color: '#934790',
    fontWeight: 'bold',
  },
  poweredByText: {
    position: 'absolute',
    bottom: 64, // Matches the parent's padding
    fontSize: 12,
    color: '#888',
  },
  // --- END ADDED ---

  loginBtn: {
    width: '100%',
    backgroundColor: '#934790',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    // --- MODIFIED: Removed margin ---
    marginTop: 20, 
    shadowColor: '#934790', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gif: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  // --- All modal styles are unchanged ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '65%', 
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalTransparentButton: { 
    width: '80%',
    padding: 8, 
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: '#E0E0E0', 
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  modalTransparentButtonText: { 
    color: '#4b4a4aff', 
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 1,
    right: 2,
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, 
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
  },
});