import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  isEnhanced3D?: boolean; 
};

export default function ActivePolicyHeader({
  title = "Policies",
  subtitle = 'Find all your policies here.',
  illustration = { uri: 'https://i.imgur.com/6Iej2c3.png' },
  isEnhanced3D = false,
}: Props) {

  // Check if the image should get the massive 3D effect
  const illustrationUri = illustration?.uri || '';
  const isSpecialImage = 
    isEnhanced3D || 
    illustrationUri.includes('Home.png') || 
    illustrationUri.includes('policies.png');

  return (
    <View style={styles.shadowContainer}>
      
      <LinearGradient
        colors={['#E0E7FF', '#C7D2FE', '#A5B4FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.innerContainer}
      >
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Circle cx="0" cy="0" r={HEADER_HEIGHT * 1.2} fill="rgba(255,255,255,0.6)" />
          <Path
            d={`M${width} ${HEADER_HEIGHT} Q ${width * 0.7} ${HEADER_HEIGHT * 0.2} ${width * 0.4} ${HEADER_HEIGHT} Z`}
            fill="rgba(255,255,255,0.3)"
          />
          <Circle cx="85%" cy="20%" r={wp(3.7)} fill="rgba(255,255,255,0.4)" />
        </Svg>

        <View style={styles.contentRow}>
          <View style={styles.textColumn}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          
          <View style={styles.textSpacer} />
        </View>
      </LinearGradient>

      {/* Conditionally apply the massive 3D styling */}
      <View style={[
        styles.imageWrapper, 
        isSpecialImage && styles.enhancedImageWrapper
      ]}>
        <FastImage
          source={illustration}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
    height: HEADER_HEIGHT,
    marginTop: hp(1.2),
    backgroundColor: 'transparent', 
    overflow: 'visible',
    shadowColor: '#A5B4FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  innerContainer: {
    flex: 1, 
    borderRadius: wp(6), 
    overflow: 'hidden', 
    backgroundColor: '#fff',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5), 
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  // Increased spacer slightly to account for the much larger image
  textSpacer: {
    width: wp(30), 
  },
  title: {
    fontSize: hp(2),
    fontFamily: 'Montserrat-Bold', 
    fontWeight: Platform.select({ ios: '700', android: undefined }),
    color: '#4338CA', 
    letterSpacing: -0.5,
    marginBottom: hp(0.5),
  },
  subtitle: {
    fontSize: hp(1.2),
    color: '#6366F1', 
    fontFamily: 'Montserrat-SemiBold', 
    fontWeight: Platform.select({ ios: '600', android: undefined }),
    lineHeight: hp(2.2),
  },
  
  // --- BASE STYLES (For normal images) ---
  imageWrapper: {
    position: 'absolute',
    right: wp(4), 
    bottom: 0,    
    width: wp(26), 
    height: HEADER_HEIGHT * 1.35, 
    zIndex: 20, 
    shadowColor: '#1e1b4b',
    shadowOffset: { width: -4, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10, 
  },

  // --- MASSIVE 3D STYLES (For Home.png & policies.png) ---
  enhancedImageWrapper: {
    width: wp(30), // Significantly wider (up from 32)
    height: HEADER_HEIGHT * 1.3, // Almost double the height of the card!
    right: wp(1), // Pushed slightly right to balance the new massive size
    bottom: hp(1.5), // Lifted higher to make it look like it's floating above the card
    
    // Extreme Drop Shadow for Maximum Depth
    shadowColor: '#050514', // Nearly black for deep contrast
    shadowOffset: { width: -8, height: 16 }, // Casts a long shadow down and to the left
    shadowOpacity: 0.45, // Much darker shadow
    shadowRadius: 18, // Wide, soft blur on the shadow
    elevation: 24, // Android max elevation
  },
  
  illustration: {
    width: '100%',
    height: '100%',
  },
});