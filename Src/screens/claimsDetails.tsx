import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Linking, Dimensions, Platform, LayoutAnimation } from 'react-native';
import { Avatar } from 'react-native-paper';
import Header from '../component/header';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { wp, hp } from '../utilites/Dimension'; 

const { width } = Dimensions.get('window');

// --- SVG PATTERN ---
const HeaderPattern = () => (
  <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
    <Defs>
      <Pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <Circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.15)" />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#dotPattern)" />
    <Circle cx="90%" cy="80%" r="80" fill="rgba(255,255,255,0.05)" />
    <Circle cx="10%" cy="20%" r="50" fill="rgba(255,255,255,0.05)" />
  </Svg>
);

const ClaimDetailss = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalDocuments, setModalDocuments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const claim = route.params?.item || null;
  const onDownload = route.params?.onDownload || null;
  const statusText = claim?.claim_status || '';
  const isLongText = statusText.length > 15; 

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('approved') || s.includes('paid')) return '#065F46';
    if (s.includes('reject') || s.includes('denied')) return '#991B1B';
    return '#92400E';
  };

  const getStatusBg = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('approved') || s.includes('paid')) return '#D1FAE5'; 
    if (s.includes('reject') || s.includes('denied')) return '#FEE2E2'; 
    return '#FEF3C7'; 
  };
  
  const toggleExpand = () => {
    if (!isLongText) return; 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };
  
  useEffect(() => {
   if(onDownload){
      setModalDocuments(claim.claim_document);
      setShowModal(true);
    }
  }, []);

  return (
    <View style={styles.mainContainer}>
      
      {/* LAYER 1: Background Gradient (Absolute, stays fixed behind everything) */}
      <View style={styles.backgroundHeader}>
        <LinearGradient
          colors={['#F6DCC5', '#F6DCC5']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <HeaderPattern />
      </View>

      {/* LAYER 2: Header (Normal flow - this pushes the ScrollView down naturally) */}
      <View style={styles.headerContainer}>
        <Header
          showBack={true} 
          onBack={() => navigation.goBack()} 
          title="Claim Details"
        />
      </View>

      {/* LAYER 3: Scrollable Content (Fills remaining space below header) */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- 1. Policy Header Card --- */}
        <View style={styles.policyHeaderCard}>
          <View style={styles.logoContainer}>
               <Avatar.Text size={wp(14)} label="INS" style={{backgroundColor: '#0f172a'}} /> 
          </View>
          <View style={styles.policyInfo}>
            <Text style={styles.companyName}>{claim?.policy?.insurance_company_name}</Text>
            <View style={styles.policyBadge}>
                <Text style={styles.policyNumber}>Policy: {claim?.policy_number}</Text>
            </View>
          </View>
        </View>

        {/* --- 2. Details Section --- */}
        <View style={styles.detailsCard}>
          
          <View style={styles.statusSection}>
             <View>
                <Text style={styles.label}>Claim ID</Text>
                <Text style={styles.valueBold}>{claim?.tpa_claim_id}</Text>
             </View>
             
              <TouchableOpacity 
                   activeOpacity={isLongText ? 0.5 : 1}
                   onPress={toggleExpand}
                   disabled={!isLongText} 
                   style={[
                     styles.statusBadge, 
                     { backgroundColor: getStatusBg(claim?.claim_status), maxWidth: '100%' }
                   ]}
                 >
                   <Text 
                     numberOfLines={isExpanded ? 0 : 1} 
                     ellipsizeMode="tail"
                     style={[styles.statusText, { color: getStatusColor(claim?.claim_status)  }]}
                   >
                     {statusText}
                   </Text>
                   
                   {isLongText && (
                     <Icon 
                       name={isExpanded ? "chevron-up" : "chevron-down"} 
                       size={hp(1.8)} 
                       color={getStatusColor(claim?.claim_status)} 
                       style={{ marginLeft: 4, marginTop: 1 }}
                     />
                   )}
                 </TouchableOpacity>
          </View>

          <View style={styles.dashedDivider} />

          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
             <DetailBox label="Patient Name" value={claim?.patient_name} />
             <DetailBox label="Relation" value={claim?.patient_relation} align="right"/>
          </View>
          
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Hospitalization</Text>
          <DetailRow label="Hospital" value={claim?.hospital_name} />
          <View style={styles.row}>
             <DetailBox label="Admission" value={claim?.date_of_admission} />
             <DetailBox label="Discharge" value={claim?.date_of_discharge} align="right" />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Claim Financials</Text>
          <View style={styles.amountBox}>
             <Text style={styles.amountLabel}>Claim Amount</Text>
             <Text style={styles.amountValue}>{claim?.claim_amount}</Text>
          </View>
          
          <View style={styles.row}>
             <DetailBox label="Type" value={claim?.type_of_claim} />
             <DetailBox label="Mode" value={claim?.claim_mode} align="right" />
          </View>

          {claim?.deduction_reasons && (
             <View style={styles.warningBox}>
                <Text style={styles.warningLabel}>Deductions:</Text>
                <Text style={styles.warningValue}>{claim?.deduction_reasons}</Text>
             </View>
          )}

          <View style={styles.actionContainer}>
            {claim?.settlment_letter && (
              <TouchableOpacity style={styles.primaryButton} onPress={() => Linking.openURL(claim.settlment_letter)} activeOpacity={0.8}>
                <LinearGradient colors={['#0f172a', '#334155']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                   <View style={styles.gradientButton1}>
                      <Text style={styles.primaryButtonText}>Download Settlement Letter</Text>
                   </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {claim?.query_letter && (
              <TouchableOpacity style={[styles.primaryButton, {marginTop: hp(1.2)}]} onPress={() => Linking.openURL(claim.query_letter)} activeOpacity={0.8}>
                 <LinearGradient colors={['#d97706', '#b45309']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                  <View style={styles.gradientButton1}>
                     <Text style={styles.primaryButtonText}>Download Query Letter</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

          {(
            (Array.isArray(claim?.claim_document) && claim?.claim_document.length > 0) || 
            (typeof claim?.claim_document === 'string' && claim?.claim_document.trim() !== '')
          ) && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                if (Array.isArray(claim.claim_document)) {
                  setModalDocuments(claim.claim_document);
                  setShowModal(true);
                } else {
                  Linking.openURL(claim.claim_document).catch(err => console.error("Failed to open document URL:", err));
                }
              }}
            >
              <Text style={styles.secondaryButtonText}>
                {Array.isArray(claim.claim_document) ? 'View All Documents' : 'View Document'}
              </Text>
            </TouchableOpacity>
          )}
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Documents</Text>
            {modalDocuments.map((doc, idx) => (
              <TouchableOpacity key={idx} onPress={() => Linking.openURL(`https://${doc.url}`)} style={styles.docItem}>
                <View style={styles.docIconPlaceholder} />
                <Text style={styles.docName} numberOfLines={1}>{doc.filename}</Text>
                <Text style={styles.downloadLink}>OPEN</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// --- Helper Components ---
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const DetailBox = ({ label, value, align = 'left' }) => (
  <View style={[styles.detailBox, { alignItems: align === 'right' ? 'flex-end' : 'flex-start' }]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { textAlign: align === 'right' ? 'right' : 'left' }]}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  
  // 1. Background (Fixed absolutely behind everything)
  backgroundHeader: {
    height: hp(31), 
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 0, 
  },

  // 2. Normal Header Flow (Not Absolute anymore!)
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? hp(1) : hp(0), // Adjust safe area padding
    zIndex: 10, // Ensures header text stays visible
    backgroundColor: 'transparent',
    // Note: No position: 'absolute' here. This ensures the ScrollView starts strictly BELOW this header.
  },

  // 3. Scroll Content
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(4), 
    paddingTop: hp(2), // Restored to a normal gap since it now safely starts below the header
    paddingBottom: hp(5), 
  },

  // --- Cards & Content Styles ---
  policyHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4), 
    padding: wp(4), 
    marginBottom: hp(2.5), 
    shadowColor: '#0f172a', 
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    marginRight: wp(4), 
    padding: wp(0.5), 
    backgroundColor: '#F8FAFC',
    borderRadius: wp(7.5), 
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  policyInfo: { flex: 1 },
  companyName: { 
    fontSize: hp(2), 
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B', 
    marginBottom: hp(0.75) 
  },
  policyBadge: { 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: wp(2), 
    paddingVertical: hp(0.5), 
    borderRadius: wp(1.5), 
    alignSelf: 'flex-start' 
  },
  policyNumber: { 
    fontSize: hp(1.5), 
    fontFamily: 'Montserrat-SemiBold',
    color: '#475569' 
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5), 
    padding: wp(6), 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: hp(2.5), 
  },
  statusSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: hp(2) 
  },
   statusBadge: {
    marginLeft: wp(8), 
    paddingVertical: hp(0.6), 
    paddingHorizontal: wp(2.5),
    borderRadius: wp(3),
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'flex-end', 
    flexShrink: 1, 
  },
  statusText: {
    fontSize: hp(1.3),
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flexShrink: 1, 
    textAlign: 'right', 
  },
  dashedDivider: { 
    height: 1, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderStyle: 'dashed', 
    borderRadius: 1, 
    marginBottom: hp(2.5) 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
    marginVertical: hp(2) 
  },
  sectionTitle: { 
    fontSize: hp(1.6), 
    fontFamily: 'Montserrat-Bold',
    color: '#64748B', 
    marginBottom: hp(1.5), 
    textTransform: 'uppercase', 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp(1.5) 
  },
  detailBox: { flex: 1 },
  detailRow: { marginBottom: hp(1.5) }, 
  label: { 
    fontSize: hp(1.5), 
    color: '#94A3B8', 
    marginBottom: hp(0.5), 
    fontFamily: 'Montserrat-Regular' 
  },
  value: { 
    fontSize: hp(1.75), 
    color: '#212936ff', 
    fontFamily: 'Montserrat-SemiBold' 
  },
  valueBold: { 
    fontSize: hp(2), 
    color: '#0F172A', 
    fontFamily: 'Montserrat-Bold' 
  },
  amountBox: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: wp(3), 
    padding: wp(4), 
    alignItems: 'center', 
    marginBottom: hp(2), 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  amountLabel: { 
    fontSize: hp(1.5), 
    color: '#64748B', 
    marginBottom: hp(0.5), 
    fontFamily: 'Montserrat-Regular'
  },
  amountValue: { 
    fontSize: hp(3), 
    fontFamily: 'Montserrat-Bold',
    color: '#0F172A' 
  },
  warningBox: { 
    backgroundColor: '#FFFBEB', 
    borderWidth: 1, 
    borderColor: '#FEF3C7', 
    borderRadius: wp(2), 
    padding: wp(3), 
    marginTop: hp(1) 
  },
  warningLabel: { 
    fontSize: hp(1.5), 
    fontFamily: 'Montserrat-Bold',
    color: '#B45309', 
    marginBottom: hp(0.25) 
  },
  warningValue: { 
    fontSize: hp(1.5), 
    color: '#92400E',
    fontFamily: 'Montserrat-Regular'
  },
  actionContainer: { marginTop: hp(3) }, 
  primaryButton: { 
    borderRadius: wp(3), 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: hp(0.5) }, 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    elevation: 4 
  },
  gradientButton: { 
    alignItems: 'center' 
  },
   gradientButton1: { 
     padding:wp(4),
    alignItems: 'center' 
  },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontSize: hp(1.75), 
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5 
  },
  secondaryButton: { 
    marginTop: hp(1.5), 
    backgroundColor: '#FFFFFF', 
    borderRadius: wp(3), 
    paddingVertical: hp(1.75), 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#CBD5E1' 
  },
  secondaryButtonText: { 
    color: '#475569', 
    fontSize: hp(1.75), 
    fontFamily: 'Montserrat-Bold' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: wp(6), 
    borderTopRightRadius: wp(6), 
    padding: wp(6), 
    paddingBottom: hp(5), 
    elevation: 10 
  },
  modalTitle: { 
    fontSize: hp(2.5), 
    fontFamily: 'Montserrat-Bold',
    color: '#0F172A', 
    marginBottom: hp(2.5) 
  },
  docItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: hp(2), 
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  docIconPlaceholder: { 
    width: wp(8), 
    height: wp(8),
    borderRadius: wp(2), 
    backgroundColor: '#E2E8F0', 
    marginRight: wp(3) 
  },
  docName: { 
    fontSize: hp(1.75), 
    color: '#334155', 
    fontFamily: 'Montserrat-SemiBold',
    flex: 1, 
    marginRight: wp(2.5) 
  },
  downloadLink: { 
    fontSize: hp(1.5), 
    color: '#0F172A', 
    fontFamily: 'Montserrat-Bold' 
  },
  modalCloseBtn: { 
    marginTop: hp(3), 
    backgroundColor: '#F1F5F9', 
    paddingVertical: hp(1.75), 
    borderRadius: wp(3), 
    alignItems: 'center' 
  },
  modalCloseText: { 
    color: '#475569', 
    fontFamily: 'Montserrat-Bold' 
  },
});
export default ClaimDetailss;