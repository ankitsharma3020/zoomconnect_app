import { useNavigation, CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux'; 
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { wp, hp } from './Src/utilites/Dimension'; // Imported your utilities

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

// --- CONFIGURATION ---
const GIF_DURATION = 2500; 

// --- ASSETS ---
const IMG_MAIN_GIF = require('./assets/whitelogoanimation.gif');
const IMG_FINAL_LOGO = require('./assets/WhiteNewZoomConnectlogo.png');

const Splash = () => {
  const navigation = useNavigation();
  
  const [logoPhase, setLogoPhase] = useState('gif'); 
  const [mainGifLoaded, setMainGifLoaded] = useState(false);

  const isLoggedIn = useSelector((state) => state.user.user); 

  // --- Animation Values ---
  const logoScaleXAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // 1. CHANGED: Used hp(20) instead of height * 0.2
  const logoTranslateYAnim = useRef(new Animated.Value(hp(20))).current;
  
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Used hp(100) instead of height
  const bottomContentTranslateYAnim = useRef(new Animated.Value(hp(100))).current;
  const screenTranslateYAnim = useRef(new Animated.Value(hp(100))).current;

  useEffect(() => {
    FastImage.preload([
      { uri: Image.resolveAssetSource(IMG_MAIN_GIF).uri },
      { uri: Image.resolveAssetSource(IMG_FINAL_LOGO).uri },
    ]);

    const startSequence = Animated.parallel([
      Animated.timing(screenTranslateYAnim, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleXAnim, {
        toValue: 1,
        duration: 800,
        delay: 400, 
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateYAnim, {
        toValue: 0, 
        duration: 1000,
        delay: 400, 
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // 3. Guest Animation: Moves from Center -> Top using hp
    const guestSequence = Animated.parallel([
      Animated.timing(logoTranslateYAnim, {
        toValue: -hp(39), // Replaced height * 0.39 with hp(39)
        duration: 1200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bottomContentTranslateYAnim, {
        toValue: 0, 
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // --- LOGIC EXECUTION ---
    if (isLoggedIn) {
      Animated.sequence([
        startSequence,
        Animated.delay(800), 
      ]).start(() => {
        // navigation.navigate('Home');
      });

    } else {
      startSequence.start(() => {
        setTimeout(() => {
          setLogoPhase('final');

          guestSequence.start(() => {
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
        }, GIF_DURATION); 
      });
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e0f9" />

      <AnimatedImageBackground
        source={require('./assets/Splashbg.jpg')}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFillObject,
          styles.backgroundImage,
          { transform: [{ translateY: screenTranslateYAnim }] },
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.logoContainer,
            {
              transform: [
                { scaleX: logoScaleXAnim }, 
                { translateY: logoTranslateYAnim } 
              ],
              opacity: logoOpacityAnim,
              zIndex: 2,
            },
          ]}
        >
          {logoPhase === 'gif' && (
            <AnimatedFastImage
              source={IMG_MAIN_GIF}
              resizeMode={FastImage.resizeMode.contain}
              onLoad={() => setMainGifLoaded(true)} 
              style={[
                styles.bigLogo, 
                styles.absoluteCenter,
                { opacity: 1 } 
              ]} 
            />
          )}

          <AnimatedFastImage
            source={IMG_FINAL_LOGO}
            resizeMode={FastImage.resizeMode.contain}
            style={[
              styles.bigLogo, 
              styles.absoluteCenter,
              { opacity: logoPhase === 'final' ? 1 : 0 }
            ]} 
          />
        </Animated.View>

        {!isLoggedIn && (
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
                        outputRange: [-hp(1.2), hp(1.2)], // Dynamic float distance
                      }),
                    },
                  ],
                },
              ]}
            />
            <Image source={require('./assets/Shadow.png')} style={styles.illustration1} resizeMode="contain" />

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    borderTopLeftRadius: wp(2), // Approx 40
    borderTopRightRadius: wp(2),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -hp(1.2) },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0,
  },
  absoluteCenter: {
    position: 'absolute',
  },
  bigLogo: {
    width: wp(70),  // replaced width * 0.7
    height: hp(30), // replaced height * 0.3
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    width: wp(80),   // replaced '80%'
    marginTop: hp(10), // replaced height * 0.1
  },
  welcomeTitle: {
    fontSize: hp(4.6), // Approx 42px
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginBottom: hp(1.8),
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: hp(0.2) },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: hp(1.7), // Approx 16px
    color: '#f7f4f8ff',
    fontFamily: 'Montserrat-SemiBold', // Switched to SemiBold for subtitle readability
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: hp(2.4),
  },
  illustration: {
    width: wp(70),  // replaced width * 0.7
    height: hp(30), // replaced height * 0.3
  },
  illustration1: {
    width: wp(50),  // replaced width * 0.5
    height: hp(7),  // replaced height * 0.07
    marginVertical: hp(2.5),
    marginLeft: wp(2.5),
  },
  loginButton: {
    width: wp(70),
    padding: hp(1.2), // replaced 10
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5),
    alignItems: 'center',
    shadowColor: '#370235ff',
    shadowOffset: { width: 0, height: hp(1.2) },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 18,
  },
  loginButtonText: {
    fontSize: hp(2.5), // Approx 20px
    fontFamily: 'Montserrat-Bold',
    color: '#934790',
  },
});