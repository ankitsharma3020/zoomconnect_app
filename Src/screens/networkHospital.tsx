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

// --- Mock Data (Updated with specific Pincode field) ---
const MOCK_HOSPITALS = [
  { id: '1', name: 'SHAKUNTLA HOSPITAL & RESEARCH CENTRE', address: 'Near Dhamariya Pul, VARANASI', pincode: '221107' },
  { id: '2', name: 'SAROJINI NAIDU HOSPITAL', address: 'Nai Bazar, Loitja, VARANASI', pincode: '221107' },
  { id: '3', name: 'APEX MULTISPECIALITY HOSPITAL', address: 'DLW Hydel Road, VARANASI', pincode: '221104' },
];

const NetworkHospitalScreen = ({ type = 'state', route }) => { 
  
  const id = route?.params?.policyid || ''; 
  const [pincode, setPincode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  // Redux & API
  const { data } = useSelector((state) => state.hospitalstate);
  const API_RESPONSE = data;
  const [getList] = useGethospitallistMutation();
  const dispatch = useDispatch();
  const [hospitalList,setHospital]=useState()
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

  const GethospitalList = async (stateVal, cityVal) => {
    const token = await AsyncStorage.getItem('token');
    try {
        let reqbody = { token: token, policy_id: id, state: stateVal, city: cityVal };
        const response = await getList(reqbody).unwrap();
        setHospital(response.data.hospitals)
        console.log("Hospital API:", response.data.hospitals);
    } catch (error) { console.error(error); }
  };

  const statesList = useMemo(() => {
     if (!API_RESPONSE?.data?.search_options?.states) return [];
     return API_RESPONSE.data.search_options.states.map(item => item.state).sort();
  }, [API_RESPONSE]);

  const filteredHospitals = hospitalList?.filter((hospital) =>
    hospital.pincode.includes(localSearch.toLowerCase())
  );

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
    if (type === 'pincode') {
        return pincode.length === 6;
    } else {
        return selectedState !== null && selectedCity !== null;
    }
  }, [type, pincode, selectedState, selectedCity]);

  const handleSearch = () => {
    Keyboard.dismiss();
    if (type === 'pincode') {
        console.log("Searching Pincode:", pincode);
    } else {
        GethospitalList(selectedState, selectedCity);
    }
    setHasSearched(true);
  };

  const handleReset = () => {
    setHasSearched(false);
    setPincode('');
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
      {/* Decorative Patterns for 3D card */}
      <View style={styles.cardPatternCircle} />
      {/* <View style={styles.cardPatternCircleSmall} /> */}

      <View style={styles.cardContent}>
        <Text style={styles.hospitalName}>{item.name?item.name:'SHAKUNTLA HOSPITAL & RESEARCH CENTRE'}</Text>
        <Text style={styles.hospitalAddress}>{item.address?item?.address:'Near Dhamariya Pul, VARANASI'}</Text>
        
        {/* Pincode Display - Bold & Highlighted */}
        <View style={styles.pincodeContainer}>
          <MaterialCommunityIcons name="map-marker-radius" size={16} color="#AB47BC" />
          <Text style={styles.pincodeLabel}>Pincode: </Text>
          <Text style={styles.pincodeValue}>{item.pincode}</Text>
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
          <View style={styles.mainSearchCard}>
            
            {/* Background Pattern Circles */}
            <View style={styles.patternCircle1} />
            <View style={styles.patternCircle2} />

            {/* Title */}
            <View style={styles.cardTitleRow}>
                <View style={styles.iconCircle}>
                    <MaterialIcons name="search" size={20} color="#AB47BC" />
                </View>
                <Text style={styles.cardTitleText}>Find cashless treatment facilities near you</Text>
            </View>
            <Text style={styles.cardSubtitle}>Flexible Search</Text>

            {/* Pink Banner */}
            <View style={styles.pinkBanner}>
                <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                    <MaterialCommunityIcons name="target" size={18} color="#AB47BC" />
                    <Text style={styles.bannerTitle}>Flexible Search</Text>
                </View>
                <Text style={styles.bannerSubtitle}>
                    {type === 'pincode' ? 'Search by entering your 6-digit Pincode' : 'Select state and city'}
                </Text>
            </View>

            {/* Form Inputs */}
            <View style={styles.formContainer}>
                {type === 'pincode' ? (
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Pincode</Text>
                        <TextInput
                            style={styles.inputBox}
                            placeholder="6-digit code"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            maxLength={6}
                            value={pincode}
                            onChangeText={setPincode}
                        />
                    </View>
                ) : (
                    <View style={styles.columnInputs}>
                         <DropdownInput 
                            label="State"
                            placeholder="Select State"
                            value={selectedState} 
                            icon="map"
                            onPress={() => setStateModalVisible(true)}
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
                )}
            </View>

            {/* Search Button */}
            <TouchableOpacity 
                style={[styles.searchButton, { backgroundColor: isButtonEnabled ? '#AB47BC' : '#BDBDBD' }]} 
                onPress={handleSearch}
                disabled={!isButtonEnabled}
            >
                <MaterialIcons name="search" size={20} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.searchButtonText}>Search Hospitals</Text>
            </TouchableOpacity>

          </View>
        ) : (
             


          <View style={styles.resultsContainer}>
            {/* Results Header */}
            <View style={styles.resultsHeader}>
                <TouchableOpacity onPress={handleReset} style={styles.backBtn3D}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.resultSearchBox3D}>
                     <MaterialIcons name="search" size={20} color="#999" />
                     <TextInput
                        style={styles.resultSearchInput}
                        placeholder="Filter by hospital name..."
                        value={localSearch}
                        onChangeText={setLocalSearch}
                     />
                </View>
            </View>
            {/* List */}
            <FlatList
              data={filteredHospitals}
              keyExtractor={(item) => item.id}
              renderItem={renderHospitalCard}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
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
  inputGroup: { marginBottom: 15 },
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

  // --- 3D Result Card Styles ---
  resultCard3D: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16, // Increased margin for 3D separation
    
    // 3D Shadow/Elevation
    elevation: 6,
    shadowColor: '#AB47BC', // Slight purple tint to shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  
  // Card Patterns
  cardPatternCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E5F5', // Light purple
    opacity: 0.6,
  },
  cardPatternCircleSmall: {
    position: 'absolute',
    bottom: -10,
    left: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1BEE7',
    opacity: 0.3,
  },

  cardContent: { flex: 1, marginRight: 10, zIndex: 1 },
  hospitalName: { fontSize: 15, fontFamily: 'Montserrat-Bold', color: '#333', marginBottom: 4 },
  hospitalAddress: { fontSize: 12, color: '#666', marginBottom: 10, lineHeight: 18 },
  
  // Pincode Styles
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
    color: '#4A148C', // Darker purple
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


