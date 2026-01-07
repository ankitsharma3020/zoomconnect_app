import React, { useState, useRef, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure you have this installed

const { height, width } = Dimensions.get('window');

const DependantModal = ({ visible, onClose }) => {
  // Form State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [fileName, setFileName] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  // Animation Values
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Open Animation: Spring effect for pop-up
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close Animation
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!isChecked) {
      Alert.alert('Required', 'Please accept the declaration to proceed.');
      return;
    }
    Alert.alert('Success', 'Dependant details submitted successfully!');
    onClose();
  };

  const handleFilePick = () => {
    // Mock file picking logic
    setFileName('birth_certificate.pdf');
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        {/* Blurred/Dimmed Background */}
        <Animated.View style={[styles.backdrop, { opacity: opacityValue }]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        </Animated.View>

        {/* Decorative Background Pattern (Subtle Circles) */}
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
                <Text style={styles.title}>Dependant Details</Text>
                <Text style={styles.subtitle}>Fill form to add new dependants</Text>
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
                {/* Relation Selector (Mock) */}
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Relation</Text>
                  <TouchableOpacity style={styles.selector}>
                    <Text style={relation ? styles.inputText : styles.placeholderText}>
                      {relation || 'Select'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Gender Selector (Mock) */}
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Gender</Text>
                  <TouchableOpacity style={styles.selector}>
                    <Text style={gender ? styles.inputText : styles.placeholderText}>
                      {gender || 'Select'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date Picker (Mock) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.selector}>
                  <Text style={dob ? styles.inputText : styles.placeholderText}>
                    {dob || 'DD/MM/YYYY'}
                  </Text>
                  <Icon name="calendar-month-outline" size={20} color="#6366f1" />
                </TouchableOpacity>
              </View>

              {/* Modern File Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Documents (PDF Only)</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={handleFilePick}>
                  {fileName ? (
                    <View style={styles.fileSelected}>
                        <Icon name="file-pdf-box" size={24} color="#ef4444" />
                        <Text style={styles.fileName}>{fileName}</Text>
                        <Icon name="check-circle" size={18} color="#22c55e" />
                    </View>
                  ) : (
                    <>
                      <View style={styles.uploadIconCircle}>
                        <Icon name="cloud-upload-outline" size={24} color="#6366f1" />
                      </View>
                      <Text style={styles.uploadText}>Tap to upload proof</Text>
                      <Text style={styles.uploadSubText}>Max size 5MB</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                {/* Info Note */}
                <View style={styles.infoBox}>
                    <Icon name="information-outline" size={16} color="#6366f1" style={{marginTop: 2}} />
                    <Text style={styles.infoText}>
                        Please upload valid proof (birth certificate or marriage certificate).
                    </Text>
                </View>
              </View>

              {/* Declaration Checkbox */}
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

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Details</Text>
                <Icon name="arrow-right" size={18} color="#fff" style={{marginLeft: 8}} />
              </TouchableOpacity>

            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Slate-900 with opacity
    zIndex: 0,
  },
  backdropTouch: {
    flex: 1,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  
  // Decorative Patterns
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

  // Modal Card
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

  // Header
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

  // Forms
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  inputText: {
    fontSize: 15,
    color: '#1e293b',
  },
  placeholderText: {
    fontSize: 15,
    color: '#94a3b8',
  },

  // File Upload
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
  },
  fileName: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    marginHorizontal: 10,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff', // Light blue bg
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

  // Checkbox
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

  // Button
  submitBtn: {
    backgroundColor: '#ac25a8ff', // Indigo 500
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
    marginBottom: 10,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default DependantModal;