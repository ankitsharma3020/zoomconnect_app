import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';
import { hp, wp } from '../utilites/Dimension';

const { width } = Dimensions.get('window');
// Adjusted width to show approx 2.2 cards on screen like the screenshot
const CARD_WIDTH = Math.round(width * 0.42); 
const CARD_SPACING = 12;

const promos = [
  {
    id: 'p1',
    provider: 'HEALTHIANS',
    title: 'Flat 50% Off',
    subtitle: 'Full body check up at home collection',
    logo: 'https://cdn-icons-png.flaticon.com/128/2966/2966327.png', // Lab icon
    logoBg: '#4F9A94', // Teal color
  },
  {
    id: 'p2',
    provider: 'MEDIBUDDY',
    title: 'Free Consult',
    subtitle: 'Online doctor consultation',
    logo: 'https://cdn-icons-png.flaticon.com/128/3004/3004458.png', // Doctor icon
    logoBg: '#FFC107', // Amber color
  },
  {
    id: 'p3',
    provider: 'THYROCARE',
    title: 'Buy 1 Get 1',
    subtitle: 'On all blood test packages',
    logo: 'https://cdn-icons-png.flaticon.com/128/3209/3209074.png', // Test tube icon
    logoBg: '#FF6F61', // Coral color
  },
  {
    id: 'p4',
    provider: 'PRACTO',
    title: '₹200 OFF',
    subtitle: 'On specialist appointments',
    logo: 'https://cdn-icons-png.flaticon.com/128/387/387561.png', // Stethoscope icon
    logoBg: '#5E5CE6', // Purple color
  },
];

const CardPattern = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="1" fill="#F3F4F6" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dots)" />
      {/* Decorative Circles for subtle depth */}
      <Circle cx="100%" cy="0" r="60" fill="rgba(243, 244, 246, 0.6)" />
      <Circle cx="0" cy="100%" r="40" fill="rgba(243, 244, 246, 0.6)" />
    </Svg>
  </View>
);

export default function PromoCarousel3() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const onMomentum = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    setActiveIdx(idx);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header Title */}
        <Text style={styles.headerTitle}>Healthcare benefits</Text>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onMomentumScrollEnd={onMomentum}
        >
          {promos.map((p, i) => (
            <TouchableOpacity 
              activeOpacity={0.9} 
              key={p.id} 
              style={[
                styles.card, 
                { marginRight: i === promos.length - 1 ? 0 : CARD_SPACING }
              ]}
            >
              <CardPattern />
              <View style={styles.cardTop}>
                {/* Logo container with dynamic background color */}
                <View style={[styles.logoWrap, { backgroundColor: p.logoBg }]}>
                  <Image 
                    source={{ uri: p.logo }} 
                    style={styles.logo} 
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.provider}>{p.provider}</Text>
                <Text style={styles.title}>{p.title}</Text>
                <Text numberOfLines={2} style={styles.subtitle}>{p.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.dots}>
          {promos.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIdx ? styles.dotActive : null]} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { width: '100%' },
  container: {
    paddingVertical: hp(1.2), // approx 10
    marginTop: hp(1.2), // approx 10
    height: hp(31), // approx 270
    alignItems: 'flex-start', 
  },
  headerTitle: {
    fontSize: hp(2), // approx 20
    fontFamily: 'Montserrat-Bold', // Font
    color: '#1F2937',
    marginLeft: wp(5), // approx 20
    marginBottom: hp(2), // approx 16
  },
  card: {
    width: CARD_WIDTH,
    height: hp(19.5), // approx 180
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5), // approx 20
    borderWidth: 1,
    borderColor: '#F3F4F6', 
    padding: wp(2.5), // approx 16
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    justifyContent: 'space-between',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: hp(1.5), // approx 12
  },
  logoWrap: {
    width: wp(12), // approx 48
    // backgroundColor:'red',
    height: wp(11.3),
    borderRadius: wp(3), // approx 12
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: wp(5), // approx 28
    height: wp(5),
    tintColor: '#FFFFFF', 
  },

  cardBody: {
    flex: 1,
    // justifyContent: 'center',
  },
  provider: {
    fontSize: hp(1), // approx 10
    color: '#9CA3AF', 
    fontFamily: 'Montserrat-Bold', // Font
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: hp(0.75), // approx 6
  },
  title: {
    fontSize: hp(1.3), // approx 18
    color: '#1F2937', 
    fontFamily: 'Montserrat-Bold', // Font
    marginBottom: hp(0.75), // approx 6
  },
  subtitle: {
    fontSize: hp(1.2), // approx 13
    color: '#4B5563', 
    lineHeight: hp(2.2), // approx 18
    fontFamily: 'Montserrat-Bold', // Font
  },

  dots: {
    flexDirection: 'row',
    marginTop: hp(2), // approx 16
    marginLeft: wp(6), // approx 24
    alignItems: 'center',
  },
  dot: {
    width: wp(1.5), // approx 6
    height: wp(1.5),
    borderRadius: wp(0.75), // approx 3
    backgroundColor: '#E5E7EB',
    marginHorizontal: wp(0.75), // approx 3
  },
  dotActive: {
    backgroundColor: '#9CA3AF', 
    width: wp(4.5), // approx 18
    borderRadius: wp(0.75), // approx 3
  },
});