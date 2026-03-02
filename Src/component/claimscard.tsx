import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../utilites/Dimension';

// Enable LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CardPattern = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <Circle cx="2" cy="2" r="1.5" fill="rgba(147, 71, 144, 0.08)" />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      <Path 
        d="M 0 100 Q 100 50 200 150 T 400 100" 
        stroke="rgba(147, 71, 144, 0.05)" 
        strokeWidth="40" 
        fill="none" 
      />
    </Svg>
  </View>
);

const ClaimCard = ({ item, onDownload }) => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Check if text is long enough to need expansion
  const statusText = item?.claim_status || '';
  const isLongText = statusText.length > 15; 

  // Colors
  let statusColor = '#03392a'; 
  let statusBgColor = '#d8ffeb'; 
  const statusLower = statusText.toLowerCase();

  if (statusLower.includes('process')) {
    statusColor = '#92400e'; 
    statusBgColor = '#fef3c7'; 
  } else if (statusLower.includes('reject')) {
    statusColor = '#991b1b'; 
    statusBgColor = '#fee2e2'; 
  }

  const toggleExpand = () => {
    if (!isLongText) return; // Disable click for short text
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#FDF4FD', '#F6EAF6', '#EEDDEE']} 
        style={styles.gradientBackground}
      >
        <View style={styles.gradientBackground1}>
          <CardPattern />

          <View style={styles.contentContainer}>
            {/* --- Top Section --- */}
            <View style={styles.topSection}>
              
              {/* Left Side: Policy Info (Takes 55% width) */}
              <View style={{ flex: 1.3, marginRight: wp(2) }}>
                <View style={styles.policyBadge}>
                  <Text style={styles.policyText}>{item.policy_name}</Text>
                </View>
                <Text style={styles.policyNoLabel}>Policy No. {item.policy_number}</Text>
              </View>
              
              {/* Right Side: Amount & Status (Takes remaining width) */}
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.amountText}>{item.claim_amount}</Text>
                
                {/* SMART STATUS BADGE */}
                <TouchableOpacity 
                  activeOpacity={isLongText ? 0.7 : 1}
                  onPress={toggleExpand}
                  disabled={!isLongText} // Disable touch if text is short
                  style={[
                    styles.statusBadge, 
                    { 
                        backgroundColor: statusBgColor,
                        maxWidth: '100%', // Ensure it doesn't overflow parent flex
                    }
                  ]}
                >
                  <Text 
                    // If expanded, show all lines. If collapsed, show 1 line.
                    numberOfLines={isExpanded ? 0 : 1} 
                    ellipsizeMode="tail"
                    style={[styles.statusText, { color: statusColor }]}
                  >
                    {statusText}
                  </Text>
                  
                  {/* Only show arrow if text is actually long */}
                  {isLongText && (
                    <Icon 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={hp(1.8)} 
                      color={statusColor} 
                      style={{ marginLeft: 4, marginTop: 1 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* --- Patient Info Box --- */}
            <View style={styles.patientBox}>
              <View style={styles.patientIconPlaceholder}>
                <Text style={{ fontSize: hp(2) }}>👤</Text> 
              </View>
              <View>
                <Text style={styles.patientName}>{item.patient_name}</Text>
                <Text style={styles.patientRelation}>Relation: {item.patient_relation}</Text>
              </View>
            </View>

            {/* --- Footer Actions --- */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={() => navigation.navigate('ClaimsDetails', { item })}
              >
                <Text style={styles.secondaryButtonText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton} 
                //  onPress={() => navigation.navigate('ClaimsDetails', { item })}
                onPress={() => navigation.navigate('ClaimsDetails', { item , onDownload: true})}
              >
                <Text style={styles.primaryButtonText}>Download</Text>
              </TouchableOpacity>
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
    borderColor: '#F3E6F2' 
  },
  gradientBackground: {
    borderRadius: wp(5),
    overflow: 'hidden',
  },
  gradientBackground1: {
    padding: wp(5),
  },
  contentContainer: {
    zIndex: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(2.5),
  },
  policyBadge: {
    backgroundColor: '#934790', 
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
  policyNoLabel: {
    fontSize: hp(1.3),
    color: '#865A84', 
    fontFamily: 'Montserrat-SemiBold',
  },
  amountText: {
    fontSize: hp(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#2E1A2D', 
    textAlign: 'right',
    marginBottom: hp(0.5)
  },
  statusBadge: {
    paddingVertical: hp(0.6), 
    paddingHorizontal: wp(2.5),
    borderRadius: wp(3),
    flexDirection: 'row',
    alignItems: 'center', // Aligns arrow with text center
    justifyContent: 'center',
    alignSelf: 'flex-end', // Ensures badge stays to the right
    flexShrink: 1, // Allows badge to shrink if needed
  },
  statusText: {
    fontSize: hp(1.3),
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flexShrink: 1, // Critical: Allows text to wrap or shrink
    textAlign: 'right', // Aligns text to look neat next to arrow
  },
  patientBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', 
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderColor: '#E8D6E7' 
  },
  patientIconPlaceholder: {
    width: wp(9),
    height: wp(9),
    backgroundColor: '#F3E6F2',
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
    color: '#865A84',
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
    borderColor: '#934790', 
  },
  secondaryButtonText: {
    color: '#934790', 
    fontSize: hp(1.4),
    fontFamily: 'Montserrat-Bold',
  },
  primaryButton: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: wp(3),
    alignItems: 'center',
    backgroundColor: '#934790', 
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: hp(1.4),
    fontFamily: 'Montserrat-Bold',
  },
});

export default ClaimCard;