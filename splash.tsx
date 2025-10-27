import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Easing, StatusBar, Dimensions } from 'react-native';
import ShimmerPlaceholder from './component/shimmer'; // Assuming this is your shimmer component

const { width, height } = Dimensions.get('window');

const Splash = () => {
  // State to control the transition from the initial shimmer to the logo animations
  const [showLogos, setShowLogos] = useState(false);

  // General animation values
  const backgroundFadeAnim = useRef(new Animated.Value(0)).current;
  const logosOpacityAnim = useRef(new Animated.Value(1)).current; // To control final fade-out

  // Animation for the SHORT LOGO
  const shortLogoBounceAnim = useRef(new Animated.Value(0)).current;
  const shortLogoOpacityAnim = useRef(new Animated.Value(0)).current;

  // Animation for the MAIN LOGO
  const mainLogoFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Initial Generic Shimmer
    const initialShimmerTimer = setTimeout(() => {
      setShowLogos(true); // After 2 seconds, switch to the logo sequence
    }, 2000);

    // Main animation sequence
    const backgroundFadeIn = Animated.timing(backgroundFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    const shortLogoBounce = Animated.sequence([
      Animated.timing(shortLogoOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(shortLogoBounceAnim, {
        toValue: 1,
        duration: 1000, // Slower bounce
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]);

    const mainLogoFadeIn = Animated.timing(mainLogoFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });
    
    const finalFadeOut = Animated.timing(logosOpacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    });

    // Chain the animations together
    if (showLogos) {
      Animated.sequence([
        Animated.parallel([backgroundFadeIn, shortLogoBounce]), // Background and short logo appear together
        mainLogoFadeIn, // Then the main logo appears
        Animated.delay(4000), // Hold both logos for 4 seconds
        finalFadeOut // Fade both out
      ]).start();
    }
    
    return () => clearTimeout(initialShimmerTimer); // Cleanup timer on unmount
  }, [showLogos]); // This effect runs when `showLogos` changes

  // Interpolations for short logo 3D bounce
  const shortLogoScale = shortLogoBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const shortLogoRotation = shortLogoBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  if (!showLogos) {
    return (
      <View style={styles.initialLoadingContainer}>
        <StatusBar hidden={true} />
        <ShimmerPlaceholder width={width} height={height} style={StyleSheet.absoluteFill} />
      </View>
    );
  }

  // --- Main Content View for the logo animations ---
  return (
    <Animated.View style={[styles.container, { opacity: backgroundFadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#934790" />
      
      <Animated.View style={{ opacity: logosOpacityAnim, alignItems: 'center' }}>
        <Animated.Image
          source={require('./assets/Whiteshortlogo.png')}
          style={[
            styles.shortLogo,
            {
              opacity: shortLogoOpacityAnim,
              transform: [
                { scale: shortLogoScale },
                { rotate: shortLogoRotation },
              ],
            },
          ]}
          resizeMode="contain"
        />

        <Animated.Image
          source={require('./assets/WhiteNewZoomConnectlogo.png')}
          style={[
            styles.mainLogo,
            { opacity: mainLogoFadeAnim },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  initialLoadingContainer: {
    flex: 1,
    backgroundColor: '#C59AC3',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#934790',
  },
  shortLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  mainLogo: {
    width: 300,
    height: 80, // Adjusted height for a more banner-like logo
  },
});33