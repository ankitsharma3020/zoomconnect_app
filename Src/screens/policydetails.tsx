import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Animated,
  Dimensions,
  Linking,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { wp, hp } from '../utilites/Dimension'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchPolicydetails } from './Epicfiles/MainEpic';

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
  danger: '#EF4444',
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

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Helper to map API relation/gender to local assets
const getAvatar = (relation, gender) => {
  const r = relation?.toUpperCase();
  const g = gender?.toUpperCase();
  
  if (r === 'SELF') return require('../../assets/youngmanavtar.png'); 
  if (r === 'FATHER') return require('../../assets/oldmanavtar.png');
  if (r === 'MOTHER') return require('../../assets/oldmanavtar.png'); 
  if (r === 'SPOUSE') return g === 'MALE' ? require('../../assets/youngmanavtar.png') : require('../../assets/youngmanavtar.png');
  if (r === 'CHILD' || r === 'SON' || r === 'DAUGHTER') return require('../../assets/youngmanavtar.png');
  
  return require('../../assets/youngmanavtar.png'); // Fallback
};

// Helper to group array by department
const groupContacts = (matrix) => {
  if (!matrix) return {};
  return matrix.reduce((groups, item) => {
    const dept = item.department || 'General';
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(item);
    return groups;
  }, {});
};

// Base URL for images (Replace with your actual server URL)
const BASE_URL = "https://your-api-domain.com/"; 

const PolicyDetails = ({ route }) => {
  const id = route?.params?.policyid;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('Details');
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const { data, isLoading } = useSelector((state) => state.policydetails);

  useEffect(() => {
    dispatch(fetchPolicydetails({ PolicyId: id }));
  }, [dispatch, id]);

  // Set default selected member to 'SELF' (usually index 0) when data loads
  useEffect(() => {
    if (data?.dependents?.length > 0) {
      // Find self or default to first index
      const defaultMember = data.dependents.find(d => d.relation === 'SELF') || data.dependents[0];
      setSelectedMember(defaultMember);
    }
  }, [data]);
  console.log('Policy Details Data:', data);

  // Toggle Drawer Animation
 const toggleDrawer = (show) => {
  if (show) {
    setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Moves to center (0)
      duration: 300,
      useNativeDriver: true,
    }).start();
  } else {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH, // CHANGE: Moves back to the Right
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen(false));
  }
};
  const handleConnectPress = () => {
    toggleDrawer(true);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />

      <SafeAreaView style={styles.safeArea}>
        {/* --- Header --- */}
        <View style={styles.headerContainer}>
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

          {/* Tabs */}
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
             <DetailsContent 
               data={data} 
               id={id}
               navigation={navigation} 
               selectedMember={selectedMember} 
               setSelectedMember={setSelectedMember}
               onConnectPress={handleConnectPress} // Pass the handler
             />
          ) : (
             <CoveragesContent features={data?.policy_feature} />
          )}

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Made with care & empathy</Text>
            <Text style={styles.footerHeart}>❤️</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.background }} />

      {/* --- SIDE DRAWER MODAL --- */}
      <Modal
        visible={isDrawerOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => toggleDrawer(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Touchable background to close modal */}
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => toggleDrawer(false)} 
          />
          
          {/* Animated Drawer Content */}
          <Animated.View style={[
            styles.drawerContainer, 
            { transform: [{ translateX: slideAnim }] }
          ]}>
            <SafeAreaView style={{flex: 1}}>
              <View style={styles.drawerHeader}>
                <TouchableOpacity onPress={() => toggleDrawer(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={hp(3.5)} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.drawerTitle}>Connect with us</Text>

              </View>

              <ScrollView contentContainerStyle={styles.drawerContent}>
                <ContactList matrix={data?.escalation_matrix} />
              </ScrollView>

              <View style={styles.drawerFooter}>
                <TouchableOpacity onPress={() => Alert.alert("Escalation", "Opening escalation form...")}>
                   <Text style={styles.escalateText}>Escalate issue</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
};

