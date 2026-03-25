import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension';

// CardPattern with dynamic colors
const CardPattern = ({ dotColor, strokeColor }) => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <Circle cx="2" cy="2" r="1.5" fill={dotColor} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      <Path 
        d="M 0 100 Q 100 50 200 150 T 400 100" 
        stroke={strokeColor} 
        strokeWidth="40" 
        fill="none" 
      />
    </Svg>
  </View>
);

const Submittedclaimscard = ({ item, onDownload, isSubmitted = false }) => {

  const navigation = useNavigation();

  const statusText = item?.claim_status || '';

  // --- Dynamic Background Theme ---
  const gradientColors = isSubmitted 
    ? ['#FDF4FD', '#F6EAF6', '#EEDDEE'] 
    : ['#F2FCF5', '#E6F9EC', '#DDF4E3']; 
    
  const dotColor = isSubmitted ? 'rgba(147, 71, 144, 0.08)' : 'rgba(27, 94, 32, 0.08)';
  const strokeColor = isSubmitted ? 'rgba(147, 71, 144, 0.05)' : 'rgba(27, 94, 32, 0.05)';
  const cardBorderColor = isSubmitted ? '#F3E6F2' : '#C8E6D1';

  // --- Dynamic Text & Button Elements ---
  const themeColor = isSubmitted ? '#934790' : '#1B5E20'; 
  const lightThemeColor = isSubmitted ? '#F3E6F2' : '#C8E6D1'; 
  const textSubColor = isSubmitted ? '#865A84' : '#2E7D32'; 

  // Status Colors
  let statusColor = isSubmitted ? '#934790' : '#03392a'; 
  const statusLower = statusText.toLowerCase();

  if (statusLower.includes('process')) {
    statusColor = '#92400e'; 
  } else if (statusLower.includes('reject')) {
    statusColor = '#991b1b'; 
  }

  return (
    <View style={[styles.cardContainer, { borderColor: cardBorderColor }]}>
      <LinearGradient
        colors={gradientColors} 
        style={styles.gradientBackground}
      >
        <View style={styles.gradientBackground1}>
          <CardPattern dotColor={dotColor} strokeColor={strokeColor} />

          <View style={styles.contentContainer}>
            {/* --- Top Section --- */}
            <View style={styles.topSection}>
              
              {/* LEFT SIDE: Policy Name & Full Length Status */}
              <View style={{ flex: 1.5, marginRight: wp(2) }}>
                <View style={[styles.policyBadge, { backgroundColor: themeColor }]}>
                  <Text style={styles.policyText}> Claim No. {item.claim_no}</Text>
                </View>
                
                {/* FIX: Policy Number hatakar Status ko yahan daal diya taaki wo full length le sake */}
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusText}
                </Text>
              </View>
              
              {/* RIGHT SIDE: Only Amount */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.amountText}>₹{item.claim_amount}</Text>
              </View>
            </View>

            {/* --- Patient Info Box --- */}
            <View style={[styles.patientBox, { borderColor: cardBorderColor }]}>
              <View style={[styles.patientIconPlaceholder, { backgroundColor: lightThemeColor }]}>
                <Text style={{ fontSize: hp(2) }}>👤</Text> 
              </View>
              <View>
               
                <Text style={[styles.patientRelation, { color: textSubColor }]}>Relation: {item.relation_with_patient}</Text>
                 <Text style={styles.patientName}> UHID: {item.uhid_member_id}</Text>
              </View>
            </View>

            {/* --- Footer Actions --- */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.secondaryButton, { borderColor: themeColor }]} 
                onPress={() => navigation.navigate('SubmitClaimdetails', { item })}
              >
                <Text style={[styles.secondaryButtonText, { color: themeColor }]}>View Details</Text>
              </TouchableOpacity>
              {item?.file_url && (
                <TouchableOpacity 
                  style={[styles.primaryButton, { backgroundColor: themeColor }]}
                  onPress={() => Linking.openURL(item?.file_url)}
                >
                  <Text style={styles.primaryButtonText}>View document</Text>
                </TouchableOpacity>
              )}
          
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: wp(3),
    marginBottom: hp(2.5),
    borderRadius: wp(5),
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: '#FFF', 
    borderWidth: 1,
  },
  gradientBackground: {
    borderRadius: wp(5),
    overflow: 'hidden',
  },
  gradientBackground1: {
    padding: wp(3),
  },
  contentContainer: {
    zIndex: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2), // Thoda adjust kiya taaki status neat lage
  },
  policyBadge: {
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(2),
    marginBottom: hp(0.75),
    alignSelf: 'flex-start'
  },
  policyText: {
    color: '#FFFFFF',
    fontSize: hp(1.2),
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: hp(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#2E1A2D', 
    textAlign: 'right',
  },
  // FIX: Status text ab left side par full-width wrap hoga
  statusText: {
    fontSize: hp(1.3),
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'left',
    marginTop: hp(0.5),
    lineHeight: hp(1.8), // Better readability for long text
  },
  patientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', 
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(2.5),
    borderWidth: 1,
  },
  patientIconPlaceholder: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3)
  },
  patientName: {
    fontSize: hp(1.4),
    fontFamily: 'Montserrat-Bold',
    color: '#2E1A2D',
  },
  patientRelation: {
    fontSize: hp(1.5),
    fontFamily: 'Montserrat-SemiBold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    paddingVertical: hp(1.2),
    borderRadius: wp(3),
    alignItems: 'center',
    paddingHorizontal: wp(6),
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: hp(1.4),
    fontFamily: 'Montserrat-Bold',
  },
  primaryButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: wp(3),
    alignItems: 'center',
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: hp(1.4),
    fontFamily: 'Montserrat-Bold',
  },
});

export default Submittedclaimscard;