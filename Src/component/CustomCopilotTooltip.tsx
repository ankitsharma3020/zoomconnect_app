import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Animated } from 'react-native';
import { useCopilot } from 'react-native-copilot';
import Svg, { Path, Defs, Pattern, Circle, Rect, LinearGradient, Stop } from 'react-native-svg';
import { useSelector } from 'react-redux';
import FastImage from '@d11/react-native-fast-image';
import LinearGradientBg from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import { wp, hp } from '../utilites/Dimension';

const { width } = Dimensions.get('window');

// 🔥 DYNAMIC CONSTANTS 🔥
const PROFILE_DOME_DIAMETER = wp(180); 
const PROFILE_DOME_BOTTOM_EDGE = Platform.OS === 'ios' ? hp(24) : hp(22); 

// --- ICONS ---
const HomeIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <><Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><Path d="M9 12H15V21H9V12Z" fill="#ffffff"/></>
    ) : (
      <><Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><Path d="M9 21V12H15V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>
    )}
  </Svg>
);

const ClaimsIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <><Path d="M12 2.714A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><Path d="M9 12.75 11.25 15 15 9.75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
    ) : (
      <><Path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>
    )}
  </Svg>
);

const WellnessIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpIcon = ({ size = 20, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <><Path d="M12 2C7.58 2 4 5.58 4 10C4 13.87 6.67 16.54 9 17.5V19C9 19.55 9.45 20 10 20H14C14.55 20 15 19.55 15 19V17.5C17.33 16.54 20 13.87 20 10C20 5.58 16.42 2 12 2Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><Path d="M11 18H13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>
    ) : (
      <><Path d="M11 18H13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><Path d="M12 2C7.58 2 4 5.58 4 10C4 13.87 6.67 16.54 9 17.5V19C9 19.55 9.45 20 10 20H14C14.55 20 15 19.55 15 19V17.5C17.33 16.54 20 13.87 20 10C20 5.58 16.42 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>
    )}
  </Svg>
);

const CardPattern = ({ dotColor, strokeColor }) => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height="100%" width="100%">
      <Defs><Pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse"><Circle cx="1.5" cy="1.5" r="1" fill={dotColor} /></Pattern></Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      <Path d="M 0 80 Q 80 40 160 120 T 320 80" stroke={strokeColor} strokeWidth="30" fill="none" />
    </Svg>
  </View>
);

const DummyClaimCard = () => {
  const gradientColors = ['#F2FCF5', '#E6F9EC', '#DDF4E3']; 
  const dotColor = 'rgba(27, 94, 32, 0.08)'; const strokeColor = 'rgba(27, 94, 32, 0.05)';
  const cardBorderColor = '#C8E6D1'; const themeColor = '#1B5E20'; 
  const lightThemeColor = '#C8E6D1'; const textSubColor = '#2E7D32'; const statusColor = '#03392a'; 

  return (
    <View style={[styles.dummyCardContainer, { borderColor: cardBorderColor }]}>
      <LinearGradientBg colors={gradientColors} style={styles.gradientBackground}>
        <View style={styles.gradientBackground1}>
          <CardPattern dotColor={dotColor} strokeColor={strokeColor} />
          <View style={{ zIndex: 1 }}>
            <View style={styles.dummyTopSection}>
              <View style={{ flex: 1.5, marginRight: wp(1) }}>
                <View style={[styles.dummyPolicyBadge, { backgroundColor: themeColor }]}><Text style={styles.dummyPolicyText}>GMC</Text></View>
                <Text style={[styles.dummyStatusText, { color: statusColor }]}>PAYMENT DETAILS RECEIVED WITH UTR NO</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}><Text style={styles.dummyAmountText}>₹34843</Text></View>
            </View>
            <View style={[styles.dummyPatientBox, { borderColor: cardBorderColor }]}>
              <View style={[styles.dummyPatientIconPlaceholder, { backgroundColor: lightThemeColor }]}><Text style={{ fontSize: hp(1.5) }}>👤</Text></View>
              <View><Text style={styles.dummyPatientName}>PRASANT KUMAR BEHERA</Text><Text style={[styles.dummyPatientRelation, { color: textSubColor }]}>Relation: Employee</Text></View>
            </View>
            <View style={styles.dummyActionRow}>
              <View style={[styles.dummySecondaryButton, { borderColor: themeColor }]}><Text style={[styles.dummySecondaryButtonText, { color: themeColor }]}>View Details</Text></View>
              <View style={[styles.dummyPrimaryButton, { backgroundColor: themeColor }]}><Text style={styles.dummyPrimaryButtonText}>Download</Text></View>
            </View>
          </View>
        </View>
      </LinearGradientBg>
    </View>
  );
};

