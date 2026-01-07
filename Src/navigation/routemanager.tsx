import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import Splash from '../../splash';
import { UserRoute } from './userroute';
import { GuestRoute } from './guestroute';

const { height } = Dimensions.get('window');

const RouteManager = () => {
  // 1. Get Login status
  const Login = useSelector((state) => state.user.user);

  // 2. State to keep Splash visible in background while animation happens
  const [isSplashVisible, setSplashVisible] = useState(true);

  // 3. Animated Value for the Slide (Starts off-screen at 'height')
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    // SCENARIO 1: GUEST (No Login)
    // Hide splash immediately (or after a small delay if you prefer) so they see Login
    if (!Login) {
      setSplashVisible(false);
      return; 
    }

    // SCENARIO 2: USER (Logged In)
    // Wait for your Splash animation (3.8s), THEN slide up the Home screen
    const timer = setTimeout(() => {
      
      // Animate UserRoute sliding up from bottom
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to top
        duration: 800, // Speed of slide
        easing: Easing.out(Easing.ease),
        useNativeDriver: true, 
      }).start(() => {
        // Animation Done: Now we can unmount the Splash behind it
        setSplashVisible(false);
      });

    }, 3500);

    return () => clearTimeout(timer);
  }, [Login]);


  // --- RENDER LOGIC ---

  // 1. If Guest, just show GuestRoute (No fancy slide needed usually, or add logic if desired)
  if (!Login) {
    // If you want to avoid blink for guests, verify logic from previous step:
    // This assumes GuestRoute renders immediately.
    return <GuestRoute />;
  }

  // 2. If User, we render a CONTAINER that holds BOTH Splash and UserRoute
  return (
    <View style={{ flex: 1 }}>
      
      {/* BACKGROUND: Splash Screen (Stays visible until we remove it) */}
      {isSplashVisible && (
        <View style={styles.absoluteFill}>
          <Splash />
        </View>
      )}

      {/* FOREGROUND: UserRoute (Slides up over the splash) */}
      <Animated.View 
        style={[
          styles.absoluteFill, 
          { transform: [{ translateY: slideAnim }] } // Bind animation
        ]}
      >
        <UserRoute />
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject, // This makes views overlap perfectly
    backgroundColor: '#fff', // Ensure background is white so no transparency issues
  },
});

export default RouteManager;