import React from 'react';
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
  Platform,
  UIManager,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Path, Rect, Circle } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path

// Components
import ActivePolicyHeader from '../component/activpolicy';
import Header from '../component/header';
import ClaimCard from '../component/claimscard';

const { width, height } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); // approx 80

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- 2. Define SVG Icons Components with Dynamic Sizing ---

const FileClaimIcon = () => (
  <Svg width={wp(7)} height={wp(7)} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14 2V8H20" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 13H8" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 17H8" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10 9H9H8" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ProcessIcon = () => (
  <Svg width={wp(7)} height={wp(7)} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="2" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 18H12.01" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 6V6.01" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 10H15" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 14H15" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const RepresentativeIcon = () => (
  <Svg width={wp(7)} height={wp(7)} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17 11L19 13" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M23 21H23.01" stroke="#7E8CA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const claimScreen = ({ navigation }) => {

  const myClaimsData = [
  {
    id: 'c1',
    policyType: 'Base Policy',
    policyNo: '70994070',
    patientName: 'DATTATRAY JADHAV',
    patientRelation: 'Self',
    claimAmount: '₹ 51,400',
    claimStatus: 'Pending',
  },
    {
    id: 'c2',
    policyType: 'Base Policy',
    policyNo: '70994570',
    patientName: 'DATTATRAY JADHAV',
    patientRelation: 'Self',
    claimAmount: '₹ 41,400',
    claimStatus: 'sucess', 
  },
];

  const helpOptions = [
    {
      id: '1',
      title: 'How to file a claim?',
      IconComponent: FileClaimIcon, 
    },
    {
      id: '2',
      title: 'Know about claim process',
      IconComponent: ProcessIcon,
    },
    {
      id: '3',
      title: 'Connect with claim representative',
      IconComponent: RepresentativeIcon,
    },
  ];

  const renderItem = ({ item }) => {
    const Icon = item.IconComponent; 
    
    return (
      <TouchableOpacity style={styles.card1}>
        <View style={styles.iconContainer}>
          <Icon />
        </View>

        <Text style={styles.cardTitle}>{item.title}</Text>

        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>
    );
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
              title="Claims"
              subtitle="Find all your claims here."
              onBack={() => navigation?.goBack?.()}
              illustration={require('../../assets/policies.png')}
            />
          </View>
          
          {/* --- No Claims Card --- */}
          <View style={styles.card}>
            <Image
              source={require('../../assets/yoga.png')}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>No claims yet</Text>
              <Text style={styles.subtitle}>
                Well that’s a sign of you living a healthy life.
              </Text>
            </View>
          </View>

          <FlatList
            data={myClaimsData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: hp(2.5) }} 
            renderItem={({ item }) => (
                <ClaimCard
                item={item}
                onViewDetails={(claim) => console.log('View details for:', claim.id)}
                onDownload={(claim) => console.log('Download for:', claim.id)}
                />
            )}
            scrollEnabled={false} // Since it's inside a ScrollView
          />

          {/* --- Help List --- */}
          <View style={[styles.sectionContainer,{ marginTop: hp(2) }]}>
            <Text style={styles.headerText}>Need help?</Text>
              
            <FlatList
              data={helpOptions}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              scrollEnabled={false} 
            />
          </View>
      
        </ScrollView>

        {/* --- Fixed Footer Background Text --- */}
        <View pointerEvents="none" style={styles.fixedFooterWrap}>
          <Text style={styles.fixedFooterText}>YOUR CLAIMS</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default claimScreen;

/* =========================================================================
   STYLESHEET
   ========================================================================= */

const styles = StyleSheet.create({
  // --- Screen & Global Layout ---
  screenWrap: { flex: 1, backgroundColor: 'transparent' },
  patternWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  safe: { flex: 1, zIndex: 1 },
  
  fixedHeaderWrapper: {
    zIndex: 10,
    backgroundColor: 'transparent', 
  },

  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(18) }, // approx 150
  sectionContainer: { paddingHorizontal: Platform.OS === 'ios' ? 0 :  wp(4), marginBottom: hp(1.2) }, // approx 16, 10

  // --- Fixed Footer ---
  fixedFooterWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_TAB_HEIGHT + hp(0.7), // approx 30
    alignItems: 'center',
    zIndex: 0, 
  },
  fixedFooterText: {
    fontSize: hp(6.5), // approx 60
    fontFamily: 'Montserrat-Bold',
    color: 'rgba(15,17,32,0.06)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textAlign: 'center',
  },
  
  // --- No Claims Card ---
  card: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
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
    marginBottom: hp(1), // approx 24
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: hp(2.4), // approx 25
    fontFamily: 'Montserrat-Bold',
    color: '#1A3B5D',
    marginBottom: hp(1.5), // approx 12
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(1.8), // approx 18
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(2), // approx 24
    fontFamily: 'Montserrat-Regular',
    maxWidth: '90%',
  },

  // --- Help List Styles ---
  headerText: {
    fontSize: hp(2), // approx 20
    marginLeft: wp(1.5), // approx 4
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginBottom: hp(2.5), // approx 20
  },
  card1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(7.5), // approx 30
    paddingVertical: hp(1.5), // approx 16
    paddingHorizontal: wp(5), // approx 20
    marginBottom: hp(2), // approx 16
    borderWidth: 1,
    borderColor: '#EEEEEE',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 1,
  },
  iconContainer: {
    width: wp(12.5), // approx 50
    height: wp(12.5),
    borderRadius: wp(6.25), // approx 25
    backgroundColor: '#FFF8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4), // approx 16
  },
  cardTitle: {
    flex: 1,
    fontSize: hp(1.7), // approx 16
    fontFamily: 'Montserrat-SemiBold',
    color: '#2D3748',
  },
  arrowIcon: {
    fontSize: hp(2.5), // approx 20
    color: '#4A5568',
    fontFamily: 'Montserrat-Bold',
  },
});