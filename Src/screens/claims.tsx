import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  UIManager,
  FlatList,
  Modal,
  Animated,
  Easing
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Path, Rect, Circle } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension';

// Components
import ActivePolicyHeader from '../component/activpolicy';
import Header from '../component/header';
import ClaimCard from '../component/claimscard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetClaimdetailsMutation } from '../redux/service/user/user';
import { useDispatch, useSelector } from 'react-redux';
import Submittedclaimscard from '../component/Submittedclaimscard';
import FastImage from '@d11/react-native-fast-image';
import { fetchClaims } from './Epicfiles/MainEpic';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? hp(14) : hp(13);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Icons ---
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

// --- SHIMMER SKELETON ---
const ClaimCardSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
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
    <View style={styles.cardContainerSkeleton}>
      <View style={styles.skeletonInner}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(2) }}>
          <View style={{ width: wp(30), height: hp(1.5), backgroundColor: '#E0E0E0', borderRadius: 4 }} />
          <View style={{ width: wp(20), height: hp(1.5), backgroundColor: '#E0E0E0', borderRadius: 4 }} />
        </View>
        <View style={{ width: '100%', height: hp(8), backgroundColor: '#E0E0E0', borderRadius: 8, marginBottom: hp(2) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: wp(25), height: hp(4), backgroundColor: '#E0E0E0', borderRadius: 8 }} />
          <View style={{ width: wp(25), height: hp(4), backgroundColor: '#E0E0E0', borderRadius: 8 }} />
        </View>
      </View>
    </View>
  );
};


const ClaimScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [getClaims] = useGetClaimdetailsMutation();
  const {data:PolicyData} = useSelector((state) => state.policy);
  const dispatch = useDispatch();
  const ClaimState = useSelector((state) => state.claims);
  console.log("claim state", ClaimState.data.submitted_claims);
  // States
  const [claimDetails, setClaimDetails] = useState([]);      // Processed
  const [isLoading, setIsLoading] = useState(true);
  const Submitedaims=ClaimState.data.submitted_claims || [];

  const getClaimDetails = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      let res = await getClaims(token);
      console.log("claim details res", res);
      
      if (res?.data) {
        setClaimDetails(res?.data?.data?.claims || []); // PROCESSED
      }
    } catch (error) {
      console.log("claim details error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchClaims());
    getClaimDetails();
  }, []);

  let helpOptions = [];
  let hasActivePolicies = false;
  
  if (PolicyData && PolicyData.data && PolicyData.data.policy_details) {
      if (PolicyData.data.policy_details.length > 0) {
          hasActivePolicies = true;
      }
  }

  if (hasActivePolicies) {
      helpOptions = [
          { id: '1', title: 'File a claim', screen: 'fileclaim', IconComponent: FileClaimIcon },
          { id: '2', title: 'Know about claim process', screen: 'claimProcess', IconComponent: ProcessIcon },
          { id: '3', title: 'Connect with claim representative', isRepresentative: true, IconComponent: RepresentativeIcon }
      ];
  } else {
      helpOptions = [
          { id: '2', title: 'Know about claim process', screen: 'claimProcess', IconComponent: ProcessIcon }
      ];
  }

  const renderItem = ({ item }) => {
    const Icon = item.IconComponent;
    return (
      <TouchableOpacity 
        style={styles.card1}
        onPress={() => item.isRepresentative ? setModalVisible(true) : navigation.navigate(item.screen)}
      >
        <View style={styles.iconContainer}><Icon /></View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>
    );
  };

  // --- RENDER CLAIMS LOGIC ---
  const renderClaimsContent = () => {
    if (isLoading) {
      return (
        <View>
          <ClaimCardSkeleton />
          <ClaimCardSkeleton />
        </View>
      );
    }

    // Dono array empty hone par
    if (claimDetails.length === 0 && Submitedaims.length === 0) {
      return (
        <View style={styles.card}>
          <FastImage source={require('../../assets/yoga.png')} style={styles.image} resizeMode="cover" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>No claims yet</Text>
            <Text style={styles.subtitle}>Well that’s a sign of you living a healthy life.</Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        {/* SUBMITTED SECTION */}
        {Submitedaims && Submitedaims.length > 0 && (
          <View style={styles.claimSection}>
            <Text style={styles.headerText}>Submitted Claims</Text>
            
            {/* Pehla Card - Added isSubmitted prop */}
            <Submittedclaimscard
              item={Submitedaims[0]}
              isSubmitted={true}
              onViewDetails={() => console.log('Details', Submitedaims[0].id)}
              onDownload={() => console.log('Download')}
            />

            {/* Doosra Card (Agar exist karta hai) - Added isSubmitted prop */}
            {/* {Submitedaims.length > 1 && (
              <Submittedclaimscard
                item={Submitedaims[1]}
                isSubmitted={true}
                onViewDetails={() => console.log('Details', Submitedaims[1].id)}
                onDownload={() => console.log('Download')}
              />
            )} */}

            {/* View More Button */}
            {Submitedaims.length > 1 && (
              <TouchableOpacity 
                style={styles.viewMoreBtn}
                onPress={() => navigation.navigate('ClaimList', { type: 'Submitted', data: Submitedaims })}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* PROCESSED SECTION */}
        {claimDetails && claimDetails.length > 0 && (
          <View style={styles.claimSection}>
            <Text style={styles.headerText}>Processed Claims</Text>
            
            {/* Pehla Card (Defaults to purple theme) */}
            <ClaimCard
              item={claimDetails[0]}
              onViewDetails={() => console.log('Details', claimDetails[0].id)}
              onDownload={() => console.log('Download')}
            />

            {/* Doosra Card (Agar exist karta hai) */}
          

            {/* View More Button */}
            {claimDetails.length > 1 && (
              <TouchableOpacity 
                style={styles.viewMoreBtn}
                onPress={() => navigation.navigate('ClaimList', { type: 'Processed', data: claimDetails })}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screenWrap}>
      {/* Background Patterns */}
      <View pointerEvents="none" style={styles.patternWrap}>
        <LinearGradient colors={['#F6F7FB', '#F0ECF8']} style={StyleSheet.absoluteFill} />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <Pattern id="diags" patternUnits="userSpaceOnUse" width="20" height="20">
              <Path d="M0 20 L20 0" stroke="rgba(147,71,144,0.02)" strokeWidth="2" />
            </Pattern>
          </Defs>
          <Rect x={0} y={0} width={width} height={height} fill="url(#diags)" opacity={0.05} />
        </Svg>
        <View style={styles.fixedFooterWrap}>
          <Text style={styles.fixedFooterText}>YOUR CLAIMS</Text>
        </View>
      </View>

      <View style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>
        
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: HEADER_HEIGHT }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionContainer}>
            <ActivePolicyHeader
              title="Claims"
              subtitle="Find all your claims here."
              onBack={() => navigation?.goBack()}
              isEnhanced3D = {true}
              illustration={require('../../assets/claimshead.png')}
            />
          </View>

          {/* DYNAMIC CONTENT AREA */}
          <View style={styles.claimsWrapper}>
            {renderClaimsContent()}
          </View>
          
          <View style={[styles.sectionContainer, { marginTop: hp(1) }]}>
            <Text style={styles.headerText}>Need help?</Text>
            {/* Pure Loop for Help Options to avoid .map() or FlatList inside ScrollView */}
            {(() => {
               let helpViews = [];
               for(let i=0; i<helpOptions.length; i++) {
                 helpViews.push(<View key={helpOptions[i].id}>{renderItem({item: helpOptions[i]})}</View>);
               }
               return helpViews;
            })()}
          </View>

        </ScrollView>

        {/* --- MODAL --- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Connect with Claim Representative</Text>
              <Text style={styles.modalSub}>
                To connect with a claim representative, open your policy details and click <Text style={{fontWeight: '700', color: '#1A3B5D'}}>Connect.</Text>
              </Text>
              <TouchableOpacity 
                style={styles.modalActionBtn}
                onPress={() => {
                  navigation.navigate('Policy')
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalActionText}>Go to Policy Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrap: { flex: 1 },
  patternWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  safe: { flex: 1, zIndex: 1 },
  fixedHeaderWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, elevation: 10, backgroundColor: 'white' },
  scrollContent: { paddingBottom: hp(15) },
  sectionContainer: { paddingHorizontal: wp(4) ,marginTop: hp(3.5),marginBottom: hp(3) },
  headerText: { fontSize: hp(2), fontFamily: 'Montserrat-Bold', color: '#333', marginBottom: hp(2) },
  
  claimsWrapper: {
    paddingHorizontal: wp(4),
  },
  claimSection: {
    marginBottom: hp(2),
  },

  card1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(7.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  iconContainer: { width: wp(12), height: wp(12), borderRadius: wp(6), backgroundColor: '#FFF8F5', justifyContent: 'center', alignItems: 'center', marginRight: wp(4) },
  cardTitle: { flex: 1, fontSize: hp(1.7), fontFamily: 'Montserrat-SemiBold', color: '#2D3748' },
  arrowIcon: { fontSize: hp(2.5), color: '#4A5568' },
  fixedFooterWrap: { position: 'absolute', bottom: hp(10), width: '100%', alignItems: 'center' },
  fixedFooterText: { fontSize: hp(6), fontFamily: 'Montserrat-Bold', color: 'rgba(15,17,32,0.04)' },

  cardContainerSkeleton: {
    marginBottom: hp(2.5),
    borderRadius: wp(5),
    backgroundColor: '#F5F5F5', 
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  skeletonInner: {
    padding: wp(5),
    backgroundColor: '#F5F5F5',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: wp(6),
    padding: wp(8),
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: wp(4),
    right: wp(4),
    padding: 5,
  },
  closeText: {
    fontSize: wp(5),
    color: '#999',
  },
  modalTitle: {
    fontSize: hp(2.4),
    fontFamily: 'Montserrat-Bold',
    color: '#934790',
    textAlign: 'center',
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  modalSub: {
    fontSize: hp(1.6),
    fontFamily: 'Montserrat-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(2.6),
    marginBottom: hp(4),
  },
  modalActionBtn: {
    backgroundColor: '#934790',
    width: '90%',
    paddingVertical: hp(1.6),
    borderRadius: wp(3),
    alignItems: 'center',
  },
  modalActionText: {
    color: 'white',
    fontSize: hp(2),
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderRadius: wp(6),
    width: '100%',
    maxWidth: wp(95),
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    alignItems: 'center',
  },
  image: {
    width: wp(60),
    height: hp(25),
    marginBottom: hp(1),
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: hp(2.4),
    fontFamily: 'Montserrat-Bold',
    color: '#1A3B5D',
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(1.8),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(2),
    fontFamily: 'Montserrat-Regular',
    maxWidth: '90%',
  },
  viewMoreBtn: {
    alignSelf: 'center',
    marginTop: hp(0.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
  },
  viewMoreText: {
    color: '#934790',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.6),
    textDecorationLine: 'underline',
  },
});

export default ClaimScreen;