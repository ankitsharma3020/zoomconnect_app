import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { useAdddependentMutation, useEditdependentMutation } from '../redux/service/user/user';
import { fetchDependence } from '../screens/Epicfiles/MainEpic';
import { useDispatch } from 'react-redux';

const { height } = Dimensions.get('window');

// --- Data Options ---
const relationOptions = [
  { key: '1', value: 'CHILD' },
  { key: '2', value: 'SPOUSE' },
];

const genderOptions = [
  { key: '1', value: 'MALE' },
  { key: '2', value: 'FEMALE' },
];

const DependantModal = ({ visible, onClose, policyId, data }) => {
  // console.log('Editable Data in Modal:', data); 

  // --- Form State ---
  const [name, setName] = useState('');
  
  // Dropdown States
  const [relation, setRelation] = useState(null);
  const [showRelDropdown, setShowRelDropdown] = useState(false);
  const [Adddependent] = useAdddependentMutation();
  const [Editdependent] = useEditdependentMutation();
  
  const [gender, setGender] = useState(null);
  const [showGenDropdown, setShowGenDropdown] = useState(false);

  // Date States
  const [dob, setDob] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const [doe, setDoe] = useState(null); 
  const [showDoePicker, setShowDoePicker] = useState(false);

  // Document State
  const [selectedFile, setSelectedFile] = useState(null);
  const [dp64, setDP64] = useState(null);

  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  
  // Animation Values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  // --- Animation & Pre-fill Logic ---
  useEffect(() => {
    if (visible) {
      // 1. Trigger Open Animations
      Animated.parallel([
        Animated.spring(scaleValue, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
        Animated.timing(opacityValue, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // 2. Pre-fill Form if 'data' is passed (Edit Mode)
      if (data && Object.keys(data).length > 0) {
        setName(data.insured_name || '');
        
        // Match existing dropdown values
        setRelation(relationOptions.find(r => r.value === data.relation?.toUpperCase()) || null);
        setGender(genderOptions.find(g => g.value === data.gender?.toUpperCase()) || null);
        
        // Parse dates from strings to JS Date objects
        setDob(data.dob ? new Date(data.dob) : null);
        setDoe(data.date_of_event ? new Date(data.date_of_event) : null);
        
        // Extract filename from the document URL for display
        if (data.document) {
          const extractedName = data.document.split('/').pop();
          setSelectedFile({ name: extractedName, uri: data.document });
        }
      } else {
        // Reset Form for New Entry
        setName('');
        setRelation(null);
        setGender(null);
        setDob(null);
        setDoe(null);
        setSelectedFile(null);
        setDP64(null);
        setIsChecked(false);
      }

    } else {
      // Trigger Close Animations
      Animated.timing(scaleValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      Animated.timing(opacityValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible, data]); // Re-run whenever visibility or data changes

  // --- Date Handlers & Formatters ---
  
  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${day}/${month}/${d.getFullYear()}`;
  };

  const formatApiDate = (dateObj) => {
    if (!dateObj) return null;
    const d = new Date(dateObj);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const handledateofbirthChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDobPicker(false);
    
    if (event.type === 'dismissed' || !selectedDate) return;

    const pickedDate = new Date(selectedDate);
    pickedDate.setHours(0,0,0,0);

    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    thirtyDaysAgo.setHours(0,0,0,0);

    if (pickedDate > currentDate) {
      Toast.show({ type: 'error', text1: 'Invalid Date', text2: 'The date cannot be in the future.' });
      return;
    }

    if (relation?.value === 'CHILD' && pickedDate < thirtyDaysAgo) {
      Toast.show({ type: 'error', text1: 'Invalid Date', text2: 'Child birthdate cannot be older than 30 days.' });
      return;
    }

    setDob(pickedDate);
  };

  const handledateofeventChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDoePicker(false);
    
    if (event.type === 'dismissed' || !selectedDate) return;

    const pickedDate = new Date(selectedDate);
    pickedDate.setHours(0,0,0,0);

    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    thirtyDaysAgo.setHours(0,0,0,0);

    if (pickedDate > currentDate) {
      Toast.show({ type: 'error', text1: 'Invalid Date', text2: 'The date cannot be in the future.' });
      return;
    }

    if (pickedDate < thirtyDaysAgo) {
      Toast.show({ type: 'error', text1: 'Invalid Date', text2: 'The date cannot be more than 30 days in the past.' });
      return;
    }

    setDoe(pickedDate);
  };

  // --- Document Picker ---
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
         filePath = decodeURIComponent(filePath).replace('file://', '');
      }

      const fileSize = fileObj.size ?? (await RNFS.stat(filePath)).size;
      const fileSizeInMB = fileSize / (1024 * 1024);

      if (fileSizeInMB > 2) {
        Toast.show({ type: 'error', text1: 'File Size Error', text2: 'File is over 2MB.' });
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

      Toast.show({ type: 'success', text1: 'File Selected', text2: fileObj.name });

    } catch (error) {
      if (error?.code === 'OPERATION_CANCELED' || error?.code === 'DOCUMENTS_PICKER_CANCELED') {
        console.log('User cancelled');
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to pick document' });
      }
    }
  }, []);

  const handleSubmit = async () => {
    // Check if there is either a newly selected document (dp64) or an existing pre-filled one (selectedFile)
    const hasDocument = dp64 || selectedFile;

    if(!name || !relation || !gender || !dob || !hasDocument) {
        Alert.alert('Missing Fields', 'Please fill all fields and ensure a document is attached.');
        return;
    }
    
    if(relation?.value === 'SPOUSE' && !doe) {
       Alert.alert('Missing Fields', 'Please select Date of Event for Spouse.');
       return;
    }

    if (!isChecked) {
      Alert.alert('Required', 'Please accept the declaration to proceed.');
      return;
    }
    
    try {
      const dobString = formatApiDate(dob);
      const doeString = formatApiDate(doe);

      let reqbody = {
          policy_id: policyId, 
          dependent_name: name,
          dependent_relation: relation?.value,
          dependent_gender: gender?.value,
          dependent_dob: dobString,
          date_of_event: relation?.value === 'CHILD' ? dobString : doeString,
      };

      // Only attach document key if they actually picked a new file
      // If editing and no new file picked, don't overwrite the existing document on the server
      if (dp64) {
         reqbody.document = dp64;
      }

      // If we are editing existing data, pass the ID
      if (data && data.id) {
         reqbody.id = data.id; 
      }
      
      let res = await Adddependent(reqbody)

      if (res?.data?.success === true) {
        dispatch(fetchDependence())
        onClose(); // Automatically close the modal on success
        return Toast.show({
          type: 'success',
          text1: data?.id ? 'Dependant Updated' : 'Added Dependant',
          text2: `${res.data.success}`
        });
      } else {
        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${res.error.data.message}`
        });
      }

    } catch (error) {
      console.log('Response Error:', error);
    }
  };
   const handleEdit = async () => {
    // Check if there is either a newly selected document (dp64) or an existing pre-filled one (selectedFile)
    const hasDocument = dp64 || selectedFile;

    if(!name || !relation || !gender || !dob || !hasDocument) {
        Alert.alert('Missing Fields', 'Please fill all fields and ensure a document is attached.');
        return;
    }
    
    if(relation?.value === 'SPOUSE' && !doe) {
       Alert.alert('Missing Fields', 'Please select Date of Event for Spouse.');
       return;
    }

    if (!isChecked) {
      Alert.alert('Required', 'Please accept the declaration to proceed.');
      return;
    }
    
    try {
      const dobString = formatApiDate(dob);
      const doeString = formatApiDate(doe);

      let reqbody = {
          policy_id: policyId, 
          dependent_name: name,
          dependent_relation: relation?.value,
          dependent_gender: gender?.value,
          dependent_dob: dobString,
          date_of_event: relation?.value === 'CHILD' ? dobString : doeString,
      };

      // Only attach document key if they actually picked a new file
      // If editing and no new file picked, don't overwrite the existing document on the server
      if (dp64) {
         reqbody.document = dp64;
      }

      // If we are editing existing data, pass the ID
      if (data && data.id) {
         reqbody.id = data.id; 
      }
      
      let res = await Editdependent(reqbody)

      if (res?.data?.success === true) {
        dispatch(fetchDependence())
        onClose(); // Automatically close the modal on success
        return Toast.show({
          type: 'success',
          text1: data?.id ? 'Dependant Updated' : 'Added Dependant',
          text2: `${res.data.success}`
        });
      } else {
        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${res.error.data.message}`
        });
      }

    } catch (error) {
      console.log('Response Error:', error);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: opacityValue }]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        </Animated.View>

        <View style={styles.patternContainer}>
            <View style={styles.circleDecoration} />
            <View style={styles.circleDecorationSmall} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleValue }], opacity: opacityValue },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{data?.id ? 'Edit Dependant' : 'Dependant Details'}</Text>
                <Text style={styles.subtitle}>
                  {data?.id ? 'Update existing details below' : 'Fill form to add new dependants'}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Icon name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dependant Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Row for Selectors */}
              <View style={styles.row}>
                
                {/* Relation Dropdown */}
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Relation</Text>
                  <TouchableOpacity 
                    style={[styles.selector, showRelDropdown && styles.selectorActive]} 
                    onPress={() => {
                        setShowRelDropdown(!showRelDropdown);
                        setShowGenDropdown(false);
                    }}
                  >
                    <Text style={relation ? styles.inputText : styles.placeholderText}>
                      {relation?.value || 'Select'}
                    </Text>
                    <Icon name={showRelDropdown ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
                  </TouchableOpacity>
                  
                  {showRelDropdown && (
                    <View style={styles.dropdownList}>
                        {relationOptions.map((item) => (
                            <TouchableOpacity 
                                key={item.key} 
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setRelation(item);
                                    setShowRelDropdown(false);
                                    setDob(null);
                                    setDoe(null);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{item.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                  )}
                </View>

                {/* Gender Dropdown */}
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <TouchableOpacity 
                    style={[styles.selector, showGenDropdown && styles.selectorActive]} 
                    onPress={() => {
                        setShowGenDropdown(!showGenDropdown);
                        setShowRelDropdown(false);
                    }}
                  >
                    <Text style={gender ? styles.inputText : styles.placeholderText}>
                      {gender?.value || 'Select'}
                    </Text>
                    <Icon name={showGenDropdown ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
                  </TouchableOpacity>

                   {showGenDropdown && (
                    <View style={styles.dropdownList}>
                        {genderOptions.map((item) => (
                            <TouchableOpacity 
                                key={item.key} 
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setGender(item);
                                    setShowGenDropdown(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{item.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Date of Birth Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setShowDobPicker(true)}>
                  <Text style={dob ? styles.inputText : styles.placeholderText}>
                    {dob ? formatDate(dob) : 'DD/MM/YYYY'}
                  </Text>
                  <Icon name="calendar-month-outline" size={20} color="#6366f1" />
                </TouchableOpacity>
                {showDobPicker && (
                    <DateTimePicker
                        value={dob || new Date()}
                        mode="date"
                        display="default"
                        onChange={handledateofbirthChange}
                        maximumDate={new Date()} 
                    />
                )}
              </View>

              {/* Conditional Date of Event (If Spouse) */}
              {relation?.value === 'SPOUSE' && (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date of Event (Marriage)</Text>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowDoePicker(true)}>
                    <Text style={doe ? styles.inputText : styles.placeholderText}>
                        {doe ? formatDate(doe) : 'DD/MM/YYYY'}
                    </Text>
                    <Icon name="ring" size={20} color="#ec4899" />
                    </TouchableOpacity>
                    {showDoePicker && (
                        <DateTimePicker
                            value={doe || new Date()}
                            mode="date"
                            display="default"
                            onChange={handledateofeventChange}
                            maximumDate={new Date()}
                        />
                    )}
                </View>
              )}

              {/* Document Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Documents (Image or PDF)</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={openGallery}>
                  {selectedFile ? (
                    <View style={styles.fileSelected}>
                        <Icon name="file-document-outline" size={24} color="#ef4444" />
                        <View style={{flex: 1, marginHorizontal: 10}}>
                            <Text style={styles.fileName} numberOfLines={1}>{selectedFile.name}</Text>
                            {selectedFile.size > 0 && (
                               <Text style={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Text>
                            )}
                        </View>
                        <Icon name="check-circle" size={18} color="#22c55e" />
                    </View>
                  ) : (
                    <>
                      <View style={styles.uploadIconCircle}>
                        <Icon name="cloud-upload-outline" size={24} color="#6366f1" />
                      </View>
                      <Text style={styles.uploadText}>Tap to upload proof</Text>
                      <Text style={styles.uploadSubText}>Max size 2MB</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                <View style={styles.infoBox}>
                    <Icon name="information-outline" size={16} color="#6366f1" style={{marginTop: 2}} />
                    <Text style={styles.infoText}>
                        {relation?.value === 'SPOUSE' 
                         ? 'Please upload Marriage Certificate.' 
                         : 'Please upload Birth Certificate.'}
                    </Text>
                </View>
              </View>

              {/* Checkbox */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.8}
                onPress={() => setIsChecked(!isChecked)}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                  {isChecked && <Icon name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxText}>
                  I hereby declare that the information given is true and correct to the best of my knowledge.
                </Text>
              </TouchableOpacity>

              {/* Submit */}
              <TouchableOpacity style={styles.submitBtn} onPress={data?.id ?handleEdit:handleSubmit}>
                <Text style={styles.submitBtnText}>{data?.id ? 'Update Details' : 'Submit Details'}</Text>
                <Icon name={data?.id ? "content-save" : "arrow-right"} size={18} color="#fff" style={{marginLeft: 8}} />
              </TouchableOpacity>

            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
        <Toast /> 
      </View>
    </Modal>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    zIndex: 0,
  },
  backdropTouch: { flex: 1 },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    overflow: 'hidden',
  },
  circleDecoration: {
    position: 'absolute',
    top: height * 0.15,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6366f1',
    opacity: 0.15,
  },
  circleDecorationSmall: {
    position: 'absolute',
    bottom: height * 0.2,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    opacity: 0.15,
  },
  modalContainer: {
    width: '90%',
    maxHeight: height * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  closeBtn: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 50,
  },
  inputGroup: {
    marginBottom: 20,
    zIndex: 10, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 20, 
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#334155',
  },
  inputText: {
    fontSize: 15,
    color: '#1e293b',
  },
  placeholderText: {
    fontSize: 15,
    color: '#94a3b8',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    backgroundColor: '#e0e7ff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  uploadSubText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  fileSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  fileName: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: '#64748b',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 11,
    color: '#3b82f6',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkboxText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#ac25a8ff',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default DependantModal;