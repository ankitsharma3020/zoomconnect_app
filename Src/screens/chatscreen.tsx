import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// UNCOMMENT THIS LINE AFTER INSTALLING: npm install react-native-image-picker
// import * as ImagePicker from 'react-native-image-picker';

// --- Configuration / Dummy Data ---
const BOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'; 
const BRAND_COLOR = '#934790'; // Changed to your brand purple

// --- Updated Chat Flow for Insurance Context ---
const CHAT_FLOW = {
  root: {
    message: "Hello! How can I assist you with your insurance policy today?",
    options: [
      { id: 'policy_details', label: 'My Policy Details', next: 'policy_flow' },
      { id: 'claims', label: 'Claims & Reimbursement', next: 'claims_flow' },
      { id: 'ecard', label: 'Download E-Card', next: 'ecard_action' },
      { id: 'network', label: 'Network Hospitals', next: 'network_action' },
    ],
  },
  policy_flow: {
    message: "Sure, what specifically would you like to know about your policy?",
    options: [
      { id: 'coverage', label: 'View Coverage', next: 'coverage_info' },
      { id: 'dependants', label: 'Add/View Dependants', next: 'dependants_info' },
      { id: 'end_date', label: 'Policy Expiry Date', next: 'expiry_info' },
    ],
  },
  claims_flow: {
    message: "I can help with claims. What is your query?",
    options: [
      { id: 'status', label: 'Check Claim Status', next: 'status_check' },
      { id: 'file_new', label: 'How to file a claim?', next: 'file_claim_info' },
      { id: 'rejected', label: 'Why was my claim rejected?', next: 'rejection_info' },
    ],
  },
  // Information States
  coverage_info: { message: "Your policy covers hospitalization, pre/post-hospitalization expenses, and daycare procedures up to ₹5 Lakhs.", options: [] },
  dependants_info: { message: "You can view or add dependants from the 'My Policy' section on the home screen. You currently have 3 dependants active.", options: [] },
  expiry_info: { message: "Your current policy is valid until 31st March 2026.", options: [] },
  
  // Action States
  ecard_action: { message: "You can download your E-Card from the 'E-Card' section. I've sent a copy to your registered email as well.", options: [] },
  network_action: { message: "You can find the nearest network hospital by using the 'Network Hospital' locator on the dashboard.", options: [] },
  
  // Claim States
  status_check: { message: "Please provide your Claim Intimation Number to check the status.", options: [] },
  file_claim_info: { message: "To file a cashless claim, show your E-Card at the network hospital. For reimbursement, upload bills in the 'Claims' section within 30 days of discharge.", options: [] },
  rejection_info: { message: "Common reasons include missing documents or non-payable items. Please check the rejection letter sent to your email for specific details.", options: [] },
};

const COLORS = {
  background: '#F9FAFB', 
  primary: '#934790',     
  primaryDark: '#7A3A75',
  primaryLight: '#F3E5F5',
  white: '#FFFFFF',
  textDark: '#1F2937',
  textGrey: '#6B7280',
  accentGreen: '#10B981',
  userBubble: '#2D2D2D',
  botBubble: '#FFFFFF',
};

