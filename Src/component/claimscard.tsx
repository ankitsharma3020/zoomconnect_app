import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

interface ClaimData {
  id: string;
  policyType: string;
  policyNo: string;
  patientName: string;
  patientRelation: string;
  claimAmount: string;
  claimStatus: string;
  theme?: any; 
}

interface ClaimCardProps {
  item: ClaimData;
  onViewDetails?: (item: ClaimData) => void;
  onDownload?: (item: ClaimData) => void;
}

// --- SVG Background Pattern (Lighter for new theme) ---
const CardPattern = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <Circle cx="2" cy="2" r="1.5" fill="rgba(147, 71, 144, 0.08)" />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      {/* Decorative subtle curves */}
      <Path 
        d="M 0 100 Q 100 50 200 150 T 400 100" 
        stroke="rgba(147, 71, 144, 0.05)" 
        strokeWidth="40" 
        fill="none" 
      />
    </Svg>
  </View>
);

const ClaimCard: React.FC<ClaimCardProps> = ({ item, onViewDetails, onDownload }) => {
  const navigation = useNavigation();

  // Status Badge Logic (Updated for light background)
  let statusColor = '#065f46'; // Dark Green
  let statusBgColor = '#d1fae5'; // Light Green

  const statusLower = item.claimStatus.toLowerCase();
  if (statusLower === 'pending' || statusLower === 'in process') {
    statusColor = '#92400e'; // Dark Amber
    statusBgColor = '#fef3c7'; // Light Amber
  } else if (statusLower === 'rejected') {
    statusColor = '#991b1b'; // Dark Red
    statusBgColor = '#fee2e2'; // Light Red
  }

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        // New Light Gradient based on #934790
        colors={['#FDF4FD', '#F6EAF6', '#EEDDEE']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View  style={styles.gradientBackground1}>
           <CardPattern />

        <View style={styles.contentContainer}>
          
          {/* --- Top Section --- */}
          <View style={styles.topSection}>
            <View>
                <View style={styles.policyBadge}>
                  <Text style={styles.policyText}>{item.policyType}</Text>
                </View>
                <Text style={styles.policyNoLabel}>Policy No. {item.policyNo}</Text>
            </View>
            
            <View>
                 <Text style={styles.amountText}>{item.claimAmount}</Text>
                 <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                   <Text style={[styles.statusText, { color: statusColor }]}>{item.claimStatus}</Text>
                 </View>
            </View>
          </View>


          {/* --- Patient Info Box --- */}
          <View style={styles.patientBox}>
             <View style={styles.patientIconPlaceholder}>
                <Text style={{fontSize: hp(2)}}>👤</Text> 
             </View>
             <View>
                <Text style={styles.patientName}>{item.patientName}</Text>
                <Text style={styles.patientRelation}>Relation: {item.patientRelation}</Text>
             </View>
          </View>

          {/* --- Footer: Actions --- */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => navigation.navigate('ClaimsDetails')}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>View Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => onDownload?.(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>Download</Text>
            </TouchableOpacity>
          </View>

        </View>

        </View>
        {/* Background Pattern */}
            </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: wp(3), // approx 16
    marginBottom: hp(2.5), // approx 20
    borderRadius: wp(5), // approx 20
    // Softer shadow matching brand color
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: '#FFF', 
    borderWidth: 1,
    borderColor: '#F3E6F2' 
  },
  gradientBackground: {
    borderRadius: wp(5), // approx 20
    overflow: 'hidden',
   
  },
    gradientBackground1: {
    borderRadius: wp(5), // approx 20
    overflow: 'hidden',
    padding: wp(5), // approx 20
  },
  contentContainer: {
    zIndex: 1,
  },

  // --- Top Section ---
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2.5), // approx 20
  },
  policyBadge: {
    backgroundColor: '#934790', 
    paddingVertical: hp(0.6), // approx 5
    paddingHorizontal: wp(2.5), // approx 10
    borderRadius: wp(2), // approx 8
    marginBottom: hp(0.75), // approx 6
    alignSelf: 'flex-start'
  },
  policyText: {
    color: '#FFFFFF',
    fontSize: hp(1.2), // approx 11
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  policyNoLabel: {
    fontSize: hp(1.3), // approx 12
    color: '#865A84', 
    fontFamily: 'Montserrat-SemiBold',
  },
  amountText: {
    fontSize: hp(2.2), // approx 22
    fontFamily: 'Montserrat-Bold',
    color: '#2E1A2D', 
    textAlign: 'right',
    marginBottom: hp(0.5)
  },
  statusBadge: {
    paddingVertical: hp(0.5), // approx 4
    paddingHorizontal: wp(2.5), // approx 10
    borderRadius: wp(3), // approx 12
    alignSelf: 'flex-end'
  },
  statusText: {
    fontSize: hp(1.2), // approx 11
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // --- Patient Box ---
  patientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', 
    padding: wp(3), // approx 12
    borderRadius: wp(3), // approx 12
    marginBottom: hp(2.5), // approx 20
    borderWidth: 1,
    borderColor: '#E8D6E7' 
  },
  patientIconPlaceholder: {
    width: wp(9), // approx 36
    height: wp(9),
    backgroundColor: '#F3E6F2',
    borderRadius: wp(4.5), // approx 18
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3) // approx 12
  },
  patientName: {
    fontSize: hp(1.4), // approx 14
    fontFamily: 'Montserrat-Bold',
    color: '#2E1A2D',
    marginBottom: hp(0.25)
  },
  patientRelation: {
    fontSize: hp(1.5), // approx 12
    color: '#865A84',
    fontFamily: 'Montserrat-SemiBold',
  },

  // --- Actions ---
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    
  },
  secondaryButton: {
    // flex: 1,
    paddingVertical: hp(1.2), // approx 12
    borderRadius: wp(3), // approx 12
    alignItems: 'center',
    paddingHorizontal: wp(4), // approx 16
  // approx 16
    borderWidth: 1,
    borderColor: '#934790', 
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#934790', 
    fontSize: hp(1.4), // approx 13
    fontFamily: 'Montserrat-Bold',
  },
  primaryButton: {
    // flex: 1,
      paddingHorizontal: wp(4),
    paddingVertical: hp(1.2), // approx 12
    borderRadius: wp(3), // approx 12
    alignItems: 'center',
    backgroundColor: '#934790', 
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: hp(1.6), // approx 13
    fontFamily: 'Montserrat-Bold',
  },
});

export default ClaimCard;