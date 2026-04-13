import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  UIManager,
  Image,
  Animated,
  Easing
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension'; 

// --- CUSTOM IMPORTS ---
import Header from '../component/header';
import ActivePolicyHeader from '../component/activpolicy';
import { useSelector } from 'react-redux';
import FastImage from '@d11/react-native-fast-image';

const { width } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); 
const HEADER_HEIGHT = Platform.OS === 'ios' ? hp(14) : hp(13);
const IMAGE_BASE_URL = 'https://portal.zoomconnect.co.in'; 

// Enable LayoutAnimation (Only if needed for other parts, but NOT for tabs)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- THEMES CONFIG ---
const THEMES = {
  BLUE: {
    gradient: ['#dbeafe', '#bfdbfe'], 
    shadowColor: '#3b82f6',
    textColor: '#1e40af',
    subTextColor: '#1d4ed8',
    tagBgColor: '#2563EB',
    tagTextColor: '#FFFFFF'
  },
  ORANGE: {
    gradient: ['#ffedd5', '#fed7aa'], 
    shadowColor: '#f97316',
    textColor: '#9a3412',
    subTextColor: '#c2410c',
    tagBgColor: '#EA580C',
    tagTextColor: '#FFFFFF'
  },
  GREEN: {
    gradient: ['#d1fae5', '#a7f3d0'], 
    shadowColor: '#10b981',
    textColor: '#065f46',
    subTextColor: '#047857',
    tagBgColor: '#059669',
    tagTextColor: '#FFFFFF'
  },
  PURPLE: {
    gradient: ['#ede9fe', '#ddd6fe'], 
    shadowColor: '#8b5cf6',
    textColor: '#5b21b6',
    subTextColor: '#6d28d9',
    tagBgColor: '#7C3AED',
    tagTextColor: '#FFFFFF'
  },
  DEFAULT: {
    gradient: ['#f3f4f6', '#e5e7eb'], 
    shadowColor: '#9ca3af',
    textColor: '#374151',
    subTextColor: '#4b5563',
    tagBgColor: '#4B5563',
    tagTextColor: '#FFFFFF'
  }
};

const getThemeByCategory = (categoryName) => {
  if (!categoryName) return THEMES.DEFAULT;
  const normalized = categoryName.toLowerCase();
  if (normalized.includes('doctor') || normalized.includes('consultation')) return THEMES.BLUE;
  if (normalized.includes('lab') || normalized.includes('test') || normalized.includes('checkup')) return THEMES.ORANGE;
  if (normalized.includes('pharmacy') || normalized.includes('medicine')) return THEMES.GREEN;
  if (normalized.includes('maternity') || normalized.includes('surgery') || normalized.includes('care')) return THEMES.PURPLE;
  return THEMES.DEFAULT;
};

// --- NEW COMPONENT: SHIMMER CARD ---
const ShimmerCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width], 
  });

  return (
    <View style={styles.shimmerWrapper}>
      <View style={styles.shimmerContainer}>
        {/* Background Base Color */}
        <View style={styles.shimmerBackground} />
        
        {/* Moving Gradient "Shine" */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX }] }
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

// --- COMPONENT: SHIMMER GRID WRAPPER ---
const WellnessShimmer = () => {
  // Render 6 dummy cards
  return (
    <View style={styles.cardsGrid}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <ShimmerCard key={key} />
      ))}
    </View>
  );
};

// --- MAIN SCREEN COMPONENT ---
const WellnessScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState('All');
  
  const { data: wellnessData, isLoading: loading } = useSelector((state: any) => state.wellness);
  console.log('Fetched Wellness Data:', wellnessData);
  
  const uniqueCategories = [
    'All', 
    ...new Set(wellnessData?.map(item => item.category?.category_name).filter(Boolean))
  ];

  const handleTabPress = (tab: string) => {
    // ❌ REMOVED LayoutAnimation here to fix the flickering/light color issue
    setSelectedTab(tab);
  };

  const filteredData = useMemo(() => {
    if (selectedTab === 'All') {
      return wellnessData;
    }
    return wellnessData.filter(item => item.category?.category_name === selectedTab);
  }, [selectedTab, wellnessData]);