const ChatScreen = () => {
  // State
  const [messages, setMessages] = useState([
    { id: 1, text: CHAT_FLOW.root.message, sender: 'bot', type: 'text' }
  ]);
  const [currentOptions, setCurrentOptions] = useState(CHAT_FLOW.root.options);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Modal Form State
  const [issueCategory, setIssueCategory] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const flatListRef = useRef();
  const navigation = useNavigation();

  // Helper to append "Other" to every option list
  const getOptionsWithOther = (options) => {
    if (!options || options.length === 0) return [];
    return [...options, { id: 'other', label: 'Other Query', next: 'modal' }];
  };

  const handleOptionPress = (option) => {
    // 1. Add User Message
    const userMsg = { id: Date.now(), text: option.label, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setCurrentOptions([]); // Hide options while processing

    // 2. Check if "Other" was selected
    if (option.id === 'other') {
      setTimeout(() => setModalVisible(true), 500);
      return;
    }

    // 3. Simulate Bot Response
    setIsTyping(true);
    setTimeout(() => {
      const nextFlow = CHAT_FLOW[option.next];
      if (nextFlow) {
        const botMsg = { id: Date.now() + 1, text: nextFlow.message, sender: 'bot', type: 'text' };
        setMessages(prev => [...prev, botMsg]);
        setCurrentOptions(nextFlow.options);
      } else {
        // Fallback or End of conversation
        const endMsg = { id: Date.now() + 1, text: "Is there anything else I can help you with?", sender: 'bot', type: 'text' };
        setMessages(prev => [...prev, endMsg]);
        // Reset to root options after a delay or interaction could be implemented here
        setCurrentOptions(CHAT_FLOW.root.options);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleImagePick = async () => {
    // MOCK IMPLEMENTATION
    setSelectedImage('https://via.placeholder.com/150'); 
    Alert.alert("Demo", "Image selected (Mocked). Install react-native-image-picker for real functionality.");
  };

  const handleModalSubmit = () => {
    if (!issueCategory || !issueDescription) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setModalVisible(false);

    // Add User's Ticket details to chat
    const ticketMsg = {
      id: Date.now(),
      sender: 'user',
      type: 'ticket',
      data: { category: issueCategory, desc: issueDescription, img: selectedImage }
    };
    setMessages(prev => [...prev, ticketMsg]);

    // Bot acknowledgement
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: `We have logged your request under "${issueCategory}". Your Ticket ID is #INS-${Math.floor(1000 + Math.random() * 9000)}. Our support team will contact you shortly.`, 
        sender: 'bot', 
        type: 'text' 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Reset Form
      setIssueCategory('');
      setIssueDescription('');
      setSelectedImage(null);
      
      // Show root options again
      setCurrentOptions(CHAT_FLOW.root.options);
    }, 1500);
  };

  // --- RENDER FUNCTIONS ---

  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';
    
    if (item.type === 'ticket') {
      return (
        <View style={[styles.bubble, styles.userBubble, styles.ticketBubble]}>
          <Text style={styles.ticketHeader}>REQUEST SUBMITTED</Text>
          <Text style={styles.ticketLabel}>Category: <Text style={styles.ticketValue}>{item.data.category}</Text></Text>
          <Text style={styles.ticketLabel}>Details: <Text style={styles.ticketValue}>{item.data.desc}</Text></Text>
          {item.data.img && (
            <Image source={{ uri: item.data.img }} style={styles.ticketImage} />
          )}
        </View>
      );
    }

    return (
      <View style={[
        styles.messageRow, 
        isUser ? styles.messageRowRight : styles.messageRowLeft
      ]}>
        {!isUser && <Image source={{ uri: BOT_AVATAR }} style={styles.botAvatar} />}
        <View style={[
          styles.bubble, 
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.goBack()} >
                <Icon name="arrow-left" size={hp(3.2)} color={COLORS.textDark} />
                <Text style={styles.headerTitle}>Support Assistant</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Policy No: 9876543210</Text>
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Assistant is typing...</Text>
        </View>
      )}

      {/* Options Area */}
      {!isTyping && currentOptions.length > 0 && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsHeader}>Please select an option:</Text>
          <View style={styles.optionsGrid}>
            {getOptionsWithOther(currentOptions).map((opt) => (
              <TouchableOpacity 
                key={opt.id} 
                style={styles.optionButton} 
                onPress={() => handleOptionPress(opt)}
              >
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* --- THE "OTHER" MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit a Request</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
              
              {/* Custom Dropdown */}
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={{color: issueCategory ? '#000' : '#999', fontFamily: 'Montserrat-Regular'}}>
                  {issueCategory || "Select Category..."}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>
              
              {showDropdown && (
                <View style={styles.dropdownList}>
                  {['E-Card Issue', 'Claim Dispute', 'Policy Correction', 'Network Hospital Query', 'IT/App Issue'].map((item) => (
                    <TouchableOpacity 
                      key={item} 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setIssueCategory(item);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={{fontFamily: 'Montserrat-Regular'}}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Description Input */}
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Please describe your query..."
                value={issueDescription}
                onChangeText={setIssueDescription}
              />

              {/* Image Picker */}
              <Text style={styles.label}>Attachment (Optional)</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
                <Text style={styles.uploadText}>
                  {selectedImage ? "Image Selected" : "Upload Document/Screenshot"}
                </Text>
              </TouchableOpacity>
              
              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleModalSubmit}>
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: wp(4), 
    
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp(2.2), 
    marginLeft: wp(2), 
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: hp(1.5), 
    marginLeft: wp(9), // Aligned with text start
    color: COLORS.textGrey,
    marginTop: hp(0.25), 
    fontFamily: 'Montserrat-Regular',
  },
  iconButton:{
    alignItems:'center',
    flexDirection:'row',
  },
  
  // Chat List
  chatList: {
    padding: wp(4), 
    paddingBottom: hp(2.5), 
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: hp(1.5), 
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: wp(8), 
    height: wp(8),
    marginRight: wp(2), 
    borderRadius: wp(4), 
  },
  bubble: {
    maxWidth: '75%',
    padding: wp(3.5), 
    borderRadius: wp(4), 
  },
  botBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: wp(1), 
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: wp(1), 
  },
  messageText: {
    fontSize: hp(1.8), 
    lineHeight: hp(2.4), 
    fontFamily: 'Montserrat-Regular',
  },
  botText: {
    color: COLORS.textDark,
  },
  userText: {
    color: COLORS.white,
  },
  
  // Ticket Bubble
  ticketBubble: {
    backgroundColor: '#F3E8FF', // Light purple bg
    borderWidth: 1,
    borderColor: '#D8B4FE',
    width: '85%',
    alignSelf: 'flex-end',
  },
  ticketHeader: {
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
    marginBottom: hp(0.75), 
    fontSize: hp(1.4), 
  },
  ticketLabel: {
    fontSize: hp(1.6), 
    color: COLORS.textDark,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: hp(0.5),
  },
  ticketValue: {
    fontFamily: 'Montserrat-Regular',
    color: COLORS.textGrey,
  },
  ticketImage: {
    width: '100%',
    height: hp(15), 
    marginTop: hp(1.2), 
    borderRadius: wp(2), 
    resizeMode: 'cover',
  },
  
  // Typing
  typingContainer: {
    padding: wp(4), 
    alignItems: 'flex-start',
    marginLeft: wp(10),
  },
  typingText: {
    fontSize: hp(1.5), 
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Regular',
  },
  
  // Options Area
  optionsContainer: {
    padding: wp(2.5), 
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  optionsHeader: {
    fontSize: hp(1.5), 
    color: '#6B7280',
    marginBottom: hp(1.2), 
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: hp(1.2), 
    paddingHorizontal: wp(4), 
    borderRadius: wp(6), 
    margin: wp(1.25), 
  },
  optionText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: hp(1.75), 
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(6), 
    borderTopRightRadius: wp(6), 
    maxHeight: '90%',
    paddingBottom: hp(4), 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(5), 
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: hp(2.2), 
    fontFamily: 'Montserrat-Bold',
    color: COLORS.textDark,
  },
  closeText: {
    fontSize: hp(2.5), 
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Bold',
  },
  formContainer: {
    padding: wp(5), 
  },
  label: {
    fontSize: hp(1.75), 
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: hp(1), 
    marginTop: hp(1.5), 
    color: COLORS.textDark,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: wp(3.5), 
    borderRadius: wp(2.5), 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp(2.5), 
    marginTop: hp(0.6), 
    backgroundColor: COLORS.white,
    elevation: 3,
  },
  dropdownItem: {
    padding: wp(3.5), 
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp(2.5), 
    padding: wp(3.5), 
    height: hp(12.5), 
    textAlignVertical: 'top',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#F9FAFB',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    padding: wp(4), 
    borderRadius: wp(2.5), 
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  uploadText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
  },
  previewImage: {
    width: wp(25), 
    height: wp(25), 
    marginTop: hp(1.5), 
    borderRadius: wp(2), 
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: wp(4), 
    borderRadius: wp(3), 
    alignItems: 'center',
    marginTop: hp(4), 
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: 'Montserrat-Bold',
    fontSize: hp(2), 
  },
});