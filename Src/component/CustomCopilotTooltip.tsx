




import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useCopilot } from 'react-native-copilot';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from 'react-redux';
import FastImage from '@d11/react-native-fast-image';

// 🔥 Using your provided utility
import { wp, hp } from '../utilites/Dimension';

// 🔥 DYNAMIC CONSTANTS 🔥
const PROFILE_DOME_DIAMETER = wp(180); // Corresponds to width * 1.8
const PROFILE_DOME_BOTTOM_EDGE = Platform.OS === 'ios' ? hp(24) : hp(22); 

const ClaimsIcon = ({ size = 24, color = '#934790' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>
);
const WellnessIcon = ({ size = 24, color = '#934790' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Svg>
);
const HelpIcon = ({ size = 20, color = '#934790' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M11 18H13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><Path d="M12 2C7.58 2 4 5.58 4 10C4 13.87 6.67 16.54 9 17.5V19C9 19.55 9.45 20 10 20H14C14.55 20 15 19.55 15 19V17.5C17.33 16.54 20 13.87 20 10C20 5.58 16.42 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);

const CustomCopilotTooltip = () => {
  const { isLastStep, goToNext, stop, currentStep } = useCopilot();
  

  const isPolicyStep = currentStep?.name === 'policyCard';
  const isProfileStep = currentStep?.name === 'profile'; 

  const rawText = currentStep?.text || '';
  const textParts = rawText.split('\n');
  const title = textParts[0];
  console.log('Current Copilot Step:', rawText);
  const description = textParts.slice(1).join('\n');
  
  const stepNumber = currentStep?.order || 1;
  const totalSteps = 5; 

  const { data } = useSelector((state) => state.profile) || {};
  const gender = data?.data?.user?.gender || 'male';
  const fullName = data?.data?.user?.full_name || 'Brijesh Kumar';
  
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 18) greeting = 'Good Afternoon';
  else if (hour >= 18) greeting = 'Good Evening';

  const renderHighlightedTab = () => {
    let IconComponent = null; let label = ''; let centerPosition = 0;
    if (currentStep?.name === 'claimsTab') { IconComponent = ClaimsIcon; label = 'Claims'; centerPosition = wp(30); } 
    else if (currentStep?.name === 'wellnessTab') { IconComponent = WellnessIcon; label = 'Wellness'; centerPosition = wp(70); } 
    else if (currentStep?.name === 'helpTab') { IconComponent = HelpIcon; label = 'Help'; centerPosition = wp(90); }

    if (!IconComponent) return null;
    return (
      <View style={[styles.highlightedTabMock, { left: centerPosition - wp(9) }]}>
        <View style={styles.tabIconCircle}><IconComponent size={wp(6)} color="#934790" /></View>
        <Text style={styles.tabMockLabel}>{label}</Text>
      </View>
    );
  };

  if (isPolicyStep) {
    return (
      <View style={styles.policyButtonsContainer}>
        <TouchableOpacity onPress={stop} activeOpacity={0.7}><Text style={styles.skipTextWhite}>Skip tutorial</Text></TouchableOpacity>
        <TouchableOpacity onPress={isLastStep ? stop : goToNext} style={styles.nextBtnWhite} activeOpacity={0.8}><Text style={styles.nextBtnTextWhite}>Next ></Text></TouchableOpacity>
      </View>
    );
  }

  if (isProfileStep) {
    return (
      <View style={{ width: wp(100), height: hp(100), position: 'relative' }}>
        <View style={styles.step5DomeBackground} />
        <View style={styles.step5TopSection}>
          <View style={styles.realProfileContainer}>
            <FastImage 
              source={gender === 'male' ? require('../../assets/profileman.png') : require('../../assets/profilewomen.png')} 
              style={styles.realAvatar} 
            />
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
          <TouchableOpacity onPress={stop} activeOpacity={0.7}><Text style={styles.skipTextWhite}>Skip tutorial</Text></TouchableOpacity>
          <TouchableOpacity onPress={stop} style={styles.nextBtnWhite} activeOpacity={0.8}><Text style={styles.nextBtnTextWhite}>Finish</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bottomDomeWrapper}>
      <View style={styles.whiteDomeBackground} />
      <View style={styles.topButtonsRow}>
        <TouchableOpacity onPress={stop} activeOpacity={0.7}><Text style={styles.skipTextWhite}>Skip tutorial</Text></TouchableOpacity>
        <TouchableOpacity onPress={isLastStep ? stop : goToNext} style={styles.nextBtnWhite} activeOpacity={0.8}><Text style={styles.nextBtnTextWhite}>{isLastStep ? 'Finish' : 'Next >'}</Text></TouchableOpacity>
      </View>
      <View style={styles.textContent}>
        <Text style={styles.counter}>{String(stepNumber).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}</Text>
        <Text style={styles.title}>{title}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      {renderHighlightedTab()}
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
  description: { fontSize: wp(3.3), fontFamily: 'Montserrat-SemiBold', color: '#393e46', lineHeight: hp(2.8) },

  policyButtonsContainer: { width: wp(100), paddingHorizontal: wp(6), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp(22) },

  // --- Step 5 Styles ---
  step5DomeBackground: {
    position: 'absolute',
    width: PROFILE_DOME_DIAMETER,
    height: PROFILE_DOME_DIAMETER,
    borderRadius: PROFILE_DOME_DIAMETER / 2,
    left: -(PROFILE_DOME_DIAMETER - wp(100)) / 2,
    top: -(PROFILE_DOME_DIAMETER - PROFILE_DOME_BOTTOM_EDGE), 
    backgroundColor: '#F4F5F9',
    zIndex: 0,
  },
  step5TopSection: { height: PROFILE_DOME_BOTTOM_EDGE, paddingTop: Platform.OS === 'ios' ? hp(1) : 0, paddingHorizontal: wp(5), zIndex: 1 },
  realProfileContainer: { flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 0 : -hp(8) },
  realAvatar: { width: wp(12), height: wp(12), borderRadius: wp(6), marginRight: wp(3), borderWidth: 2, borderColor: '#934790', backgroundColor: '#F0F0F0' },
  realGreetSmall: { color: '#64748B', fontSize: wp(3), fontFamily: 'Montserrat-SemiBold' },
  realGreetName: { color: '#1E293B', fontSize: wp(3.5), fontFamily: 'Montserrat-Bold' },
  step5ButtonSection: { width: wp(100), paddingHorizontal: wp(6), paddingTop: hp(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },

  // --- Steps 2, 3, 4 ---
  bottomDomeWrapper: { height: hp(60), width: wp(100), justifyContent: 'space-between', position: 'relative' },
  whiteDomeBackground: { position: 'absolute', width: wp(220), height: wp(220), borderRadius: wp(110), left: -(wp(220) - wp(100)) / 2, top: hp(15), backgroundColor: '#F4F5F9', zIndex: 0 },
  topButtonsRow: { width: wp(100), paddingHorizontal: wp(6), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  textContent: { width: wp(100), paddingHorizontal: wp(7), paddingBottom: hp(27), zIndex: 1,paddingTop: hp(20) },
  
  highlightedTabMock: { position: 'absolute', bottom: -hp(2), width: wp(18), alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  tabIconCircle: { width: wp(13), height: wp(13), borderRadius: wp(6.5), borderWidth: 1.5, borderColor: '#934790', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: hp(0.5), elevation: 12 },
  tabMockLabel: { fontSize: wp(2.8), color: '#934790', fontWeight: '600' },
});