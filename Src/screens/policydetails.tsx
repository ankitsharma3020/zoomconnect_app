import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

// --- THEME CONSTANTS ---
const COLORS = {
  primary: '#5E5CE6',
  background: '#F8F9FF',
  cardBg: '#FFFFFF',
  textDark: '#111827',
  textGray: '#6B7280',
  success: '#10B981',
  info: '#3B82F6',
  border: '#F3F4F6',
  lightPurple: '#EEF2FF',
};

const SHADOWS = {
  medium: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  small: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};

// --- DATA ---
const COVERAGE_DATA = [
  {
    type: 'header',
    title: 'Sum Insured',
    value: '₹1,00,000',
    desc: 'Maximum amount that can be claimed (per year) against the policy',
  },
  {
    title: 'Hospitalisation',
    desc: 'Expenses upto Sum Insured are covered if the patient is hospitalised for > 24 hrs.',
    icon: 'bed-outline',
  },
  {
    title: 'Room Rent',
    value: '₹1,500',
    desc: 'Max limit for normal room rent per day.',
    icon: 'home-outline',
  },
  {
    title: 'ICU Room Rent',
    value: '₹4,000',
    desc: 'Max limit for ICU room rent per day.',
    icon: 'pulse-outline',
  },
  {
    title: 'Maternity',
    desc: 'Medical procedures due to childbirth covered upto limits.',
    icon: 'woman-outline',
  },
  {
    title: 'Zero Co-pay',
    desc: "No need to split the bill with insurer.",
    icon: 'wallet-outline',
  },
  {
    title: 'Pre-existing diseases',
    value: 'Covered',
    desc: 'Diabetes, thyroid, BP etc. covered from Day 1.',
    icon: 'medkit-outline',
  },
  {
    title: 'Pre-Post Hospitalization',
    desc: 'Tests/medicines covered 60 days before & 30 days after.',
    subNote: 'Not valid for maternity',
    icon: 'calendar-outline',
  },
  {
    title: 'Cashless Hospital',
    value: 'Wide Network',
    desc: 'Direct settlement to hospital in network.',
    icon: 'card-outline',
  },
  {
    title: 'Ambulance',
    value: '₹2,000',
    desc: 'Cost for shifting patient per event.',
    icon: 'car-outline',
  },
  {
    title: 'Air Ambulance',
    value: '₹4,000',
    desc: 'Cost for shifting patient by air per event.',
    icon: 'airplane-outline',
  },
];

const samplePolicy = {
  company: "Acko",
  validTill: "21-Sep-2026",
  sumInsured: "₹1.0 Lakh",
  beneficiariesText: "Self, Spouse, 2 Children and 2 Parents or Parents in Law",
  members: [
    { id: "self", name: "Self", avatar: require('../../assets/youngmanavtar.png') },
    { id: "father", name: "Father", avatar: require('../../assets/oldmanavtar.png') },
  ],
  verificationStatus: "Verification is pending at insurer end",
  selectedMember: {
    name: "Ankit Sharma",
    relationship: "Self",
    coverageStart: "22-Sep-2025",
    healthId: "Processing...",
    dob: "03-Aug-2000",
  },
};

const PolicyDetails = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Details');

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />

      <SafeAreaView style={styles.safeArea}>
        {/* --- Header --- */}
        <View style={styles.headerContainer}>
          {/* Soft Gradient Blob Background */}
          <View style={styles.decorativeCircle} />

          <View style={styles.navBar}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()} 
            >
              <Ionicons name="arrow-back" size={hp(3)} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Corporate Health{'\n'}Insurance</Text>

          {/* Improved Tabs */}
          <View style={styles.tabWrapper}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'Details' && styles.activeTabButton]}
                onPress={() => setActiveTab('Details')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'Details' && styles.activeTabText]}>
                  Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'Coverages' && styles.activeTabButton]}
                onPress={() => setActiveTab('Coverages')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'Coverages' && styles.activeTabText]}>
                  Coverages
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- Scrollable Content --- */}
        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.pageContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'Details' ? (
             <DetailsContent policy={samplePolicy} navigation={navigation} />
          ) : (
             <CoveragesContent />
          )}

          {/* Footer Branding */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Made with care & empathy</Text>
            <Text style={styles.footerHeart}>❤️</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Bottom Safe Area Cover */}
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.background }} />
    </View>
  );
};

