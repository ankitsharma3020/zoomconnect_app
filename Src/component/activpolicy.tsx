import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension';
import FastImage from '@d11/react-native-fast-image';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = hp(8.5);

type Props = {
  title?: string;
  subtitle?: string;
  illustration?: any;
};

export default function ActivePolicyHeader({
  title = "Policies",
  subtitle = 'Find all your policies here.',
  illustration = { uri: 'https://i.imgur.com/6Iej2c3.png' },
}: Props) {
  return (
    // 1. Outer Container: Handles Margins and Shadows ONLY
    <View style={styles.shadowContainer}>
      
      {/* 2. Inner Container: Handles Gradient, Border Radius, and Clipping */}
      <LinearGradient
        colors={['#E0E7FF', '#C7D2FE', '#A5B4FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.innerContainer}
      >
        {/* Decorative Background Pattern */}
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Circle
            cx="0"
            cy="0"
            r={HEADER_HEIGHT * 1.2}
            fill="rgba(255,255,255,0.6)"
          />
          <Path
            d={`M${width} ${HEADER_HEIGHT} Q ${width * 0.7} ${HEADER_HEIGHT * 0.2} ${width * 0.4} ${HEADER_HEIGHT} Z`}
            fill="rgba(255,255,255,0.3)"
          />
          <Circle
            cx="85%"
            cy="20%"
            r={wp(3.7)}
            fill="rgba(255,255,255,0.4)"
          />
        </Svg>

        <View style={styles.contentRow}>
          {/* Text Column */}
          <View style={styles.textColumn}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* Illustration */}
          <View style={styles.imageWrapper}>
            <FastImage
              source={illustration}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // FIX 1: Dedicated Shadow Container
 shadowContainer: {
    width: '100%',
    height: HEADER_HEIGHT,
    marginTop: hp(1.2),
    // 1. MUST BE TRANSPARENT ON IOS
    backgroundColor: 'transparent', 
    
    // iOS Shadow
    shadowColor: '#A5B4FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,

    // Android Shadow
    elevation: 8,
  },
  innerContainer: {
    // 2. This is the actual "Card"
    flex: 1, 
    borderRadius: wp(6), 
    overflow: 'hidden', 
    backgroundColor: '#fff', // Card background
  },
  contentRow: {
    flex: 1, // Use flex instead of height: 100%
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // 3. MOVE PADDING HERE instead of innerContainer
    paddingHorizontal: wp(5), 
  },
  textColumn: {
    flex: 1,
    paddingRight: wp(2),
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: hp(2),
    // Ensure this font name is the exact 'PostScript Name' on iOS
    fontFamily: 'Montserrat-Bold', 
    fontWeight: Platform.select({ ios: '700', android: undefined }), // Fallback weight
    color: '#4338CA', 
    letterSpacing: -0.5,
    marginBottom: hp(0.5),
  },
  subtitle: {
    fontSize: hp(1.2),
    color: '#6366F1', 
    fontFamily: 'Montserrat-SemiBold', 
    fontWeight: Platform.select({ ios: '600', android: undefined }), // Fallback weight
    lineHeight: hp(2.2),
  },
  imageWrapper: {
    width: wp(20),
    height: '100%', // Changed from 120% to avoid layout breaks
    justifyContent: 'center',
    alignItems: 'center',
    // Removed negative margin to prevent clipping issues
  },
  illustration: {
    width: '100%',
    height: '80%', // Scale image inside wrapper instead
  },
});