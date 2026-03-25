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
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAdddependentMutation, useEditdependentMutation } from '../redux/service/user/user';
import { fetchDependence } from '../screens/Epicfiles/MainEpic';
import { useDispatch } from 'react-redux';

const { height } = Dimensions.get('window');

const relationOptions = [
  { key: '1', value: 'CHILD' },
  { key: '2', value: 'SPOUSE' },
];

const genderOptions = [
  { key: '1', value: 'MALE' },
  { key: '2', value: 'FEMALE' },
];

const DependantModal = ({ visible, onClose, policyId, data }) => {
  const dispatch = useDispatch();
  const [Adddependent] = useAdddependentMutation();
  const [Editdependent] = useEditdependentMutation();

  // --- Form State ---
  const [name, setName] = useState('');
  const [relation, setRelation] = useState(null);
  const [showRelDropdown, setShowRelDropdown] = useState(false);
  const [gender, setGender] = useState(null);
  const [showGenDropdown, setShowGenDropdown] = useState(false);
  const [dob, setDob] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [doe, setDoe] = useState(null);
  const [showDoePicker, setShowDoePicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dp64, setDP64] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  // Animation Values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  // --- Custom Notification Utility ---
  const showToastOrAlert = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
        Animated.timing(opacityValue, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      if (data && Object.keys(data).length > 0) {
        setName(data.insured_name || '');
        setRelation(relationOptions.find(r => r.value === data.relation?.toUpperCase()) || null);
        setGender(genderOptions.find(g => g.value === data.gender?.toUpperCase()) || null);
        setDob(data.dob ? new Date(data.dob) : null);
        setDoe(data.date_of_event ? new Date(data.date_of_event) : null);
        if (data.document) {
          const extractedName = data.document.split('/').pop();
          setSelectedFile({ name: extractedName, uri: data.document });
        }
      } else {
        resetForm();
      }
    } else {
      Animated.timing(scaleValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      Animated.timing(opacityValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible, data]);

  const resetForm = () => {
    setName('');
    setRelation(null);
    setGender(null);
    setDob(null);
    setDoe(null);
    setSelectedFile(null);
    setDP64(null);
    setIsChecked(false);
  };

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
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    if (pickedDate > currentDate) {
      showToastOrAlert('The date cannot be in the future.');
      return;
    }
    if (relation?.value === 'CHILD' && pickedDate < thirtyDaysAgo) {
      showToastOrAlert('Child birthdate cannot be older than 30 days.');
      return;
    }
    setDob(pickedDate);
  };

  const handledateofeventChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDoePicker(false);
    if (event.type === 'dismissed' || !selectedDate) return;

    const pickedDate = new Date(selectedDate);
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    if (pickedDate > currentDate) {
      showToastOrAlert('The date cannot be in the future.');
      return;
    }
    if (pickedDate < thirtyDaysAgo) {
      showToastOrAlert('The date cannot be more than 30 days in the past.');
      return;
    }
    setDoe(pickedDate);
  };

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
          files: [{ uri: fileObj.uri, fileName: fileObj.name ?? `doc_${Date.now()}` }],
          destination: 'cachesDirectory',
        });
        filePath = copyResult.localUri;
      }

      const stats = await RNFS.stat(filePath);
      if (stats.size / (1024 * 1024) > 2) {
        showToastOrAlert('File size exceeds 2MB limit.');
        return;
      }

      const base64Data = await RNFS.readFile(filePath, 'base64');
      setSelectedFile({ name: fileObj.name, size: stats.size, uri: filePath });
      setDP64(base64Data);
      showToastOrAlert('File attached successfully.');

    } catch (error) {
      if (error?.code !== 'OPERATION_CANCELED') {
        showToastOrAlert('Failed to select document.');
      }
    }
  }, [relation]);

  const handleSave = async () => {
    const isEdit = !!data?.id;
    const hasDocument = dp64 || selectedFile;

    if (!name || !relation || !gender || !dob || !hasDocument) {
      showToastOrAlert('Please fill all mandatory fields and attach proof.');
      return;
    }

    if (relation?.value === 'SPOUSE' && !doe) {
      showToastOrAlert('Marriage date is required for Spouse.');
      return;
    }

    if (!isChecked) {
      showToastOrAlert('Please accept the declaration.');
      return;
    }

    try {
      const dobString = formatApiDate(dob);
      const reqbody = {
        policy_id: policyId,
        dependent_name: name,
        dependent_relation: relation?.value,
        dependent_gender: gender?.value,
        dependent_dob: dobString,
        date_of_event: relation?.value === 'CHILD' ? dobString : formatApiDate(doe),
      };

      if (dp64) reqbody.document = dp64;
      if (isEdit) reqbody.id = data.id;

      const response = isEdit ? await Editdependent(reqbody) : await Adddependent(reqbody);

      if (response?.data?.success) {
        dispatch(fetchDependence());
        showToastOrAlert(isEdit ? 'Dependant updated successfully!' : 'Dependant added successfully!');
        onClose();
      } else {
        showToastOrAlert(response?.error?.data?.message || 'Something went wrong.');
      }
    } catch (error) {
      showToastOrAlert('Network error occurred.');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: opacityValue }]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        </Animated.View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }], opacity: opacityValue }]}>
            
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{data?.id ? 'Edit Dependant' : 'New Dependant'}</Text>
                <Text style={styles.subtitle}>Enter details for cashless coverage</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Icon name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput style={styles.input} placeholder="Enter name" value={name} onChangeText={setName} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Relation</Text>
                  <TouchableOpacity style={styles.selector} onPress={() => setShowRelDropdown(!showRelDropdown)}>
                    <Text style={relation ? styles.inputText : styles.placeholderText}>{relation?.value || 'Select'}</Text>
                    <Icon name="chevron-down" size={20} color="#64748b" />
                  </TouchableOpacity>
                  {showRelDropdown && (
                    <View style={styles.dropdownList}>
                      {relationOptions.map(opt => (
                        <TouchableOpacity key={opt.key} style={styles.dropdownItem} onPress={() => { setRelation(opt); setShowRelDropdown(false); }}>
                          <Text style={styles.dropdownItemText}>{opt.value}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <TouchableOpacity style={styles.selector} onPress={() => setShowGenDropdown(!showGenDropdown)}>
                    <Text style={gender ? styles.inputText : styles.placeholderText}>{gender?.value || 'Select'}</Text>
                    <Icon name="chevron-down" size={20} color="#64748b" />
                  </TouchableOpacity>
                  {showGenDropdown && (
                    <View style={styles.dropdownList}>
                      {genderOptions.map(opt => (
                        <TouchableOpacity key={opt.key} style={styles.dropdownItem} onPress={() => { setGender(opt); setShowGenDropdown(false); }}>
                          <Text style={styles.dropdownItemText}>{opt.value}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setShowDobPicker(true)}>
                  <Text style={dob ? styles.inputText : styles.placeholderText}>{dob ? formatDate(dob) : 'DD/MM/YYYY'}</Text>
                  <Icon name="calendar-outline" size={20} color="#6366f1" />
                </TouchableOpacity>
                {showDobPicker && <DateTimePicker value={dob || new Date()} mode="date" maximumDate={new Date()} onChange={handledateofbirthChange} />}
              </View>

              {relation?.value === 'SPOUSE' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Marriage Date</Text>
                  <TouchableOpacity style={styles.selector} onPress={() => setShowDoePicker(true)}>
                    <Text style={doe ? styles.inputText : styles.placeholderText}>{doe ? formatDate(doe) : 'DD/MM/YYYY'}</Text>
                    <Icon name="ring" size={20} color="#ec4899" />
                  </TouchableOpacity>
                  {showDoePicker && <DateTimePicker value={doe || new Date()} mode="date" maximumDate={new Date()} onChange={handledateofeventChange} />}
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Upload Proof</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={openGallery}>
                  {selectedFile ? (
                    <View style={styles.fileSelected}>
                      <Icon name="file-check" size={24} color="#22c55e" />
                      <Text style={[styles.fileName, {flex:1, marginLeft: 10}]}>{selectedFile.name}</Text>
                      <Icon name="pencil" size={16} color="#64748b" />
                    </View>
                  ) : (
                    <Text style={styles.uploadText}>Tap to upload Birth/Marriage Certificate</Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsChecked(!isChecked)}>
                <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                  {isChecked && <Icon name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxText}>Information provided is true to my knowledge.</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                <Text style={styles.submitBtnText}>{data?.id ? 'Update' : 'Submit'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  backdropTouch: { flex: 1 },
  keyboardView: { width: '100%', alignItems: 'center' },
  modalContainer: { width: '90%', maxHeight: height * 0.85, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  subtitle: { fontSize: 12, color: '#64748b' },
  closeBtn: { padding: 5 },
  scrollContent: { padding: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 5 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12 },
  row: { flexDirection: 'row' },
  selector: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12 },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, marginTop: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  dropdownItemText: { fontSize: 14 },
  placeholderText: { color: '#94a3b8' },
  inputText: { color: '#1e293b' },
  uploadBox: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 15, alignItems: 'center', backgroundColor: '#f8fafc' },
  uploadText: { fontSize: 12, color: '#6366f1' },
  fileSelected: { flexDirection: 'row', alignItems: 'center' },
  fileName: { fontSize: 12, color: '#1e293b' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  checkboxText: { fontSize: 11, color: '#64748b' },
  submitBtn: { backgroundColor: '#ac25a8', padding: 15, borderRadius: 10, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '700' },
});

export default DependantModal;