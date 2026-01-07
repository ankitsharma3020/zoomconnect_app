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
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// 1. Updated Import: Added G, Polygon, Rect for drawing icons
import Svg, { Defs, Pattern, Path, Rect, Circle, G } from 'react-native-svg';

// Components
import PolicyCardList from '../component/policyCard';
import ActivePolicyHeader from '../component/activpolicy';
import EnrollmentModal from '../component/Enrollmodal';
import SurveyModal from '../component/Survaymodal';
import Header from '../component/header';
import ClaimCard from '../component/claimscard';
import PromoCarousel from '../component/promocorosl';
import PolicysCardList from '../component/policyscard';
import BannnerCarousel from '../component/bannerCorosol';
import PromoCarousel2 from '../component/promocorsol2';
import PromoCarousel3 from '../component/policycorosol3';
import HealthCarousel from '../component/healthCorosol';
import { wp, hp } from '../utilites/Dimension'; // Added import for dynamic dimensions

const { width, height } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); // approx 80

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- ICONS FOR QUICK ACTIONS ---
const FileClaimIcon = () => (
  <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none" stroke="#934790" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6" />
    <Path d="M16 13H8" />
    <Path d="M16 17H8" />
    <Path d="M10 9H8" />
  </Svg>
);

const HospitalIcon = () => (
  <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none" stroke="#934790" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Svg>
);

const ECardIcon = () => (
  <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none" stroke="#934790" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M7 8h10" />
    <Path d="M7 12h10" />
    <Path d="M7 16h10" />
  </Svg>
);

const SupportIcon = () => (
  <Svg width={wp(6)} height={wp(6)} viewBox="0 0 24 24" fill="none" stroke="#934790" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);


const Dashboard = ({ navigation }) => {

  // --- QUICK ACTIONS DATA ---
  const quickActions = [
    { id: 1, title: 'Intimate Claim', icon: FileClaimIcon, screen: 'Claims' },
    { id: 2, title: 'Network Hospitals', icon: HospitalIcon, screen: 'Hospitals' },
    { id: 3, title: 'Download E-Card', icon: ECardIcon, screen: 'ECard' },
    { id: 4, title: 'Help & Support', icon: SupportIcon, screen: 'Support' },
  ];


  return (
    <View style={styles.screenWrap}>
      <View pointerEvents="none" style={styles.patternWrap}>
        <LinearGradient
          colors={['#F6F7FB', '#F0ECF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      
      </View>

      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.sectionContainer}>
            <ActivePolicyHeader
              title="Home"
              subtitle="Find all your claims here."
              onBack={() => navigation?.goBack?.()}
              illustration={require('../../assets/policies.png')}
            />
          </View>
         <BannnerCarousel/>
          {/* --- NEW SECTION: Quick Actions --- */}
          {/* <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity 
                    key={action.id} 
                    style={styles.actionCard}
                    onPress={() => navigation.navigate(action.screen)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      <Icon />
                    </View>
                    <Text style={styles.actionText}>{action.title}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View> */}
          <View style={styles.sectionHeaderContainer}>
             <Text style={styles.sectionTitle}>Active Policy Details</Text>
          </View>
          <PolicysCardList/>
           {/* <View style={styles.sectionHeaderContainer}>
             <Text style={styles.sectionTitle}>Featured Offers</Text>
          </View> */}
       
          <HealthCarousel/>
          <PromoCarousel2/>
            {/* <View style={styles.sectionHeaderContainer}>
             <Text style={styles.sectionTitle}>Featured Offers</Text>
          </View> */}
          <PromoCarousel3/>
         
          <PromoCarousel3/>
        </ScrollView>

        <View pointerEvents="none" style={styles.fixedFooterWrap}>
          <Text style={styles.fixedFooterText}>HOME</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Dashboard;


const styles = StyleSheet.create({
  screenWrap: { flex: 1, backgroundColor: 'transparent' },
  patternWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  safe: { flex: 1, zIndex: 1 },
  
  fixedHeaderWrapper: {
    zIndex: 10,
    backgroundColor: 'transparent', 
  },

  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(18) }, // approx 150
  sectionContainer: { paddingHorizontal: Platform.OS === 'ios' ? wp(0) : wp(4), marginBottom: hp(1.2) }, // approx 16, 10

  // --- Quick Actions Styles ---
  quickActionsContainer: {
    paddingHorizontal: wp(4), // approx 16
    marginBottom: hp(3), // approx 24
  },
  sectionTitle: {
    fontSize: hp(1.7), // approx 18
    fontFamily: 'Montserrat-Bold', // Font
    color: '#1F2937',
 
    marginLeft: wp(3), // approx 4
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', 
  },

  actionCard: {
    width: '23%', 
    alignItems: 'center',
    marginBottom: hp(1.2), // approx 10
  },
  iconCircle: {
    width: wp(14), // approx 56
    height: wp(14),
    borderRadius: wp(7), // approx 28
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1), // approx 8
    // Soft shadow
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionText: {
    fontSize: hp(1.4), // approx 11
    fontFamily: 'Montserrat-SemiBold', // Font
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: hp(1.8), // approx 14
  },

  // --- Fixed Footer ---
  fixedFooterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_TAB_HEIGHT + hp(3.7), // approx 30
    alignItems: 'center',
    zIndex: 0, 
  },
  fixedFooterText: {
    fontSize: hp(7.5), // approx 60
    fontFamily: 'Montserrat-Bold', // Font (Black weight preferred if available, else Bold)
    color: 'rgba(15,17,32,0.06)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },
  
  card: {
    alignSelf: 'center',
    borderRadius: wp(6), // approx 24
    width: '100%',
    maxWidth: wp(95), // approx 390
    paddingVertical: hp(5), // approx 40
    paddingHorizontal: wp(6), // approx 24
    alignItems: 'center',
  },
  image: {
    width: wp(70), // approx 280
    height: hp(30), // approx 240
    marginBottom: hp(3), // approx 24
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: hp(3), // approx 25
    fontFamily: 'Montserrat-Bold',
    color: '#1A3B5D',
    marginBottom: hp(1.5), // approx 12
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(2.2), // approx 18
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(3), // approx 24
    fontFamily: 'Montserrat-Regular',
    maxWidth: '90%',
  },

 sectionHeaderContainer: {
    paddingHorizontal: wp(3), // approx 16
    // approx 20
  },
  headerText: {
    fontSize: hp(2), // approx 20
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginBottom: hp(2.5), // approx 20
  },
});