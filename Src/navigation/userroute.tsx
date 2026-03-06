import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  Animated, 
  Platform, 
  Text, 
  ActivityIndicator, 
  Modal, 
  PanResponder, 
  Image,
  Dimensions
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

// IMPORTANT: Adjust this import path based on where your setUser action is located
import { setUser } from '../redux/service/userSlice'; 
// IMPORTANT: Adjust this path to your dimension utilities
import { wp, hp } from '../utilites/Dimension'; 

import ClaimDetailss from '../screens/claimsDetails';
import ProfileScreen from '../screens/profile';
import PolicyDetails from '../screens/policydetails';
import NaturaAddition from '../screens/NaturaAddition';
import chatscreen from '../screens/chatscreen';
import MainTabs from './bottomtab';
import DoctorOnCallScreen from '../screens/nhtConsultant';
import ResetPassword from '../screens/resetPassword';
import SurvayPage from '../screens/SurvayPage';
import SurveyListScreen from '../screens/survayScreen';
import Helpticketlist from '../screens/Helpticketlist';
import NetworkHospitalScreen from '../screens/networkHospital';
import FileClaimPage from '../screens/fileClaim';
import ClaimProcessPage from '../screens/claimProcess';
import LoginedesetPassword from '../screens/LoginedResetPass';
import WebRendering from '../screens/webview/webRender';
import PermissionRequestScreen from '../component/Permission/permission';