// --- Component: Details Tab ---
const DetailsContent = ({ policy, navigation  }) => (
  <>
    <View style={styles.cardContainer}>
        {/* Header Row */}
        <View style={styles.rowBetween}>
          <Text style={styles.companyText}>{policy.company}</Text>
          <View style={styles.logoBadge}>
             <Text style={styles.logoText}>ACKO</Text>
          </View>
        </View>

        {/* Policy Meta Data */}
        <View style={styles.infoRowContainer}>
          <View>
            <Text style={styles.infoLabel}>Valid Till</Text>
            <Text style={styles.infoValue}>{policy.validTill}</Text>
          </View>
          <View>
            <Text style={[styles.infoLabel, { textAlign: 'right' }]}>Sum Insured</Text>
            <View style={styles.sumRow}>
              <Text style={styles.infoValue}>{policy.sumInsured}</Text>

            </View>
          </View>
        </View>

        <View style={styles.dashedDivider} />

        {/* Beneficiaries */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Beneficiaries</Text>
          <View style={styles.underline} />
        </View>

        <Text style={styles.benefitText}>Your policy can cover</Text>
        <Text style={styles.benefitSubText}>{policy.beneficiariesText}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersScroll}>
          {policy.members.map((m) => (
            <TouchableOpacity key={m.id} activeOpacity={0.8} style={styles.memberWrapper}>
              <View style={[styles.avatarContainer, m.id === 'self' && styles.avatarSelected]}>
                 <Image source={m.avatar} style={styles.memberAvatar} resizeMode="contain" />
              </View>
              <Text style={[styles.memberLabel, m.id === 'self' && { color: COLORS.primary, fontFamily: 'Montserrat-Bold' }]}>{m.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.memberWrapper} activeOpacity={0.6}
          onPress={()=>navigation.navigate('NaturalAddition')}
          >
            <View style={styles.addMemberBlock}>
              <Ionicons name="add" size={hp(3.5)} color={COLORS.primary} />
            </View>
            <Text style={styles.memberLabel}>Add</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Verification Alert */}
        <View style={styles.verificationBadge}>
          <Ionicons name="information-circle" size={hp(2.5)} color={COLORS.white} style={{marginRight: wp(2)}} />
          <Text style={styles.verificationText}>{policy.verificationStatus}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.gridRow}>
             <DetailItem label="Name" value={policy.selectedMember.name} />
             <DetailItem label="Relationship" value={policy.selectedMember.relationship} alignRight />
          </View>
          <View style={styles.gridRow}>
             <DetailItem label="Coverage Start" value={policy.selectedMember.coverageStart} />
             <DetailItem label="Health ID" value={policy.selectedMember.healthId} alignRight />
          </View>
          <View style={styles.gridRow}>
             <DetailItem label="Date of Birth" value={policy.selectedMember.dob} />
          </View>
        </View>

        <TouchableOpacity style={styles.moreActions}>
          <Text style={styles.moreActionsText}>More actions</Text>
          <Ionicons name="ellipsis-horizontal-circle-outline" size={hp(2.2)} color={COLORS.textGray} style={{marginLeft: wp(1.5)}}/>
        </TouchableOpacity>
    </View>

    {/* Actions */}
    <TouchableOpacity style={styles.claimButton} activeOpacity={0.9}>
      <Text style={styles.claimButtonText}>Claim Insurance</Text>
      <View style={styles.iconCircle}>
        <Ionicons name="arrow-forward" size={hp(2)} color={COLORS.textDark} />
      </View>
    </TouchableOpacity>

    <TouchableOpacity style={styles.connectCard} activeOpacity={0.9}>
      <View style={{flex: 1}}>
        <Text style={styles.connectText}>Connect with claim{'\n'}representative</Text>
      </View>
      <Ionicons name="chatbubble-ellipses-outline" size={hp(3)} color={COLORS.primary} />
    </TouchableOpacity>
  </>
);

// --- Component: Coverages Tab ---
const CoveragesContent = () => {
  return (
    <View style={styles.coverageContainer}>
      {COVERAGE_DATA.map((item, index) => {
        // HEADER TYPE
        if (item.type === 'header') {
          return (
            <View key={index} style={styles.covHeaderCard}>
              <View style={styles.covHeaderRow}>
                <Text style={styles.covHeaderTitle}>{item.title}</Text>
                {/* <TouchableOpacity>
                  <Text style={styles.covNotCoveredLink}>What's not covered?</Text>
                </TouchableOpacity> */}
              </View>
              <Text style={styles.covHeaderValue}>{item.value}</Text>
              <Text style={styles.covHeaderDesc}>{item.desc}</Text>
            </View>
          );
        }

        // STANDARD LIST ITEM
        return (
          <View key={index}>
            <View style={styles.covItem}>
              <View style={styles.covIconBox}>
                <Ionicons name={item.icon} size={hp(2.5)} color={COLORS.primary} />
              </View>
              <View style={styles.covContent}>
                <View style={styles.covTitleRow}>
                  <Text style={styles.covTitle}>{item.title}</Text>
                  {item.value && (
                    <View style={styles.valueTag}>
                        <Text style={styles.valueTagText}>{item.value}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.covDesc}>{item.desc}</Text>
                {item.subNote && (
                  <Text style={styles.covSubNote}>{item.subNote}</Text>
                )}
              </View>
            </View>
            {/* Soft Divider */}
            {index < COVERAGE_DATA.length - 1 && <View style={styles.covDivider} />}
          </View>
        );
      })}
    </View>
  );
};

// Helper: Grid Item
const DetailItem = ({ label, value, alignRight }) => (
  <View style={[styles.detailItem, alignRight && { alignItems: 'flex-end' }]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  // --- Global Layout ---
  mainContainer: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  safeArea: { 
    flex: 1 
  },
  page: { 
    flex: 1 
  },
  pageContent: { 
    paddingHorizontal: wp(5), // approx 20
    paddingTop: hp(1.2), // approx 10
    paddingBottom: hp(5) // approx 40
  },

  // --- Header Styling ---
  headerContainer: {
    paddingHorizontal: wp(5), // approx 20
    paddingTop: Platform.OS === 'android' ? hp(5) : 0, // approx 40
    paddingBottom: hp(1.2), // approx 10
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -hp(12.5), // approx -100
    right: -wp(20), // approx -80
    width: wp(75), // approx 300
    height: wp(75), // approx 300
    borderRadius: wp(37.5), // approx 150
    backgroundColor: COLORS.lightPurple,
    opacity: 0.8,
    zIndex: -1,
  },
  navBar: {
    marginBottom: hp(1.2), // approx 10
  },
  backButton: { 
    width: wp(10), // approx 40
    height: wp(10),
    borderRadius: wp(5), // approx 20
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small
  },
  headerTitle: {
    fontSize: hp(3.5), // approx 28
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
    marginBottom: hp(3), // approx 24
    lineHeight: hp(4.5), // approx 36
    letterSpacing: -0.5,
  },
  tabWrapper: {
    alignItems: 'flex-start',
  },
  tabContainer: { 
    flexDirection: "row", 
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(7.5), // approx 30
    padding: wp(1), // approx 4
    ...SHADOWS.small,
  },
  tabButton: {
    paddingVertical: hp(1.2), // approx 10
    paddingHorizontal: wp(7), // approx 28
    borderRadius: wp(6.5), // approx 26
  },
  activeTabButton: { 
    backgroundColor: COLORS.primary,
  },
  tabText: { 
    fontSize: hp(1.7), // approx 15
    fontFamily: 'Montserrat-SemiBold', // Font
    color: COLORS.textGray 
  },
  activeTabText: { 
    color: COLORS.cardBg 
  },

  // --- Main Card Styling ---
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), // approx 24
    padding: wp(6), // approx 24
    marginBottom: hp(2.5), // approx 20
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  rowBetween: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: hp(3) // approx 24
  },
  companyText: { 
    fontSize: hp(3), // approx 24
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark 
  },
  logoBadge: {
    paddingHorizontal: wp(3), // approx 12
    paddingVertical: hp(0.75), // approx 6
    backgroundColor: COLORS.lightPurple,
    borderRadius: wp(2), // approx 8
  },
  logoText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold', // Font
    fontSize: hp(1.75), // approx 14
    letterSpacing: 1,
  },
  infoRowContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: hp(2.5) // approx 20
  },
  infoLabel: { 
    fontSize: hp(1.6), // approx 13
    color: COLORS.textGray, 
    marginBottom: hp(0.75), // approx 6
    fontFamily: 'Montserrat-SemiBold' // Font
  },
  infoValue: { 
    fontSize: hp(2.1), // approx 17
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark 
  },
  sumRow: { 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: 'flex-end',
  },
  dropdownCircle: { 
    marginLeft: wp(2), // approx 8
    backgroundColor: COLORS.border,
    padding: wp(1), // approx 4
    borderRadius: wp(2.5), // approx 10
  },
  dashedDivider: { 
    height: 1, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderStyle: 'dashed',
    borderRadius: 1,
    marginBottom: hp(2.5), // approx 20
  },
  sectionHeader: { 
    marginBottom: hp(1) // approx 8
  },
  sectionTitle: { 
    fontSize: hp(2), // approx 16
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.primary 
  },
  underline: { 
    height: hp(0.375), // approx 3
    width: wp(10), // approx 40
    backgroundColor: COLORS.primary, 
    marginTop: hp(0.75), // approx 6
    marginBottom: hp(1), // approx 8
    borderRadius: 2,
  },
  benefitText: { 
    fontSize: hp(1.9), // approx 15
    fontFamily: 'Montserrat-SemiBold', // Font
    color: COLORS.textDark 
  },
  benefitSubText: { 
    color: COLORS.textGray, 
    marginTop: hp(0.5), // approx 4
    marginBottom: hp(2.5), // approx 20
    lineHeight: hp(2.5), // approx 20
    fontSize: hp(1.6), // approx 13
    fontFamily: 'Montserrat-Regular', // Font
  },
  
  // Beneficiaries
  membersScroll: {
    marginBottom: hp(3), // approx 24
  },
  memberWrapper: {
    alignItems: 'center',
    marginRight: wp(5), // approx 20
  },
  avatarContainer: {
    width: wp(15), // approx 60
    height: wp(15),
    borderRadius: wp(7.5), // approx 30
    marginBottom: hp(1), // approx 8
    padding: wp(0.5), // approx 2
    backgroundColor: COLORS.cardBg,
    ...SHADOWS.small
  },
  avatarSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  memberAvatar: { 
    width: '100%', 
    height: '100%', 
    borderRadius: wp(7.5) // approx 30
  },
  addMemberBlock: {
    width: wp(15), // approx 60
    height: wp(15),
    borderRadius: wp(7.5), // approx 30
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#FAFAFA',
    marginBottom: hp(1), // approx 8
  },
  memberLabel: { 
    fontSize: hp(1.5), // approx 12
    color: COLORS.textGray,
    fontFamily: 'Montserrat-SemiBold' // Font
  },

  verificationBadge: {
    backgroundColor: COLORS.info,
    borderRadius: wp(3), // approx 12
    paddingVertical: hp(1.5), // approx 12
    paddingHorizontal: wp(4), // approx 16
    marginBottom: hp(3), // approx 24
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.info,
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  verificationText: { 
    color: COLORS.cardBg, 
    fontFamily: 'Montserrat-SemiBold', // Font
    fontSize: hp(1.4), // approx 13
    flex: 1,
  },
  detailsGrid: { 
    backgroundColor: '#FAFAFA',
    padding: wp(4), // approx 16
    borderRadius: wp(4), // approx 16
    marginBottom: hp(2), // approx 16
  },
  gridRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp(2) // approx 16
  },
  detailItem: { 
    width: '48%' 
  },
  detailLabel: { 
    color: COLORS.textGray, 
    fontSize: hp(1.5), // approx 12
    marginBottom: hp(0.5), // approx 4
    fontFamily: 'Montserrat-SemiBold' // Font
  },
  detailValue: { 
    fontSize: hp(1.9), // approx 15
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark 
  },
  moreActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.25), // approx 10
  },
  moreActionsText: { 
    color: COLORS.textGray, 
    fontFamily: 'Montserrat-SemiBold' // Font
  },

  // --- Buttons ---
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), // approx 30
    paddingVertical: hp(2.25), // approx 18
    paddingHorizontal: wp(6), // approx 24
    marginBottom: hp(2.5), // approx 20
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  claimButtonText: {
    fontSize: hp(2), // approx 16
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
  },
  iconCircle: {
    width: wp(8), // approx 32
    height: wp(8),
    borderRadius: wp(4), // approx 16
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  connectCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), // approx 24
    padding: wp(6), // approx 24
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(5), // approx 40
    ...SHADOWS.medium,
  },
  connectText: {
    fontSize: hp(2), // approx 16
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
    lineHeight: hp(2.75), // approx 22
  },

  // --- Coverages Styling ---
  coverageContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), // approx 24
    paddingVertical: hp(1.5), // approx 12
    paddingHorizontal: wp(5), // approx 20
    ...SHADOWS.medium,
    marginBottom: hp(3.75), // approx 30
  },
  covHeaderCard: {
    marginBottom: hp(3), // approx 24
    paddingBottom: hp(3), // approx 24
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: hp(1.5), // approx 12
  },
  covHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5), // approx 12
  },
  covHeaderTitle: {
    fontSize: hp(2), // approx 16
    fontFamily: 'Montserrat-SemiBold', // Font
    color: COLORS.textGray,
  },
  covNotCoveredLink: {
    fontSize: hp(1.6), // approx 13
    fontFamily: 'Montserrat-SemiBold', // Font
    color: COLORS.primary,
  },
  covHeaderValue: {
    fontSize: hp(3), // approx 32
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
    marginBottom: hp(1), // approx 8
    letterSpacing: -0.5,
  },
  covHeaderDesc: {
    fontSize: hp(1.5), // approx 13
    color: COLORS.textGray,
    lineHeight: hp(2.25), // approx 18
    fontFamily: 'Montserrat-Regular', // Font
  },
  covItem: {
    flexDirection: 'row',
    paddingVertical: hp(2), // approx 16
  },
  covIconBox: {
    width: wp(11), // approx 44
    height: wp(11),
    borderRadius: wp(4), // approx 16
    backgroundColor: COLORS.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4), // approx 16
  },
  covContent: {
    flex: 1,
    justifyContent: 'center',
  },
  covTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.75), // approx 6
  },
  covTitle: {
    fontSize: hp(1.8), // approx 16
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
  },
  valueTag: {
    backgroundColor: COLORS.border,
    paddingHorizontal: wp(1.2), // approx 8
    paddingVertical: hp(0.5), // approx 4
    borderRadius: wp(1.5), // approx 6
  },
  valueTagText: {
    fontSize: hp(1.2), // approx 12
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
  },
  covDesc: {
    fontSize: hp(1.4), // approx 13
    color: COLORS.textGray,
    lineHeight: hp(2.4), // approx 19
    fontFamily: 'Montserrat-Regular', // Font
  },
  covSubNote: {
    marginTop: hp(0.75), // approx 6
    fontSize: hp(1.5), // approx 12
    color: '#EF4444',
    // fontStyle: 'italic', // Montserrat doesn't always have italic by default, can use regular/semibold
    fontFamily: 'Montserrat-SemiBold' // Font
  },
  covDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: wp(15), // approx 60
  },

  // --- Footer ---
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp(3.75), // approx 30
    marginTop: hp(1.25), // approx 10
  },
  footerText: {
    fontSize: hp(1.75), // approx 14
    fontFamily: 'Montserrat-SemiBold', // Font
    color: '#CBD5E1', 
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerHeart: {
    fontSize: hp(3), // approx 24
    marginTop: hp(1), // approx 8
    opacity: 0.8
  },
});
export default PolicyDetails;