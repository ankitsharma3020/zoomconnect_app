import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Splash from '../../splash';
import { UserRoute } from './userroute';
import { GuestRoute } from './guestroute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../redux/service/userSlice';

const { height } = Dimensions.get('window');

const RouteManager = () => {
  const dispatch = useDispatch();
    const [isFirstLaunch, setIsFirstLaunch] = useState(null); 
  // Get user from Redux
  const user = useSelector((state) => state.user.user);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSplashVisible, setSplashVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        // IF NO TOKEN: Ensure Redux is also cleared
        if (!token) {
          dispatch(setUser(null)); 
        } else {
          // IF TOKEN EXISTS: But Redux is empty, sync it (optional based on your slice logic)
          // dispatch(setUser(dataFromToken));
        }
      } catch (e) {
        console.error(e);
      } finally {
        // Stop loading only after we are sure about the token
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Use a strictly boolean check for the UI
  // If user is null, undefined, or false, isLoggedIn will be false
  const isLoggedIn = !!user; 
   useEffect(() => {
    // Check AsyncStorage to see if the permission screen has run before
    const checkFirstLaunch = async () => {
      const hasRequested = await AsyncStorage.getItem('hasRequestedPermissions');
      setIsFirstLaunch(hasRequested !== 'true');
    };
    checkFirstLaunch();
  }, []);


  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        setSplashVisible(false);
      } else {
        // Trigger the slide animation for logged-in users
        const timer = setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start(() => setSplashVisible(false));
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) return <Splash />;

  // THE KEY FIX: If not logged in, return GuestRoute immediately
  if (!isLoggedIn) {
    return <GuestRoute />;
  }

  return (
    <View style={{ flex: 1 }}>
      {isSplashVisible && (
        <View style={styles.absoluteFill}><Splash /></View>
      )}
      <Animated.View style={[styles.absoluteFill, { transform: [{ translateY: slideAnim }] }]}>
        <UserRoute  isFirstLaunch={isFirstLaunch}/>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
});

export default RouteManager;