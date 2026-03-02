import React, { useRef, useEffect, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

const { width } = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CARD_WIDTH = width * 0.9; 
const CARD_HEIGHT = hp(26); // Approx 230

const samplePolicies = [
  {
    id: 'gmc-1',
    title: 'Group Medical Coverage Policy',
    policyNumber: 'GMC-12345678',
    baseSi: '₹5,00,000',
    topup: '₹10,00,000',
    insuredBy: 'HDFC ERGO',
    tpa: 'MediAssist TPA',
    gradient: ['#FAF7FB', '#EDE9F5'],
  },
  {
    id: 'gmc-2',
    title: 'Group Medical Coverage Policy',
    policyNumber: 'GMC-87654321',
    baseSi: '₹2,50,000',
    topup: '₹7,50,000',
    insuredBy: 'HDFC ERGO',
    tpa: 'HealthIndia TPA',
    gradient: ['#F9FAFB', '#E9E6F5'],
  },
  {
    id: 'gmc-3',
    title: 'Group Medical Coverage Policy',
    policyNumber: 'GMC-87654316',
    baseSi: '₹2,50,000',
    topup: '₹7,50,000',
    insuredBy: 'HDFC ERGO',
    tpa: 'HealthIndia TPA',
    gradient: ['#F9FAFB', '#fae7fcff'],
  },
  {
    id: 'gmc-4',
    title: 'Group Medical Coverage Policy',
    policyNumber: 'GMC-87654319',
    baseSi: '₹3,00,000',
    topup: '₹5,00,000',
    insuredBy: 'HDFC ERGO',
    tpa: 'HealthIndia TPA',
    gradient: ['#F9FAFB', '#fae7fcff'],
  },
];

const PolicyCard = ({ p, onViewDetails, remainingCount, onShowMore }) => {
  console.log('PolicyCard rendering with policy:', onShowMore);
   const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation(); 
  // Floating bubbles animation
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;
   const toggleExpand = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(!expanded);
    };

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

  return (
    <View style={styles.wrapper}>
      {/* --- Moved Badge Outside Card --- */}
      {remainingCount > 0 && (
        <TouchableOpacity 
          style={styles.moreBadgeOutside} 
          onPress={()=>onShowMore()}
          activeOpacity={0.7}
        >
          <Text style={styles.moreBadgeTextHighlight}>View {remainingCount} more</Text>
          <MaterialCommunityIcons name="arrow-right" size={hp(2)} color="#934790" style={{marginLeft: wp(1)}} />
        </TouchableOpacity>
      )}

      <View style={styles.cardOuter}>
        <View style={styles.cardClip}>
          <LinearGradient
            colors={['#F9FAFB', '#E9E6F5']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardGradient1}>
              <View style={styles.accentCircle} />

            {/* Floating Bubbles */}
            <Animated.View style={[styles.bubble1, { transform: [{ translateY: floatA }] }]} />
            <Animated.View style={[styles.bubble2, { transform: [{ translateY: floatB }] }]} />
            <Animated.View style={[styles.bubble3, { transform: [{ translateY: floatC }] }]} />

            <View style={styles.cardContent}>
              <View style={styles.textBlock}>
                <Text numberOfLines={1} style={styles.title}>
                  {p.corporate_policy_name}
                </Text>

                <View style={styles.rowTwoCol}>
                  <View style={styles.colItem}>
                    <Text style={styles.colLabel}>Base SI</Text>
                    <Text style={styles.colValue}>{p.cover_string.total_base_sum_insured}</Text>
                  </View>
                  <View style={styles.colItem}>
                    <Text style={styles.colLabel}>Top-up</Text>
                    <Text style={styles.colValue}>{p.cover_string.total_topup_sum_insured}</Text>
                  </View>
                </View>

                <Text style={styles.policyNumber}>
                  Policy No: <Text style={{ fontFamily: 'Montserrat-Bold' }}>{p.policy_number}</Text>
                </Text>

                <View style={[styles.rowTwoCol, { marginTop: hp(1.2) }]}>
                  <View style={styles.colItem}>
                    <Text style={styles.colLabel}>Insured by</Text>
                         <TouchableWithoutFeedback onPress={toggleExpand}>
                       <Text 
                         numberOfLines={expanded ? undefined : 1} 
                                          style={styles.colValue}
                                        >{p.insurance_company_name}</Text>
                                        </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.colItem}>
                    <Text style={styles.colLabel}>TPA</Text>
                    <TouchableWithoutFeedback onPress={toggleExpand}>
                       <Text 
                                          numberOfLines={expanded ? undefined : 1} 
                                          style={styles.colValue}
                                        >{p.tpa_company_name}</Text>
                    </TouchableWithoutFeedback>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.cta}
                   onPress={() => navigation.navigate('policydetails',{ policyid: p?.id })}
                >
                  <Text style={styles.ctaText}>View Details</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.downloadIconWrap}>
                <MaterialCommunityIcons
                  name="download"
                  size={hp(2.8)}
                  color="#934790"
                />
              </View> */}
            </View>
            </View>
            
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default function PolicysCardList({

 onNavigate,
 policydata,
  onViewDetails = () => {},
}) {
  console.log('Policies in PolicysCardList:',policydata);
  // const navigation = useNavigation();
 const policies=policydata?.data?.policy_details

  const visiblePolicy = policies[0];
  const remainingCount = Math.max(0, policies.length - 1);



  if (!visiblePolicy) return null;

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <PolicyCard 
            p={visiblePolicy} 
            onViewDetails={onViewDetails} 
            remainingCount={remainingCount}
            onShowMore={onNavigate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // paddingVertical: 10,
  },
  listContainer: {
    width: '100%',
    // backgroundColor:'red',
    alignItems: 'center',
  },
  // Wrapper to hold relative positioning for badge outside
  wrapper: {
    position: 'relative',
    paddingTop: hp(3.8), // approx 30
  },
  cardOuter: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: wp(4.5), // approx 18
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: hp(0.75) },
    elevation: 4,
    backgroundColor: '#fff', 
  },
  cardClip: {
    flex: 1,
    borderRadius: wp(4.5), // approx 18
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
     // approx 18
    borderRadius: wp(4.5), // approx 18
    position: 'relative', 
      shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp(1), // approx 8
    },
    shadowOpacity: 0.3, 
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
   cardGradient1: {
    // flex: 1,
    padding: wp(4.5), // approx 18
    borderRadius: wp(4.5), // approx 18
    //  overflow: 'hidden',
   
  
    // position: 'relative', 
  },
  
  // --- NEW: Badge Style Outside Card ---
  moreBadgeOutside: {
    position: 'absolute',
    top: 0, // Align to top of wrapper
    right: 0, // Align to right of wrapper
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.75), // approx 6
    paddingHorizontal: wp(0.5), // approx 2
    zIndex: 20, 
  },
  moreBadgeTextHighlight: {
    color: '#934790', // Highlight color
    fontSize: hp(1.3), // approx 13
    fontFamily: 'Montserrat-Bold',
    textDecorationLine: 'underline', // Optional: adds link feel
  },

  accentCircle: {
    position: 'absolute',
    right: wp(3.5), // approx 14
    top: hp(1.5), // approx 12
    width: wp(25), // approx 100
    height: wp(25), // approx 100
    borderRadius: wp(12.5), // approx 50
    backgroundColor: 'rgba(147, 71, 144, 0.08)',
  },
  bubble1: {
    position: 'absolute',
    left: wp(4.5), // approx 18
    top: hp(3), // approx 24
    width: wp(6), // approx 24
    height: wp(6),
    borderRadius: wp(3), // approx 12
    backgroundColor: 'rgba(147, 71, 144, 0.06)',
  },
  bubble2: {
    position: 'absolute',
    left: wp(18), // approx 72
    top: hp(7.5), // approx 60
    width: wp(4), // approx 16
    height: wp(4),
    borderRadius: wp(2), // approx 8
    backgroundColor: 'rgba(147, 71, 144, 0.05)',
  },
  bubble3: {
    position: 'absolute',
    left: wp(9), // approx 36
    bottom: hp(5.2), // approx 42
    width: wp(8), // approx 32
    height: wp(8),
    borderRadius: wp(4), // approx 16
    backgroundColor: 'rgba(76, 127, 255, 0.05)',
  },
  cardContent: { flexDirection: 'row', marginTop: hp(0.5) }, // approx 10
  textBlock: { flex: 1 },
  title: {
    fontSize: hp(1.8), // approx 18
    fontFamily: 'Montserrat-Bold',
    color: '#2A1F3D',
    marginBottom: hp(0.7), // approx 10
    paddingRight: wp(2.5), // approx 10
  },
  rowTwoCol: { flexDirection: 'row', justifyContent: 'space-between' },
  colItem: { width: '48%' },
  colLabel: { fontSize: hp(1.2), fontFamily: 'Montserrat-Regular', color: '#7D6D8A' },
  colValue: { fontSize: hp(1.3), fontFamily: 'Montserrat-SemiBold', color: '#4A2E67', marginTop: hp(0.25) },
  policyNumber: { marginTop: hp(1.2), fontSize: hp(1.4), fontFamily: 'Montserrat-Regular', color: '#6B5C79' },
  cta: {
    backgroundColor: '#934790',
    paddingVertical: hp(1), // approx 8
    paddingHorizontal: wp(3.2), // approx 13
    borderRadius: wp(2), // approx 8
    marginTop: hp(1.4), // approx 14
    alignSelf: 'flex-start',
  },
  ctaText: { color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: hp(1.5) }, // approx 13
  downloadIconWrap: {
    position: 'absolute',
    bottom: hp(1), // approx 8
    right: wp(4.5), // approx 18
    zIndex: 20,
    backgroundColor: '#ffffffcc',
    padding: wp(1.5), // approx 6
    borderRadius: wp(5), // approx 20
  },
});