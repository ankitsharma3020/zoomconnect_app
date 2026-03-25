import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, StatusBar, ImageBackground, Modal, FlatList, Animated, Dimensions, ToastAndroid, Platform, KeyboardAvoidingView,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension';
import Header from '../component/header';
import { Avatar } from 'react-native-paper';
import { useSubmitclaimMutation } from '../redux/service/user/user';
import { useSelector } from 'react-redux';
import FastImage from '@d11/react-native-fast-image';

// RNFS, File Picker, and DateTimePicker imports
import RNFS from 'react-native-fs';
import { pick, types, keepLocalCopy } from '@react-native-documents/picker'; 
import DateTimePicker from '@react-native-community/datetimepicker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const formatCurrency = (amount) => {
  if (!amount) return '₹ 0';
  return "₹ " + Number(amount).toLocaleString('en-IN');
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// --- NEW ILLNESS CATEGORY & NATURE DATA ---
const illnessData = {
  "LAE":["LAE"],
  "ULAE":["ULAE"],
  "AYUSH":["Medical","Illness","Cancer","Critical Illness","Accident","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Death":["Death of insured","Death"],
  "Day Care":["Surgical","Medical","Chemotherapy","Radiotherapy","Dialysis","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Maternity":["Anti-natal","Delivery","New born Care","Immunisation for newborn","Post Natal Complication","Hospitalization for child","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Organ donor":["End Stage Liver Failure","End Stage Lung Failure","Major Organ/ Bone Marrow Transplant","Kidney Failure Requiring Regular Dialysis","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Air Ambulance":["Evacuation","Critical Illness","Accidental","Illness","Cancer"],
  "Cancer Benefit":["Cancer of Specified Severity","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Health Check-up":["Annual Health Check-Up","Adoc Health Check up"],
  "TPA Service Fee":["PPMC tests","CMO Opinion Fees"],
  "Loss of Employment":["Terminated","Dismissed","Retrenched"],
  "Domicilary treatment":["Critical Illness","Accidental", "Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Outpatient Treatment":["Procedure","Consultation/Pharmacy/Diagnostics","Laboratory services","Pharmacy service","Doctor consultation"],
  "COVID Hospitalization":["COVID Hospitalization","COVID Positive","COVID Quarantine","Pre or Post Hospitalisation expenses"],
  "Infertility treatment":["Primary infertility for Male","Secondary infertility for Male","Primary infertility for Female","Secondary infertility for Female","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Second Medical Opinion":["Medical","Surgical"],
  "Daily Hospital Cash Cover":["Critical Illness","Accidental","Illness","Cancer"],
  "Inpatient Hospitalisation":["Critical Illness","Cancer","Illness","Accidental","Lumpsum for Pre or post Hospitalisation expenses","Pre or Post Hospitalisation expenses"],
  "Critical Illness Hospitalisation":["Aplastic Anaemia","Loss of Independent Existence","Multiple Sclerosis with Persisting Symptoms","Motor Neurone Disease with Permanent Symptoms","Permanent Paralysis of Limbs","Stroke Resulting in Permanent Symptoms","Major Head Trauma","Coma of Specified Severity","Benign Brain Tumour","Apallic Syndrome","Major Organ/ Bone Marrow Transplant","Kidney Failure Requiring Regular Dialysis","End Stage Lung Failure","End Stage Liver Failure","Open Chest CABG","Primary (Idiopathic) Pulmonary Hypertension","Surgery to Aorta","Open Heart Replacement or Repair of Heart Valves","Myocardial Infarction","Cancer of Specified Severity","Pre or Post Hospitalisation expenses","Lumpsum for Pre or post Hospitalisation expenses"],
  "Long Hospitalization Cash Benefit":["Critical Illness","Cancer","Accidental","Illness"]
};

const categoriesList = Object.keys(illnessData);

const FileClaimPage = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [Submitclaim] = useSubmitclaimMutation();
  const [selectedDep, setSelectedDep] = useState(null);
  const [isCashless, setIsCashless] = useState(null);

  // --- FORM DATA STATES ---
  const [doa, setDoa] = useState('');
  const [dod, setDod] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [pinCode, setPinCode] = useState('');
  
  // Category and Nature dropdowns
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [natureOfIllness, setNatureOfIllness] = useState('Select Nature of Illness');

  const [claimNo, setClaimNo] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [loading, setLoading] = useState(false);

  // Date Picker States
  const [showDoaPicker, setShowDoaPicker] = useState(false);
  const [showDodPicker, setShowDodPicker] = useState(false);

  // Auto-filled States (No longer dropdowns)
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Modal States
  const [isModalVisible, setModalVisible] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  // File states
  const [selectedFile, setSelectedFile] = useState(null);
  const [dp64, setDP64] = useState('');

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  
  const { data: PolicyData } = useSelector((state) => state.policy);
  const policiesList = PolicyData?.data?.policy_details || [];
  
  const totalSteps = isCashless === false ? 6 : 5;
  const stepTitles = isCashless === false 
    ? ["Policy", "Claim Mode", "Patient", "Admission Details", "Upload Docs", "Contact Details"]
    : ["Policy", "Claim Mode", "Patient", "Admission Details", "Contact Details"];

  const handleBack = () => step === 1 ? navigation?.goBack() : setStep(step - 1);

  const autoAdvance = (nextStepValue) => {
    setTimeout(() => setStep(nextStepValue), 300);
  };

  const showToastOrAlert = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Required', msg);
    }
  };

  // --- PINCODE API AUTO-FILL LOGIC ---
  const handlePincodeChange = async (val) => {
    setPinCode(val);
    if (val.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setSelectedState(postOffice.State);
          setSelectedCity(postOffice.District);
        } else {
          showToastOrAlert('Invalid Pincode entered');
          setSelectedState('');
          setSelectedCity('');
        }
      } catch (error) {
        console.error("Pincode Fetch Error:", error);
      }
    } else {
      setSelectedState('');
      setSelectedCity('');
    }
  };

  // --- VALIDATIONS ---
  const validateAndProceed = (targetStep) => {
    // Validating Admission Details (Step 4)
    if (step === 4) {
      if (!doa) return showToastOrAlert('Date of Admission is mandatory');
      if (!dod) return showToastOrAlert('Date of Discharge is mandatory');
      if (!hospitalName.trim()) return showToastOrAlert('Hospital Name is mandatory');
      if (!pinCode || pinCode.length < 6) return showToastOrAlert('Valid 6-digit Hospital Pincode is mandatory');
      if (!selectedState || !selectedCity) return showToastOrAlert('State and City are mandatory (Enter valid Pincode)');
      
      // Category and nature validations
      if (selectedCategory === 'Select Category') return showToastOrAlert('Category of Illness is mandatory');
      if (natureOfIllness === 'Select Nature of Illness') return showToastOrAlert('Nature of Illness is mandatory');
    }

    // Validating Document Upload (Step 5 in Reimbursement)
    if (step === 5 && isCashless === false) {
      if (!dp64) return showToastOrAlert('Please upload the required medical documents');
    }

    setStep(targetStep);
  };

  const validateContactAndSubmit = () => {
    if (!emergencyContactName.trim()) return showToastOrAlert('Emergency Contact Name is mandatory');
    if (!claimAmount || isNaN(claimAmount) || Number(claimAmount) <= 0) return showToastOrAlert('Valid Claim Amount is mandatory');
    if (!mobileNo || mobileNo.length !== 10) return showToastOrAlert('Valid 10-digit Mobile Number is mandatory');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) return showToastOrAlert('Valid Email Address is mandatory');

    handleSubmit();
  };

  // --- DATE PICKER HANDLERS ---
  const onDoaChange = (event, selectedDate) => {
    setShowDoaPicker(false);
    if (selectedDate) {
      setDoa(selectedDate.toISOString().split('T')[0]);
    }
  };

  const onDodChange = (event, selectedDate) => {
    setShowDodPicker(false);
    if (selectedDate) {
      setDod(selectedDate.toISOString().split('T')[0]);
    }
  };

  // --- DOCUMENT PICKER ---
  const openGallery = useCallback(async () => {
    try {
      const result = await pick({
        mode: 'import', 
        allowMultiSelection: false,
        type: [types.images, types.pdf], 
      });

      if (!result || result.length === 0) return;

      const fileObj = result[0];
      let filePath = fileObj.uri;

      if (Platform.OS === 'android' && filePath.startsWith('content://')) {
         const [copyResult] = await keepLocalCopy({
           files: [{ uri: fileObj.uri, fileName: fileObj.name ?? `document_${Date.now()}` }],
           destination: 'cachesDirectory',
         });

         if (copyResult?.status === 'success') {
           filePath = copyResult.localUri;
         } else {
           throw new Error(copyResult?.copyError || 'Failed to copy file.');
         }
      } else if (Platform.OS === 'ios') {
         let cleanPath = '';
         let isFileUrl = true;
         let filePrefix = 'file://';
         for (let i = 0; i < 7; i++) {
             if (filePath[i] !== filePrefix[i]) {
                 isFileUrl = false;
                 break;
             }
         }
         let startIndex = isFileUrl ? 7 : 0;
         for (let i = startIndex; i < filePath.length; i++) {
             cleanPath += filePath[i];
         }
         filePath = decodeURIComponent(cleanPath);
      }

      const fileSize = fileObj.size ?? (await RNFS.stat(filePath)).size;
      const fileSizeInMB = fileSize / (1024 * 1024);

      if (fileSizeInMB > 2) {
        showToastOrAlert('Please select a file under 2MB limit.');
        return;
      }

      const base64Data = await RNFS.readFile(filePath, 'base64');
      
      setSelectedFile({
          name: fileObj.name,
          size: fileSize,
          type: fileObj.type,
          uri: filePath
      });
      setDP64(base64Data);

      showToastOrAlert(`File Selected: ${fileObj.name}`);

    } catch (error) {
      if (error?.code === 'OPERATION_CANCELED' || error?.code === 'DOCUMENTS_PICKER_CANCELED') {
        console.log('User cancelled document picking');
      } else {
        console.error('File pick error:', error);
        showToastOrAlert('Failed to pick document');
      }
    }
  }, []);

  // --- MODAL / PICKER LOGIC ---
  const openPicker = (type) => {
    setActivePicker(type);
    setSearchQuery(''); // Reset search whenever modal opens
    setModalVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }).start();
  };

  const closePicker = () => {
    Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 300, useNativeDriver: true }).start(() => setModalVisible(false));
  };

  const onSelectItem = (item) => {
    if (activePicker === 'category') { 
        setSelectedCategory(item); 
        setNatureOfIllness('Select Nature of Illness'); // Reset Nature when Category changes
    }
    else if (activePicker === 'nature') { setNatureOfIllness(item); }
    closePicker();
  };

  // Dynamically get modal data & filter it via search
  let currentModalData = [];
  if (activePicker === 'category') currentModalData = categoriesList;
  else if (activePicker === 'nature') currentModalData = illnessData[selectedCategory] || [];

  const filteredModalData = currentModalData.filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- SUBMIT LOGIC ---
  const handleSubmit = async () => {
    const dependent = selectedPolicy?.dependents?.[selectedDep];
    
    const payload = {
      policy_id: selectedPolicy?.id,
      relation_name: dependent?.relation || "SELF",
      policy_number: selectedPolicy?.policy_number,
      uhid_member_id: dependent?.uhid,
      claim_type: isCashless ? "intimation" : "reimbursement",
      date_of_admission: doa,
      insured_name: dependent?.insured_name,
      hospital_name: hospitalName,
      hospital_state: selectedState,
      hospital_city: selectedCity,
      hospital_pin_code: pinCode,
      // Pass the selected Nature as diagnosis
      diagnosis: natureOfIllness === 'Select Nature of Illness' ? '' : natureOfIllness,
      claim_amount: Number(claimAmount) || 0,
      relation_with_patient: dependent?.relation || "SELF",
      mobile_no: mobileNo,
      email: email,
      date_of_discharge: dod, 
      emergency_contact_name: emergencyContactName,
      claim_no: claimNo,
      category: selectedCategory === 'Select Category' ? '' : selectedCategory,
    };

    if (isCashless === false) {
      payload.file_url = dp64 || "";
    }

    setLoading(true);
    try {
      let res = await Submitclaim(payload);
      if (res?.data?.status === 'success') {
        showToastOrAlert('Claim Submitted Successfully!');
        navigation.goBack();
      } else {
        showToastOrAlert(res.error?.data?.message || 'Failed to submit claim');
      }
    } catch (error) {
      showToastOrAlert('Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };
  
  const Headerstate = () => (
    <View style={styles.navHeaderContainer}>
      <View style={styles.stepCounterPosition}>
        <Text style={styles.stepCountText}>Step {step} of {totalSteps}</Text>
      </View>
      <View style={styles.headerContentWrapper}>
        <View style={styles.logoContainer}>
          <Avatar.Text size={wp(12)} label={step.toString()} style={{ backgroundColor: '#0f172a' }} labelStyle={{ fontFamily: 'Montserrat-Bold' }} />
        </View>
        <View style={styles.policyInfo}>
          <Text style={styles.companyName}> Step {step}: {stepTitles[step - 1]}</Text>
          <View style={styles.policyBadgeTop}>
            <Text style={styles.policyNumberTextTop}>Please fill following details</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <LinearGradient colors={['#F6DCC5',  '#f3f3f3']} style={styles.container}>
        <Header showBack={true} onBack={() => navigation.goBack()} title="New Claim" />
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <Headerstate />

      <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(0.5)} 
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={[styles.scrollContent, { paddingBottom: hp(15) }]} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" 
          >
            
            {/* STEP 1: POLICY SELECTION */}
            {step === 1 && (
              <View style={styles.detailsCardWrapper}>
                {policiesList.map((policy) => (
                  <TouchableOpacity 
                    key={policy.id} 
                    style={[styles.policyHeaderCard, selectedPolicy?.id === policy.id && styles.selectedGlow]} 
                    onPress={() => { setSelectedPolicy(policy); autoAdvance(2); }}
                  >
                    <View style={styles.policyLogoBox}>
                      <FastImage source={require('../../assets/policy.png')} style={{height:40,width:50}} resizeMode='contain'/>
                    </View>
                    <View style={styles.policyInfo}>
                      <Text style={styles.companyName}>{policy.corporate_policy_name || policy.policy_name}</Text>
                      <View style={styles.policyBadgeRow}>
                        <View style={styles.policyBadge}>
                          <Text style={styles.policyNumberText} numberOfLines={1} ellipsizeMode="middle">
                            {policy.policy_number}
                          </Text>
                        </View>
                        {policy.is_active === 1 && (
                          <View style={styles.activeStatusBadge}><Text style={styles.activeStatusText}>ACTIVE</Text></View>
                        )}
                      </View>
                      <View style={styles.dashedDivider} />
                      <View style={styles.policyDetailRow}>
                        <View>
                          <Text style={styles.miniLabel}>SUM INSURED</Text>
                          <Text style={styles.valueBold}>{formatCurrency(policy.total_cover)}</Text>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                          <Text style={styles.miniLabel}>VALID UNTIL</Text>
                          <Text style={styles.valueBold}>{formatDate(policy.policy_end_date)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* STEP 2: CLAIM TYPE */}
            {step === 2 && (
              <View style={styles.detailsCardWrapper}>
                <TouchableOpacity style={[styles.typeCard, isCashless === true && styles.selectedGlow]} onPress={() => { setIsCashless(true); autoAdvance(3); }}>
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
                  <View style={styles.typeHeader}><Text style={styles.choiceEmoji}>🏠</Text><Text style={styles.typeTitle}>Reimbursement Claim</Text></View>
                  <Text style={styles.typeDesc}>Pay yourself and submit bills later to get reimbursed after verification.</Text>
                  <View style={styles.bulletBox}>
                    <Text style={styles.bulletItem}>• Treatments at non-network hospitals</Text>
                    <Text style={styles.bulletItem}>• Submit within 30 days of discharge</Text>
                    <Text style={styles.bulletItem}>• Requires all original bills and documents</Text>
                  </View>
                  <Text style={styles.statsText}>🏠 20+ private rooms booked this week</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.btnPrevMain} onPress={handleBack}>
                  <Text style={styles.btnPrevText}>Previous</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 3: SELECT PATIENT */}
            {step === 3 && (
              <View style={styles.detailsCardWrapper}>
                <View style={styles.grid}>
                  {selectedPolicy?.dependents?.map((dep, idx) => (
                    <TouchableOpacity 
                        key={idx} 
                        style={[styles.gridItem, selectedDep === idx && styles.selectedGlow]} 
                        onPress={() => { setSelectedDep(idx); autoAdvance(4); }}
                    >
                        <View style={styles.avatarBox}><Text style={{fontSize: 28}}>👨</Text></View>
                        <Text style={styles.depName}>{dep.insured_name}</Text>
                        <View style={styles.relBadge}><Text style={styles.relBadgeText}>{dep.relation}</Text></View>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.btnPrevMain} onPress={handleBack}>
                  <Text style={styles.btnPrevText}>Previous</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 4: ADMISSION DETAILS */}
            {(step === 4 || step === 5 || step === 6) && (
              <View style={styles.detailsCardWrapper}>
                <View style={styles.formContainer}>
                  
                  {step === 4 && (
                    <>
                      <PatternedInput label="Date of Admission *" placeholder="YYYY-MM-DD" value={doa} isTouchable onPress={() => setShowDoaPicker(true)} />
                      {showDoaPicker && (
                        <DateTimePicker 
                           value={doa ? new Date(doa) : new Date()} 
                           mode="date" 
                           display="default" 
                           onChange={onDoaChange} 
                           maximumDate={new Date()} 
                        />
                      )}
                      
                      <PatternedInput label="Date of Discharge *" placeholder="YYYY-MM-DD" value={dod} isTouchable onPress={() => setShowDodPicker(true)} />
                      {showDodPicker && (
                        <DateTimePicker 
                           value={dod ? new Date(dod) : new Date()} 
                           mode="date" 
                           display="default" 
                           onChange={onDodChange} 
                           minimumDate={doa ? new Date(doa) : undefined} 
                        />
                      )}
                      
                      {/* Claim No is now shown for both and is optional */}
                      <PatternedInput label="Claim No (Optional)" placeholder="Enter Claim No" value={claimNo} onChangeText={setClaimNo} />
                      
                      <PatternedInput label="Hospital Name *" placeholder="Enter Hospital Name" value={hospitalName} onChangeText={setHospitalName} />
                      
                      {/* Pincode shifted above State & City */}
                      <PatternedInput label="Hospital Pin Code *" placeholder="000000" keyboardType="numeric" value={pinCode} onChangeText={handlePincodeChange} maxLength={6} />

                      {/* State and City are now disabled PatternedInputs autofilled by Pincode */}
                      <View style={styles.row}>
                        <View style={styles.flexHalf}>
                          <PatternedInput label="State *" placeholder="State" value={selectedState} editable={false} />
                        </View>
                        <View style={styles.flexHalf}>
                          <PatternedInput label="City *" placeholder="City" value={selectedCity} editable={false} />
                        </View>
                      </View>
                      
                      {/* Category of Illness */}
                      <Text style={styles.boxLabel}>Category of Illness *</Text>
                      <TouchableOpacity style={[styles.dropdownTrigger, {marginBottom: hp(1.5)}]} onPress={() => openPicker('category')}>
                          <Text style={styles.dropdownText} numberOfLines={1}>{selectedCategory}</Text>
                      </TouchableOpacity>
                      
                      {/* Nature of Illness (Disabled until Category is selected) */}
                      <Text style={styles.boxLabel}>Nature of Illness *</Text>
                      <TouchableOpacity 
                          style={[styles.dropdownTrigger, {marginBottom: hp(2)}, selectedCategory === 'Select Category' && styles.disabledDropdown]} 
                          disabled={selectedCategory === 'Select Category'}
                          onPress={() => openPicker('nature')}
                      >
                          <Text style={[styles.dropdownText, selectedCategory === 'Select Category' && styles.disabledText]} numberOfLines={1}>
                             {natureOfIllness}
                          </Text>
                      </TouchableOpacity>
                      
                      <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack}>
                          <Text style={styles.btnPrevTextSmall}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnFormNextHalf} onPress={() => validateAndProceed(5)}>
                          <Text style={styles.btnText}>Next Step</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {/* STEP 5: DOCUMENTS (Reimbursement) OR CONTACT (Cashless) */}
                  {step === 5 && (
                    isCashless === false ? (
                      <>
                        <Text style={styles.typeDesc}>Upload hospital bills, discharge summary, and medical reports</Text>
                        <Text style={styles.miniLabel}>PDF or images (max 2MB per file) *Required</Text> 
                        
                        <TouchableOpacity style={styles.uploadBox} onPress={openGallery}>
                          <Text style={{fontSize: 30}}>{selectedFile ? '✅' : '📁'}</Text>
                          <Text style={styles.btnTextBlack}>
                            {selectedFile ? selectedFile.name : 'Tap to Choose Files'}
                          </Text>
                        </TouchableOpacity>
                        
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack}>
                              <Text style={styles.btnPrevTextSmall}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnFormNextHalf} onPress={() => validateAndProceed(6)}>
                              <Text style={styles.btnText}>Next Step</Text>
                            </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <PatternedInput label="Emergency Contact Name *" placeholder="Enter Name" value={emergencyContactName} onChangeText={setEmergencyContactName} />
                        <PatternedInput label="Estimated Claim Amount *" placeholder="₹ Amount" keyboardType="numeric" value={claimAmount} onChangeText={setClaimAmount} />
                        <PatternedInput label="Mobile Number *" placeholder="10 Digit Number" keyboardType="phone-pad" value={mobileNo} onChangeText={setMobileNo} maxLength={10} />
                        <PatternedInput label="Email Address *" placeholder="example@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                        
                        <View style={styles.buttonRow}>
                          <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack} disabled={loading}>
                            <Text style={styles.btnPrevTextSmall}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.btnFormNextHalf} onPress={validateContactAndSubmit} disabled={loading}>
                            <Text style={styles.btnText}>{loading ? 'Submitting...' : 'Submit Claim'}</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )
                  )}

                  {/* STEP 6: CONTACT DETAILS (Reimbursement Only) */}
                  {step === 6 && isCashless === false && (
                    <>
                      <PatternedInput label="Emergency Contact Name *" placeholder="Enter Name" value={emergencyContactName} onChangeText={setEmergencyContactName} />
                      <PatternedInput label="Total Claim Amount *" placeholder="₹ Amount" keyboardType="numeric" value={claimAmount} onChangeText={setClaimAmount} />
                      <PatternedInput label="Mobile Number *" placeholder="10 Digit Number" keyboardType="phone-pad" value={mobileNo} onChangeText={setMobileNo} maxLength={10} />
                      <PatternedInput label="Email Address *" placeholder="example@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                      
                      <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.btnPrevSmall} onPress={handleBack} disabled={loading}>
                          <Text style={styles.btnPrevTextSmall}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnFormNextHalf} onPress={validateContactAndSubmit} disabled={loading}>
                          <Text style={styles.btnText}>{loading ? 'Submitting...' : 'Submit Claim'}</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        {/* BOTTOM MODAL FOR DROPDOWNS W/ SEARCH */}
        <Modal visible={isModalVisible} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closePicker} />
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.modalHandle} />
              
              <Text style={styles.modalHeader}>Select {activePicker?.toUpperCase()}</Text>
              
              {/* Search Bar inside Modal */}
              <View style={styles.searchContainer}>
                 <Text style={styles.searchIcon}>🔍</Text>
                 <TextInput
                   style={styles.searchInput}
                   placeholder={`Search ${activePicker}...`}
                   placeholderTextColor="#94A3B8"
                   value={searchQuery}
                   onChangeText={setSearchQuery}
                 />
              </View>

              <FlatList
                data={filteredModalData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => onSelectItem(item)}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
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

// UI Component for Input with Touchable Support (For Dates)
const PatternedInput = ({ label, isTouchable, onPress, ...props }) => {
  if (isTouchable) {
    return (
      <TouchableOpacity style={styles.inputWrapper} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.boxLabel}>{label}</Text>
        <View style={styles.inputBackground}>
          <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/subtle-white-feathers.png' }} style={styles.patternInner} imageStyle={{ opacity: 0.1 }}>
            <View pointerEvents="none">
              <TextInput style={[styles.boxedTextInput, props.editable === false && { color: '#94A3B8' }]} placeholderTextColor="#94A3B8" editable={false} {...props} />
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.boxLabel}>{label}</Text>
      <View style={[styles.inputBackground, props.editable === false && { backgroundColor: '#F1F5F9' }]}>
        <ImageBackground source={{ uri: 'https://www.transparenttextures.com/patterns/subtle-white-feathers.png' }} style={styles.patternInner} imageStyle={{ opacity: 0.1 }}>
          <TextInput style={[styles.boxedTextInput, props.editable === false && { color: '#94A3B8' }]} placeholderTextColor="#94A3B8" {...props} />
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: wp(4), paddingTop: hp(10.5), paddingBottom: hp(15) },
  
  navHeaderContainer: { position: 'absolute', top: hp(12.5), left: wp(5), right: wp(5), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: wp(3), borderRadius: wp(4), zIndex: 100, elevation: 10, shadowColor: '#0f172a', shadowOpacity: 0.1 },
  stepCounterPosition: { position: 'absolute', top: wp(3), right: wp(4) },
  headerContentWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: hp(0.5) },
  logoContainer: { marginLeft: wp(6), marginRight: wp(4), padding: wp(0.5), backgroundColor: '#F8FAFC', borderRadius: wp(10), borderWidth: 1, borderColor: '#E2E8F0' },
  stepCountText: { fontSize: hp(1.2), fontFamily: 'Montserrat-Bold', color: '#94A3B8', textTransform: 'uppercase' },
  
  detailsCardWrapper: { backgroundColor: '#FFFFFF', borderRadius: wp(5), padding: wp(4), elevation: 6, shadowOpacity: 0.06, marginBottom: hp(1), minHeight: hp(70) },
  
  // NEW PREMIUM POLICY CARD STYLES
  policyHeaderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: wp(4), padding: wp(4), marginBottom: hp(1.5), borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  selectedGlow: { borderColor: '#0f172a', backgroundColor: '#F8FAFD', borderWidth: 1.5 },
  policyLogoBox: { marginRight: wp(4), padding: wp(2), backgroundColor: '#eff2fa', borderRadius: wp(3), justifyContent: 'center', alignItems: 'center', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  policyInfo: { flex: 1 },
  companyName: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', color: '#1E293B', marginBottom: 2 },
  policyBadgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp(0.3) },
  policyBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: wp(2.5), paddingVertical: 2, borderRadius: wp(1), maxWidth: wp(45) },
  policyNumberText: { fontSize: hp(1.2), color: '#475569', fontFamily: 'Montserrat-Medium' },
  policyBadgeTop: { backgroundColor: '#E2E8F0', paddingHorizontal: wp(2), borderRadius: wp(1), width: wp(45) },
  policyNumberTextTop: { fontSize: hp(1.1), color: '#475569' },
  activeStatusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: wp(2), paddingVertical: 2, borderRadius: wp(1), marginLeft: 8 },
  activeStatusText: { color: '#065F46', fontSize: hp(1), fontFamily: 'Montserrat-Bold' },
  dashedDivider: { height: 1, width: '100%', borderWidth: 0.5, borderColor: '#CBD5E1', borderStyle: 'dashed', marginVertical: hp(1.2) },
  policyDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  valueBold: { fontSize: hp(1.6), color: '#0F172A', fontFamily: 'Montserrat-Bold', marginTop: 2 },
  miniLabel: { fontSize: hp(1.1), color: '#64748B', fontFamily: 'Montserrat-Medium', letterSpacing: 0.5 },
  
  // CLAIM TYPE STYLES
  typeCard: { padding: wp(4), borderRadius: wp(4), borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', marginBottom: hp(1.5), shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  typeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(0.5) },
  choiceEmoji: { fontSize: 24, marginRight: 10 },
  typeTitle: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.7), color: '#1E293B' },
  typeDesc: { fontSize: hp(1.4), color: '#64748B', marginTop: 2, marginBottom: 8, lineHeight: 18 },
  bulletBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginTop: 4, borderWidth: 1, borderColor: '#F1F5F9' },
  bulletItem: { fontSize: hp(1.3), color: '#475569', marginBottom: 4, fontFamily: 'Montserrat-Medium' },
  statsText: { fontSize: hp(1.2), fontFamily: 'Montserrat-Bold', color: '#065F46', marginTop: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#F8FAFC', borderRadius: wp(4), padding: wp(3), alignItems: 'center', marginBottom: hp(1), borderWidth: 1, borderColor: '#E2E8F0' },
  avatarBox: { width: wp(12), height: wp(12), borderRadius: wp(6), backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginBottom: 6 },
  depName: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.5), color: '#1E293B', textAlign: 'center' },
  relBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 6, borderRadius: 4, marginVertical: 4 },
  relBadgeText: { fontSize: hp(1), color: '#475569', fontFamily: 'Montserrat-Bold' },
  
  boxLabel: { fontFamily: 'Montserrat-Bold', fontSize: hp(1.4), color: '#475569', marginBottom: 6 },
  inputWrapper: { marginBottom: hp(1.5) },
  inputBackground: { backgroundColor: '#F8FAFD', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  patternInner: { flex: 1 },
  boxedTextInput: { paddingHorizontal: 12, paddingVertical: hp(0.8), fontSize: hp(1.6), color: '#1E293B' },
  
  dropdownTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFD', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, height: hp(5) },
  dropdownText: { fontSize: hp(1.6), color: '#1E293B', fontFamily: 'Montserrat-Medium' },
  disabledDropdown: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
  disabledText: { color: '#94A3B8' },

  row: { flexDirection: 'row', marginBottom: hp(1) },
  flexHalf: { flex: 1, marginRight: 10 },
  
  uploadBox: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', borderRadius: 12, padding: 20, alignItems: 'center', marginVertical: 15, backgroundColor: '#F8FAFC' },
  btnTextBlack: { color: '#0f172a', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6), marginTop: 10 },

  // --- MODAL / SEARCH STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: hp(75) },
  modalHandle: { width: 40, height: 5, backgroundColor: '#D1D9E6', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { fontFamily: 'Montserrat-Bold', fontSize: 18, marginBottom: 15, textAlign: 'center' },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 12, marginBottom: 15, height: 45 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#1E293B' },
  
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemText: { fontFamily: 'Montserrat-Medium', fontSize: 15, color: '#333' },
  flatListStyle: { flexGrow: 0 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#94A3B8', fontFamily: 'Montserrat-Medium' },
  
  closeBtn: { marginTop: 10, alignItems: 'center', padding: 10 },
  closeBtnText: { color: '#FF3B30', fontFamily: 'Montserrat-Bold' },
  
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp(1) },
  btnPrevMain: { paddingVertical: hp(1.5), alignItems: 'center', marginTop: hp(1), borderWidth: 1, borderColor: '#0f172a', borderRadius: 12 },
  btnPrevText: { color: '#0f172a', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
  btnPrevSmall: { width: '45%', paddingVertical: hp(1.5), alignItems: 'center', borderWidth: 1, borderColor: '#0f172a', borderRadius: 12 },
  btnFormNextHalf: { width: '45%', backgroundColor: '#0f172a', paddingVertical: hp(1.5), borderRadius: 12, alignItems: 'center' },
  btnPrevTextSmall: { color: '#0f172a', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
  btnText: { color: '#FFF', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
});

export default FileClaimPage;