const DummyPolicyCard = () => {
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnim = (anim, distance, duration) => {
      Animated.loop(Animated.sequence([
        Animated.timing(anim, { toValue: -distance, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
      ])).start();
    };
    loopAnim(floatA, 6, 2200); loopAnim(floatB, 10, 3000); loopAnim(floatC, 4, 1800);
  }, []);

  return (
    <View style={[styles.cardShadowContainer, { width: width * 0.82, height: hp(24), alignSelf: 'center' }]}>
      <View style={styles.cardBorderClipper}>
        <LinearGradientBg colors={['#FAF7FB', '#EDE9F5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fullCardGradient}>
          <View style={styles.accentCircle} />
          <Animated.View style={[styles.bubble1, { transform: [{ translateY: floatA }] }]} />
          <Animated.View style={[styles.bubble2, { transform: [{ translateY: floatB }] }]} />
          <Animated.View style={[styles.bubble3, { transform: [{ translateY: floatC }] }]} />

          <View style={styles.contentContainer}>
            <View style={styles.textBlock}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1.2) }}>
                <Text numberOfLines={1} style={[styles.policyCardTitle, { marginBottom: 0 }]}>Secure Health Plus</Text>
                <View style={{ backgroundColor: '#D1FAE5', paddingHorizontal: wp(2), paddingVertical: hp(0.5), borderRadius: 6 }}><Text style={{ color: '#065F46', fontSize: hp(1.2), fontFamily: 'Montserrat-Bold' }}>ACTIVE</Text></View>
              </View>
              <View style={styles.rowTwoCol}>
                <View style={styles.colItem}><Text style={styles.colLabel}>Base SI</Text><Text style={styles.colValue}>₹ 5,00,000</Text></View>
                <View style={styles.colItem}><Text style={styles.colLabel}>Top-up</Text><Text style={styles.colValue}>₹ 2,00,000</Text></View>
              </View>
              <Text style={styles.policyNumber}>Policy No: <Text style={{ fontFamily: 'Montserrat-Bold' }}>SHP-987654321</Text></Text>
              <View style={[styles.rowTwoCol, { marginTop: hp(1.2) }]}>
                <View style={styles.colItem}><Text style={styles.colLabel}>Insured by</Text><Text numberOfLines={1} style={styles.colValue}>Sample Insurance Co.</Text></View>
                <View style={styles.colItem}><Text style={styles.colLabel}>TPA</Text><Text numberOfLines={1} style={styles.colValue}>MediAssist</Text></View>
              </View>
              <View style={styles.cta}><Text style={styles.ctaText}>View Details</Text></View>
            </View>
          </View>
        </LinearGradientBg>
      </View>
    </View>
  );
};

const DummyWellnessCard = () => {
  const theme = { gradient: ['#f3f4f6', '#e5e7eb'], shadowColor: '#9ca3af', textColor: '#374151', subTextColor: '#64748b', tagBgColor: '#475569', tagTextColor: '#FFFFFF' };
  return (
    <View style={[styles.dummyWellnessContainer, { shadowColor: theme.shadowColor }]}>
      <LinearGradientBg colors={theme.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dummyWellnessGradient}>
        <View style={styles.dummyWellnessInner}>
          <View style={[styles.dummyWellnessTag, { backgroundColor: theme.tagBgColor }]}><Text style={[styles.dummyWellnessTagText, { color: theme.tagTextColor }]}>50% OFF</Text></View>
          <View style={styles.dummyWellnessTopLeft}>
            <Text style={[styles.dummyWellnessCategory, { color: theme.subTextColor }]}>Talk to Doctor</Text>
            <Text style={[styles.dummyWellnessTitle, { color: theme.textColor }]} numberOfLines={2}>Talk to Doctor</Text>
          </View>
          <FastImage source={require('../../assets/taltodocgp.png')} style={styles.dummyWellnessImage} resizeMode="cover" />
        </View>
      </LinearGradientBg>
    </View>
  );
};

