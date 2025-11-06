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
  Animated,
  Modal, // --- ADDED ---
} from 'react-native';
import FastImage from '@d11/react-native-fast-image'
import React, { useState, useRef, useEffect } from 'react';
import DotPattern from '../component/Pattern';
// import LinearGradient from 'react-native-linear-gradient'; // --- NO GRADIENT ---

const { height, width } = Dimensions.get('window');

// Define animation constants
const START_HEIGHT = height * 0.45;
const END_HEIGHT = START_HEIGHT / 1.5; 

// --- REMOVED AnimatedLinearGradient ---

// Placeholder for images
const Images = {
  gmail: require('../../assets/Google.png'),
  microsoft: require('../../assets/micosoft.png'),
  phone: require('../../assets/phone.png'),
  email: require('../../assets/email.png'),
  welcomeBackBg: require('../../assets/purpleshortlogo.png'),
  appLogo: require('../../assets/purpleshortlogo.png'),
  // forgotPasswordGif: require('../../assets/Login.gif') // This was in your code but not used
};

const Forgetpassword = () => {
  // const [loginMode, setLoginMode] = useState('phone');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // --- ADDED ---

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

  // --- DUPLICATE IMAGES OBJECT REMOVED ---

  // ... (handleSetLoginMode function is unchanged)
  const handleSetLoginMode = (mode) => {
    setLoginMode(mode);
    setUsername('');
    setPassword('');
  };

  let usernamePlaceholder = 'Phone Number';
  let keyboardType = 'phone-pad';




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
          
            <Text style={styles.welcomeBackText}>Forget Password!</Text>
          </Animated.View>

          {/* --- MODIFIED: Wrapped in Animated.View and applied animated style --- */}
          <Animated.View
            style={[styles.bottomSection, { top: topSectionHeightAnim }]}
          >
            {/* Input Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
               Email
              </Text>
              <TextInput
                style={styles.input}
                placeholder={usernamePlaceholder}
                keyboardType={keyboardType}
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
              />
            </View>

       

            {/* Main Login Button */}
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Submit</Text>
            </TouchableOpacity>

            {/* --- ADDED: Powered By Text --- */}
            <Text style={styles.poweredByText}>Product by Zoom Insurance Brokers Pvt Ltd</Text>
       

          </Animated.View>
              
 

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Forgetpassword;

const styles = StyleSheet.create({
  // --- Styles are UNCHANGED, except for adding poweredByText ---
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: '#E8D4B7', 
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
    // marginTop: 1,
    backgroundColor: '#934790', 
  },
  topSection: {
    backgroundColor: '#934790', 
    borderBottomRightRadius: 70, 
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // elevation: 6,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 20, 
    zIndex: 1, 
  },
  imageBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden', 
    alignItems: 'center',
    justifyContent: 'center', 
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
    //  marginTop: 1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF', // This is YOUR style, left unchanged
    borderTopLeftRadius: 50, 
    
    padding: 24,
    overflow: 'hidden',
    paddingTop: height * 0.10, 
    alignItems: 'center',
    zIndex: 1, 
      shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // elevation: 6,
    // marginTop: 4,
  },
  // ... (All other styles are UNCHANGED)
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 45,
    borderBottomColor: '#B0AFAF',
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  authOptionsRow: {
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#934790',
    fontWeight: '600',
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#934790',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6A9B48',
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
  smallOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  smallOptionBtnText: {
    color: '#292727ff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  smallOptionBtnIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  smallOptionBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  gif: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    marginBottom: 10, // Adds a little space above the text
  },
  smallOptionBtnHalf: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45.5%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dontHaveAccountText: {
    fontSize: 14,
    color: '#333',
  },
  signUpText: {
    fontSize: 14,
    color: '#934790',
    fontWeight: 'bold',
  },
 orLoginWithContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%', 
    marginBottom: 24, 
  },
  line: {
    flex: 1, 
    height: 1,
    backgroundColor: '#B0AFAF', 
  },
  orLoginWithText: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 10, 
  },

  // --- ADDED --- Styles for the Modal ---
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '65%', // --- MODIFIED: Smaller width ---
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20, // --- MODIFIED: Slightly less padding ---
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
    zIndex: 1, // Ensure it's on top
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
  },
  
  // --- ADDED: Powered By Text Style ---
  poweredByText: {
    position: 'absolute',
    bottom: 64, // Matches the parent's padding
    fontSize: 12,
    color: '#888',
  },
});