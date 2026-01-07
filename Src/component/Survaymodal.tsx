import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

const { width } = Dimensions.get('window');

// Color constants based on your request
const THEME_COLOR = '#934790';
const THEME_LIGHT = '#F5EBF4'; 

type Props = {
  visible: boolean;
  survey?: { name: string; description?: string };
  onClose: () => void;
  onStart: () => void;
};

export default function SurveyCardModal({ visible, survey, onClose, onStart }: Props) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 10 }),
        Animated.timing(fadeAnim, { toValue: 1, useNativeDriver: true, duration: 300 })
      ]).start();
    } else {
      scale.setValue(0.92);
      fadeAnim.setValue(0);
    }
  }, [visible, scale, fadeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.cardContainer, 
            { transform: [{ scale }], opacity: fadeAnim }
          ]}
        >
          {/* 0. Background Gradient & Pattern Layer */}
          <View style={styles.backgroundLayer}>
            <LinearGradient
              colors={[THEME_LIGHT, '#FFFFFF', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              {/* Subtle Pattern */}
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg height="100%" width="100%">
                  {/* Top Right Circle */}
                  <Circle cx="100%" cy="0" r={wp(30)} fill={THEME_COLOR} opacity="0.05" />
                  {/* Bottom Left Curve */}
                  <Path 
                    d="M-20,100 Q50,200 150,300" 
                    stroke={THEME_COLOR} 
                    strokeWidth="40" 
                    opacity="0.03" 
                    fill="none" 
                  />
                  {/* Small decorative circle */}
                  <Circle cx="10%" cy="40%" r={wp(2.5)} fill={THEME_COLOR} opacity="0.1" />
                </Svg>
              </View>
            </LinearGradient>
          </View>

          {/* 1. The Illustration (Popping out of the top) */}
          <View style={styles.illustrationWrapper}>
            <Image 
              source={require('../../assets/survey_vector1.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* 2. Content */}
          <View style={styles.contentContainer}>
            {/* Spacer to push text down below image */}
            <View style={{ height: hp(16) }} /> 

            <Text style={styles.title}>{survey?.name || 'Employee Survey'}</Text>
            
            <Text style={styles.description}>
             {survey?.description || 'This is a short survey to help us improve — it takes 2-3 minutes.'}
            </Text>

            {/* 3. Buttons Row */}
            <View style={styles.buttonRow}>
              
              {/* Take Survey Button (Purple) */}
              <TouchableOpacity activeOpacity={0.8} style={styles.btnPrimary} onPress={onStart}>
                <Text style={styles.btnPrimaryText}>Take Survey</Text>
              </TouchableOpacity>

              {/* Cancel Button (White) */}
              <TouchableOpacity activeOpacity={0.8} style={styles.btnSecondary} onPress={onClose}>
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              
            </View>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5), // approx 20
  },
  cardContainer: {
    width: '100%',
    maxWidth: wp(95), // approx 390
    borderRadius: wp(8), // approx 32
    alignItems: 'center',
    // Important: overflow visible allows the image to pop out
    overflow: 'visible', 
    shadowColor: '#934790', // Colored shadow for glow effect
    shadowOffset: { width: 0, height: hp(1.5) }, // approx 12
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    paddingBottom: hp(3.75), // approx 30
    backgroundColor: 'transparent', // Background handled by inner layer
  },

  /* Background Layer - Mimics the card shape */
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: wp(8), // approx 32
    overflow: 'hidden', 
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  
  /* --- Illustration --- */
  illustrationWrapper: {
    position: 'absolute',
    top: -hp(11), // approx -90
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  illustration: {
    width: wp(85), // approx 340
    height: hp(30), // approx 240
  },

  /* --- Content --- */
  contentContainer: {
    width: '100%',
    paddingHorizontal: wp(6), // approx 24
    alignItems: 'center',
  },
  title: {
    fontSize: hp(2.7), // approx 24
    fontFamily: 'Montserrat-Bold', // Font
    color: '#2D1A2E', 
    textAlign: 'center',
    marginBottom: hp(1.2), // approx 10
    letterSpacing: -0.5,
  },
  description: {
    fontSize: hp(1.7), // approx 15
    color: '#6B5B6B', 
    textAlign: 'center',
    marginBottom: hp(4), // approx 32
    fontFamily: 'Montserrat-SemiBold', // Font
    lineHeight: hp(2.75), // approx 22
  },

  /* --- Buttons --- */
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp(2.5), // approx 10
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#c91e62cc',
    paddingVertical: hp(1), // approx 16
    borderRadius: wp(25), // approx 99
    marginRight: wp(2), // approx 8
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: hp(0.5)},
    shadowRadius: 8,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: hp(1.7), // approx 16
    fontFamily: 'Montserrat-Bold', // Font
  },
  btnSecondary: {
    // flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(1), // approx 16
    paddingHorizontal: wp(6), // approx 24
    borderRadius: wp(25), // approx 99
    marginLeft: wp(2), // approx 8
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EFE6EE', 
    elevation: 1,
  },
  btnSecondaryText: {
    color: THEME_COLOR, 
    fontSize: hp(1.7), // approx 16
    fontFamily: 'Montserrat-Bold', // Font
  },
});