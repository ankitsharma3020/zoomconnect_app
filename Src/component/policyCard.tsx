import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension';

const { width } = Dimensions.get('window');

const CARD_HORIZONTAL_PADDING = wp(4);
const CARD_WIDTH = width * 0.82;
const CARD_HEIGHT_COLLAPSED = hp(26);
const SPACER = wp(3.5);

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PolicyCard = ({ p, index, scrollX, navigation }) => {
  const [expanded, setExpanded] = useState(false);

  // Animation Refs
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnim = (anim, distance, duration) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -distance, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ]),
      ).start();
    };
    loopAnim(floatA, 6, 2200);
    loopAnim(floatB, 10, 3000);
    loopAnim(floatC, 4, 1800);
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleDownload = () => {
    if (p.download_e_card_url) {
      Linking.openURL(p.download_e_card_url).catch(err => 
        Alert.alert("Error", "Could not open download link")
      );
    } else {
      Alert.alert("Unavailable", "Download link is not available for this policy.");
    }
  };

  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACER),
    index * (CARD_WIDTH + SPACER),
    (index + 1) * (CARD_WIDTH + SPACER),
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.94, 1, 0.94],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.75, 1, 0.75],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.cardShadowContainer,
        {
          transform: [{ scale }],
          opacity,
          // If NOT expanded, force height. If expanded, let it contain content (null/undefined).
          // height: expanded ? undefined : CARD_HEIGHT_COLLAPSED, 
        },
      ]}
    >
      {/* This Inner View handles the Border Radius & Clipping. 
         It stretches to fill the ShadowContainer.
      */}
      <View style={styles.cardBorderClipper}>
        
        {/* Gradient must have flex: 1 to fill the Clipper completely.
           This ensures the gradient IS the background.
        */}
        <LinearGradient
          colors={['#FAF7FB', '#EDE9F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fullCardGradient}
        >
          <View style={styles.fullCardGradient}>
                <View style={styles.accentCircle} />
          <Animated.View style={[styles.bubble1, { transform: [{ translateY: floatA }] }]} />
          <Animated.View style={[styles.bubble2, { transform: [{ translateY: floatB }] }]} />
          <Animated.View style={[styles.bubble3, { transform: [{ translateY: floatC }] }]} />

          {/* Content Area */}
          <View style={styles.contentContainer}>
            <View style={styles.textBlock}>
              <Text numberOfLines={1} style={styles.title}>
                {p.policy_name}
              </Text>

              <View style={styles.rowTwoCol}>
                <View style={styles.colItem}>
                  <Text style={styles.colLabel}>Base SI</Text>
                  <Text style={styles.colValue}>{p?.cover_string?.total_base_sum_insured}</Text>
                </View>
                <View style={styles.colItem}>
                  <Text style={styles.colLabel}>Top-up</Text>
                  <Text style={styles.colValue}>{p?.cover_string?.total_topup_sum_insured}</Text>
                </View>
              </View>

              <Text style={styles.policyNumber}>
                Policy No:{' '}
                <Text style={{ fontFamily: 'Montserrat-Bold' }}>{p.policy_number}</Text>
              </Text>

              <View style={[styles.rowTwoCol, { marginTop: hp(1.2) }]}>
                {/* Insured By */}
                <TouchableWithoutFeedback onPress={toggleExpand}>
                  <View style={styles.colItem}>
                    <Text style={styles.colLabel}>Insured by</Text>
                    <Text 
                      numberOfLines={expanded ? undefined : 1} 
                      style={styles.colValue}
                    >
                      {p.insurance_company_name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                {/* TPA */}
                <TouchableWithoutFeedback onPress={toggleExpand}>
                  <View style={styles.colItem}>
                    <Text style={styles.colLabel}>TPA</Text>
                    <Text 
                      numberOfLines={expanded ? undefined : 1} 
                      style={styles.colValue}
                    >
                      {p.tpa_company_name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <TouchableOpacity
                style={styles.cta}
                onPress={() => navigation.navigate('policydetails', { policy: p })}
              >
                <Text style={styles.ctaText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleDownload} style={styles.downloadIconWrap}>
              <MaterialCommunityIcons
                name="download"
                size={hp(2.8)}
                color="#934790"
              />
            </TouchableOpacity>
          </View>
          </View>
          {/* Background Decorations */}
       
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function PolicyCardList(Policydata) {
  const policyList = Policydata?.Policydata || [];
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACER));
    setActiveIndex(index);
  };

  return (
    <View>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACER}
        decelerationRate="fast"
        scrollEventThrottle={16}
        // iOS Fix: Ensure padding is applied here so shadow isn't cut
        contentContainerStyle={styles.scrollContainer}
        // iOS Fix: Allow shadows to bleed outside scroll view bounds vertically
        overflow="visible" 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {policyList.map((p, index) => (
          <PolicyCard 
            key={p.id || index} 
            p={p} 
            index={index} 
            scrollX={scrollX} 
            navigation={navigation} 
          />
        ))}
      </Animated.ScrollView>

      {policyList.length > 1 && (
        <View style={styles.dotsRow}>
          {policyList.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingVertical: hp(2.5), // Increased vertical padding to prevent shadow clipping
    alignItems: 'center', // Helps center cards vertically
  },
  // 1. The Container for Shadow and Size
  cardShadowContainer: {
    width: CARD_WIDTH,
    marginRight: SPACER,
    // No background color here! transparent ensures shadow works right.
    backgroundColor: 'transparent',
    
    // iOS Shadow Props
    shadowColor: '#2A1F3D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    
    // Android Elevation
    elevation: 6,
  },
  // 2. The Container for Clipping (Border Radius)
  cardBorderClipper: {
    flex: 1, // Fill the shadow container
    borderRadius: wp(4.5),
    overflow: 'hidden', // This cuts off the corners of the gradient
    backgroundColor: '#FAF7FB', // Fallback color
  },
  // 3. The Gradient Background
  fullCardGradient: {
    flex: 1, // CRITICAL: This forces gradient to fill the clipper completely
    width: '100%',
  },
    fullCardGradient1: {
 // CRITICAL: This forces gradient to fill the clipper completely
   padding: wp(8.5),
    // width: '100%',
  },
  // 4. Content Padding Wrapper (Inside Gradient)
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: wp(4.5), // Padding is applied here, INSIDE the gradient
  },
  
  // Decorative Elements
  accentCircle: {
    position: 'absolute',
    right: wp(3.5),
    top: hp(1.5),
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: 'rgba(147, 71, 144, 0.08)',
  },
  bubble1: {
    position: 'absolute',
    left: wp(4.5),
    top: hp(3),
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: 'rgba(147, 71, 144, 0.06)',
  },
  bubble2: {
    position: 'absolute',
    left: wp(18),
    top: hp(7.5),
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: 'rgba(147, 71, 144, 0.05)',
  },
  bubble3: {
    position: 'absolute',
    left: wp(9),
    bottom: hp(5.2),
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(76, 127, 255, 0.05)',
  },

  // Text Styling
  textBlock: { flex: 1 },
  title: {
    fontSize: hp(1.8),
    fontFamily: 'Montserrat-Bold',
    color: '#2A1F3D',
    marginBottom: hp(1.2),
  },
  rowTwoCol: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    flexWrap: 'wrap' 
  },
  colItem: { width: '48%' },
  colLabel: { 
    fontSize: hp(1.2), 
    fontFamily: 'Montserrat-Regular', 
    color: '#7D6D8A' 
  },
  colValue: { 
    fontSize: hp(1.3), 
    fontFamily: 'Montserrat-SemiBold', 
    color: '#4A2E67', 
    marginTop: hp(0.25),
    lineHeight: hp(2) 
  },
  policyNumber: { 
    marginTop: hp(1.2), 
    fontSize: hp(1.4), 
    fontFamily: 'Montserrat-Regular', 
    color: '#6B5C79' 
  },
  cta: {
    backgroundColor: '#934790',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.2),
    borderRadius: wp(2),
    marginTop: hp(1.4),
    alignSelf: 'flex-start',
  },
  ctaText: { 
    color: '#fff', 
    fontFamily: 'Montserrat-Bold', 
    fontSize: hp(1.5) 
  },
  downloadIconWrap: {
    position: 'absolute',
    bottom: hp(1), // Position relative to contentContainer
    right: wp(0),
    zIndex: 20,
    backgroundColor: '#ffffffcc',
    padding: wp(1.5),
    borderRadius: wp(5),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(0.5),
    marginBottom: hp(2),
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#d3c5e0',
    marginHorizontal: wp(1),
  },
  dotActive: {
    backgroundColor: '#934790',
    width: wp(5),
  },
});