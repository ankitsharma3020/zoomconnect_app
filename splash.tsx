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
  ScrollView,
  Dimensions
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from './Src/utilites/Dimension'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// --- CONFIGURATION ---
const GIF_DURATION = 2500; 

// --- ASSETS ---
const IMG_MAIN_GIF = require('./assets/whitelogoanimation.gif');
const IMG_FINAL_LOGO = require('./assets/WhiteNewZoomConnectlogo.png');

// --- ONBOARDING DATA ---
const onboardingData = [
  {
    title: 'Welcome',
    subtitle: 'Empower Your Well-being and Insurance Management with ZoomConnect',
    image: require('./assets/Login.png'), 
  },
  {
    title: 'Track Health',
    subtitle: 'Keep all your medical records and wellness stats safely in one place.',
    image: require('./assets/track.png'), 
  },
  {
    title: 'Easy Claims',
    subtitle: 'File and track your cashless or reimbursement claims instantly without any hassle.',
    image: require('./assets/easyclaims.png'), 
  },
  {
    title: '24/7 Support',
    subtitle: 'Connect with our claim representatives anytime, anywhere for instant resolution.',
    image: require('./assets/24x7.png'), 
  }
];

const Splash = () => {
  const navigation = useNavigation();
  
  const [logoPhase, setLogoPhase] = useState('gif'); 
  const [mainGifLoaded, setMainGifLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef(null);

  const isLoggedIn = useSelector((state) => state.user.user); 

  // --- Animation Values ---
  const logoScaleXAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoTranslateYAnim = useRef(new Animated.Value(hp(20))).current;
  const bottomContentTranslateYAnim = useRef(new Animated.Value(hp(100))).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current; // Tracks horizontal scroll

  useEffect(() => {
    FastImage.preload([
      { uri: Image.resolveAssetSource(IMG_MAIN_GIF).uri },
      { uri: Image.resolveAssetSource(IMG_FINAL_LOGO).uri },
    ]);

    const startSequence = Animated.parallel([
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
        toValue: -hp(5), 
        duration: 1000,
        delay: 400, 
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    const guestSequence = Animated.parallel([
      Animated.timing(logoTranslateYAnim, {
        toValue: -hp(39), 
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

  // --- SWIPE HANDLER ---
const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false, 
      listener: (event) => {
        let offsetX = event.nativeEvent.contentOffset.x;
        let pageIndex = Math.round(offsetX / SCREEN_WIDTH);
        if (pageIndex !== currentStep) {
          setCurrentStep(pageIndex);
        }
      },
    }
  );

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      let nextStep = currentStep + 1;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: nextStep * SCREEN_WIDTH, animated: true });
      }
    }
  };


  // --- INTERPOLATIONS FOR CROSSFADES ---
  const whiteBgOpacity = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const activeDotColor = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: ['#FFFFFF', '#934790'],
    extrapolate: 'clamp'
  });

  const inactiveDotColor = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: ['rgba(255, 255, 255, 0.4)', 'rgba(147, 71, 144, 0.2)'],
    extrapolate: 'clamp'
  });

  const loginTextColor = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: ['#FFFFFF', '#934790'],
    extrapolate: 'clamp'
  });

  const nextBtnBg = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: ['#FFFFFF', '#934790'],
    extrapolate: 'clamp'
  });

  const nextBtnTextColor = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: ['#934790', '#FFFFFF'],
    extrapolate: 'clamp'
  });

  const nextBtnBorderColor = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: ['#E0E0E0', '#5A2A58'], 
    extrapolate: 'clamp'
  });

  // Calculate STAGGERED ranges for the final crossfade to fix glitch
  const LAST_SWIPE_START = (onboardingData.length - 2) * SCREEN_WIDTH;
  const MID_SWIPE = LAST_SWIPE_START + (SCREEN_WIDTH * 0.45); // Fade out dual buttons before midpoint
  const LAST_SWIPE_END = (onboardingData.length - 1) * SCREEN_WIDTH;

  const dualButtonOpacity = scrollX.interpolate({
    inputRange: [LAST_SWIPE_START, MID_SWIPE],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const dualButtonScale = scrollX.interpolate({
    inputRange: [LAST_SWIPE_START, MID_SWIPE],
    outputRange: [1, 0.85],
    extrapolate: 'clamp'
  });

  const finalButtonOpacity = scrollX.interpolate({
    inputRange: [MID_SWIPE, LAST_SWIPE_END],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const finalButtonScale = scrollX.interpolate({
    inputRange: [MID_SWIPE, LAST_SWIPE_END],
    outputRange: [0.85, 1],
    extrapolate: 'clamp'
  });

  // --- PURE LOOP LOGIC FOR PROGRESS BAR ---
  let progressBars = [];
  for (let i = 1; i < onboardingData.length; i++) {
    let isActive = i <= currentStep; 
    progressBars.push(
      <Animated.View 
        key={i} 
        style={[
          styles.progressSegment, 
          { backgroundColor: isActive ? activeDotColor : inactiveDotColor },
          isActive && styles.activeSegmentShadow
        ]} 
      />
    );
  }

  // --- PURE LOOP LOGIC FOR SLIDER CONTENT ---
  let onboardingPages = [];
  for (let i = 0; i < onboardingData.length; i++) {
    let item = onboardingData[i];
    let isFirstScreen = i === 0;

    onboardingPages.push(
      <View key={i} style={styles.pageContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.welcomeTitle, { color: isFirstScreen ? '#FFFFFF' : '#934790', textShadowColor: isFirstScreen ? 'rgba(0,0,0,0.2)' : 'transparent' }]}>
            {item.title}
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: isFirstScreen ? '#f7f4f8ff' : '#6B5C79' }]}>
            {item.subtitle}
          </Text>
        </View>

        {isFirstScreen ? (
          <>
            <Animated.Image
              source={item.image}
              resizeMode="contain"
              style={[
                styles.illustration,
                { transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [-hp(1.2), hp(1.2)] }) }] }
              ]}
            />
            <FastImage source={require('./assets/Shadow.png')} style={styles.illustration1} resizeMode="contain" />
          </>
        ) : (
          <View style={styles.imageWrapper3D}>
            {/* Secondary Organic Accent Shape */}
             <LinearGradient
              colors={['rgba(244, 160, 224, 0.4)', 'rgba(207, 117, 117, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.blobShapeSecondary}
            />
            
            {/* Primary Beautiful Glassmorphism Blob */}
            <LinearGradient
              colors={['rgba(218, 107, 211, 0.35)', 'rgba(111, 74, 110, 0.15)']}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.blobShapePrimary}
            />
            
            <View style={styles.imageShadow3D}>
              <FastImage
                source={item.image}
                resizeMode="contain"
                style={styles.illustration3D}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={currentStep === 0 ? "light-content" : "dark-content"} backgroundColor={currentStep === 0 ? "#fabdf7" : "#FFFFFF"} />

      <AnimatedImageBackground
        source={require('./assets/splash_bg.jpg')}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFillObject,
          styles.backgroundImage,
        ]}
      >
        {/* Dynamic White Overlay */}
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#e6e6e6', opacity: whiteBgOpacity, zIndex: 1 }]} />

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
          {/* LOGO */}
          <Animated.View style={[styles.absoluteCenter, { opacity: currentStep === 0 ? 1 : 0 }]}>
            {logoPhase === 'gif' && (
              <AnimatedFastImage
                source={IMG_MAIN_GIF}
                resizeMode={FastImage.resizeMode.contain}
                onLoad={() => setMainGifLoaded(true)} 
                style={[styles.bigLogo, styles.absoluteCenter, { opacity: 1 }]} 
              />
            )}
            <AnimatedFastImage
              source={IMG_FINAL_LOGO}
              resizeMode={FastImage.resizeMode.contain}
              style={[
                styles.bigLogo, 
                { opacity: logoPhase === 'final' ? 1 : 0 },
                currentStep > 0 && { tintColor: '#934790' } // Keeps logo visible against white
              ]} 
            />
          </Animated.View>

          {/* PROGRESS BAR */}
          <Animated.View style={[styles.absoluteCenter, styles.progressBarContainer, { opacity: currentStep > 0 ? 1 : 0 }]}>
            {progressBars}
          </Animated.View>

        </Animated.View>

        {!isLoggedIn && (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              styles.bottomContainer,
              { transform: [{ translateY: bottomContentTranslateYAnim }], zIndex: 3 },
            ]}
          >
            {/* ScrollView for EXACT alignment preservation */}
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              bounces={false}
              style={{ flexGrow: 0 }}
            >
              {onboardingPages}
            </ScrollView>

            {/* CROSSFADING BUTTON LOGIC WITH SCALE (NO OVERLAP GLITCH) */}
            <View style={styles.buttonWrapper}>
              
              {/* Dual Layout: Login Text + Next Button */}
              <Animated.View 
                style={[
                  styles.buttonLayer, 
                  { 
                    opacity: dualButtonOpacity,
                    transform: [{ scale: dualButtonScale }]
                  },
                  currentStep === onboardingData.length - 1 ? { pointerEvents: 'none' } : {}
                ]}
              >
                <View style={styles.twoButtonRow}>
                  <TouchableOpacity 
                    style={styles.loginTextBtn}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Animated.Text style={[styles.loginTextOnly, { color: loginTextColor }]}>Login</Animated.Text>
                  </TouchableOpacity>

                  <AnimatedTouchableOpacity 
                    style={[styles.buttonSimple3D, { backgroundColor: nextBtnBg, borderBottomColor: nextBtnBorderColor }]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                  >
                    <Animated.Text style={[styles.buttonText3D, { color: nextBtnTextColor }]}>Next</Animated.Text>
                  </AnimatedTouchableOpacity>
                </View>
              </Animated.View>

              {/* Single Layout: Final Get Started Button */}
              <Animated.View 
                style={[
                  styles.buttonLayer, 
                  { 
                    opacity: finalButtonOpacity,
                    transform: [{ scale: finalButtonScale }]
                  },
                  currentStep !== onboardingData.length - 1 ? { pointerEvents: 'none' } : {}
                ]}
              >
                <TouchableOpacity 
                  style={styles.finalLoginButtonSimple3D}
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.finalButtonText3D}>Login</Text>
                </TouchableOpacity>
              </Animated.View>

            </View>

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
    backgroundColor: '#fabdf7',
  },
  backgroundImage: {
    borderTopLeftRadius: wp(2), 
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
    width: wp(70),  
    height: hp(30), 
  },
  
  // WHATSAPP STYLE PROGRESS BAR
  progressBarContainer: {
    flexDirection: 'row', 
    width: wp(80), 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressSegment: {
    flex: 1,
    height: hp(0.5),
    borderRadius: wp(1),
    marginHorizontal: wp(0.8),
  },
  activeSegmentShadow: {
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },

  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: { 
    width: SCREEN_WIDTH, 
    alignItems: 'center' 
  },
  textContainer: {
    alignItems: 'center',
    width: wp(80),   
    marginTop: hp(8), 
  },
  welcomeTitle: {
    fontSize: hp(3.2), 
    fontFamily: 'Montserrat-Bold',
    marginBottom: hp(1.5),
    textShadowOffset: { width: 0, height: hp(0.2) },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: hp(1.6), 
    fontFamily: 'Montserrat-SemiBold', 
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: hp(2.4),
    minHeight: hp(7.5),
  },
  illustration: {
    width: wp(70),  
    height: hp(30), 
    marginTop: hp(2.5), 
  },
  illustration1: {
    width: wp(50),  
    height: hp(7),  
    marginVertical: hp(2.5),
    marginLeft: wp(2.5),
  },

  // --- BEAUTIFUL 3D ORGANIC BLOB ENHANCEMENTS ---
  imageWrapper3D: {
    alignItems: 'center',
    justifyContent: 'flex-end', 
    marginTop: hp(1),
    width: wp(100),
    height: hp(44), 
  },
  blobShapePrimary: {
    position: 'absolute',
    bottom: hp(2),
    width: wp(75),
    height: wp(68),
    borderTopLeftRadius: wp(35),
    borderTopRightRadius: wp(45),
    borderBottomRightRadius: wp(35),
    borderBottomLeftRadius: wp(40),
    transform: [{ rotate: '-12deg' }],
    borderWidth: 1.5,
    borderColor: 'rgba(147, 71, 144, 0.1)', 
  },
  blobShapeSecondary: {
    position: 'absolute',
    bottom: hp(6),
    left: wp(8),
    width: wp(55),
    height: wp(55),
    borderTopLeftRadius: wp(25),
    borderTopRightRadius: wp(30),
    borderBottomRightRadius: wp(20),
    borderBottomLeftRadius: wp(35),
    transform: [{ rotate: '45deg' }],
  },
  imageShadow3D: {
    shadowColor: '#1A0015',
    shadowOffset: { width: 0, height: hp(2.5) }, 
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15, 
    zIndex: 5,
  },
  illustration3D: {
    width: wp(95), 
    height: hp(42), 
    zIndex: 5,
  },
  
  // BUTTONS CROSSFADE WRAPPERS
  buttonWrapper: {
    width: wp(75),
    height: hp(8), // Keeps layout fixed to prevent jumps
    marginTop: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  twoButtonRow: {
    flexDirection: 'row',
    width: wp(75), 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginTextBtn: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    justifyContent: 'center',
  },
  loginTextOnly: {
    fontSize: hp(2.2), 
    fontFamily: 'Montserrat-Bold',
    textDecorationLine: 'underline',
  },
  
  // SIMPLE 3D BUTTON STYLES (No Elevation to avoid Android shadow animation glitches)
  buttonSimple3D: {
    width: wp(25), 
    paddingVertical: hp(0.6), 
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    // Simple 3D Effect: solid bottom border without drop shadow elevation
    borderBottomWidth: hp(0.4),
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  buttonText3D: {
    fontSize: hp(2.0), 
    fontFamily: 'Montserrat-Bold',
  },
  
  finalLoginButtonSimple3D: {
    width: wp(65), 
    paddingVertical: hp(1),
    backgroundColor: '#934790',
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    // Simple 3D Effect
    borderBottomWidth: hp(0.6),
    borderBottomColor: '#5A2A58',
  },
  finalButtonText3D: {
    fontSize: hp(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
});





