import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, SafeAreaView, StatusBar, ImageBackground, Modal, FlatList, Animated, Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension';
import Header from '../component/header';
import { Avatar } from 'react-native-paper';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FileClaimPage = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);
  const [isCashless, setIsCashless] = useState(null); // true for Cashless, false for Reimbursement

  // Selector States
  const [selectedState, setSelectedState] = useState('Select State');
  const [selectedCity, setSelectedCity] = useState('Select City');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [isModalVisible, setModalVisible] = useState(false);
  const [activePicker, setActivePicker] = useState(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Dynamic Step Logic
  const totalSteps = isCashless === false ? 6 : 5;
  const stepTitles = isCashless === false 
    ? ["Policy Selection", "Claim Mode", "Select Patient", "Admission Details", "Upload Documents", "Contact Details"]
    : ["Policy Selection", "Claim Mode", "Select Patient", "Admission Details", "Contact Details"];

  // --- DATA SOURCE ---
  const statesData = ['Delhi', 'Haryana', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Punjab'];
  const citiesData = {
    'Delhi': ['New Delhi', 'South Delhi', 'Dwarka', 'Rohini'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panchkula', 'Ambala'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
    'Uttar Pradesh': ['Noida', 'Lucknow', 'Kanpur', 'Agra'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar']
  };
  const categoryData = ['Heart Care', 'Orthopedic', 'Viral Infection', 'Maternity', 'Critical Illness', 'Dental'];

  const handleBack = () => step === 1 ? navigation?.goBack() : setStep(step - 1);

  const autoAdvance = (nextStepValue) => {
    setTimeout(() => setStep(nextStepValue), 300);
  };

  const getAvatar = (relation) => {
    const r = relation.toLowerCase();
    if (r.includes('self')) return '👨';
    if (r.includes('spouse')) return '👩';
    return '👦';
  };

  const openPicker = (type) => {
    setActivePicker(type);
    setModalVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }).start();
  };

  const closePicker = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }).start(() => setModalVisible(false));
  };

  const onSelectItem = (item) => {
    if (activePicker === 'state') { 
        setSelectedState(item); 
        setSelectedCity('Select City'); 
    }
    else if (activePicker === 'city') { setSelectedCity(item); }
    else if (activePicker === 'category') { setSelectedCategory(item); }
    closePicker();
  };
 const Headerstate = () => (
    <View style={styles.navHeaderContainer}>
      {/* 1. BACK BUTTON (Left Top Corner) */}


      {/* 2. STEP COUNTER (Right Top Corner) */}
      <View style={styles.stepCounterPosition}>
        <Text style={styles.stepCountText}>Step {step} of {totalSteps}</Text>
      </View>

      {/* 3. CENTER CONTENT */}
      <View style={styles.headerContentWrapper}>
        <View style={styles.logoContainer}>
          <Avatar.Text 
            size={wp(12)} 
            label={step.toString()} 
            style={{ backgroundColor: '#0f172a' }} 
            labelStyle={{ fontFamily: 'Montserrat-Bold' }}
          />
        </View>
        <View style={styles.policyInfo}>
          <Text style={styles.companyName}> Step {step} {stepTitles[step - 1]}</Text>
          <View style={styles.policyBadge}>
            <Text style={styles.policyNumberText}>Please fill following details</Text>
          </View>
        </View>
      </View>
    </View>
  );
  // const StepNavigationHeader = () => (
  //   <View style={styles.navHeaderContainer}>
  
  //     <View style={styles.navTitleWrapper}>
  //       <Text style={styles.stepCountText}>Step {step} of {totalSteps}</Text>
  //       <Text style={styles.stepTitleText}>{stepTitles[step - 1]}</Text>
  //     </View>
  //     <View style={{ width: wp(9) }} /> 
  //   </View>
  // );

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={['#F6DCC5',  '#f3f3f3']} style={styles.container}>
        <Header showBack={true} onBack={() => navigation.goBack()} title="New Claim" />
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <Headerstate />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {step === 1 && (
            <View style={styles.detailsCardWrapper}>
              {[1, 2, 3].map((i) => (
                <TouchableOpacity key={i} style={[styles.policyHeaderCard, selectedPolicy === i && styles.selectedGlow]} onPress={() => { setSelectedPolicy(i); autoAdvance(2); }}>
                  <View style={styles.policyLogoBox}><Text style={{fontSize: wp(5)}}>🛡️</Text></View>
                  <View style={styles.policyInfo}>
                    <Text style={styles.companyName}>Health Guard Gold {i === 1 ? 'Plus' : 'Max'}</Text>
                    <View style={styles.policyBadgeRow}>
                      <View style={styles.policyBadge}><Text style={styles.policyNumberText}>POL-1200-{i}02</Text></View>
                      <View style={styles.activeStatusBadge}><Text style={styles.activeStatusText}>ACTIVE</Text></View>
                    </View>
                    <View style={styles.dashedDivider} />
                    <View style={styles.policyDetailRow}>
                       <View><Text style={styles.miniLabel}>SUM INSURED</Text><Text style={styles.valueBold}>₹ 5,00,000</Text></View>
                       <View style={{alignItems: 'flex-end'}}><Text style={styles.miniLabel}>VALID UNTIL</Text><Text style={styles.valueBold}>31 Dec 2026</Text></View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

        {step === 2 && (
            <View style={styles.detailsCardWrapper}>
              <TouchableOpacity style={[styles.typeCard, isCashless === true && styles.selectedGlow]} onPress={() => { setIsCashless(true); autoAdvance(3); }}>
                 {/* ... Cashless Content ... */}
                 <View style={styles.typeHeader}><Text style={styles.choiceEmoji}>🏥</Text><Text style={styles.typeTitle}>Cashless / Intimation</Text></View>
                <Text style={styles.typeDesc}>Get treatment without paying upfront. Insurance settles directly with hospital.</Text>
                <View style={styles.bulletBox}>
                  <Text style={styles.bulletItem}>• Planned hospitalizations at network hospitals</Text>
                  <Text style={styles.bulletItem}>• Intimate within 24-48 hours of admission</Text>
                  <Text style={styles.bulletItem}>• Pre-authorization approval in 2-4 hours</Text>
                </View>
                <Text style={styles.statsText}>⚡ 350+ claims processed securely today</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.typeCard, isCashless === false && styles.selectedGlow]} onPress={() => { setIsCashless(false); autoAdvance(3); }}>
                 {/* ... Reimbursement Content ... */}
                 <View style={styles.typeHeader}><Text style={styles.choiceEmoji}>🏠</Text><Text style={styles.typeTitle}>Reimbursement Claim</Text></View>
                <Text style={styles.typeDesc}>Pay yourself and submit bills later to get reimbursed after verification.</Text>
                <View style={styles.bulletBox}>
                  <Text style={styles.bulletItem}>• Treatments at non-network hospitals</Text>
                  <Text style={styles.bulletItem}>• Submit within 30 days of discharge</Text>
                  <Text style={styles.bulletItem}>• Requires all original bills and documents</Text>
                </View>
                <Text style={styles.statsText}>🏠 20+ private rooms booked this week</Text>
              </TouchableOpacity>
              
              {/* PREVIOUS BUTTON FOR STEP 2 */}
              <TouchableOpacity style={styles.btnPrevMain} onPress={handleBack}>
                 <Text style={styles.btnPrevText}>Previous</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.detailsCardWrapper}>
               <View style={styles.grid}>
                 {/* ... Grid Items ... */}
                 {[{name: 'Brijesh Kumar', rel: 'Self', dob: '15/08/1990'}, {name: 'Anita Chaubey', rel: 'Spouse', dob: '12/10/1992'}, {name: 'Rahul Chaubey', rel: 'Child', dob: '01/01/2018'}].map((item, idx) => (
                   <TouchableOpacity key={idx} style={[styles.gridItem, selectedDep === idx && styles.selectedGlow]} onPress={() => { setSelectedDep(idx); autoAdvance(4); }}>
                      <View style={styles.avatarBox}><Text style={{fontSize: 28}}>{getAvatar(item.rel)}</Text></View>
                      <Text style={styles.depName}>{item.name}</Text>
                      <View style={styles.relBadge}><Text style={styles.relBadgeText}>{item.rel}</Text></View>
                      <Text style={styles.dobText}>DOB: {item.dob}</Text>
                   </TouchableOpacity>
                 ))}
               </View>
               <TouchableOpacity style={styles.btnPrevMain} onPress={handleBack}>
                 <Text style={styles.btnPrevText}>Previous</Text>
               </TouchableOpacity>
            </View>
          )}

          {(step === 4 || step === 5 || step === 6) && (
            <View style={styles.detailsCardWrapper}>
              <View style={styles.formContainer}>
                {step === 4 && (
                  <>
                    {/* ... Step 4 Inputs ... */}
                    <PatternedInput label="Date of Admission" placeholder="DD-MM-YYYY" />
                    <PatternedInput label="Date of Discharge" placeholder="DD-MM-YYYY" />
                    <PatternedInput label="Hospital Name" placeholder="Search Hospital..." />
                    <View style={styles.row}>
                      <View style={styles.flexHalf}>
                        <Text style={styles.boxLabel}>State</Text>
                        <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('state')}>
                            <Text style={styles.dropdownText} numberOfLines={1}>{selectedState}</Text>
                            <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.flexHalf}>
                        <Text style={styles.boxLabel}>City</Text>
                        <TouchableOpacity style={styles.dropdownTrigger} onPress={() => openPicker('city')}>
                            <Text style={styles.dropdownText} numberOfLines={1}>{selectedCity}</Text>
                            <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <PatternedInput label="Hospital Pin Code" placeholder="000000" keyboardType="numeric" />
                    <Text style={styles.boxLabel}>Category</Text>
                    <TouchableOpacity style={[styles.dropdownTrigger, {marginBottom: hp(2)}]} onPress={() => openPicker('category')}>
                        <Text style={styles.dropdownText}>{selectedCategory}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                    <PatternedInput label="Disease" placeholder="Enter Disease Name" />
                    
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack}>
                        <Text style={styles.btnPrevTextSmall}>Previous</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnFormNextHalf} onPress={() => setStep(5)}>
                        <Text style={styles.btnText}>Next Step</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step === 5 && (
                  isCashless === false ? (
                    <>
                       {/* ... Upload Content ... */}
                       <Text style={styles.typeDesc}>Upload hospital bills, discharge summary, and medical reports</Text>
                       <Text style={styles.miniLabel}>PDF or images (max 10MB per file)</Text>
                       <TouchableOpacity style={styles.uploadBox}><Text style={{fontSize: 30}}>📁</Text><Text style={styles.btnTextBlack}>Choose Files</Text></TouchableOpacity>
                       
                       <View style={styles.buttonRow}>
                          <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack}>
                            <Text style={styles.btnPrevTextSmall}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.btnFormNextHalf} onPress={() => setStep(6)}>
                            <Text style={styles.btnText}>Next Step</Text>
                          </TouchableOpacity>
                       </View>
                    </>
                  ) : (
                    <>
                      {/* ... Final Details (Cashless) ... */}
                      <PatternedInput label="Claim Amount" placeholder="₹ Amount" keyboardType="numeric" />
                      <PatternedInput label="Mobile Number" placeholder="+91" keyboardType="phone-pad" />
                      <PatternedInput label="Email Address" placeholder="example@mail.com" />
                      
                      <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack}>
                          <Text style={styles.btnPrevTextSmall}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnFormNextHalf} onPress={() => {}}>
                          <Text style={styles.btnText}>Submit Claim</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )
                )}

                {step === 6 && isCashless === false && (
                  <>
                    {/* ... Final Details (Reimbursement) ... */}
                    <PatternedInput label="Claim Amount" placeholder="₹ Amount" keyboardType="numeric" />
                    <PatternedInput label="Mobile Number" placeholder="+91" keyboardType="phone-pad" />
                    <PatternedInput label="Email Address" placeholder="example@mail.com" />
                    
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack}>
                        <Text style={styles.btnPrevTextSmall}>Previous</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnFormNextHalf} onPress={() => {}}>
                        <Text style={styles.btnText}>Submit Claim</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}

        </ScrollView>

        <Modal visible={isModalVisible} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closePicker} />
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalHeader}>Select {activePicker?.toUpperCase()}</Text>
              <FlatList
                data={activePicker === 'state' ? statesData : activePicker === 'city' ? (citiesData[selectedState] || []) : categoryData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => onSelectItem(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.flatListStyle}
              />
              <TouchableOpacity style={styles.closeBtn} onPress={closePicker}>
                <Text style={styles.closeBtnText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const PatternedInput = ({ label, ...props }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.boxLabel}>{label}</Text>
    <View style={styles.inputBackground}>
      <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/subtle-white-feathers.png' }} style={styles.patternInner} imageStyle={{ opacity: 0.1 }}>
        <TextInput style={styles.boxedTextInput} placeholderTextColor="#94A3B8" {...props} />
      </ImageBackground>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: wp(4), paddingTop: hp(10.5), paddingBottom: hp(5) },
  
  navHeaderContainer: { position: 'absolute', top: hp(12.5), left: wp(5), right: wp(5), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: wp(3), borderRadius: wp(4), zIndex: 100, elevation: 10, shadowColor: '#0f172a', shadowOpacity: 0.1 },
  backButtonPosition: {
    position: 'absolute',
    top: wp(0.5),
    left: wp(0.5),
    zIndex: 101,
  },
  stepCounterPosition: {
    position: 'absolute',
    top: wp(3),
    right: wp(4),
  },
  headerContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5), // Push down slightly to clear the corner elements
  },
  logoContainer: {
    marginLeft: wp(6),
    marginRight: wp(4),
    padding: wp(0.5),
    backgroundColor: '#F8FAFC',
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  // policyInfo: {
  //   flex: 1,
  //   justifyContent: 'center',
  // },
  // companyName: {
  //   fontSize: hp(1.8),
  //   fontFamily: 'Montserrat-Bold',
  //   color: '#1E293B',
  //   lineHeight: hp(2.2),
  // },
  stepCountText: {
    fontSize: hp(1.2), // Small text as requested
    fontFamily: 'Montserrat-Bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  navIconBtn: {
    // width: wp(8),
    height: wp(8),
    // borderRadius: wp(4),
    // backgroundColor: '#F1F5F9',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  navIconText: {
    fontSize: wp(3),
    color: '#0f172a',
  },
  //     logoContainer: {
  //   marginRight: wp(4), // approx 16
  //   padding: wp(0.5), // approx 2
  //   backgroundColor: '#F8FAFC',
  //   borderRadius: wp(7.5), // approx 30
  //   borderWidth: 1,
  //   borderColor: '#E2E8F0'
  // },
  // navIconBtn: { width: wp(9), height: wp(9), borderRadius: wp(4.5), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  // navIconText: { fontSize: wp(3.5), color: '#0f172a' },
  navTitleWrapper: { alignItems: 'center', flex: 1 },
  // stepCountText: { fontSize: hp(1.3), fontFamily: 'Montserrat-Bold', color: '#94A3B8' },
  stepTitleText: { fontSize: hp(1.7), fontFamily: 'Montserrat-Bold', color: '#0f172a' },
  
  detailsCardWrapper: { backgroundColor: '#FFFFFF', borderRadius: wp(5), padding: wp(4), elevation: 6, shadowOpacity: 0.06, marginBottom: hp(1), minHeight: hp(70) },
  policyHeaderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: wp(4), padding: wp(3), marginBottom: hp(1), borderWidth: 1, borderColor: '#E2E8F0' },
  selectedGlow: { borderColor: '#0f172a', backgroundColor: '#F4F7FF', borderWidth: 1.5 },
  policyLogoBox: { marginRight: wp(3), padding: wp(2), backgroundColor: '#FFF', borderRadius: wp(3), elevation: 2 },
  policyInfo: { flex: 1 },
  companyName: { fontSize: hp(1.6), fontFamily: 'Montserrat-Bold', color: '#1E293B' },
  policyBadgeRow: { flexDirection: 'row', marginTop: hp(0.3) },
  policyBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: wp(2), borderRadius: wp(1) ,width:wp(34) },
  activeStatusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: wp(2), borderRadius: wp(1), marginLeft: 8 },
  activeStatusText: { color: '#065F46', fontSize: hp(1), fontFamily: 'Montserrat-Bold' },
  policyNumberText: { fontSize: hp(1.1), color: '#475569' },
  dashedDivider: { height: 1, width: '100%', borderWidth: 0.5, borderColor: '#E2E8F0', borderStyle: 'dashed', marginVertical: hp(0.8) },
  policyDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  
  typeCard: { padding: wp(4), borderRadius: wp(4), borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#F8FAFC', marginBottom: hp(0.5) },
  choiceEmoji: { fontSize: 22, marginBottom: 4 },
  typeTitle: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.7), color: '#1E293B' },
  typeDesc: { fontSize: hp(1.4), color: '#64748B', marginTop: 2 },
  bulletBox: { backgroundColor: 'rgba(0,0,0,0.03)', padding: 8, borderRadius: 10, marginTop: 6 },
  bulletItem: { fontSize: hp(1.2), color: '#475569', marginBottom: 2 },
  statsText: { fontSize: hp(1.1), fontFamily: 'Montserrat-Bold', color: '#065F46', marginTop: 5 },
  infoTitle: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.4), color: '#333', marginBottom: 5 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#F8FAFC', borderRadius: wp(4), padding: wp(3), alignItems: 'center', marginBottom: hp(1), borderWidth: 1, borderColor: '#E2E8F0' },
  avatarBox: { width: wp(12), height: wp(12), borderRadius: wp(6), backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginBottom: 6 },
  depName: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.5), color: '#1E293B' },
  relBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 6, borderRadius: 4, marginVertical: 4 },
  relBadgeText: { fontSize: hp(1), color: '#475569', fontFamily: 'Montserrat-Bold' },
  dobText: { fontSize: hp(1.2), color: '#94A3B8' },
  
  boxLabel: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.4), color: '#475569', marginBottom: 6 },
  inputWrapper: { marginBottom: hp(1.5) },
  inputBackground: { backgroundColor: '#F8FAFD', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  boxedTextInput: { paddingHorizontal: 12, paddingVertical: hp(0.8), fontSize: hp(1.6), color: '#1E293B' },
  dropdownTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFD', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, height: hp(5) },
  dropdownText: { fontSize: hp(1.6), color: '#1E293B', fontFamily: 'Montserrat-Medium' },
  dropdownArrow: { color: '#64748B', fontSize: hp(1.2) },
  row: { flexDirection: 'row', marginBottom: hp(1) },
  flexHalf: { flex: 1, marginRight: 10 },
  
  btnFormNext: { backgroundColor: '#0f172a', paddingVertical: hp(1.5), borderRadius: 12, alignItems: 'center', marginTop: hp(1) },
  btnText: { color: '#FFF', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
  btnTextBlack: { color: '#0f172a', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
  
  uploadBox: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', borderRadius: 12, padding: 20, alignItems: 'center', marginVertical: 15, backgroundColor: '#F8FAFC' },
  
  valueBold: { fontSize: hp(1.6), color: '#0F172A', fontFamily: 'Montserrat-Bold' },
  miniLabel: { fontSize: hp(1.1), color: '#94A3B8' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: hp(60) },
  modalHandle: { width: 40, height: 5, backgroundColor: '#D1D9E6', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { fontFamily: 'Montserrat-Bold', fontSize: 18, marginBottom: 15, textAlign: 'center' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemText: { fontFamily: 'Montserrat-Medium', fontSize: 16, color: '#333' },
  flatListStyle: { flexGrow: 0 },
  closeBtn: { marginTop: 10, alignItems: 'center', padding: 10 },

  closeBtnText: { color: '#FF3B30', fontFamily: 'Montserrat-Bold' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  btnPrevMain: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginTop: hp(1),
    borderWidth: 1,
    borderColor: '#0f172a',
    borderRadius: 12,
  },
  btnPrevText: {
    color: '#0f172a',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.6),
  },
  btnPrevSmall: {
    width: '45%',
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f172a',
    borderRadius: 12,
  },
  btnFormNextHalf: {
    width: '45%',
    backgroundColor: '#0f172a',
    paddingVertical: hp(1.5),
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrevTextSmall: {
    color: '#0f172a',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(1.6),
  },
});

export default FileClaimPage;