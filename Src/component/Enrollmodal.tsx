import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

const { width, height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
};

export default function EnrollmentModal({ visible, onClose, onStart }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        useNativeDriver: true, 
        duration: 600 
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  const imageSource = require('../../assets/RelevantLaws.png'); 

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
      onRequestClose={() => onClose()}
    >
      <View style={styles.container}>
        
        {/* 1. Background Gradient */}
        <LinearGradient
          colors={["#4C1D95", "#6D28D9", "#A78BFA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 2. SVG Waves */}
        <Svg width={width} height={height} style={styles.bgSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <Defs>
            <SvgLinearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.98" />
              <Stop offset="1" stopColor="#F3E8FF" stopOpacity="0.92" />
            </SvgLinearGradient>
          </Defs>

           {/* Middle Wave */}
          <Path
            d={`M0 ${height * 0.58} 
               C ${width * 0.3} ${height * 0.52}, ${width * 0.6} ${height * 0.72}, ${width} ${height * 0.60} 
               L ${width} ${height} L 0 ${height} Z`}
            fill="#8B5CF6"
            opacity={0.5}
          />

          {/* Main Front Wave */}
          <Path
            d={`M0 ${height * 0.65} 
               C ${width * 0.25} ${height * 0.55}, ${width * 0.45} ${height * 0.78}, ${width * 0.7} ${height * 0.68} 
               C ${width * 0.85} ${height * 0.60}, ${width * 0.92} ${height * 0.68}, ${width} ${height * 0.65} 
               L ${width} ${height} L 0 ${height} Z`}
            fill="url(#whiteGrad)"
          />
        </Svg>

        {/* 3. Content */}
        <SafeAreaView style={styles.safe}>
          
          <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
              
              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.headline}>
                    ENROLLMENT{`\n`}BEGINS!
                </Text>
              </View>

              {/* Image */}
              <View style={styles.centralImageContainer}>
                <Image 
                    source={imageSource} 
                    style={styles.illustrationBig}
                    resizeMode="contain" 
                />
              </View>
              
              {/* Description */}
              <View style={styles.descriptionContainer}>
                  <Text style={styles.leadCentered}>
                  Enrollment period begins{'\n'}
                  <Text style={styles.highlightDate}>January 6 to 13, 2025.</Text>
                  </Text>
              </View>

          </Animated.View>

          {/* Buttons Footer */}
          <Animated.View style={[styles.footerContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity activeOpacity={0.9} style={styles.cta} onPress={onStart}>
              <LinearGradient colors={["#3B82F6", "#10B981"]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.ctaInner}>
                <Text style={styles.ctaText}>ENROLL NOW</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.maybe} onPress={onClose}>
              <Text style={styles.maybeText}>Maybe later</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closePill} onPress={onClose}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </View>
    </Modal>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4C1D95',
    width: width,
    height: height,
  },
  bgSvg: { 
    position: 'absolute', 
    left: 0, 
    top: 0,
    zIndex: 0,
    width: width,
    height: height,
  },
  safe: { 
    flex: 1, 
    zIndex: 10,
    justifyContent: 'space-between',
    paddingBottom: hp(2.5), // approx 20
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },

  // --- Header ---
  headerContainer: {
    alignItems: 'center',
    // INCREASED TOP MARGIN
    marginTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + hp(7.5) : hp(10), // approx 60/80
    paddingHorizontal: wp(5), // approx 20
  },
  headline: {
    fontSize: hp(4.5), // approx 44
    fontFamily: 'Montserrat-Bold', // Font (Black preferred if available)
    color: '#FFF8EA',
    textAlign: 'center',
    lineHeight: hp(6), // approx 48
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: hp(0.5) },
    textShadowRadius: 12,
  },

  // --- Image ---
  centralImageContainer: {
    height: height * 0.28, 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1.8), // approx 15
    // marginBottom: hp(1), // approx 10
  },
  illustrationBig: {
    width: '85%', 
    height: '100%', 
  },

  // --- Description ---
  descriptionContainer: {
    paddingHorizontal: wp(8), // approx 32
    alignItems: 'center',
    zIndex: 20,
  },
  leadCentered: { 
    color: 'rgba(255,255,255,0.98)', 
    fontSize: hp(2), // approx 18
    lineHeight: hp(3.2), // approx 26
    fontFamily: 'Montserrat-SemiBold', // Font
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: hp(0.25) },
    textShadowRadius: 4,
  },
  highlightDate: {
    fontFamily: 'Montserrat-Bold', // Font
    color: '#ffffff',
    fontSize: hp(2.5), // approx 20
  },

  // --- Footer (Buttons) ---
  footerContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(2), // approx 32"
    // marginTop: hp(5), // approx 16
    width: '100%',
    marginBottom: hp(6), // approx 90
  },
  cta: { 
    width: '90%',
    marginTop: hp(4), // approx 8
    borderRadius: wp(4), // approx 16
    overflow: 'hidden', 
    elevation: 10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginBottom: hp(2), // approx 16
  },
  ctaInner: { 
    paddingVertical: hp(2), // approx 18
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  ctaText: { 
    color: '#FFFFFF', 
    fontFamily: 'Montserrat-Bold', // Font
    fontSize: hp(2), // approx 16
    letterSpacing: 1,
  },
  maybe: { 
    paddingVertical: hp(1.5), // approx 12
    paddingHorizontal: wp(6), // approx 24
  },
  maybeText: { 
    color: '#6B7280', 
    fontFamily: 'Montserrat-Bold', // Font
    fontSize: hp(1.8), // approx 15
  },

  // --- Close Button ---
  closePill: {
    position: 'absolute',
    right: wp(5), // approx 20
    top: Platform.OS === 'android' ? hp(5) : hp(6), // approx 40/50
    width: wp(9), // approx 36
    height: wp(9),
    borderRadius: wp(4.5), // approx 18
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  closeTxt: { color: '#fff', fontSize: hp(1.75), fontFamily: 'Montserrat-Bold' }, // approx 14
});