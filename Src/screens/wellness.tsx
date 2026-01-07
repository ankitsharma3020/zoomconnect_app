import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension'; 

// --- CUSTOM IMPORTS ---
import Header from '../component/header';
import ActivePolicyHeader from '../component/activpolicy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetApi } from '../component/Apifunctions';

const { width } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); 

// Domain for appending to relative image paths
const IMAGE_BASE_URL = 'https://portal.zoomconnect.co.in'; 

// Enable LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- 1. DEFINE COLOR THEMES ---
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

// --- 2. HELPER TO ASSIGN THEMES BASED ON CATEGORY ---
const getThemeByCategory = (categoryName) => {
  if (!categoryName) return THEMES.DEFAULT;
  
  const normalized = categoryName.toLowerCase();
  
  if (normalized.includes('doctor') || normalized.includes('consultation')) return THEMES.BLUE;
  if (normalized.includes('lab') || normalized.includes('test') || normalized.includes('checkup')) return THEMES.ORANGE;
  if (normalized.includes('pharmacy') || normalized.includes('medicine')) return THEMES.GREEN;
  if (normalized.includes('maternity') || normalized.includes('surgery') || normalized.includes('care')) return THEMES.PURPLE;

  return THEMES.DEFAULT;
};

// --- MAIN COMPONENT ---

const WellnessScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [wellnessData, setWellnessData] = useState([]); // Store raw API list
  const [tabs, setTabs] = useState(['All']); // Dynamic tabs
  const [loading, setLoading] = useState(true);

  const WELLNESS_URL = '/wellness-services';

  // --- FETCH DATA ---
  const fetchWellness = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const response = await GetApi(WELLNESS_URL, {}, token);
      
      // Assuming response is the array provided in prompt. 
      // If response is { data: [...] }, change to response.data
      const data = response || []; 
      
      setWellnessData(data?.data?.services);

      // --- EXTRACT UNIQUE CATEGORIES FOR TABS ---
      const uniqueCategories = [
        'All', 
        ...new Set(data?.data?.services.map(item => item.category?.category_name).filter(Boolean))
      ];
      setTabs(uniqueCategories);

    } catch (error) {
      console.error('Wellness fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWellness();
  }, []);

  const handleTabPress = (tab: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTab(tab);
  };

  const handleCardPress = (item: any) => {
    console.log('Navigate to service:', item.wellness_name);
    // navigation.navigate('ServiceDetails', { serviceData: item });
  };

  // --- FILTER DATA BASED ON TAB ---
  const filteredData = useMemo(() => {
    if (selectedTab === 'All') {
      return wellnessData;
    }
    return wellnessData.filter(item => item.category?.category_name === selectedTab);
  }, [selectedTab, wellnessData]);

  return (
    <View style={styles.screenWrap}>
      <View style={styles.backgroundFill} />

      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" translucent={false} />
        
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ActivePolicyHeader
              title="Wellness"
              subtitle="Explore our health services."
              onBack={() => navigation?.goBack?.()}
              illustration={require('../../assets/policies.png')}
            />
          </View>

          {/* --- DYNAMIC TABS --- */}
          {tabs.length > 0 && (
            <View style={styles.tabWrapper}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.tabContainer}
              >
                {tabs.map((tab) => {
                  const isSelected = selectedTab === tab;
                  return (
                    <TouchableOpacity 
                      key={tab} 
                      style={[styles.tabButton, isSelected && styles.tabButtonSelected]}
                      onPress={() => handleTabPress(tab)}
                      activeOpacity={0.7}
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
          
          {/* --- LOADING STATE --- */}
          {loading ? (
            <ActivityIndicator size="large" color="#934790" style={{marginTop: 20}} />
          ) : (
            /* --- CARD GRID --- */
            <View style={styles.cardsGrid}>
              {filteredData?.map((item, index) => {
                
                // Get Theme based on Category Name
                const theme = getThemeByCategory(item.category?.category_name);
                
                // Construct Image URL (Handle relative paths)
                let imageUrl = item.icon_url;
                if (imageUrl && !imageUrl.startsWith('http')) {
                  imageUrl = `${IMAGE_BASE_URL}${imageUrl}`;
                }

                // Construct Vendor Logo URL
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

                          {/* ----- Discount Tag (Description field) ----- */}
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

                          {/* Top-Left: Logo & Text */}
                          <View style={styles.topLeftContainer}>
                            {/* Vendor Logo */}
                            {vendorLogo ? (
                               <View style={styles.logoBox}>
                                 <Image
                                   source={{ uri: vendorLogo }}
                                   style={styles.companyLogo}
                                   resizeMode="contain" // Changed to contain for logos
                                 />
                               </View>
                            ) : null}

                            {/* Category Name */}
                            <Text style={[styles.categoryLabel, { color: theme.subTextColor }]}>
                              {item.category?.category_name}
                            </Text>

                            {/* Service Name */}
                            <Text
                              style={[styles.cardTitle, { color: theme.textColor }]}
                              numberOfLines={3}
                            >
                              {item.wellness_name}
                            </Text>
                          </View>

                          {/* Bottom-Right: Service Illustration */}
                          {imageUrl ? (
                             <Image
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

        <View pointerEvents="none" style={styles.fixedFooterWrap}>
          <Text style={styles.fixedFooterText}>WELLNESS</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrap: { flex: 1, backgroundColor: '#F8F9FD' },
  backgroundFill: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F8F9FD' },
  safe: { flex: 1, zIndex: 1 },
  fixedHeaderWrapper: { zIndex: 10, backgroundColor: '#F8F9FD' },
  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(6.25) }, 
  sectionContainer: { paddingHorizontal: Platform.OS === 'ios' ? 0 : wp(4), marginBottom: hp(1.2) },

  // Tabs
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

  // Grid
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

  // Cards
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
  
  // Top Left Layout
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
    height: hp(3), // Fixed height for logo container
    justifyContent: 'center'
  },
  companyLogo: {
    width: wp(15), 
    height: hp(2),
  },
  categoryLabel: {
    fontSize: hp(1.1),
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

  // Bottom Right Image
  bottomRightImage: {
    position: 'absolute',
    bottom: -hp(0.6),
    right: -wp(1.2),
    width: wp(28),
    height: hp(12),
  },

  fixedFooterWrap: {
    marginTop: hp(3),
    left: 0,
    right: 0,
    bottom: BOTTOM_TAB_HEIGHT + hp(1.5),
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
});

export default WellnessScreen;