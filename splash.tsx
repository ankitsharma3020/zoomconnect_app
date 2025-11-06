import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Animated version of ImageBackground
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const Splash = () => {
  const navigation=useNavigation()
  // Logo animations
  const logoScaleXAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoTranslateYAnim = useRef(new Animated.Value(0)).current;
const floatAnim = useRef(new Animated.Value(0)).current;
  // Bottom content animation
  const bottomContentTranslateYAnim = useRef(new Animated.Value(height)).current;

  // Whole screen slide-in
  const screenTranslateYAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const screenSlideIn = Animated.timing(screenTranslateYAnim, {
      toValue: 0,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

    const logoAppear = Animated.parallel([
      Animated.timing(logoScaleXAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    const logoSwipeUp = Animated.timing(logoTranslateYAnim, {
      toValue: -height * 0.37,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

    const contentSlideUp = Animated.timing(bottomContentTranslateYAnim, {
      toValue: 0,
      duration: 1400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

Animated.sequence([
  Animated.delay(400),
  screenSlideIn,
  logoAppear,
  Animated.delay(1000),
  Animated.parallel([logoSwipeUp, contentSlideUp]),
]).start(() => {
  // start gentle up/down oscillation
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 1800,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ])
  ).start();
});

  }, [logoScaleXAnim, logoOpacityAnim, logoTranslateYAnim, bottomContentTranslateYAnim, screenTranslateYAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e0f9" />

      {/* Background IMAGE with the same slide-in animation */}
      <AnimatedImageBackground
        source={require('./assets/Splashbg.jpg')}  // <-- replace with your image
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFillObject,
          styles.backgroundImage,
          { transform: [{ translateY: screenTranslateYAnim }] },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.logoContainer,
            {
              transform: [{ scaleX: logoScaleXAnim }, { translateY: logoTranslateYAnim }],
              opacity: logoOpacityAnim,
              zIndex: 2,
            },
          ]}
        >
          <Animated.Image
            source={require('./assets/WhiteNewZoomConnectlogo.png')}
            style={styles.bigLogo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Bottom Content */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.bottomContainer,
            { transform: [{ translateY: bottomContentTranslateYAnim }], zIndex: 1 },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.welcomeSubtitle}>
              Empower Your Well-being and Insurance Management with ZoomConnect
            </Text>
          </View>

          <Animated.Image
  source={require('./assets/Login.png')}
  resizeMode="contain"
  style={[
    styles.illustration,
    {
      transform: [
        {
          translateY: floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 10], // up to down distance (tweak to taste)
          }),
        },
      ],
    },
  ]}
/>


          <TouchableOpacity style={styles.loginButton}
          onPress={()=>{
            navigation.navigate('Login' as never)
            }}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </AnimatedImageBackground>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFF',
  },

  // Replaces gradientContainer
  backgroundImage: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },

  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigLogo: {
    width: width * 0.8,
    height: height * 0.4,
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    alignItems: 'center',
    width: '80%',
    marginTop: height * 0.1,
  },
  welcomeTitle: {
    fontSize: 42,
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#f7f4f8ff',
     fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  illustration: {
    width: width * 0.7,
    height: height * 0.3,
    marginVertical: 30,
  },
 loginButton: {
  width: '70%',
  padding: 10,
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  alignItems: 'center',

  // --- Shadow (iOS) ---
  shadowColor: '#370235ff',
  shadowOffset: { width: 0, height: 10 }, // 👈 pushes shadow more downward
  shadowOpacity: 0.25, // a bit stronger
  shadowRadius: 10, // smoother spread

  // --- Shadow (Android) ---
  elevation: 18, // 👈 increase for deeper shadow on Android
},

  loginButtonText: {
    fontSize: 20,
   fontFamily: 'Montserrat-Bold',
    color: '#934790',
  },
});