const Stack = createNativeStackNavigator();
const rnBiometrics = new ReactNativeBiometrics();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const UserRoute = ({ isFirstLaunch }) => {
  const dispatch = useDispatch();

  // --- States for Biometrics & UI ---
  const [authStatus, setAuthStatus] = useState('INITIALIZING');
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState('');
  const [biometricTitle, setBiometricTitle] = useState('');

  // --- States for Floating Button ---
  const animatedWidth = useRef(new Animated.Value(wp(30))).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  // --- PanResponder for Draggable Floating Button ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }], 
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const moveDistance = Math.sqrt(dx * dx + dy * dy);
        
        if (moveDistance < 10) {
          setIsDragging(false);
          pan.flattenOffset();
          return;
        }
        
        setIsDragging(false);
        pan.flattenOffset();
        
        const buttonSize = 60;
        const initialRightMargin = wp(3.5);
        const bottomMargin = Platform.OS === 'android' ? hp(14) : hp(12);
        
        const minX = -(screenWidth - initialRightMargin - buttonSize); 
        const maxX = 0; 
        const minY = -(screenHeight - bottomMargin - buttonSize);  
        const maxY = 0; 
        
        const currentX = pan.x._value;
        const currentY = pan.y._value;
        
        const clampedX = Math.max(minX, Math.min(maxX, currentX));
        const clampedY = Math.max(minY, Math.min(maxY, currentY));
        
        if (clampedX !== currentX || clampedY !== currentY) {
          Animated.spring(pan, {
            toValue: { x: clampedX, y: clampedY },
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        pan.flattenOffset();
      },
    })
  ).current;

  // --- App Initialization & Biometric Logic ---
  useEffect(() => {
    const initialize = async () => {
      setAuthStatus('INITIALIZING');
      try {
        const firstLogin = await AsyncStorage.getItem('isFirstLogin');
        const biometricsEnable = await AsyncStorage.getItem('biometricsEnable');

        if (biometricsEnable === 'true') {
          setAuthStatus('CHECKING_BIOMETRICS');
          checkBiometrics();
        } else if (firstLogin === 'true') {
          setShowFirstLoginModal(true);
          setAuthStatus('SHOW_APP');
        } else {
          setAuthStatus('SHOW_APP');
        }
      } catch (e) {
        console.error("Initialization error:", e);
        setAuthStatus('SHOW_APP');
      }
    };
    initialize();
  }, []);

  const checkBiometrics = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        // If device has no sensor, just let them in
        setAuthStatus('SHOW_APP');
        return;
      }
      handleBiometricAuthentication();
    } catch (error) {
      console.error('Biometric check error:', error);
      logoutUser(); // Security fallback
    }
  };

  const handleBiometricAuthentication = async () => {
    try {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint to continue',
        cancelButtonText: 'Cancel',
      });
      
      if (result.success) {
        setAuthStatus('SHOW_APP'); // Success -> Let them in
      } else {
        // User clicked Cancel -> Log them out
        logoutUser();
      }
    } catch (error) {
      console.error('Biometric prompt error:', error);
      // Failsafe -> Log them out
      logoutUser();
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.clear();
      dispatch(setUser(false)); 
      setAuthStatus('LOGGED_OUT');
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const handleEnableBiometrics = async () => {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
          alert("Biometric sensor is not available on this device.");
          setShowFirstLoginModal(false);
          return;
      }
      await AsyncStorage.setItem('biometricsEnable', 'true');
      await AsyncStorage.setItem('isFirstLogin', 'false');
      
      setShowFirstLoginModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

    } catch (e) {
        console.error("Error enabling biometrics:", e);
        setShowFirstLoginModal(false);
    }
  };

  const handleCancelBiometricsModal = async () => {
    try {
      await AsyncStorage.setItem('isFirstLogin', 'false');
      setShowFirstLoginModal(false);
    } catch (e) {
      setShowFirstLoginModal(false);
    }
  };

  // --- Floating Button Handlers ---
  const openWhatsApp = () => {
    let url = `whatsapp://send?phone=+919289695656&text=Hi`;
    Linking.openURL(url).catch(() => alert('Make sure WhatsApp is installed on your device'));
  };

  const toggleChat = () => {
    Animated.parallel([
      Animated.timing(animatedWidth, { toValue: isChatVisible ? wp(9.5) : wp(28), duration: 300, useNativeDriver: false }),
      Animated.timing(animatedOpacity, { toValue: isChatVisible ? 0 : 1, duration: 200, useNativeDriver: true }),
      Animated.timing(animatedTranslateX, { toValue: isChatVisible ? 50 : 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setIsChatVisible(!isChatVisible));
  };

  // --- Renders ---
  if (authStatus === 'INITIALIZING' || authStatus === 'CHECKING_BIOMETRICS') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#934790" />
        <Text style={styles.loadingText}>
          {authStatus === 'INITIALIZING' ? 'Loading...' : 'Authenticating...'}
        </Text>
      </View>
    );
  }

  if (authStatus === 'LOGGED_OUT') {
      return null; // Will trigger navigation reset via Redux state change in App.js
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* 1. Main Navigation Stack */}
      <Stack.Navigator 
        initialRouteName={isFirstLaunch ? "PermissionRequest" : "Dashboard"}   
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="PermissionRequest" component={PermissionRequestScreen} />
        <Stack.Screen name="Dashboard" component={MainTabs} />
        <Stack.Screen name="ClaimsDetails" component={ClaimDetailss} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="policydetails" component={PolicyDetails} />
        <Stack.Screen name="NaturalAddition" component={NaturaAddition} />
        <Stack.Screen name="ChatScreen" component={chatscreen} />
        <Stack.Screen name="DoconCall" component={DoctorOnCallScreen} />
        <Stack.Screen name="ResetPassword" component={LoginedesetPassword} />
        <Stack.Screen name="SurvayDetails" component={SurvayPage} />
        <Stack.Screen name="SurvaylistPage" component={SurveyListScreen} />
        <Stack.Screen name="AllTicketsScreen" component={Helpticketlist} />
        <Stack.Screen name="networkHospitalScreen" component={NetworkHospitalScreen} />
        <Stack.Screen name="fileclaim" component={FileClaimPage} />
        <Stack.Screen name="claimProcess" component={ClaimProcessPage} />
        <Stack.Screen name="Webrendering" component={WebRendering} />
      </Stack.Navigator>

      {/* 2. Draggable Floating WhatsApp Button */}
      <Animated.View 
        {...panResponder.panHandlers}
        style={[
          styles.floatingButton, 
          { 
            width: animatedWidth,
            transform: [
              { translateX: pan.x },
              { translateY: pan.y }
            ]
          }
        ]}
      >
         <TouchableOpacity onPress={toggleChat} style={styles.touchable}>
          <Image
            source={require('../../assets/floatingbuttonn.png')} // Adjust path if needed
            style={{ width: 50, height: 50, right: 5 }}
            resizeMode="contain"
          />
          {isChatVisible && (
            <Animated.View style={{ flexDirection: 'row', opacity: animatedOpacity, transform: [{ translateX: animatedTranslateX }] }}>
            
              <TouchableOpacity onPress={openWhatsApp} style={styles.chatContainer}>
                <Text style={styles.chatText}>Let's Chat</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* 3. First Login: Enable Biometrics Modal */}
      <Modal
        visible={showFirstLoginModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelBiometricsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enable Fingerprint?</Text>
            <Text style={styles.modalSubtitle}>Enable quick and secure login for future access.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={handleCancelBiometricsModal}
              >
                <Text style={styles.modalButtonText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#934790' }]}
                onPress={handleEnableBiometrics}
              >
                <Text style={styles.modalButtonText}>Enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Success Modal for Biometrics */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Image
              source={require('../../assets/fingerprintsucess.gif')} // Adjust path if needed
              style={styles.successGif}
              resizeMode="contain"
            />
            <Text style={styles.successText}>Success!</Text>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#934790',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? hp(14) : hp(12),
    right: wp(3.5),
    height: 45,
    borderRadius: 30,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#42C250',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  touchable: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  chatContainer: {
    justifyContent: 'center',
    left: Platform.OS === 'android' ? wp(3) : wp(3.6),
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  chatText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: -10,
    left: -5,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    bottom: Platform.OS === 'ios' ? 1 : 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 0.45,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  successGif: {
    width: 80,
    height: 80,
  },
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});