const DummyHelpCard = () => {
  const theme = { gradient: ['#eef2ff', '#e0e7ff'], shadowColor: '#6366f1', textColor: '#1e3a8a', subTextColor: '#4338ca', tagBgColor: '#6366f1' };
  return (
    <View style={[styles.dummyWellnessContainer, { shadowColor: theme.shadowColor, borderWidth: 1, borderColor: '#c7d2fe' }]}>
      <LinearGradientBg colors={theme.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dummyhelpGradient}>
        <View style={styles.dummyWellnessInner}>
          <View style={[styles.dummyHelpTag, { backgroundColor: theme.tagBgColor }]}><Text style={styles.dummyHelpTagText}>24/7</Text></View>
          <View style={styles.dummyWellnessTopLeft}>
            <Text style={[styles.dummyWellnessCategory, { color: theme.subTextColor, letterSpacing: 0 }]}>CONTACT US</Text>
            <Text style={[styles.dummyWellnessTitle, { color: theme.textColor }]} numberOfLines={2}>Help and Support</Text>
          </View>
          <FastImage source={require('../../assets/help.png')} style={styles.dummyHelpImage} resizeMode="contain" />
        </View>
      </LinearGradientBg>
    </View>
  );
};

const DummyEnrollmentCard = () => (
  <View style={[styles.newBannerContainer, { width: wp(85) }]}>
    <View style={styles.newBannerLeft}>
      <Text style={styles.newBannerTitle}>Enrollment Open</Text>
      <Text style={styles.newBannerDesc}>
        Complete your benefit coverages to bring security and modern care to your lifestyle.
      </Text>
      <View style={styles.newBannerBtn}>
        <Text style={styles.newBannerBtnText}>Start Now</Text>
      </View>
    </View>
    <View style={styles.newBannerRight}>
      <View style={styles.tiltedCardWrapper}>
        <View style={styles.floatingTooltip}>
          <Text style={styles.tooltipText}>Track your{"\n"}Progress</Text>
        </View>
        <View style={styles.tiltedCard}>
          <View style={styles.progressHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.greenDot} />
              <Text style={styles.progressText}>Progress</Text>
            </View>
            <Svg width={wp(2.5)} height={wp(3.5)} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Circle cx="12" cy="12" r="10"/><Path d="M12 6v6l4 2"/>
            </Svg>
          </View>
          <View style={styles.stepRow}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}><Text style={styles.stepCircleTextActive}>1</Text></View>
            <Text style={styles.stepTextActive}>Add Dependents</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}><Text style={styles.stepCircleText}>2</Text></View>
            <Text style={styles.stepText}>Choose Plans</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}><Text style={styles.stepCircleText}>3</Text></View>
            <Text style={styles.stepText}>Extra Coverage</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepCircle}><Text style={styles.stepCircleText}>4</Text></View>
            <Text style={styles.stepText}>Review & Submit</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const CustomCopilotTooltip = () => {
  const { isLastStep, goToNext, stop, currentStep } = useCopilot();
  
  const rawText = currentStep?.text || '';
  const textParts = rawText.split('\n');
  const title = textParts[0];
  const description = textParts.slice(1).join('\n');

  const { data } = useSelector((state) => state.profile) || {};
  const { data: PolicyData } = useSelector((state) => state.policy);
  
  const enrollmentLogic = useMemo(() => {
    const enrollmentlistdata = PolicyData?.data?.enrolment;
    if (!enrollmentlistdata) return { shouldShowImage: false };
    const currentDate = new Date();
    const hasValidAssignedDates = enrollmentlistdata?.new_enrolment_assigned?.every(item => new Date(item.portal_end_date) >= currentDate);
    const hasValidSubmittedDates = enrollmentlistdata?.new_enrolment_submitted?.every(item => new Date(item.portal_end_date) >= currentDate);
    const hasAssignedData = enrollmentlistdata?.new_enrolment_assigned?.length > 0;
    const hasAssignedsubmittedData = enrollmentlistdata?.new_enrolment_submitted?.length > 0;
    return (hasAssignedData || hasAssignedsubmittedData) && (hasValidAssignedDates || hasValidSubmittedDates);
  }, [PolicyData]);
  
  const isPolicyStep = currentStep?.name === 'policyCard';
  const isProfileStep = currentStep?.name === 'profile';
  const stepNumber = currentStep?.order || 1;
  const totalSteps = 5;
  const gender = data?.data?.user?.gender || 'male';
  const fullName = data?.data?.user?.full_name || 'Brijesh Kumar';
  
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 18) greeting = 'Good Afternoon';
  else if (hour >= 18) greeting = 'Good Evening';

  const handleFinishTutorial = async () => {
    try { await AsyncStorage.setItem('tutorialCompleted', 'true'); } catch (error) {}
    stop();
  };

  const renderDummyBottomTab = (activeTabOverride = null) => {
    const tabs = [
      { name: 'Home', label: 'Home' },
      { name: 'claimsTab', label: 'Claims' },
      { name: 'wellnessTab', label: 'Wellness' },
      { name: 'helpTab', label: 'Help' },
    ];

    return (
      <View style={[styles.dummyTabBarWrapper, { bottom:activeTabOverride=== 'Home' ? -hp(1) : -hp(5) }]}>
        <Svg height={hp(11)} width={width} style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <Defs>
            <LinearGradient id="dummyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="1" stopColor="#f8f9fa" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path d={`M 0 15 L 0 ${hp(11)} L ${width} ${hp(11)} L ${width} 15 Z`} fill="url(#dummyGrad)" stroke="#e0e0e0" strokeWidth="0.5" />
        </Svg>

        <View style={styles.dummyTabInnerContainer}>
          {tabs.map((tab) => {
            const isFocused = activeTabOverride === tab.name || currentStep?.name === tab.name || (isPolicyStep && tab.name === 'Home');

            const getIcon = () => {
              if (tab.name === 'Home') return <HomeIcon size={24} color={isFocused ? '#934790' : '#8E9AAF'} filled={isFocused} />;
              if (tab.name === 'claimsTab') return <ClaimsIcon size={24} color={isFocused ? '#934790' : '#8E9AAF'} filled={isFocused} />;
              if (tab.name === 'wellnessTab') return <WellnessIcon size={24} color={isFocused ? '#934790' : '#8E9AAF'} filled={isFocused} />;
              if (tab.name === 'helpTab') return <HelpIcon size={20} color={isFocused ? '#934790' : '#8E9AAF'} filled={isFocused} />;
            };

            return (
              <View key={tab.name} style={styles.dummyTabItem}>
                <View style={[styles.dummyIconWrapper, isFocused && styles.dummyIconWrapperActive]}>
                  {getIcon()}
                </View>
                <Text style={[styles.dummyTabLabel, isFocused && styles.dummyTabLabelActive]}>{tab.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (isPolicyStep) {
   if (enrollmentLogic) { 
      // 🔥 FIX: Restored this to exactly match the Step 2/3 return format. 
      // No more absolute positioning here.
      return (
        <View style={styles.bottomDomeWrapper}>
          <View style={styles.whiteDomeBackground} />
          
          <View style={styles.topButtonsRow}>
            <TouchableOpacity onPress={handleFinishTutorial} activeOpacity={0.7}>
              <Text style={styles.skipTextWhite}>Skip tutorial</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNext} style={styles.nextBtnWhite} activeOpacity={0.8}>
              <Text style={styles.nextBtnTextWhite}>Next ></Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.textContent}>
            <Text style={styles.counter}>01/05</Text>
            <Text style={styles.title}>Enrollment Open</Text>
            <Text style={styles.description}>Your insurance enrollment window is now active! Please review your plan and add your dependents before the deadline to ensure coverage.</Text>
            
            <View style={{ alignItems: 'center', marginTop: hp(2) }}>
              <DummyEnrollmentCard />
            </View>
          </View>
          
          {renderDummyBottomTab('Home')}
        </View>
      );
    }

    return (
      // 🔥 FIX: Changed top from -hp(32) to -hp(12) so it stops pushing the content out of the screen.
      // Added left: -wp(4.5) to center the container within the Copilot wrapper.
      <View style={{ width: wp(100), position: 'absolute', top: -hp(12), left: -wp(4.5) }}>
        <View style={styles.step1DomeBackground} />
        <View style={styles.step1TopSection}>
          <View style={{ marginTop: hp(6), paddingHorizontal: wp(6) ,marginLeft: wp(5)}}>
            <Text style={styles.counter}>01/05</Text>
            <Text style={styles.title}>Your Policy Details</Text>
            <Text style={styles.description}>Access your active insurance policies, download your e-cards, and view coverage limits all in one place.</Text>
          </View>
          <View style={{ marginTop: hp(2), width: '100%', alignItems: 'center',marginLeft: wp(3) }}>
            <DummyPolicyCard />
          </View>
        </View>
        <View style={styles.step1ButtonSection}>
          <TouchableOpacity onPress={handleFinishTutorial} activeOpacity={0.7}>
            <Text style={styles.skipTextWhite}>Skip tutorial</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNext} style={styles.nextBtnWhite} activeOpacity={0.8}>
            <Text style={styles.nextBtnTextWhite}>Next ></Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isProfileStep) {
    return (
      <View style={{ width: wp(100), height: hp(100), position: 'relative' }}>
        <View style={styles.step5DomeBackground} />
        <View style={styles.step5TopSection}>
          <View style={styles.realProfileContainer}>
            <FastImage source={gender === 'male' ? require('../../assets/profileman.png') : require('../../assets/profilewomen.png')} style={styles.realAvatar} />
            <View>
              <Text style={styles.realGreetSmall}>{greeting}</Text>
              <Text style={styles.realGreetName} numberOfLines={1}>{fullName}</Text>
            </View>
          </View>
          <View style={{ marginTop: hp(0.5), paddingHorizontal: wp(1) }}>
            <Text style={styles.counter}>{String(stepNumber).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}</Text>
            <Text style={styles.title}>{title}</Text>
            {!!description && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>
        <View style={styles.step5ButtonSection}>
          <TouchableOpacity onPress={handleFinishTutorial} activeOpacity={0.7}><Text style={styles.skipTextWhite}>Skip tutorial</Text></TouchableOpacity>
          <TouchableOpacity onPress={handleFinishTutorial} style={styles.nextBtnWhite} activeOpacity={0.8}><Text style={styles.nextBtnTextWhite}>Finish</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bottomDomeWrapper}>
      <View style={styles.whiteDomeBackground} />
      <View style={styles.topButtonsRow}>
        <TouchableOpacity onPress={handleFinishTutorial} activeOpacity={0.7}><Text style={styles.skipTextWhite}>Skip tutorial</Text></TouchableOpacity>
        <TouchableOpacity onPress={isLastStep ? handleFinishTutorial : goToNext} style={styles.nextBtnWhite} activeOpacity={0.8}><Text style={styles.nextBtnTextWhite}>{isLastStep ? 'Finish' : 'Next >'}</Text></TouchableOpacity>
      </View>
      
      <View style={styles.textContent}>
        <Text style={styles.counter}>{String(stepNumber).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}</Text>
        <Text style={styles.title}>{title}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
        
        {currentStep?.name === 'claimsTab' && (
           <View style={{ marginTop: hp(2.5), width: '100%', alignItems: 'center' }}><DummyClaimCard /></View>
        )}
        {currentStep?.name === 'wellnessTab' && (
           <View style={{ marginTop: hp(1.5), width: '100%', alignItems: 'center', paddingBottom: hp(2.5) }}><DummyWellnessCard /></View>
        )}
        {currentStep?.name === 'helpTab' && (
           <View style={{ marginTop: hp(1.5), width: '100%', alignItems: 'center', paddingBottom: hp(2.5) }}><DummyHelpCard /></View>
        )}
      </View>
      {renderDummyBottomTab()}
    </View>
  );
};

export default CustomCopilotTooltip;

const styles = StyleSheet.create({
  skipTextWhite: { fontSize: wp(3.5), fontFamily: 'Montserrat-Bold', color: '#FFFFFF' },
  nextBtnWhite: { borderWidth: 1.5, borderColor: '#FFFFFF', borderRadius: wp(6), paddingVertical: hp(0.8), paddingHorizontal: wp(6) },
  nextBtnTextWhite: { fontSize: wp(3.5), fontFamily: 'Montserrat-Bold', color: '#FFFFFF' },
  counter: { color: '#FF7A59', fontSize: wp(3.2), fontFamily: 'Montserrat-Bold', marginBottom: hp(1) },
  title: { fontSize: wp(4.7), fontFamily: 'Montserrat-Bold', color: '#1E293B', marginBottom: hp(0.8) },
  description: { fontSize: wp(3.3), fontFamily: 'Montserrat-SemiBold', color: '#393e46', lineHeight: hp(2.5) },

  step1DomeBackground: { position: 'absolute', width: wp(185), height: wp(187), borderRadius: wp(90), left: -(wp(180) - wp(100)) / 2, top: -(wp(180) - hp(50)), backgroundColor: '#F4F5F9', zIndex: 0 },
  step1TopSection: { height: hp(50), zIndex: 1 },
  // 🔥 FIX: Adjusted top offset from hp(63) to hp(55) so the buttons display nicely below the card
  step1ButtonSection: { marginLeft: wp(4), position: 'absolute', top: hp(59), width: wp(100), paddingHorizontal: wp(4), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  
  step5DomeBackground: { position: 'absolute', width: PROFILE_DOME_DIAMETER, height: PROFILE_DOME_DIAMETER, borderRadius: PROFILE_DOME_DIAMETER / 2, left: -(PROFILE_DOME_DIAMETER - wp(100)) / 2, top: -(PROFILE_DOME_DIAMETER - PROFILE_DOME_BOTTOM_EDGE), backgroundColor: '#F4F5F9', zIndex: 0 },
  step5TopSection: { height: PROFILE_DOME_BOTTOM_EDGE, paddingTop: Platform.OS === 'ios' ? hp(1) : 0, paddingHorizontal: wp(5), zIndex: 1 },
  realProfileContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'ios' ? -hp(8) : -hp(8) },
  realAvatar: { width: wp(12), height: wp(12), borderRadius: wp(6), marginRight: wp(3), borderWidth: 2, borderColor: '#934790', backgroundColor: '#F0F0F0' },
  realGreetSmall: { color: '#64748B', fontSize: wp(3), fontFamily: 'Montserrat-SemiBold' },
  realGreetName: { color: '#1E293B', fontSize: wp(3.5), fontFamily: 'Montserrat-Bold' },
  step5ButtonSection: { width: wp(100), paddingHorizontal: wp(6), paddingTop: hp(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },

  bottomDomeWrapper: { height: hp(65), width: wp(120), justifyContent: 'flex-start', position: 'relative' ,left: -wp(4) },
  whiteDomeBackground: { position: 'absolute', width: wp(220), height: wp(280), borderRadius: wp(110), left: -(wp(220) - wp(100)) / 2, top: hp(10), backgroundColor: '#F4F5F9', zIndex: 0 },
  topButtonsRow: { width: wp(100), paddingHorizontal: wp(6), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  textContent: { width: wp(100), paddingHorizontal: wp(7), paddingTop: hp(12), zIndex: 1 },

  dummyTabBarWrapper: { position: 'absolute', left: 0, width: wp(100), height: hp(10), zIndex: 100 },
  dummyTabInnerContainer: { flexDirection: 'row', alignItems: 'center', height: hp(11), paddingTop: hp(3) },
  dummyTabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  dummyIconWrapper: { marginBottom: 4 },
  
  dummyIconWrapperActive: { 
    width: wp(13), height: wp(13), borderRadius: wp(6.5), borderWidth: 1.5, borderColor: '#934790', backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', transform: [{ translateY: -hp(2) }], elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  dummyTabLabel: { fontSize: 11, color: '#8E9AAF', fontWeight: '500' },
  dummyTabLabelActive: { color: '#934790', fontWeight: '600', transform: [{ translateY: -hp(1.5) }] },

  cardShadowContainer: { backgroundColor: 'transparent', shadowColor: '#2A1F3D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  cardBorderClipper: { flex: 1, borderWidth:1, borderColor:'rgba(255,255,255,0.8)', borderRadius: wp(4.5), overflow: 'hidden', backgroundColor: '#FAF7FB' },
  fullCardGradient: { flex: 1, width: '100%', height: '100%' }, 
  contentContainer: { flex: 1, flexDirection: 'row', padding: wp(3.5) },
  accentCircle: { position: 'absolute', right: wp(3.5), top: hp(1.5), width: wp(25), height: wp(25), borderRadius: wp(12.5), backgroundColor: 'rgba(147, 71, 144, 0.08)' },
  bubble1: { position: 'absolute', left: wp(4.5), top: hp(3), width: wp(6), height: wp(6), borderRadius: wp(3), backgroundColor: 'rgba(147, 71, 144, 0.06)' },
  bubble2: { position: 'absolute', left: wp(18), top: hp(7.5), width: wp(4), height: wp(4), borderRadius: wp(2), backgroundColor: 'rgba(147, 71, 144, 0.05)' },
  bubble3: { position: 'absolute', left: wp(9), bottom: hp(5.2), width: wp(8), height: wp(8), borderRadius: wp(4), backgroundColor: 'rgba(76, 127, 255, 0.05)' },
  textBlock: { flex: 1 },
  policyCardTitle: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', color: '#2A1F3D', marginBottom: hp(1.2) },
  rowTwoCol: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  colItem: { width: '48%' },
  colLabel: { fontSize: hp(1.2), fontFamily: 'Montserrat-Regular', color: '#7D6D8A' },
  colValue: { fontSize: hp(1.3), fontFamily: 'Montserrat-SemiBold', color: '#4A2E67',  lineHeight: hp(2) },
  policyNumber: { marginTop: hp(1.2), fontSize: hp(1.4), fontFamily: 'Montserrat-Regular', color: '#6B5C79' },
  cta: { backgroundColor: '#934790', paddingVertical: hp(1), paddingHorizontal: wp(2.2), borderRadius: wp(2), marginTop: hp(1.4), alignSelf: 'flex-start' },
  ctaText: { color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: hp(1.3) },

  dummyCardContainer: { width: '95%', borderRadius: wp(3.5), shadowColor: '#1B5E20', shadowOffset: { width: 0, height: hp(0.5) }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, backgroundColor: '#FFF', borderWidth: 1 },
  gradientBackground: { borderRadius: wp(3.5), overflow: 'hidden' },
  gradientBackground1: { padding: wp(2.5) },
  dummyTopSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: hp(1.5) },
  dummyPolicyBadge: { paddingVertical: hp(0.4), paddingHorizontal: wp(2), borderRadius: wp(1.5), marginBottom: hp(0.5), alignSelf: 'flex-start' },
  dummyPolicyText: { color: '#FFFFFF', fontSize: hp(1), fontFamily: 'Montserrat-Bold', textTransform: 'uppercase' },
  dummyAmountText: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', color: '#2E1A2D', textAlign: 'right' },
  dummyStatusText: { fontSize: hp(1), fontFamily: 'Montserrat-Bold', textTransform: 'uppercase', letterSpacing: 0.2, textAlign: 'left', marginTop: hp(0.2), lineHeight: hp(1.4) },
  dummyPatientBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)', padding: wp(2), borderRadius: wp(2), marginBottom: hp(1.5), borderWidth: 1 },
  dummyPatientIconPlaceholder: { width: wp(6), height: wp(6), borderRadius: wp(3), justifyContent: 'center', alignItems: 'center', marginRight: wp(2) },
  dummyPatientName: { fontSize: hp(1.1), fontFamily: 'Montserrat-Bold', color: '#2E1A2D' },
  dummyPatientRelation: { fontSize: hp(1.1), fontFamily: 'Montserrat-SemiBold' },
  dummyActionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dummySecondaryButton: { paddingVertical: hp(0.8), borderRadius: wp(2), alignItems: 'center', paddingHorizontal: wp(4), borderWidth: 1 },
  dummySecondaryButtonText: { fontSize: hp(1.1), fontFamily: 'Montserrat-Bold' },
  dummyPrimaryButton: { paddingHorizontal: wp(4), paddingVertical: hp(0.8), borderRadius: wp(2), alignItems: 'center', elevation: 2 },
  dummyPrimaryButtonText: { color: '#FFFFFF', fontSize: hp(1.1), fontFamily: 'Montserrat-Bold' },

  dummyWellnessContainer: { width:Platform.OS === 'ios' ? wp(50) : wp(45), height:Platform.OS === 'ios' ? hp(24) : hp(22), borderRadius: wp(5), shadowOffset: { width: 0, height: hp(0.5) }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  dummyWellnessGradient: { flex: 1, borderRadius: wp(5), padding: wp(3) },
  dummyhelpGradient: { flex: 1, borderRadius: wp(5),  padding:Platform.OS === 'ios' ? wp(0.9) : wp(3) },
  dummyWellnessInner: { flex: 1, position: 'relative'  },
  dummyWellnessTopLeft: { alignItems: 'flex-start', width: '90%', marginTop: hp(0.5) },
  dummyWellnessCategory: { fontSize: hp(0.8), fontFamily: 'Montserrat-Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: hp(0.5) },
  dummyWellnessTitle: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', lineHeight: hp(2.2) },
  dummyWellnessTag: { position: 'absolute', top: -hp(0.5), right:  Platform.OS === 'ios' ? wp(3) : -wp(1.5), paddingHorizontal: wp(2.5), paddingVertical: hp(0.6), borderRadius: wp(3), zIndex: 10, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: hp(0.12) }, shadowOpacity: 0.1, shadowRadius: 1 },
  dummyWellnessTagText: { fontSize: hp(1.1), fontFamily: 'Montserrat-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  dummyWellnessImage: { position: 'absolute', bottom: -hp(0.6), right:Platform.OS === 'ios' ? wp(1.8) : -wp(1.2), width: Platform.OS === 'ios' ? wp(25) : wp(30), height: Platform.OS === 'ios' ? hp(15) : hp(13) },
  dummyHelpTag: { position: 'absolute', bottom: hp(1), left: 0, paddingHorizontal: wp(3), paddingVertical: hp(0.5), borderRadius: wp(1.5), zIndex: 10, elevation: 1 },
  dummyHelpTagText: { fontSize: hp(1.2), fontFamily: 'Montserrat-Bold', color: '#FFFFFF', letterSpacing: 1 },
  dummyHelpImage: { position: 'absolute', bottom: -hp(0.5), right: -wp(2), width: wp(28), height: hp(11), opacity: 0.9 },
  newBannerContainer: { backgroundColor: '#FDE067', borderRadius: wp(5), marginTop: hp(2), flexDirection: 'row', paddingHorizontal: wp(4), alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4, overflow: 'visible' },
  newBannerLeft: { flex: 1.4, paddingRight: wp(2) },
  newBannerTitle: { fontSize: hp(1.3), fontFamily: 'Montserrat-Bold', color: '#111827', marginBottom: hp(0.8) },
  newBannerDesc: { fontSize: hp(0.85), fontFamily: 'Montserrat-Regular', color: '#101215', marginBottom: hp(1), lineHeight: hp(1.6) },
  newBannerBtn: { backgroundColor: '#FFFFFF', marginTop: hp(0.5), paddingVertical: hp(0.8), paddingHorizontal: wp(4), borderRadius: wp(5), alignSelf: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  newBannerBtnText: { color: '#111827', fontFamily: 'Montserrat-Bold', fontSize: hp(0.85) },
  newBannerRight: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  tiltedCardWrapper: { position: 'relative', width: wp(34), marginRight: 0 },
  floatingTooltip: { position: 'absolute', top: -hp(3.1), left: -wp(6), backgroundColor: '#2563EB', borderRadius: wp(2), paddingVertical: hp(0.7), paddingHorizontal: wp(2.5), zIndex: 10, elevation: 5, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4 },
  tooltipText: { color: '#FFFFFF', fontFamily: 'Montserrat-SemiBold', fontSize: hp(0.6), textAlign: 'center', lineHeight: hp(1.2) },
  tiltedCard: { backgroundColor: '#FFFFFF', borderRadius: wp(3.5), padding: wp(1.5), transform: [{ rotate: '4deg' }], shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1.2) },
  greenDot: { width: wp(1.2), height: wp(1.2), borderRadius: wp(0.9), backgroundColor: '#10B981', marginRight: wp(1.5) },
  progressText: { fontSize: hp(0.6), fontFamily: 'Montserrat-Bold', color: '#111827' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) },
  stepCircle: { width: wp(2.8), height: wp(2.8), borderRadius: wp(1.5), backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: wp(2) },
  stepCircleActive: { backgroundColor: '#2563EB' },
  stepCircleText: { fontSize: hp(1), fontFamily: 'Montserrat-Bold', color: '#9CA3AF' },
  stepCircleTextActive: { fontSize: hp(0.8), fontFamily: 'Montserrat-Bold', color: '#FFFFFF' },
  stepText: { fontSize: hp(0.8), fontFamily: 'Montserrat-SemiBold', color: '#9CA3AF' },
  stepTextActive: { fontSize: hp(0.6), fontFamily: 'Montserrat-Bold', color: '#111827' },
});