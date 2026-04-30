import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
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
  BackHandler,
  Modal,
  Linking,
  InteractionManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import messaging from '@react-native-firebase/messaging';
import VersionCheck from 'react-native-version-check';
import Svg, { Defs, Pattern, Path, Rect, Circle } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension';

import { useCopilot, CopilotStep, walkthroughable } from 'react-native-copilot';

// Components
import PolicyCardList from '../component/policyCard';
import ActivePolicyHeader from '../component/activpolicy';
import EnrollmentModal from '../component/Enrollmodal';
import SurveyModal from '../component/Survaymodal';
import Header from '../component/header';
import { useSaveTokenMutation } from '../redux/service/user/user';
import { GetApi } from '../component/Apifunctions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPolicies, fetchProfile, fetchSurveys, fetchWellness } from './Epicfiles/MainEpic';
import FastImage from '@d11/react-native-fast-image';
import { setUser } from '../redux/service/userSlice';

const { width, height } = Dimensions.get('window');

const BOTTOM_TAB_HEIGHT = hp(10); 
const HEADER_HEIGHT = Platform.OS === 'ios' ? hp(14) : hp(13);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CopilotView = walkthroughable(View);

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
        <LinearGradient colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
};

const PolicyScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); 
  
  const { start, currentStep, copilotEvents } = useCopilot();
  const scrollViewRef = useRef(null);
  const hasStartedTutorial = useRef(false);
  
  const isProfileStep = currentStep?.name === 'profile';
  const shouldHideHeader = !!currentStep && !isProfileStep;
  
  // State
  const [claimExpanded, setClaimExpanded] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false); 
  const [Savetoken] = useSaveTokenMutation();
  
  const { data:surveylistdata, isLoading, error } = useSelector((state) => state.surveys);
  const filteredSurveys = useMemo(() => surveylistdata?.data?.filter(item => item.is_submit !== "1") || [], [surveylistdata]);
  
  // Policy Data State
  const getToken = useCallback(async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      AsyncStorage.setItem('deviceTOKEN', token);
    } catch (error) { console.error('Error getting FCM token:', error); }
  }, []);

  const Savedevicetoken = useCallback(async () => {
    await getToken();
    const token = await AsyncStorage.getItem('deviceTOKEN');
    try { if(token) await Savetoken({ device_token: token }); } catch (error) { console.log(error); }
  }, [getToken, Savetoken]);

  const {data:PolicyData, isLoading:policyLoading} = useSelector((state:any)=>state.policy);
  let enrollmentlistdata = PolicyData?.data?.enrolment;

  const enrollmentLogic = useMemo(() => {
    if (!enrollmentlistdata) return { shouldShowImage: false };
    const currentDate = new Date();
    const hasValidAssignedDates = enrollmentlistdata?.new_enrolment_assigned?.every(item => new Date(item.portal_end_date) >= currentDate);
    const hasValidSubmittedDates = enrollmentlistdata?.new_enrolment_submitted?.every(item => new Date(item.portal_end_date) >= currentDate);
    const hasAssignedData = enrollmentlistdata?.new_enrolment_assigned?.length > 0;
    const hasAssignedsubmittedData = enrollmentlistdata?.new_enrolment_submitted?.length > 0;
    const isEnrollmentListEmpty = enrollmentlistdata?.length === 0;
    const shouldShowImage = !isEnrollmentListEmpty && (hasAssignedData || hasAssignedsubmittedData) && (hasValidAssignedDates || hasValidSubmittedDates);
    return { shouldShowImage };
  }, [enrollmentlistdata]);

  // Listen for tutorial completion to restore scroll
  useEffect(() => {
    if (copilotEvents) {
      const handleStop = () => {
        setIsTutorialActive(false);
        AsyncStorage.setItem('tutorialCompleted', 'true');
      };
      copilotEvents.on('stop', handleStop);
      return () => copilotEvents.off('stop');
    }
  }, [copilotEvents]);

  useFocusEffect(
    useCallback(() => {
      let timer;
      let isActive = true;

      const checkAndStartTutorial = async () => {
        try {
          const isCompleted = await AsyncStorage.getItem('tutorialCompleted');
          if (isCompleted === 'true') return;
          if (!isActive || hasStartedTutorial.current) return;
          
          setIsTutorialActive(true);
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
          
          timer = setTimeout(() => {
            hasStartedTutorial.current = true;
            start();
          }, 4500); 
        } catch (error) { console.error("Error checking tutorial status:", error); }
      };

      InteractionManager.runAfterInteractions(() => { checkAndStartTutorial(); });

      return () => {
        isActive = false;
        if (timer) clearTimeout(timer);
      };
    }, [start])
  );

  const toggleClaim = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setClaimExpanded((s) => !s);
  };
  
  const CheckInactivecomp = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await GetApi('/company-status',{},token);
      if (res.data.status_label === 'inactive') dispatch(setUser(false));
    } catch (error) { console.error(error); }
  };

  const checkAppVersion = useCallback(async (apiVersion) => {
    try {
      const currentVersion = VersionCheck.getCurrentVersion();
      if (apiVersion && currentVersion !== apiVersion) setShowUpdateModal(true);
    } catch (e) {}
  }, []);

  const getProfile = useCallback(async () => {
    let token = await AsyncStorage.getItem('token');
    try {
      const response = await GetApi('/profile', {}, token);
      if (response?.error?.data?.status?.code === 404) { dispatch(setUser(false)); } 
      else {
        const version = Platform.OS === 'android' ? response?.data?.version?.android : response?.data?.version?.ios;
        checkAppVersion(version);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getProfile();
    CheckInactivecomp();
    dispatch(fetchProfile());
    dispatch(fetchPolicies());
    dispatch(fetchWellness());
    dispatch(fetchSurveys());
    Savedevicetoken();
  }, []);

  const startEnrollment = () => {
    setTimeout(() => { navigation.navigate('Webrendering', { url: enrollmentlistdata?.url }); }, 200); 
  };

  const claimSummary = "Steps to file a medical claim & track status.";
  const enrollment = { endDate: '30 Nov 2025' };
  const survey = { name: 'Employee Wellness Survey', endDate: '25 Nov 2025' };

  return (
    <View style={styles.screenWrap}>
      <View pointerEvents="none" style={styles.patternWrap}>
        <LinearGradient colors={['#F6F7FB', '#F0ECF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs><Pattern id="diags" patternUnits="userSpaceOnUse" width="20" height="20"><Path d="M0 20 L20 0" stroke="rgba(147,71,144,0.02)" strokeWidth="2" /></Pattern></Defs>
          <Rect x={0} y={0} width={width} height={height * 0.35} fill="rgba(147,71,144,0.02)" />
          <Rect x={0} y={height * 0.55} width={width} height={height * 0.15} fill="rgba(147,71,144,0.015)" />
          <Rect x={0} y={0} width={width} height={height} fill="url(#diags)" opacity={0.05} />
        </Svg>
         <View pointerEvents="none" style={styles.fixedFooterWrap}>
          <Text style={styles.fixedFooterText}>YOUR POLICY</Text>
        </View>
      </View>

      <View style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        
        <View style={[styles.fixedHeaderWrapper]}>
          <Header />
        </View>
        
        {/* 🔥 DYNAMIC ANCHOR FIX 🔥 */}
        {/* If enrollment logic is true, anchor to the BOTTOM (so dome renders at bottom like step 2 and 3). */}
        {/* If enrollment logic is false, anchor to the TOP (so dome renders at the top for standard policy details). */}
        <CopilotStep
            name="policyCard"
            order={1}
            text={`Get a quick overview of your policy Here\nQuickly review your coverage overview from the Policy Card. Navigate to 'Policy Details' to download your digital e-card, search for nearby cashless hospitals, and manage or add your dependents.`}
        >
            <CopilotView 
              style={[
                { position: 'absolute', width: 1, height: 1 },
                enrollmentLogic.shouldShowImage 
                  ? { bottom: hp(5), left: wp(50) } // Anchor Bottom for Enrollment
                  : { top: HEADER_HEIGHT, left: 0 } // Anchor Top for Standard Policy 
              ]} 
            />
        </CopilotStep>

        <ScrollView 
          ref={scrollViewRef}
          scrollEnabled={!isTutorialActive} 
          contentContainerStyle={[styles.scrollContent, { paddingTop: HEADER_HEIGHT }]} 
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.sectionContainer}>
            <ActivePolicyHeader title="Policies" subtitle="Find all your policies here." onBack={() => navigation?.goBack?.()} isEnhanced3D={true} illustration={require('../../assets/policies.png')} />
          </View>
          
          {/* --- Enrollment Card --- */}
          {enrollmentLogic.shouldShowImage && (
            <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
              <TouchableOpacity 
                activeOpacity={0.92} 
                style={styles.newBannerContainer} 
                onPress={() => navigation.navigate('Webrendering', { url: enrollmentlistdata?.url })}
              >
                {/* --- Left Column: Text & Button --- */}
                <View style={styles.newBannerLeft}>
                  <Text style={styles.newBannerTitle}>Enrollment Open</Text>
                  <Text style={styles.newBannerDesc}>
                    Complete your benefit coverages to bring security and modern care to your lifestyle.
                  </Text>
                  
                  <View style={styles.newBannerBtn}>
                    <Text style={styles.newBannerBtnText}>Start Now</Text>
                  </View>
                </View>

                {/* --- Right Column: Tilted Card --- */}
                <View style={styles.newBannerRight}>
                  <View style={styles.tiltedCardWrapper}>
                    {/* Floating Blue Tooltip */}
                    <View style={styles.floatingTooltip}>
                      <Text style={styles.tooltipText}>Track your{"\n"}Progress</Text>
                    </View>
                    
                    {/* White Tilted Progress Card */}
                    <View style={styles.tiltedCard}>
                      <View style={styles.progressHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={styles.greenDot} />
                          <Text style={styles.progressText}>Progress</Text>
                        </View>
                        {/* Clock Icon */}
                        <Svg width={wp(3.5)} height={wp(3.5)} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <Circle cx="12" cy="12" r="10"/><Path d="M12 6v6l4 2"/>
                        </Svg>
                      </View>

                      {/* Step 1 - Active */}
                      <View style={styles.stepRow}>
                        <View style={[styles.stepCircle, styles.stepCircleActive]}>
                          <Text style={styles.stepCircleTextActive}>1</Text>
                        </View>
                        <Text style={styles.stepTextActive}>Add Dependents</Text>
                      </View>
                      
                      {/* Step 2 - Inactive */}
                      <View style={styles.stepRow}>
                        <View style={styles.stepCircle}>
                          <Text style={styles.stepCircleText}>2</Text>
                        </View>
                        <Text style={styles.stepText}>Choose Plans</Text>
                      </View>
                      
                      {/* Step 3 - Inactive */}
                      <View style={styles.stepRow}>
                        <View style={styles.stepCircle}>
                          <Text style={styles.stepCircleText}>3</Text>
                        </View>
                        <Text style={styles.stepText}>Extra Coverage</Text>
                      </View>
                      
                      {/* Step 4 - Inactive */}
                      <View style={styles.stepRow}>
                        <View style={styles.stepCircle}>
                          <Text style={styles.stepCircleText}>4</Text>
                        </View>
                        <Text style={styles.stepText}>Review & Submit</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* --- Policy Card --- */}
          <View style={[styles.sectionContainer, { marginTop: hp(3), zIndex: 10 }]}>
            <View style={{ width: '100%', minHeight: hp(20) }}>
              {policyLoading ? (
                <PolicyShimmer />
              ) : PolicyData?.data?.policy_details?.length > 0 ? (
                <PolicyCardList Policydata={PolicyData?.data?.policy_details} />
              ) : (
                <View style={styles.card}>
                  <FastImage source={require('../../assets/policynotfound.png')} style={styles.image} resizeMode="cover" />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>No Policies yet</Text>
                    <Text style={styles.subtitle}>Contact your HR administrator to learn more about available insurance policies.</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
 
          {/* --- Survey Card --- */}
          {filteredSurveys.length > 0 && (
            <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
              <TouchableOpacity activeOpacity={0.94} style={styles.surveyWrapper} onPress={() => setShowSurveyModal(true)}>
                <LinearGradient colors={['#b876b4ff', '#b468b0ff', '#965192ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.surveyBackground}>
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
                        <Path d="M9 11h6" /><Path d="M9 15h6" /><Path d="M9 7h6" /><Path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
                      </Svg>
                    </View>
                    <View style={styles.surveyTextContainer}>
                      <Text style={styles.surveyHeader}>{survey.name}</Text>
                      <Text style={styles.surveyCaption}>Ends {survey.endDate} • Tap to start</Text>
                    </View>
                    <View style={styles.actionContainer}>
                      <View style={styles.surveyBtn}><Text style={styles.surveyBtnText}>Start</Text></View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* --- Claim Card --- */}
          <View style={[styles.sectionContainer, { marginTop: hp(3) }]}>
            <TouchableOpacity activeOpacity={0.96} onPress={toggleClaim} style={styles.claimShadowWrapper}>
              <LinearGradient colors={['#FFF1F2', '#F3E8FF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.claimCard}>
                <View style={styles.claimCard1}>
                  <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Svg height="100%" width="100%">
                      <Circle cx="100%" cy="0%" r="100" fill="rgba(251, 113, 133, 0.08)" />
                      <Circle cx="0%" cy="100%" r="80" fill="rgba(167, 139, 250, 0.1)" />
                      <Path d={`M0,100 Q ${width * 0.4},50 ${width},120`} stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
                    </Svg>
                  </View>
                  <View style={styles.claimContentRow}>
                    <View style={styles.claimLeft}>
                      <Text style={styles.claimTitle}>File a claim or check the process</Text>
                      <Text style={styles.claimSummary} numberOfLines={claimExpanded ? undefined : 2}>{claimSummary}</Text>
                      <View style={styles.claimBtnContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('claimProcess')} style={styles.claimButton}>
                          <Text style={styles.claimButtonText}>View Details</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.claimRight}>
                      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png' }} style={styles.claimImage} resizeMode="contain" />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <EnrollmentModal visible={showEnrollmentModal} onClose={() => setShowEnrollmentModal(false)} onStart={() => startEnrollment()} />
      <SurveyModal visible={showSurveyModal} onClose={() => setShowSurveyModal(false)} onStart={() => navigation.navigate('SurvaylistPage')} />
      
      <Modal visible={showUpdateModal} transparent animationType="fade" onRequestClose={() => BackHandler.exitApp()}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 30, alignItems: 'center', width: wp(70) }}>
            <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginBottom: 10, color: '#701A75' }}>Update to Latest Version</Text>
            <TouchableOpacity style={{ backgroundColor: '#701A75', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5, width: '100%', alignItems: 'center' }} onPress={() => Linking.openURL(Platform.OS === 'android' ? 'https://play.google.com/store/apps/details?id=com.zoomconnect' : 'https://apps.apple.com/in/app/zoom-connect/id6451200108')}>
              <Text style={{ color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: 16 }}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PolicyScreen;

const styles = StyleSheet.create({
  // --- Shimmer Style ---
  shimmerCard: { width: width * 0.82, height: hp(26), borderRadius: wp(4.5), backgroundColor: '#E1E4E8', overflow: 'hidden', alignSelf: 'center' },
  // --- Screen & Global Layout ---
  screenWrap: { flex: 1, backgroundColor: 'transparent' },
  patternWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  safe: { flex: 1, zIndex: 1 },
  fixedHeaderWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, elevation: 10, backgroundColor: 'white' },
  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(18) },
  sectionContainer: { paddingHorizontal: wp(4) ,marginTop: hp(4),marginBottom: hp(4) },
  fixedFooterWrap: { position: 'absolute', left: 0, right: 0, bottom: BOTTOM_TAB_HEIGHT + hp(3.7), alignItems: 'center', zIndex: 0 },
  fixedFooterText: { fontSize: hp(4.8), fontFamily: 'Montserrat-Bold', color: 'rgba(15,17,32,0.06)', textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center' },
  // --- Enrollment Banner ---
  banner3DContainer: { borderRadius: wp(6), shadowColor: '#6366F1', alignItems: 'center', shadowOffset: { width: 0, height: hp(1.2) }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 12 },
  bannerGradient: { flexDirection: 'row', alignItems: 'center', width: wp(92), height: hp(8), borderRadius: wp(6), borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderTopWidth: 1.5, borderBottomWidth: 0, overflow: 'hidden' },
  bannerGradient1: { flexDirection: 'row', alignItems: 'center', width: '100%', height: hp(8), padding: wp(3), borderRadius: wp(6), borderBottomWidth: 0, overflow: 'hidden' },
  iconGlassBox: { width: wp(13), height: wp(13), borderRadius: wp(4), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  bannerTitle: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', color: '#FFFFFF', marginBottom: hp(0.5), textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  bannerSub: { fontSize: hp(1.3), color: 'rgba(255,255,255,0.85)', fontFamily: 'Montserrat-SemiBold' },
  bannerAction: { marginLeft: wp(2) },
  actionBtnInner: { backgroundColor: '#FFFFFF', flexDirection: 'row', paddingVertical: hp(0.8), paddingHorizontal: wp(4), borderRadius: wp(25), alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  bannerPillText: { color: '#4F46E5', fontFamily: 'Montserrat-Bold', fontSize: hp(1.55) },
  // --- Claim Card ---
  claimShadowWrapper: { borderRadius: wp(6.5), alignItems: 'center', shadowColor: '#C084FC', shadowOffset: { width: 0, height: hp(1.2) }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  claimCard: { borderRadius: wp(6.5), width: wp(94), borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', overflow: 'hidden' },
  claimCard1: { borderRadius: wp(6.5), padding: wp(6), overflow: 'hidden' },
  claimContentRow: { flexDirection: 'row', alignItems: 'center' },
  claimLeft: { flex: 0.65, paddingRight: wp(2.5) },
  claimTitle: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', color: '#4C1D95', marginBottom: hp(0.7), lineHeight: hp(2), letterSpacing: -0.4 },
  claimSummary: { fontSize: hp(1.45), color: '#701A75', lineHeight: hp(2), fontFamily: 'Montserrat-SemiBold', opacity: 0.85 },
  claimBtnContainer: { marginTop: hp(2.2), alignItems: 'flex-start' },
  claimButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: hp(1.2), paddingHorizontal: wp(4.5), borderRadius: wp(4), shadowColor: '#BE185D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  claimButtonText: { color: '#BE185D', fontFamily: 'Montserrat-Bold', fontSize: hp(1.4) },
  claimRight: { flex: 0.35, height: hp(12.5), justifyContent: 'center', alignItems: 'center' },
  claimImage: { width: '110%', height: '110%', marginBottom: -10, marginRight: -10, opacity: 0.9 },
  // --- No Policy Card ---
  card: { alignSelf: 'center', borderRadius: wp(6), width: '100%', maxWidth: wp(95), paddingVertical: hp(1), paddingHorizontal: wp(4.5), alignItems: 'center' },
  image: { width: wp(70), height: hp(31), marginBottom: hp(2) },
  textContainer: { alignItems: 'center' },
  title: { fontSize: hp(2.3), fontFamily: 'Montserrat-Bold', color: '#1A3B5D', marginBottom: hp(0.5), textAlign: 'center' },
  subtitle: { fontSize: hp(1.6), color: '#6B7280', textAlign: 'center', lineHeight: hp(2), fontFamily: 'Montserrat-Regular', maxWidth: '90%' },
  // --- Survey Card ---
  surveyWrapper: { borderRadius: wp(5.5), shadowColor: '#14B8A6', alignItems: 'center', shadowOffset: { width: 0, height: hp(1) }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
  surveyBackground: { flexDirection: 'row', alignItems: 'center', height: hp(8), width:wp(92), borderRadius: wp(5.5), borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderTopWidth: 1.5, borderBottomWidth: 0, overflow: 'hidden' },
  surveyBackground1: { flexDirection: 'row', alignItems: 'center', padding: wp(1.9), borderRadius: wp(5.5), borderBottomWidth: 0, overflow: 'hidden' },
  glassIconFrame: { width: wp(12), height: wp(12), borderRadius: wp(3.5), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  surveyTextContainer: { flex: 1, paddingLeft: wp(3.5) },
  surveyHeader: { fontSize: hp(1.6), fontFamily: 'Montserrat-Bold', color: '#FFFFFF', marginBottom: hp(0.375), letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  surveyCaption: { fontSize: hp(1.2), color: 'rgba(255,255,255,0.9)', fontFamily: 'Montserrat-SemiBold' },
  actionContainer: { marginLeft: wp(2.5) },
  surveyBtn: { backgroundColor: '#FFFFFF', paddingVertical: hp(0.8), paddingHorizontal: wp(3.3), borderRadius: wp(5), alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  surveyBtnText: { color: '#0F766E', fontFamily: 'Montserrat-Bold', fontSize: hp(1.4), textTransform: 'uppercase' },
  // --- New Enrollment Banner Styles ---
  // --- Scaled Down Enrollment Banner Styles ---
  newBannerContainer: {
    backgroundColor: '#FDE067',
    borderRadius: wp(5),
    flexDirection: 'row',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 4,
    overflow: 'visible', 
  },
  newBannerLeft: {
    flex: 1.4, // Give text slightly more room
    paddingRight: wp(2),
  },
  newBannerTitle: {
    fontSize: hp(1.8), // Scaled down from 2.2
    fontFamily: 'Montserrat-Bold',
    color: '#111827',
    marginBottom: hp(0.8),
  },
  newBannerDesc: {
    fontSize: hp(1.25), // Scaled down
    fontFamily: 'Montserrat-Regular',
    color: '#1e2126',
    marginBottom: hp(1),
    lineHeight: hp(1.6),
  },
  newBannerDate: {
    fontSize: hp(1), // Scaled down
    fontFamily: 'Montserrat-Bold',
    color: '#374151',
    marginBottom: hp(1.5),
  },
  newBannerBtn: {
    backgroundColor: '#FFFFFF',
    marginTop: hp(0.5),
    paddingVertical: hp(0.8), // Tighter padding
    paddingHorizontal: wp(4),
    borderRadius: wp(5),
    alignSelf: 'flex-start',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2
  },
  newBannerBtnText: {
    color: '#111827',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.15), // Scaled down
  },
  newBannerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tiltedCardWrapper: {
    position: 'relative',
    width: wp(34), // Shrunk width so it doesn't push left
    marginRight: 0,
  },
  floatingTooltip: {
    position: 'absolute',
    top: -hp(2.5), // Pushed down slightly
    left: -wp(4), // Pulled right so it stops overlapping the title
    backgroundColor: '#2563EB',
    borderRadius: wp(2),
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(2),
    zIndex: 10,
    elevation: 5,
    shadowColor: '#2563EB', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp(0.9), // Scaled down
    textAlign: 'center',
    lineHeight: hp(1.2),
  },
  tiltedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3.5),
    padding: wp(2.5), // Tighter padding inside card
    transform: [{ rotate: '4deg' }],
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  greenDot: {
    width: wp(1.8),
    height: wp(1.8),
    borderRadius: wp(0.9),
    backgroundColor: '#10B981',
    marginRight: wp(1.5),
  },
  progressText: {
    fontSize: hp(1.2), // Scaled down
    fontFamily: 'Montserrat-Bold',
    color: '#111827',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  stepCircle: {
    width: wp(3.8), // Smaller circles
    height: wp(3.8),
    borderRadius: wp(1.9),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
  },
  stepCircleText: {
    fontSize: hp(1),
    fontFamily: 'Montserrat-Bold',
    color: '#9CA3AF',
  },
  stepCircleTextActive: {
    fontSize: hp(1),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: hp(1), // Scaled down
    fontFamily: 'Montserrat-SemiBold',
    color: '#9CA3AF',
  },
  stepTextActive: {
    fontSize: hp(1),
    fontFamily: 'Montserrat-Bold',
    color: '#111827',
  },
});