const handleCardPress = (item) => {
    if (item?.webview_url) {
      navigation.navigate('WellnessWebRendering', { url:item?.webview_url, label:item?.wellness_name });
    
    }
  };
  return (
    <View style={styles.screenWrap}>
      <View style={styles.backgroundFill} />
      
      {/* Footer Text in Background */}
      <View pointerEvents="none" style={styles.fixedFooterWrap}>
        <Text style={styles.fixedFooterText}>WELLNESS</Text>
      </View>

      <View style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" translucent={false} />
        
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>
        
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingTop: HEADER_HEIGHT }
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ActivePolicyHeader
              title="Wellness"
              subtitle="Explore our health services."
              onBack={() => navigation?.goBack?.()}
              isEnhanced3D = {true}
              illustration={require('../../assets/Wellness.png')}
            />
          </View>

          {/* --- TABS --- */}
          {uniqueCategories.length > 0 && (
            <View style={styles.tabWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.tabContainer}
              >
                {uniqueCategories.map((tab) => {
                  const isSelected = selectedTab === tab;
                  return (
                    <TouchableOpacity 
                      key={tab} 
                      // Removed unnecessary layout props
                      style={[styles.tabButton, isSelected && styles.tabButtonSelected]}
                      onPress={() => handleTabPress(tab)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Services</Text>
          </View>
          
          {/* --- CONDITIONAL RENDERING: SHIMMER VS DATA --- */}
          {loading ? (
            <WellnessShimmer />
          ) : (
            <View style={styles.cardsGrid}>
              {filteredData?.map((item, index) => {
                const theme = getThemeByCategory(item.category?.category_name);
                
                let imageUrl = item.icon_url;
                if (imageUrl && !imageUrl.startsWith('http')) {
                  imageUrl = `${IMAGE_BASE_URL}${imageUrl}`;
                }
                let vendorLogo = item.vendor?.logo_url;

                return (
                  <View key={item.id || index} style={styles.cardWrapper}>
                    <TouchableOpacity
                      style={[styles.mainCardContainer, { shadowColor: theme.shadowColor }]}
                      onPress={() => handleCardPress(item)}
                      activeOpacity={0.95}
                    >
                      <LinearGradient
                        colors={theme.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardGradient}
                      >
                        <View style={styles.cardGradient1}>
                           <View style={styles.cardInner}>

                            {/* Discount Tag */}
                            {item.description && (
                              <View style={[
                                styles.tagContainer,
                                { backgroundColor: theme.tagBgColor }
                              ]}>
                                <Text style={[
                                  styles.tagText,
                                  { color: theme.tagTextColor }
                                ]}>
                                  {item.description}
                                </Text>
                              </View>
                            )}

                            {/* Top-Left Content */}
                            <View style={styles.topLeftContainer}>
                              {vendorLogo ? (
                                <View style={styles.logoBox}>
                                  <FastImage
                                    source={{ uri: vendorLogo }}
                                    style={styles.companyLogo}
                                    resizeMode="contain"
                                  />
                                </View>
                              ) : null}

                              <Text style={[styles.categoryLabel, { color: theme.subTextColor }]}>
                                {item.category?.category_name}
                              </Text>

                              <Text
                                style={[styles.cardTitle, { color: theme.textColor }]}
                                numberOfLines={3}
                              >
                                {item.wellness_name}
                              </Text>
                            </View>

                            {/* Bottom-Right Image */}
                            {imageUrl ? (
                              <FastImage
                                source={{ uri: imageUrl }}
                                style={styles.bottomRightImage}
                                resizeMode="cover"
                              />
                            ) : null}

                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrap: { flex: 1, backgroundColor: '#F8F9FD' },
  backgroundFill: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8F9FD' },
  safe: { flex: 1, zIndex: 1 },
  
  fixedHeaderWrapper: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, 
    elevation: 10, 
    backgroundColor: '#F8F9FD' 
  },
  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(6.25) }, 
   sectionContainer: { paddingHorizontal: wp(4) ,marginTop: hp(4),marginBottom: hp(4) },

  // --- TABS ---
  tabWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.2) },
  tabContainer: { paddingHorizontal: wp(6), paddingVertical: hp(2), alignItems: 'center' },
  tabButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    marginRight: wp(2.5),
    borderRadius: wp(5),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Removed Elevation/Shadow from default state to reduce flicker
  },
  tabButtonSelected: {
    backgroundColor: '#934790',
    borderColor: '#934790',
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: { 
    fontSize: hp(1.6),
    fontFamily: 'Montserrat-SemiBold',
    color: '#64748B' 
  },
  tabTextSelected: { 
    color: 'white', 
    fontFamily: 'Montserrat-Bold'
  },

  // --- GRID ---
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(6), marginBottom: hp(2) },
  sectionTitle: { 
    fontSize: hp(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#334155' 
  },
  cardsGrid: {
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: (width - wp(12)) / 2, // approx 48% width
    marginBottom: hp(2),
  },

  // --- CARDS ---
  mainCardContainer: {
    height: hp(23.75),
    borderRadius: wp(5),
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    flex: 1,
    borderRadius: wp(5),
  },
  cardGradient1: {
    flex: 1,
    borderRadius: wp(5),
    padding: wp(2.6),
  },
  cardInner: {
    flex: 1,
    position: 'relative',
  },
  
  topLeftContainer: {
    alignItems: 'flex-start',
    width: '70%', 
  },
  logoBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: wp(1.5),
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.25),
    marginBottom: hp(1),
    height: hp(3), 
    justifyContent: 'center'
  },
  companyLogo: {
    width: wp(15), 
    height: hp(2),
  },
  categoryLabel: {
    fontSize: hp(0.9),
    width: '80%',
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: hp(0.5),
    opacity: 0.9,
  },
  cardTitle: {
    fontSize: hp(1.5),
    fontFamily: 'Montserrat-Bold',
    lineHeight: hp(2),
  },
  bottomRightImage: {
    position: 'absolute',
    bottom: -hp(0.6),
    right: -wp(1.2),
    width: wp(28),
    height: hp(12),
  },
  tagContainer: {
    position: 'absolute', 
    top: -hp(0.25),
    right: -wp(1.8),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
    zIndex: 10,           
    elevation: 2,         
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: hp(0.12) },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tagText: {
    fontSize: hp(1),
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // --- SHIMMER STYLES ---
  shimmerWrapper: {
    width: (width - wp(12)) / 2,
    marginBottom: hp(2),
  },
  shimmerContainer: {
    height: hp(23.75),
    borderRadius: wp(5),
    overflow: 'hidden', // Essential for masking the gradient
    backgroundColor: '#E2E8F0', // Base gray color
    position: 'relative',
  },
  shimmerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E2E8F0',
  },

  // --- FOOTER ---
  fixedFooterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_TAB_HEIGHT + hp(3.7),
    alignItems: 'center',
    zIndex: 0, 
  },
  fixedFooterText: {
    fontSize: hp(5.5),
    fontFamily: 'Montserrat-Bold',
    color: 'rgba(15,17,32,0.04)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },
});

export default WellnessScreen;