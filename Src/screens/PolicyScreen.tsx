import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Path, Rect, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension';

// Components
import PolicyCardList from '../component/policyCard';
import ActivePolicyHeader from '../component/activpolicy';
import EnrollmentModal from '../component/Enrollmodal';
import SurveyModal from '../component/Survaymodal';
import Header from '../component/header';
import { useGetNewProfileQuery } from '../redux/service/user/user';
import { GetApi } from '../component/Apifunctions';

const { width, height } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- 1. Shimmer Component ---
const PolicyShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.shimmerCard}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const PolicyScreen = () => {
  const navigation = useNavigation();
  
  // State
  const [claimExpanded, setClaimExpanded] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [enrollmentStarted, setEnrollmentStarted] = useState(false);
  const [surveyStarted, setSurveyStarted] = useState(false);
  
  // Policy Data State
  const [PolicyData, setPolicyData] = useState(null);
  const [policyLoading, setPolicyLoading] = useState(true); // Added loading state

  const { data, error, isLoading } = useGetNewProfileQuery();

  const toggleClaim = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setClaimExpanded((s) => !s);
  };
  
  const POLICY_URL = '/employee-policies';

  const fetchPolicy = async () => {
    try {
      setPolicyLoading(true); // Start loading
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const response = await GetApi(POLICY_URL, {}, token);
      setPolicyData(response);
    } catch (error) {
      console.error('Profile error:', error);
    } finally {
      setPolicyLoading(false); // Stop loading regardless of success/fail
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const claimSummary = "Steps to file a medical claim & track status.";
  const claimFullText = "Learn about the steps to file a medical claim and track its status easily. Our process is designed to be simple, transparent, and quick.";

  const enrollment = {
    title: 'Enrollment is open',
    startDate: '01 Nov 2025',
    endDate: '30 Nov 2025',
    description: 'Your enrollment window is open. Complete it before the end date.',
  };
  
  const survey = {
    name: 'Employee Wellness Survey',
    endDate: '25 Nov 2025',
    description: 'A quick 5-minute survey to help us improve benefits.',
  };

  return (
    <View style={styles.screenWrap}>
      {/* --- Decorative Global Pattern --- */}
      <View pointerEvents="none" style={styles.patternWrap}>
        <LinearGradient
          colors={['#F6F7FB', '#F0ECF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <Pattern id="diags" patternUnits="userSpaceOnUse" width="20" height="20">
              <Path d="M0 20 L20 0" stroke="rgba(147,71,144,0.02)" strokeWidth="2" />
            </Pattern>
          </Defs>
          <Rect x={0} y={0} width={width} height={height * 0.35} fill="rgba(147,71,144,0.02)" />
          <Rect x={0} y={height * 0.55} width={width} height={height * 0.15} fill="rgba(147,71,144,0.015)" />
          <Rect x={0} y={0} width={width} height={height} fill="url(#diags)" opacity={0.05} />
        </Svg>
      </View>

      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        
        {/* --- FIXED HEADER --- */}
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* --- Active Policy Header --- */}
          <View style={styles.sectionContainer}>
            <ActivePolicyHeader
              title="Policies"
              subtitle="Find all your policies here."
              onBack={() => navigation?.goBack?.()}
              illustration={require('../../assets/policies.png')}
            />
          </View>

          {/* --- 2. Conditional Rendering Logic --- */}
          <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
            {policyLoading ? (
              // Case 1: Loading -> Show Shimmer
              <PolicyShimmer />
            ) : PolicyData?.data?.policy_details?.length > 0 ? (
              // Case 2: Has Data -> Show List
              <PolicyCardList Policydata={PolicyData?.data?.policy_details} />
            ) : (
              // Case 3: No Data -> Show "No Policies" Card
              <View style={styles.card}>
                <Image
                  source={require('../../assets/policynotfound.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>No Policies yet</Text>
                  <Text style={styles.subtitle}>
                    Contact your HR administrator to learn more about available insurance policies.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* --- Enrollment Card --- */}
          {!enrollmentStarted && (
            <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
              <TouchableOpacity
                activeOpacity={0.92}
                style={styles.banner3DContainer}
                onPress={() => setShowEnrollmentModal(true)}
              >
                <LinearGradient
                  colors={['#9680c9ff', '#5d5ea3ff', '#6c63c8ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bannerGradient}
                >
                  <View style={styles.bannerGradient1}>
                      <View style={StyleSheet.absoluteFill}>
                    <Svg height="100%" width="100%" style={{ opacity: 0.15 }}>
                      <Circle cx="90%" cy="100%" r="60" fill="white" />
                      <Circle cx="10%" cy="0%" r="40" fill="white" />
                      <Circle cx="80%" cy="20%" r="20" stroke="white" strokeWidth="4" fill="none" />
                    </Svg>
                  </View>

                  <View style={styles.iconGlassBox}>
                    <Svg width={wp(7)} height={wp(7)} viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" 
                        fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={1.5}
                      />
                    </Svg>
                  </View>

                  <View style={{ flex: 1, paddingLeft: wp(4) }}>
                    <Text style={styles.bannerTitle}>Enrollment Open</Text>
                    <Text style={styles.bannerSub}>Ends {enrollment.endDate}</Text>
                  </View>

                  <View style={styles.bannerAction}>
                    <View style={styles.actionBtnInner}>
                      <Text style={styles.bannerPillText}>Start</Text>
                      <Svg width={wp(3.5)} height={wp(3.5)} viewBox="0 0 24 24" style={{marginLeft: wp(1)}}>
                         <Path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </Svg>
                    </View>
                  </View>
                  </View>
                 
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* --- Survey Card --- */}
          {!surveyStarted && (
            <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
              <TouchableOpacity
                activeOpacity={0.94}
                style={styles.surveyWrapper}
                onPress={() => setShowSurveyModal(true)}
              >
                <LinearGradient
                  colors={['#b876b4ff', '#b468b0ff', '#965192ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.surveyBackground}
                >
                  <View style={styles.surveyBackground1}>
                         <View style={StyleSheet.absoluteFill}>
                    <Svg height="100%" width="100%" style={{ opacity: 0.15 }}>
                      <Circle cx="100%" cy="100%" r="80" stroke="white" strokeWidth="12" fill="none" />
                      <Circle cx="100%" cy="100%" r="50" stroke="white" strokeWidth="6" fill="none" />
                      <Circle cx="10%" cy="10%" r="15" fill="white" />
                    </Svg>
                  </View>

                  <View style={styles.glassIconFrame}>
                    <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M9 11h6" />
                      <Path d="M9 15h6" />
                      <Path d="M9 7h6" />
                      <Path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                    </Svg>
                  </View>

                  <View style={styles.surveyTextContainer}>
                    <Text style={styles.surveyHeader}>{survey.name}</Text>
                    <Text style={styles.surveyCaption}>Ends {survey.endDate} • Tap to start</Text>
                  </View>

                  <View style={styles.actionContainer}>
                    <View style={styles.surveyBtn}>
                      <Text style={styles.surveyBtnText}>Start</Text>
                    </View>
                  </View>
                  </View>
             
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* --- Claim Card --- */}
          <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
            <TouchableOpacity activeOpacity={0.96} onPress={toggleClaim} style={styles.claimShadowWrapper}>
              <LinearGradient
                colors={['#FFF1F2', '#F3E8FF', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.claimCard}
              >
                <View style={styles.claimCard1}>
                   <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <Svg height="100%" width="100%">
                    <Circle cx="100%" cy="0%" r="100" fill="rgba(251, 113, 133, 0.08)" />
                    <Circle cx="0%" cy="100%" r="80" fill="rgba(167, 139, 250, 0.1)" />
                    <Path
                      d={`M0,100 Q ${width * 0.4},50 ${width},120`}
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.5"
                    />
                  </Svg>
                </View>

                <View style={styles.claimContentRow}>
                  {/* Left Content */}
                  <View style={styles.claimLeft}>
                    <Text style={styles.claimTitle}>File a claim or check the process</Text>
                    <Text style={styles.claimSummary} numberOfLines={claimExpanded ? undefined : 2}>
                      {claimExpanded ? claimFullText : claimSummary}
                    </Text>

                    <View style={styles.claimBtnContainer}>
                      <View style={styles.claimButton}>
                        <Text style={styles.claimButtonText}>
                          {claimExpanded ? 'Show less' : 'View details'}
                        </Text>
                        <Svg width={wp(4)} height={wp(4)} viewBox="0 0 24 24" fill="none" style={{ marginLeft: wp(1.5) }}>
                          <Path
                            d={claimExpanded ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"}
                            stroke="#BE185D" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    </View>
                  </View>

                  {/* Right Content */}
                  <View style={styles.claimRight}>
                    <Image 
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png' }} 
                      style={styles.claimImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                </View>
                {/* Pattern: Soft Glowing Orbs & Curves */}
               
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* --- Fixed Footer Background Text (Watermark) --- */}
        <View pointerEvents="none" style={styles.fixedFooterWrap}>
          <Text style={styles.fixedFooterText}>YOUR POLICY</Text>
        </View>
      </SafeAreaView>

      {/* --- Modals --- */}
      <EnrollmentModal visible={showEnrollmentModal} onClose={() => setShowEnrollmentModal(false)} onStart={() => setEnrollmentStarted(true)} />
      <SurveyModal visible={showSurveyModal} onClose={() => setShowSurveyModal(false)} onStart={() => navigation.navigate('SurvaylistPage')} />

    </View>
  );
};

export default PolicyScreen;

/* =========================================================================
   STYLESHEET
   ========================================================================= */

const styles = StyleSheet.create({
  // --- Shimmer Style ---
  shimmerCard: {
    width: width * 0.82,
    height: hp(26),
    borderRadius: wp(4.5),
    backgroundColor: '#E1E4E8', // Grey base
    overflow: 'hidden',
    alignSelf: 'center', // Center in the list area
  },
  
  // --- Screen & Global Layout ---
  screenWrap: { flex: 1, backgroundColor: 'transparent' },
  patternWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  safe: { flex: 1, zIndex: 1 },
  
  fixedHeaderWrapper: {
    zIndex: 10,
    backgroundColor: 'transparent',
  },

  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(18) },
  sectionContainer: {  marginBottom: hp(1.2) },

  fixedFooterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_TAB_HEIGHT + hp(1),
    alignItems: 'center',
    zIndex: 0, 
  },
  fixedFooterText: {
    fontSize: hp(4.8),
    fontFamily: 'Montserrat-Bold',
    color: 'rgba(15,17,32,0.06)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },

  // --- Enrollment Banner ---
  banner3DContainer: {
    borderRadius: wp(6),
    shadowColor: '#6366F1',
    alignItems: 'center',
    shadowOffset: { width: 0, height: hp(1.2) },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    // backgroundColor: '#fff',
  },
  bannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(92),
    height: hp(8),
   
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderTopWidth: 1.5,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
   bannerGradient1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: hp(8),
    padding: wp(3),
    borderRadius: wp(6),
   
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  iconGlassBox: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerTitle: {
    fontSize: hp(1.8),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginBottom: hp(0.5),
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSub: {
    fontSize: hp(1.3),
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Montserrat-SemiBold',
  },
  bannerAction: { marginLeft: wp(2) },
  actionBtnInner: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerPillText: {
    color: '#4F46E5',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.55),
  },

  // --- Claim Card ---
  claimShadowWrapper: {
    borderRadius: wp(6.5),
    alignItems: 'center',
    // backgroundColor: '#fff',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: hp(1.2) },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  claimCard: {
    borderRadius: wp(6.5),
    // paddingVertical: hp(0.4),
    width: wp(94),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  claimCard1: {
    borderRadius: wp(6.5),
    // paddingVertical: hp(0.4),
    padding: wp(6),
    
    overflow: 'hidden',
  },
  claimContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimLeft: {
    flex: 0.65,
    paddingRight: wp(2.5),
  },
  claimTitle: {
    fontSize: hp(1.8),
    fontFamily: 'Montserrat-Bold',
    color: '#4C1D95',
    marginBottom: hp(0.7),
    lineHeight: hp(2),
    letterSpacing: -0.4,
  },
  claimSummary: {
    fontSize: hp(1.45),
    color: '#701A75',
    lineHeight: hp(2),
    fontFamily: 'Montserrat-SemiBold',
    opacity: 0.85,
  },
  claimBtnContainer: {
    marginTop: hp(2.2),
    alignItems: 'flex-start',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4.5),
    borderRadius: wp(4),
    shadowColor: '#BE185D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  claimButtonText: {
    color: '#BE185D',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.4),
  },
  claimRight: {
    flex: 0.35,
    height: hp(12.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimImage: {
    width: '110%',
    height: '110%',
    marginBottom: -10,
    marginRight: -10,
    opacity: 0.9,
  },
  // No Policy Card
  card: {
    alignSelf: 'center',
    borderRadius: wp(6),
    width: '100%',
    maxWidth: wp(95),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4.5),
    alignItems: 'center',
  },
  image: {
    width: wp(70),
    height: hp(31),
    marginBottom: hp(2),
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: hp(2.3),
    fontFamily: 'Montserrat-Bold',
    color: '#1A3B5D',
    marginBottom: hp(0.5),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(1.6),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(2),
    fontFamily: 'Montserrat-Regular',
    maxWidth: '90%',
  },

  // --- Survey Card ---
  surveyWrapper: {
    borderRadius: wp(5.5),
    shadowColor: '#14B8A6',
    alignItems: 'center',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    // backgroundColor: '#fff',
  },
  surveyBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    
    height: hp(8),
    width:wp(92),
    borderRadius: wp(5.5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopWidth: 1.5,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
   surveyBackground1: {
    flexDirection: 'row',
    alignItems: 'center',
  
    padding: wp(1.9),
    borderRadius: wp(5.5),
   
   
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  glassIconFrame: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(3.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  surveyTextContainer: {
    flex: 1,
    paddingLeft: wp(3.5),
  },
  surveyHeader: {
    fontSize: hp(1.6),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginBottom: hp(0.375),
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  surveyCaption: {
    fontSize: hp(1.2),
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Montserrat-SemiBold',
  },
  actionContainer: {
    marginLeft: wp(2.5),
  },
  surveyBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3.3),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  surveyBtnText: {
    color: '#0F766E',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.4),
    textTransform: 'uppercase',
  },
});