// --- Component: Contact List for Drawer ---
const ContactList = ({ matrix }) => {
  if (!matrix || matrix.length === 0) {
    return <Text style={styles.emptyStateText}>No contact details available.</Text>;
  }

  const grouped = groupContacts(matrix);

  return Object.keys(grouped).map((dept, index) => (
    <View key={index} style={styles.deptSection}>
      <Text style={styles.deptHeader}>{dept}</Text>
      {grouped[dept].map((person, pIndex) => (
        <View key={pIndex} style={styles.contactCard}>
          <View style={styles.contactAvatar}>
             <Text style={styles.avatarInitials}>{person.full_name?.charAt(0)}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.contactName}>{person.full_name}</Text>
            <Text style={styles.contactRole}>{dept} Representative</Text>
            
            <View style={styles.contactActions}>
              {person.email_id && (
                <TouchableOpacity 
                  style={styles.actionRow} 
                  onPress={() => Linking.openURL(`mailto:${person.email_id}`)}
                >
                  <Ionicons name="mail-outline" size={hp(2)} color={COLORS.primary} />
                  <Text style={styles.actionText} numberOfLines={1}>{person.email_id}</Text>
                </TouchableOpacity>
              )}
               {person.mobile && (
                <TouchableOpacity 
                  style={[styles.actionRow, {marginTop: hp(0.5)}]} 
                  onPress={() => Linking.openURL(`tel:${person.mobile}`)}
                >
                  <Ionicons name="call-outline" size={hp(2)} color={COLORS.primary} />
                  <Text style={styles.actionText}>{person.mobile}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  ));
};

// --- Component: Details Tab ---
const DetailsContent = ({ data, navigation, selectedMember, setSelectedMember, onConnectPress ,id}) => {
  if (!data) return <Text>Loading...</Text>;
  
  const policy = data.policy || {};
  const dependents = data.dependents || [];
  const tpaData = data.tpa_data || {};
  const insurer = data.insurance_company || {};
  const tpa = data.tpa_company || {};

  // Check if policy is GTL or GPA
  const policyName = (policy?.policy_name || policy?.name || data?.policy_name || '').toLowerCase();
  const isGtlOrGpa = policyName.includes('gtl') || policyName.includes('gpa');
  
  const getShortName = (name) => {
    if (!name) return '';
    return name.split(/Insurance/i)[0].trim();
  };

  return (
    <>
      <View style={styles.cardContainer}>
          {/* Header Row: Insurer & TPA */}
          <View style={styles.rowBetween}>
            <View style={{flex: 1, marginRight: wp(2)}}>
             <Text style={styles.companyText}>Insurer</Text>
              <View style={styles.logoBadge}>
                 <Text style={styles.logoText} numberOfLines={2}>{getShortName(insurer.name)}</Text>
            </View>
            </View>
           
            <View style={{flex: 1, alignItems: 'flex-end'}}>
             <Text style={styles.companyText}>TPA</Text>
              <View style={[styles.logoBadge, {alignItems: 'flex-end'}]}>
                   <Text style={styles.logoText} numberOfLines={2}>{getShortName(tpa.name)}</Text>
            </View>
            </View>
          </View>
  
          {/* Policy Meta Data */}
          <View style={styles.infoRowContainer}>
            <View>
              <Text style={styles.infoLabel}>Valid Till</Text>
              <Text style={styles.infoValue}>{formatDate(policy.policy_end_date)}</Text>
            </View>
            <View>
              <Text style={[styles.infoLabel, { textAlign: 'right' }]}>Sum Insured</Text>
              <View style={styles.sumRow}>
                <Text style={styles.infoValue}>₹ {tpaData.base_sum_insured || data.cover_summary?.replace(/[^0-9]/g, '') || '0'}</Text>
              </View>
            </View>
          </View>
  
          <View style={styles.dashedDivider} />
  
          {/* Beneficiaries List */}
          <View style={styles.sectionHeader}>
            <View>
              {/* Only show Download eCard if NOT GTL or GPA */}
              {!isGtlOrGpa && (
                <TouchableOpacity style={{ width:wp(80),height:hp(4),marginBottom:hp(1),borderWidth:1,alignItems:'center',borderRadius:hp(1.5),borderColor:COLORS.info,flexDirection:'row',paddingHorizontal:wp(2),justifyContent:'center',backgroundColor:'rgba(59, 130, 246,0.1)'}}>
                  <Text style={styles.sectionTitle1}>Download your health card
                    <Text  style={{color:COLORS.info,fontSize:hp(1.6)}} >  Download</Text>
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={styles.sectionTitle}>Beneficiaries</Text>
            </View>
            <View style={styles.underline} />
          </View>
  
          <Text style={styles.benefitText}>Your policy covers</Text>
          <Text style={styles.benefitSubText}>
             Tap a member below to view their details.
          </Text>
  
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersScroll}>
            {dependents.map((m, index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.8} 
                style={styles.memberWrapper}
                onPress={() => setSelectedMember(m)}
              >
                <View style={[styles.avatarContainer, selectedMember?.insured_name === m.insured_name && styles.avatarSelected]}>
                   <Image 
                     source={getAvatar(m.relation, m.gender)} 
                     style={styles.memberAvatar} 
                     resizeMode="contain" 
                   />
                </View>
                <Text style={[styles.memberLabel, selectedMember?.insured_name === m.insured_name && { color: COLORS.primary, fontFamily: 'Montserrat-Bold' }]}>
                  {m.relation}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
  
          {/* Details Grid (Dynamic based on selectedMember) */}
          {selectedMember && (
            <View style={styles.detailsGrid}>
              <View style={styles.gridRow}>
                 <DetailItem label="Name" value={selectedMember.insured_name} />
                 <DetailItem label="Relationship" value={selectedMember.relation} alignRight />
              </View>
              <View style={styles.gridRow}>
                 <DetailItem 
                    label="Coverage Start" 
                    value={formatDate(policy.policy_start_date)} 
                 />
                 <DetailItem label="Date of Birth" value={formatDate(selectedMember.dob)} alignRight/>
              </View>
            </View>
          )}
          
          {/* Only show Network Hospital if NOT GTL or GPA */}
          {!isGtlOrGpa && (
            <TouchableOpacity style={styles.moreActions}
              onPress={()=>navigation.navigate('networkHospitalScreen',{policyid:id})}
            >
              <Text style={styles.moreActionsText}>Search your cashless hospital here</Text>
              <Ionicons name="arrow-forward" size={hp(2.2)} color={COLORS.primary} style={{marginLeft: wp(6.5)}}/>
            </TouchableOpacity>
          )}
      </View>
  
      {/* Actions */}

      {/* Only show Claim Insurance if NOT GTL or GPA */}
      {!isGtlOrGpa && (
        <TouchableOpacity style={styles.claimButton} activeOpacity={0.9}>
          <Text style={styles.claimButtonText}>Claim Insurance</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-forward" size={hp(2)} color={COLORS.textDark} />
          </View>
        </TouchableOpacity>
      )}
      
      {/* Only show Add Dependent if NOT GTL or GPA */}
      {!isGtlOrGpa && (
        <TouchableOpacity style={styles.claimButton} activeOpacity={0.9}
        onPress={()=>navigation.navigate('NaturalAddition',{policyid:id})}
        >
          <Text style={styles.claimButtonText}>Add Dependent {'\n'} (Spouse/Child/Parents)</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-forward" size={hp(2)} color={COLORS.textDark} />
          </View>
        </TouchableOpacity>
      )}
  
      <TouchableOpacity style={styles.connectCard} activeOpacity={0.9} onPress={onConnectPress}>
        <View style={{flex: 1}}>
          <Text style={styles.connectText}>Connect with claim{'\n'}representative</Text>
        </View>
        <Ionicons name="chatbubble-ellipses-outline" size={hp(3)} color={COLORS.primary} />
      </TouchableOpacity>
    </>
  );
};

// --- Component: Coverages Tab ---
const CoveragesContent = ({ features }) => {
  const [viewType, setViewType] = useState('inclusion'); // 'inclusion' or 'exclusion'

  const inclusions = features?.inclusion || [];
  const exclusions = features?.exclusion || [];

  const activeData = viewType === 'inclusion' ? inclusions : exclusions;
  const activeColor = viewType === 'inclusion' ? COLORS.primary : COLORS.danger;

  return (
    <View style={styles.coverageContainer}>
      {/* Toggle Header */}
      <View style={styles.covHeaderCard}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setViewType('inclusion')}>
             <Text style={[styles.toggleText, viewType === 'inclusion' ? styles.toggleTextActive : styles.toggleTextInactive]}>
              Covered
             </Text>
             {viewType === 'inclusion' && <View style={styles.activeDot} />}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setViewType('exclusion')}>
             <Text style={[styles.toggleText, viewType === 'exclusion' ? {color: COLORS.danger} : styles.toggleTextInactive]}>
               Not Covered
             </Text>
             {viewType === 'exclusion' && <View style={[styles.activeDot, {backgroundColor: COLORS.danger}]} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      {activeData.map((item, index) => {
        const title = item.feature_name || item.feature_title || item.name || "Benefit";
        const desc = item.feature_desc || item.description || item.desc || "";

        return (
          <View key={index}>
            <View style={styles.covItem}>
              <View style={[styles.covIconBox, { backgroundColor: viewType === 'exclusion' ? '#FEE2E2' : COLORS.lightPurple }]}>
                <Ionicons 
                  name={viewType === 'inclusion' ? "checkmark-circle-outline" : "close-circle-outline"} 
                  size={hp(2.5)} 
                  color={activeColor} 
                />
              </View>
              <View style={styles.covContent}>
                <View style={styles.covTitleRow}>
                  <Text style={styles.covTitle}>{title}</Text>
                </View>
                {desc ? <Text style={styles.covDesc}>{desc}</Text> : null}
              </View>
            </View>
            {index < activeData.length - 1 && <View style={styles.covDivider} />}
          </View>
        );
      })}
      
      {activeData.length === 0 && (
        <Text style={styles.emptyStateText}>No details available.</Text>
      )}
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
    paddingHorizontal: wp(5), 
    paddingTop: hp(1.2), 
    paddingBottom: hp(5) 
  },

  // --- Header Styling ---
  headerContainer: {
    paddingHorizontal: wp(5), 
    paddingTop: Platform.OS === 'android' ? hp(5) : 0, 
    paddingBottom: hp(1.2), 
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -hp(12.5), 
    right: -wp(20), 
    width: wp(75), 
    height: wp(75), 
    borderRadius: wp(37.5), 
    backgroundColor: COLORS.lightPurple,
    opacity: 0.8,
    zIndex: -1,
  },
  navBar: {
    marginBottom: hp(1.2), 
  },
  backButton: { 
    width: wp(10), 
    height: wp(10),
    borderRadius: wp(5), 
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small
  },
  headerTitle: {
    fontSize: hp(3.5), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textDark,
    marginBottom: hp(3), 
    lineHeight: hp(4.5), 
    letterSpacing: -0.5,
  },
  tabWrapper: {
    alignItems: 'flex-start',
  },
  tabContainer: { 
    flexDirection: "row", 
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(7.5), 
    padding: wp(1), 
    ...SHADOWS.small,
  },
  tabButton: {
    paddingVertical: hp(1.2), 
    paddingHorizontal: wp(7), 
    borderRadius: wp(6.5), 
  },
  activeTabButton: { 
    backgroundColor: COLORS.primary,
  },
  tabText: { 
    fontSize: hp(1.7), 
    fontFamily: 'Montserrat-SemiBold', 
    color: COLORS.textGray 
  },
  activeTabText: { 
    color: COLORS.cardBg 
  },

  // --- Main Card Styling ---
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), 
    padding: wp(6), 
    marginBottom: hp(2.5), 
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  rowBetween: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-start", // changed to allow multiline text
    marginBottom: hp(3) 
  },
  companyText: { 
    fontSize: hp(1.8), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textDark,
    marginBottom: hp(0.5)
  },
  logoBadge: {
    paddingHorizontal: wp(3), 
    paddingVertical: hp(0.5), 
    backgroundColor: COLORS.lightPurple,
    borderRadius: wp(2), 
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold', 
    fontSize: hp(1.5), 
    letterSpacing: 0.5,
  },
  infoRowContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: hp(2.5) 
  },
  infoLabel: { 
    fontSize: hp(1.6), 
    color: COLORS.textGray, 
    marginBottom: hp(0.75), 
    fontFamily: 'Montserrat-SemiBold' 
  },
  infoValue: { 
    fontSize: hp(2.1), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textDark 
  },
  sumRow: { 
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: 'flex-end',
  },
  dashedDivider: { 
    height: 1, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderStyle: 'dashed',
    borderRadius: 1,
    marginBottom: hp(2.5), 
  },
  sectionHeader: { 
    marginBottom: hp(1) 
  },
  sectionTitle: { 
    marginTop:hp(2),
    fontSize: hp(2), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.primary 
  },
  sectionTitle1: { 
    fontSize: hp(1.2), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textGray 
  },
  underline: { 
    height: hp(0.375), 
    width: wp(10), 
    backgroundColor: COLORS.primary, 
    marginTop: hp(0.75), 
    marginBottom: hp(1), 
    borderRadius: 2,
  },
  benefitText: { 
    fontSize: hp(1.9), 
    fontFamily: 'Montserrat-SemiBold', 
    color: COLORS.textDark 
  },
  benefitSubText: { 
    color: COLORS.textGray, 
    marginTop: hp(0.5), 
    marginBottom: hp(2.5), 
    lineHeight: hp(2.5), 
    fontSize: hp(1.6), 
    fontFamily: 'Montserrat-Regular', 
  },
  
  // Beneficiaries
  membersScroll: {
    marginBottom: hp(3), 
  },
  memberWrapper: {
    alignItems: 'center',
    marginRight: wp(5), 
  },
  avatarContainer: {
    width: wp(15), 
    height: wp(15),
    borderRadius: wp(7.5), 
    marginBottom: hp(1), 
    padding: wp(0.5), 
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
    borderRadius: wp(7.5) 
  },
  addMemberBlock: {
    width: wp(15), 
    height: wp(15),
    borderRadius: wp(7.5), 
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#FAFAFA',
    marginBottom: hp(1), 
  },
  memberLabel: { 
    fontSize: hp(1.5), 
    color: COLORS.textGray,
    fontFamily: 'Montserrat-SemiBold' 
  },

  detailsGrid: { 
    backgroundColor: '#FAFAFA',
    padding: wp(4), 
    borderRadius: wp(4), 
    marginBottom: hp(2), 
  },
  gridRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp(2) 
  },
  detailItem: { 
    width: '48%' 
  },
  detailLabel: { 
    color: COLORS.textGray, 
    fontSize: hp(1.5), 
    marginBottom: hp(0.5), 
    fontFamily: 'Montserrat-SemiBold' 
  },
  detailValue: { 
    fontSize: hp(1.9), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textDark 
  },
  moreActions: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: wp(6), 
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    elevation: 1,
    justifyContent: 'center',
    paddingVertical: hp(1.25), 
  },
  moreActionsText: { 
    color: COLORS.primary,
    fontSize: hp(1.4), 
    fontFamily: 'Montserrat-Bold' 
  },

  // --- Buttons ---
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), 
    paddingVertical: hp(2.25), 
    paddingHorizontal: wp(6), 
    marginBottom: hp(2.5), 
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  claimButtonText: {
    fontSize: hp(2), 
    fontFamily: 'Montserrat-Bold', 
    lineHeight: hp(2.75),
    color: COLORS.textDark,
  },
  iconCircle: {
    width: wp(8), 
    height: wp(8),
    borderRadius: wp(4), 
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  connectCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), 
    padding: wp(6), 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(5), 
    ...SHADOWS.medium,
  },
  connectText: {
    fontSize: hp(2), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textDark,
    lineHeight: hp(2.75), 
  },

  // --- Coverages Styling ---
  coverageContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: wp(6), 
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(5), 
    ...SHADOWS.medium,
    marginBottom: hp(3.75), 
  },
  covHeaderCard: {
    marginBottom: hp(2), 
    paddingBottom: hp(2), 
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: hp(1.5), 
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2)
  },
  toggleText: {
    fontSize: hp(2.2),
    fontFamily: 'Montserrat-Bold',
    marginBottom: hp(0.5)
  },
  toggleTextActive: {
    color: COLORS.primary,
  },
  toggleTextInactive: {
    color: COLORS.textGray,
    opacity: 0.5
  },
  activeDot: {
    height: 4,
    width: '40%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 2
  },
  
  covItem: {
    flexDirection: 'row',
    paddingVertical: hp(2), 
  },
  covIconBox: {
    width: wp(11), 
    height: wp(11),
    borderRadius: wp(4), 
    backgroundColor: COLORS.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4), 
  },
  covContent: {
    flex: 1,
    justifyContent: 'center',
  },
  covTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5), 
  },
  covTitle: {
    fontSize: hp(1.8), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textDark,
  },
  covDesc: {
    fontSize: hp(1.4), 
    color: COLORS.textGray,
    lineHeight: hp(2.4), 
    fontFamily: 'Montserrat-Regular', 
  },
  covDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: wp(15), 
  },
  emptyStateText: {
    textAlign: 'center',
    color: COLORS.textGray,
    padding: hp(2),
    fontFamily: 'Montserrat-Regular'
  },

  // --- Footer ---
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp(3.75), 
    marginTop: hp(1.25), 
  },
  footerText: {
    fontSize: hp(1.75), 
    fontFamily: 'Montserrat-SemiBold', 
    color: '#CBD5E1', 
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerHeart: {
    fontSize: hp(3), 
    marginTop: hp(1), 
    opacity: 0.8
  },

  // --- DRAWER STYLES ---
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    width: '100%', 
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(2.5),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  drawerTitle: {
    fontSize: hp(2.5),
    marginLeft:wp(1),
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textDark,
  },
  closeBtn: {
    padding: 5,
  },
  drawerContent: {
    padding: wp(6),
    paddingBottom: hp(5),
  },
  drawerFooter: {
    padding: wp(6),
    alignItems: 'center',
    marginBottom: hp(2)
  },
  escalateText: {
    color: COLORS.danger,
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(2),
  },
  
  // Drawer Section Styles
  deptSection: {
    marginBottom: hp(3),
  },
  deptHeader: {
    fontSize: hp(1.8),
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textGray,
    marginBottom: hp(1.5),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(2.5),
    backgroundColor: '#FAFAFA',
    padding: wp(4),
    borderRadius: wp(3),
  },
  contactAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: COLORS.lightPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  avatarInitials: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(2),
  },
  contactName: {
    fontSize: hp(2),
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textDark,
    marginBottom: hp(0.5),
  },
  contactRole: {
    fontSize: hp(1.5),
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textGray,
    marginBottom: hp(1),
  },
  contactActions: {
    marginTop: hp(0.5),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  actionText: {
    marginLeft: wp(2),
    fontSize: hp(1.6),
    fontFamily: 'Montserrat-SemiBold',
    color: COLORS.textDark,
    flex: 1,
  },
});

export default PolicyDetails;