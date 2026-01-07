import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Linking, Dimensions, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
// import { DOMAIN_URL } from '../../utility/strings';
import Header from '../component/header';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import

const { width } = Dimensions.get('window');

// --- DUMMY DATA ---
const dummyClaim = {
  tpa_claim_id: 'CLM-2023-8945',
  patient_name: 'Rahul Sharma',
  patient_relation: 'Self',
  hospital_name: 'Apollo Hospital, Delhi',
  date_of_admission: '12 Oct 2023',
  date_of_discharge: '15 Oct 2023',
  claim_amount: '₹ 45,000',
  type_of_claim: 'Cashless',
  claim_status: 'Approved', 
  claim_mode: 'Reimbursement',
  deduction_reasons: 'Non-medical expenses deducted.',
  policy_number: 'POL-987654321',
  policy: {
    insurance_company_name: 'HDFC ERGO General Insurance',
    insurance_comp_icon_url: '', 
  },
  settlment_letter: 'https://example.com/settlement.pdf',
  query_letter: null,
  claim_document: [
    { filename: 'Discharge Summary', url: 'example.com/doc1' },
    { filename: 'Final Bill', url: 'example.com/doc2' },
  ]
};

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

  const claim = route.params?.item || dummyClaim;

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('approved') || s.includes('settled')) return '#065F46';
    if (s.includes('reject') || s.includes('denied')) return '#991B1B';
    return '#92400E';
  };

  const getStatusBg = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('approved') || s.includes('settled')) return '#D1FAE5'; 
    if (s.includes('reject') || s.includes('denied')) return '#FEE2E2'; 
    return '#FEF3C7'; 
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* LAYER 1: Background Gradient (Fixed) */}
      <View style={styles.backgroundHeader}>
        <LinearGradient
          colors={['#F6DCC5', '#F6DCC5']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <HeaderPattern />
      </View>
           <View style={styles.stickyHeader}>
        <Header
          showBack={true} 
          onBack={() => navigation.goBack()} 
          title="Claim Details"
        />
      </View>

      {/* LAYER 2: Scrollable Content */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- 1. Policy Header Card (Floating) --- */}
        <View style={styles.policyHeaderCard}>
          <View style={styles.logoContainer}>
               <Avatar.Text size={wp(14)} label="INS" style={{backgroundColor: '#0f172a'}} /> 
          </View>
          <View style={styles.policyInfo}>
            <Text style={styles.companyName}>{claim?.policy.insurance_company_name}</Text>
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
             <View style={[styles.statusBadge, { backgroundColor: getStatusBg(claim?.claim_status) }]}>
               <Text style={[styles.statusText, { color: getStatusColor(claim?.claim_status) }]}>{claim?.claim_status}</Text>
             </View>
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
            {claim.settlment_letter && (
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => Linking.openURL(claim.settlment_letter)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0f172a', '#334155']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                   <View style={styles.gradientButton1}>
                      <Text style={styles.primaryButtonText}>Download Settlement Letter</Text>
                   </View>
                  
                </LinearGradient>
              </TouchableOpacity>
            )}

            {claim.query_letter && (
              <TouchableOpacity 
                style={[styles.primaryButton, {marginTop: hp(1.2)}]}
                onPress={() => Linking.openURL(claim.query_letter)}
                activeOpacity={0.8}
              >
                 <LinearGradient
                  colors={['#d97706', '#b45309']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <View style={styles.gradientButton1}>
                     <Text style={styles.primaryButtonText}>Download Query Letter</Text>
                  </View>
                  
                </LinearGradient>
              </TouchableOpacity>
            )}

            {Array.isArray(claim?.claim_document) && claim?.claim_document.length > 0 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setModalDocuments(claim.claim_document);
                  setShowModal(true);
                }}
              >
                <Text style={styles.secondaryButtonText}>View All Documents</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>

      {/* LAYER 3: Fixed Header (Stays on Top) */}
 

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Documents</Text>
            {modalDocuments.map((doc, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => Linking.openURL(`https://${doc.url}`)}
                style={styles.docItem}
              >
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
  
  // 1. Background (Fixed)
  backgroundHeader: {
    height: hp(31), // approx 250
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 0, // Behind everything
  },

  // 2. Sticky Header (Fixed Top)
  stickyHeader: {
    // position: 'absolute',
    top: Platform.OS === 'ios' ? hp(3.6) : hp(0.6), // approx 5
    // left: 0,
    right: 0,
    height: hp(10), // approx 60
    // zIndex: 100, // Highest zIndex ensures it stays on top
    // backgroundColor: 'transparent' // Uncomment if you want clear background
  },

  // 3. Scroll Content
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(4), // approx 16
    // Add ample padding top so content starts below the header bar
    paddingTop: hp(3.7), // approx 30
    paddingBottom: hp(5), // approx 40
  },

  // --- Cards & Content Styles ---
  policyHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4), // approx 16
    padding: wp(4), // approx 16
    marginBottom: hp(2.5), // approx 20
    shadowColor: '#0f172a', 
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    marginRight: wp(4), // approx 16
    padding: wp(0.5), // approx 2
    backgroundColor: '#F8FAFC',
    borderRadius: wp(7.5), // approx 30
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  policyInfo: { flex: 1 },
  companyName: { 
    fontSize: hp(2), // approx 16
    fontWeight: '800', // Note: fonts usually don't support fontWeight property with fontFamily
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B', 
    marginBottom: hp(0.75) // approx 6
  },
  policyBadge: { 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: wp(2), // approx 8
    paddingVertical: hp(0.5), // approx 4
    borderRadius: wp(1.5), // approx 6
    alignSelf: 'flex-start' 
  },
  policyNumber: { 
    fontSize: hp(1.5), // approx 12
    fontFamily: 'Montserrat-SemiBold',
    color: '#475569' 
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5), // approx 20
    padding: wp(6), // approx 24
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: hp(2.5), // approx 20
  },
  statusSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: hp(2) // approx 16
  },
  statusBadge: { 
    paddingHorizontal: wp(3), // approx 12
    paddingVertical: hp(0.75), // approx 6
    borderRadius: wp(5) // approx 20
  },
  statusText: { 
    fontSize: hp(1.5), // approx 12
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  dashedDivider: { 
    height: 1, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderStyle: 'dashed', 
    borderRadius: 1, 
    marginBottom: hp(2.5) // approx 20
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F1F5F9', 
    marginVertical: hp(2) // approx 16
  },
  sectionTitle: { 
    fontSize: hp(1.6), // approx 13
    fontFamily: 'Montserrat-Bold',
    color: '#64748B', 
    marginBottom: hp(1.5), // approx 12
    textTransform: 'uppercase', 
    // letterSpacing: 1 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp(1.5) // approx 12
  },
  detailBox: { flex: 1 },
  detailRow: { marginBottom: hp(1.5) }, // approx 12
  label: { 
    fontSize: hp(1.5), // approx 12
    color: '#94A3B8', 
    marginBottom: hp(0.5), // approx 4
    fontFamily: 'Montserrat-Regular' 
  },
  value: { 
    fontSize: hp(1.75), // approx 14
    color: '#212936ff', 
    fontFamily: 'Montserrat-SemiBold' 
  },
  valueBold: { 
    fontSize: hp(2), // approx 16
    color: '#0F172A', 
    fontFamily: 'Montserrat-Bold' 
  },
  amountBox: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: wp(3), // approx 12
    padding: wp(4), // approx 16
    alignItems: 'center', 
    marginBottom: hp(2), // approx 16
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  amountLabel: { 
    fontSize: hp(1.5), // approx 12
    color: '#64748B', 
    marginBottom: hp(0.5), // approx 4
    fontFamily: 'Montserrat-Regular'
  },
  amountValue: { 
    fontSize: hp(3), // approx 24
    fontFamily: 'Montserrat-Bold',
    color: '#0F172A' 
  },
  warningBox: { 
    backgroundColor: '#FFFBEB', 
    borderWidth: 1, 
    borderColor: '#FEF3C7', 
    borderRadius: wp(2), // approx 8
    padding: wp(3), // approx 12
    marginTop: hp(1) // approx 8
  },
  warningLabel: { 
    fontSize: hp(1.5), // approx 12
    fontFamily: 'Montserrat-Bold',
    color: '#B45309', 
    marginBottom: hp(0.25) 
  },
  warningValue: { 
    fontSize: hp(1.5), // approx 12
    color: '#92400E',
    fontFamily: 'Montserrat-Regular'
  },
  actionContainer: { marginTop: hp(3) }, // approx 24
  primaryButton: { 
    borderRadius: wp(3), // approx 12
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
    fontSize: hp(1.75), // approx 14
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5 
  },
  secondaryButton: { 
    marginTop: hp(1.5), // approx 12
    backgroundColor: '#FFFFFF', 
    borderRadius: wp(3), // approx 12
    paddingVertical: hp(1.75), // approx 14
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#CBD5E1' 
  },
  secondaryButtonText: { 
    color: '#475569', 
    fontSize: hp(1.75), // approx 14
    fontFamily: 'Montserrat-Bold' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: wp(6), // approx 24
    borderTopRightRadius: wp(6), // approx 24
    padding: wp(6), // approx 24
    paddingBottom: hp(5), // approx 40
    elevation: 10 
  },
  modalTitle: { 
    fontSize: hp(2.5), // approx 20
    fontFamily: 'Montserrat-Bold',
    color: '#0F172A', 
    marginBottom: hp(2.5) // approx 20
  },
  docItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: hp(2), // approx 16
    borderBottomWidth: 1, 
    borderBottomColor: '#F1F5F9' 
  },
  docIconPlaceholder: { 
    width: wp(8), // approx 32
    height: wp(8),
    borderRadius: wp(2), // approx 8
    backgroundColor: '#E2E8F0', 
    marginRight: wp(3) // approx 12
  },
  docName: { 
    fontSize: hp(1.75), // approx 14
    color: '#334155', 
    fontFamily: 'Montserrat-SemiBold',
    flex: 1, 
    marginRight: wp(2.5) // approx 10
  },
  downloadLink: { 
    fontSize: hp(1.5), // approx 12
    color: '#0F172A', 
    fontFamily: 'Montserrat-Bold' 
  },
  modalCloseBtn: { 
    marginTop: hp(3), // approx 24
    backgroundColor: '#F1F5F9', 
    paddingVertical: hp(1.75), // approx 14
    borderRadius: wp(3), // approx 12
    alignItems: 'center' 
  },
  modalCloseText: { 
    color: '#475569', 
    fontFamily: 'Montserrat-Bold' 
  },
});
export default ClaimDetailss;