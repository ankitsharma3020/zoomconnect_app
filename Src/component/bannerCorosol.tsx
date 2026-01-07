import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

const { width } = Dimensions.get('window');

// --- DUMMY DATA ---
const DATA = [
  {
    id: '1',
    title: 'Talk to Doctor',
    description: 'Connect with top specialists instantly for free.',
    discount: '100% OFF',
    image: require('../../assets/talktodocb.png'),
    gradient: ['#4338ca', '#6366f1'],
    bgColor: '#4338ca',
    navigation:'DoconCall'
  },
  // {
  //   id: '2',
  //   title: 'Pharmacy Delivery',
  //   description: 'Genuine medicines at your doorstep.',
  //   discount: 'Flat 50% OFF',
  //   image: require('../../assets/pharmacbanner.png'),
  //   gradient: ['#be123c', '#fb7185'],
  //   bgColor: '#be123c',
  // },
  // {
  //   id: '3',
  //   title: 'Lab Tests at Home',
  //   description: 'Safe & hygienic sample collection.',
  //   discount: 'Start Free',
  //   image: require('../../assets/labtestb.png'),
  //   gradient: ['#c2410c', '#fbbf24'],
  //   bgColor: '#c2410c',
  // },
];

// --- CONFIGURATION CONSTANTS ---
const SPACING = wp(3); // approx 12
const ITEM_WIDTH_CAROUSEL = width * 0.85; // Normal width
const ITEM_WIDTH_SINGLE = width * 0.94; // Wider width for single item

export default function BannerCarousel() {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Determine Layout Logic based on Data Length
  const isSingleItem = DATA.length === 1;
  
  // Calculate dynamic dimensions
  const cardWidth = isSingleItem ? ITEM_WIDTH_SINGLE : ITEM_WIDTH_CAROUSEL;
  const snapInterval = cardWidth + SPACING;
  const sideSpacer = (width - cardWidth) / 2;

  // 2. Auto-scroll logic (Disabled if single item)
  useEffect(() => {
    if (isSingleItem) return; 

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= DATA.length) {
        nextIndex = 0;
      }

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * snapInterval,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, isSingleItem, snapInterval]);

  const handleMomentumScrollEnd = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / snapInterval);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        bounces={false}
        scrollEnabled={!isSingleItem} // Disable scroll gesture if single
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {/* Left Spacer (only needed if centering multiple items) */}
        <View style={{ width: sideSpacer - SPACING / 2 }} />

        {DATA.map((item, index) => {
          const inputRange = [
            (index - 1) * snapInterval,
            index * snapInterval,
            (index + 1) * snapInterval,
          ];

          // If single item, we force values to static "Active" state
          const scale = isSingleItem ? 1 : scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: 'clamp',
          });

          const opacity = isSingleItem ? 1 : scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });
          
          const translateX = isSingleItem ? 0 : scrollX.interpolate({
            inputRange,
            outputRange: [wp(5), 0, -wp(5)], // approx 20
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.cardContainer,
                {
                  width: cardWidth, // Apply dynamic width here
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <TouchableOpacity onPress={()=>navigation.navigate(item.navigation)} activeOpacity={0.8} >
                  <LinearGradient
                colors={item.gradient}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View  style={styles.card1}>
                   <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{item.discount}</Text>
                    </View>
                 </View>
                 
                 <Animated.Image 
                    source={item.image} 
                    style={[styles.image, { transform: [{ translateX }] }]} 
                    resizeMode="cover" 
                 />
                 
                 <View style={styles.decorativeCircle} />
                </View>
                
              </LinearGradient>

              </TouchableOpacity>
            
            </Animated.View>
          );
        })}
        
        {/* Right Spacer */}
        <View style={{ width: sideSpacer - SPACING / 2 }} />
      </Animated.ScrollView>

      {/* Pagination Indicators - HIDE if single item */}
      {!isSingleItem && (
        <View style={styles.paginationContainer}>
          {DATA.map((_, index) => {
            const inputRange = [
              (index - 1) * snapInterval,
              index * snapInterval,
              (index + 1) * snapInterval,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [wp(2), wp(6), wp(2)], // approx 8, 24, 8
              extrapolate: 'clamp',
            });

            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: ['#D1D5DB', DATA[index].gradient[1], '#D1D5DB'], 
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { width: dotWidth, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(2.5), // approx 20
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: hp(1.2), // approx 10
  },
  cardContainer: {
    // Width is now handled inline in the component to support dynamic sizing
    marginHorizontal: SPACING / 2,
  },
  card: {
    height: Platform.OS === 'ios' ? hp(16.5) : hp(17.5), // approx 170
    borderRadius: wp(6), // approx 24
   
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp(1), // approx 8
    },
    shadowOpacity: 0.3, 
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
  },
   card1: {
    // height: Platform.OS === 'ios' ? hp(16.5) : hp(17.5), // approx 170
    borderRadius: wp(6), // approx 24
    padding: wp(4), // approx 16
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp(1), // approx 8
    },
    shadowOpacity: 0.3, 
    shadowRadius: 12,
    elevation: 2,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    zIndex: 2,
    paddingRight: wp(2.5), // approx 10
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(2), // approx 22
    fontFamily: 'Montserrat-Bold', // Font
    color: '#FFF',
    marginBottom: hp(0.5), // approx 4
    textShadowColor: 'rgba(0,0,0,0.3)', 
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: hp(1.3), // approx 13
    fontFamily: 'Montserrat-SemiBold', // Font
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: hp(1.5), // approx 12
    lineHeight: hp(2.2), // approx 18
  },
  discountBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: wp(1.5), // approx 10
    paddingVertical: hp(0.75), // approx 6
    borderRadius: wp(2), // approx 8
    alignSelf: 'flex-start',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
  },
  discountText: {
    fontSize: hp(1.3), // approx 12
    fontFamily: 'Montserrat-Bold', // Font
    color: '#1F2937',
    textTransform: 'uppercase',
  },
  image: {
    width: wp(22), // approx 120
    height: hp(15.5), // approx 150
    zIndex: 3,
  },
  decorativeCircle: {
    position: 'absolute',
    right: -wp(10), // approx -40
    top: -hp(5), // approx -40
    width: wp(50), // approx 200
    height: wp(50), // approx 200
    borderRadius: wp(25), // approx 100
    backgroundColor: 'rgba(255,255,255,0.08)',
    zIndex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1.5), // approx 12
  },
  dot: {
    height: hp(0.75), // approx 6
    borderRadius: hp(0.375), // approx 3
    marginHorizontal: wp(1), // approx 4
  },
});