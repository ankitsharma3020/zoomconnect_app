import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Alert,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../utilites/Dimension';
import FastImage from '@d11/react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { fetchhospitalstate } from './Epicfiles/MainEpic';
import { useGethospitallistMutation } from '../redux/service/user/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NetworkHospitalScreen = ({ route }) => { 
  
  const id = route?.params?.policyid || ''; 
  const [pincode, setPincode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Redux & API
  const { data } = useSelector((state) => state.hospitalstate);
  const API_RESPONSE = data;
  const [getList] = useGethospitallistMutation();
  const dispatch = useDispatch();
  const [hospitalList, setHospital] = useState();
  
  // Dropdown States
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [availableCities, setAvailableCities] = useState([]);
  
  // Modals
  const [isStateModalVisible, setStateModalVisible] = useState(false);
  const [isCityModalVisible, setCityModalVisible] = useState(false);

  useEffect(() => {
    if(id) {
      dispatch(fetchhospitalstate({ PolicyId: id }));
    }
  }, [dispatch, id]);

  // --- Updated API Call Logic ---
  const GethospitalList = async (stateVal, cityVal, pincodeVal) => {
    const token = await AsyncStorage.getItem('token');
    try {
        let reqbody = { token: token, policy_id: id };
        
        // Pass either pincode OR state/city based on what the user filled
        if (pincodeVal && pincodeVal.length === 6) {
            reqbody.pincode = pincodeVal;
        } else {
            reqbody.state = stateVal;
            reqbody.city = cityVal;
        }

        const response = await getList(reqbody).unwrap();
        setHospital(response?.data?.hospitals || []);
        console.log("Hospital API Response:", response.data.hospitals);
    } catch (error) { 
        console.error(error); 
        Alert.alert("Error", "Failed to fetch hospitals. Please try again.");
    }
  };

  const statesList = useMemo(() => {
     if (!API_RESPONSE?.data?.search_options?.states) return [];
     return API_RESPONSE.data.search_options.states.map(item => item.state).sort();
  }, [API_RESPONSE]);

  const filteredHospitals = hospitalList?.filter((hospital) =>
    hospital.pincode?.includes(localSearch.toLowerCase()) || 
    hospital.name?.toLowerCase().includes(localSearch.toLowerCase())
  );

  // --- Input Handlers (Mutual Exclusivity) ---
  const handlePincodeChange = (text) => {
    setPincode(text);
    // Clear State/City if user starts typing a pincode
    if (text.length > 0) {
        setSelectedState(null);
        setSelectedCity(null);
        setAvailableCities([]);
    }
  };

  const openStateModal = () => {
    // Clear Pincode if user decides to search by State/City
    setPincode('');
    setStateModalVisible(true);
  };

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    const stateData = API_RESPONSE?.data?.search_options?.states?.find(s => s.state === stateName);
    const citiesCopy = stateData && stateData.cities ? [...stateData.cities] : [];
    setAvailableCities(citiesCopy.sort());
    setSelectedCity(null); 
    setStateModalVisible(false);
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setCityModalVisible(false);
  };

  // --- Button Enable Logic ---
  const isButtonEnabled = useMemo(() => {
    // Enable if Pincode is 6 digits OR both State and City are selected
    return (pincode.length === 6) || (selectedState !== null && selectedCity !== null);
  }, [pincode, selectedState, selectedCity]);

  const handleSearch = () => {
    Keyboard.dismiss();
    GethospitalList(selectedState, selectedCity, pincode);
    setHasSearched(true);
  };

  const handleReset = () => {
    setHasSearched(false);
    setPincode('');
    setSelectedState(null);
    setSelectedCity(null);
    setLocalSearch('');
  };

  // --- Components ---
  const DropdownInput = ({ label, value, onPress, disabled, placeholder, icon }) => (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity 
        style={[styles.inputBox, disabled && styles.disabledInput]} 
        onPress={disabled ? null : onPress}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialIcons name={icon} size={18} color={disabled ? "#CCC" : "#AB47BC"} style={{ marginRight: 10 }} />
            <Text style={[styles.inputText, !value && styles.placeholderText]} numberOfLines={1}>
            {value || placeholder}
            </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={20} color={disabled ? "#CCC" : "#666"} />
      </TouchableOpacity>
    </View>
  );

  const SelectionModal = ({ visible, title, data, onSelect, onClose }) => {
    const [searchText, setSearchText] = useState('');
    const safeData = Array.isArray(data) ? data : [];
    const filteredData = safeData.filter(item => item && item.toLowerCase().includes(searchText.toLowerCase()));

    return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}><MaterialIcons name="close" size={24} color="#333" /></TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer}>
              <MaterialIcons name="search" size={20} color="#999" />
              <TextInput style={styles.modalSearchInput} placeholder="Search..." value={searchText} onChangeText={setSearchText} />
            </View>
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item); setSearchText(''); }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderHospitalCard = ({ item }) => (
    <View style={styles.resultCard3D}>
      <View style={styles.cardPatternCircle} />

      <View style={styles.cardContent}>
        <Text style={styles.hospitalName}>{item.name ? item.name : 'SHAKUNTLA HOSPITAL & RESEARCH CENTRE'}</Text>
        <Text style={styles.hospitalAddress}>{item.address ? item?.address : 'Near Dhamariya Pul, VARANASI'}</Text>
        
        <View style={styles.pincodeContainer}>
          <MaterialCommunityIcons name="map-marker-radius" size={16} color="#AB47BC" />
          <Text style={styles.pincodeLabel}>Pincode: </Text>
          <Text style={styles.pincodeValue}>{item.pincode || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={[styles.actionBtn, styles.callBtn]}>
            <MaterialIcons name="call" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.navBtn]}>
            <MaterialIcons name="directions" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" translucent={true} />
      
      <View style={styles.container}>
        
        {/* Top Header Card */}
        <View style={styles.topHeader}>
            <View style={styles.topHeaderIcon}>
                <MaterialCommunityIcons name="hospital-building" size={24} color="#AB47BC" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.topHeaderTitle}>Find Network Hospitals</Text>
                <Text style={styles.topHeaderSubtitle}>GMC Policy</Text>
            </View>
            <View style={styles.heartIconContainer}>
                <MaterialCommunityIcons name="heart-outline" size={18} color="#FFF" />
            </View>
        </View>

        {!hasSearched ? (
          <ScrollView style={styles.mainSearchCard} showsVerticalScrollIndicator={false}>
            
            <View style={styles.patternCircle1} />
            <View style={styles.patternCircle2} />

            <View style={styles.cardTitleRow}>
                <View style={styles.iconCircle}>
                    <MaterialIcons name="search" size={20} color="#AB47BC" />
                </View>
                <Text style={styles.cardTitleText}>Find cashless treatment facilities near you</Text>
            </View>
            <Text style={styles.cardSubtitle}>Flexible Search</Text>

            <View style={styles.pinkBanner}>
                <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                    <MaterialCommunityIcons name="target" size={18} color="#AB47BC" />
                    <Text style={styles.bannerTitle}>Flexible Search</Text>
                </View>
                <Text style={styles.bannerSubtitle}>
                    Search by entering your 6-digit Pincode OR select State and City
                </Text>
            </View>

            <View style={styles.formContainer}>
                
                {/* 1. Pincode Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Pincode</Text>
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        maxLength={6}
                        value={pincode}
                        onChangeText={handlePincodeChange}
                    />
                </View>

                {/* OR Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* 2. State & City Inputs */}
                <View style={styles.columnInputs}>
                     <DropdownInput 
                        label="State"
                        placeholder="Select State"
                        value={selectedState} 
                        icon="map"
                        onPress={openStateModal}
                    />
                     <DropdownInput 
                        label="City" 
                        placeholder="Select City"
                        value={selectedCity} 
                        icon="location-city"
                        onPress={() => setCityModalVisible(true)} 
                        disabled={!selectedState}
                    />
                </View>
            </View>

            <TouchableOpacity 
                style={[styles.searchButton, { backgroundColor: isButtonEnabled ? '#AB47BC' : '#BDBDBD' }]} 
                onPress={handleSearch}
                disabled={!isButtonEnabled}
            >
                <MaterialIcons name="search" size={20} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.searchButtonText}>Search Hospitals</Text>
            </TouchableOpacity>

            {/* Spacer for bottom scrolling */}
            <View style={{ height: 40 }} />
          </ScrollView>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
                <TouchableOpacity onPress={handleReset} style={styles.backBtn3D}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.resultSearchBox3D}>
                     <MaterialIcons name="search" size={20} color="#999" />
                     <TextInput
                        style={styles.resultSearchInput}
                        placeholder="Filter by name or pincode..."
                        value={localSearch}
                        onChangeText={setLocalSearch}
                     />
                </View>
            </View>
            
            <FlatList
              data={filteredHospitals}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              renderItem={renderHospitalCard}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#666'}}>No hospitals found.</Text>}
            />
          </View>
        )}

        <SelectionModal 
          visible={isStateModalVisible} title="Select State" data={statesList}
          onSelect={handleStateSelect} onClose={() => setStateModalVisible(false)}
        />
        <SelectionModal 
          visible={isCityModalVisible} title={selectedState ? `Select City in ${selectedState}` : "Select City"}
          data={availableCities} onSelect={handleCitySelect} onClose={() => setCityModalVisible(false)}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    padding: wp('4%'),
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : wp('4%'),
  },

  // --- Header Styles ---
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width:0, height:2 },
  },
  topHeaderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHeaderTitle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Montserrat-Bold',
    color: '#1A3B5D',
  },
  topHeaderSubtitle: {
    fontSize: hp('1.5%'),
    fontFamily: 'Montserrat-Regular',
    color: '#64748B',
  },
  heartIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#AB47BC', 
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Main Card Styles ---
  mainSearchCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width:0, height: 4 },
    position: 'relative', 
    overflow: 'hidden', 
  },
  patternCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3E5F5', 
    opacity: 0.5,
  },
  patternCircle2: {
    position: 'absolute',
    bottom: 50,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F3E5F5',
    opacity: 0.4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: '#fdf2f9', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitleText: {
    fontSize: hp('1.7%'),
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: hp('1.4%'),
    color: '#666',
    marginLeft: 42,
    marginBottom: 15,
  },
  pinkBanner: {
    backgroundColor: '#fdf2f9', 
    borderWidth: 0.1,
    borderColor: '#a755f7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: hp('1.6%'),
    fontFamily: 'Montserrat-Bold',
    color: '#7B1FA2', 
    marginLeft: 8,
  },
  bannerSubtitle: {
    fontSize: hp('1.4%'),
    color: '#8E24AA',
    marginTop: 2,
    marginLeft: 26,
  },

  // --- Form & Button ---
  formContainer: { marginBottom: 10 },
  inputGroup: { marginBottom: 5 },
  columnInputs: { flexDirection: 'column' },
  inputLabel: {
    fontSize: hp('1.5%'),
    fontFamily: 'Montserrat-Bold',
    color: '#374151',
    marginBottom: 8,
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },
  disabledInput: { backgroundColor: '#FAFAFA' },
  inputText: { fontSize: hp('1.6%'), fontFamily: 'Montserrat-Regular', color: '#333', flex: 1 },
  placeholderText: { color: '#9CA3AF' },
  searchButton: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  searchButtonText: { color: '#FFF', fontSize: hp('1.8%'), fontFamily: 'Montserrat-Bold' },

  // --- OR Divider ---
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },

  // --- 3D Result Card Styles ---
  resultCard3D: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#AB47BC', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  
  cardPatternCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E5F5',
    opacity: 0.6,
  },

  cardContent: { flex: 1, marginRight: 10, zIndex: 1 },
  hospitalName: { fontSize: 15, fontFamily: 'Montserrat-Bold', color: '#333', marginBottom: 4 },
  hospitalAddress: { fontSize: 12, color: '#666', marginBottom: 10, lineHeight: 18 },
  
  pincodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pincodeLabel: {
    fontSize: 12,
    color: '#7B1FA2',
    fontFamily: 'Montserrat-Medium',
    marginLeft: 4,
  },
  pincodeValue: {
    fontSize: 13,
    color: '#4A148C',
    fontFamily: 'Montserrat-Bold',
  },

  cardActions: { justifyContent: 'space-between', alignItems: 'center', zIndex: 1 },
  actionBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 2 },
  callBtn: { backgroundColor: '#6b9f6dff' },
  navBtn: { backgroundColor: '#6ab1ebff' },

  // --- Modals & Results Header ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: hp('70%'), paddingTop: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  modalTitle: { fontSize: 18, fontFamily: 'Montserrat-Bold', color: '#333' },
  modalSearchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', marginHorizontal: 20, paddingHorizontal: 10, height: 45, borderRadius: 10, marginBottom: 10 },
  modalSearchInput: { flex: 1, marginLeft: 10, color: '#333' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  modalItemText: { fontSize: 16, color: '#333', fontFamily: 'Montserrat-Regular' },
  
  resultsContainer: { flex: 1 },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backBtn3D: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  resultSearchBox3D: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 15,
    elevation: 4,
  },

  resultSearchInput: { flex: 1, marginLeft: 10, color: '#333' },
});

export default NetworkHospitalScreen;