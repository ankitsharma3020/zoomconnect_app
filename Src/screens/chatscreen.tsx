import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { wp, hp } from '../utilites/Dimension'; 
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAddsupportticketMutation, useCloseChatMutation, useGetMessageforChatMutation, useGetNewChatMutation } from '../redux/service/user/user';
import { useDispatch, useSelector } from 'react-redux';
import { pick, keepLocalCopy, types } from '@react-native-documents/picker';
import { fetchTicketChat, fetchtickets } from './Epicfiles/MainEpic';

const BOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'; 
const COLORS = {
  background: '#F9FAFB', 
  primary: '#934790',     
  white: '#FFFFFF',
  textDark: '#1F2937',
  textGrey: '#6B7280',
};

const ChatScreen = ({ route }) => {
  const { ticketId } = route.params || {};
  const navigation = useNavigation();
  const flatListRef = useRef();
  const dispatch = useDispatch();
const [addSupportTicket, { isLoading }] = useAddsupportticketMutation();
  const [startMessages] = useGetNewChatMutation();
  const [getMessages] = useGetMessageforChatMutation();
    
    const [dp64, setDP64] = useState(null);
  
  const { data: ticketChatData } = useSelector(state => state.chat);
  console.log("Ticket Chat Data from Redux:", ticketChatData);
  
  const [messages, setMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [chatContext, setChatContext] = useState({ ticket_id: ticketId || null, state_key: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false); 
  const [isTyping, setIsTyping] = useState(false); 
  const [issueCategory, setIssueCategory] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
 console.log("selectedImage State:", ticketId);
  useEffect(() => { 
    const initialize = async () => {
      const token = await AsyncStorage.getItem('token');
      if (ticketId) {
        dispatch(fetchTicketChat({ ticketId, token }));
      } else {
        initiateChat(token);
      }
    };
    initialize();
  }, [ticketId]);

  useEffect(() => {
    if (ticketId && ticketChatData?.data) {
      const historyArray = ticketChatData.data.chat_history || [];
      const ticketStatus = ticketChatData.data.status;

      if (historyArray.length > 0) {
        const formattedMessages = historyArray.map(item => ({
          id: item.id,
          text: item.sender_type === 'bot' 
                ? (item.message?.text || "...") 
                : (item.message?.selected_option || item.message?.text),
          sender: item.sender_type,
          type: 'text'
        }));

        const lastMsg = historyArray[historyArray.length - 1];
        setChatContext({ ticket_id: ticketId, state_key: lastMsg?.state_key });

        let options = [];
        const isResolved = ticketStatus === 'resolved';
        const isTerminal = lastMsg?.message?.is_terminal;

        if (isResolved || isTerminal) {
          options = [{ id: 'start_over', label: 'Start New Chat' }, { id: 'other', label: 'Other Query' }];
          if (isResolved) {
            formattedMessages.push({ id: 'end-msg', text: "Chat ended. Issue resolved.", sender: 'bot', type: 'text' });
          }
        } else {
          options = lastMsg?.message?.options ? [...lastMsg.message.options] : [];
          if (!options.find(o => o.id === 'other')) options.push({ id: 'other', label: 'Other Query' });
        }
        setMessages(formattedMessages);
        setCurrentOptions(options);
      }
    }
  }, [ticketChatData, ticketId]);

  const initiateChat = async (tokenProp) => {
    console.log("Initiating chat with token:", tokenProp);
    try {
      setIsTyping(true);
      const token = tokenProp || await AsyncStorage.getItem('token');
      const res = await startMessages({ token }).unwrap(); 
      console.log("Response from startMessages:", res); 
      if (res?.data) {
        setMessages([{ id: Date.now(), text: res.data.message, sender: 'bot', type: 'text' }]);
        let opts = res.data.options || [];
        opts.push({ id: 'other', label: 'Other Query' });
        setCurrentOptions(opts);
        setChatContext({ ticket_id: res.data.conversation_id, state_key: res.data.state_key });
        dispatch(fetchtickets());
      }
    } catch (error) { Alert.alert("Error", "Connection failed."); }
    finally { setIsTyping(false); }
  };

  const handleOptionPress = async (option) => {
    if (option.id === 'start_over') { setMessages([]); initiateChat(); return; }
    if (option.id === 'other') { setModalVisible(true); return; }

    setMessages(prev => [...prev, { id: Date.now(), text: option.label, sender: 'user', type: 'text' }]);
    setCurrentOptions([]);
    setIsTyping(true);

    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Sending getMessages with:", { token, conversation_id: chatContext, selected_option: option.id });
      const res = await getMessages({
        token, conversation_id: chatContext.ticket_id, selected_option: option.id
      }).unwrap();
      console.log("Response from getMessages:", res);
      if (res?.data) {
        const botMsg = { id: Date.now() + 1, text: res.data.message, sender: 'bot', type: 'text' };
        let nextOptions = res.data.options || [];
        if (res.data.is_terminal) {
            nextOptions = [{ id: 'start_over', label: 'Start New Chat' }, { id: 'other', label: 'Other Query' }];
        } else { nextOptions.push({ id: 'other', label: 'Other Query' }); }
        setMessages(prev => [...prev, botMsg]);
        setCurrentOptions(nextOptions);
        setChatContext(prev => ({ ...prev, state_key: res.data.state_key }));
      }
    } catch (e) { setIsTyping(false); }
    finally { setIsTyping(false); }
  };


 const openGallery = useCallback(async () => {
  try {
    const result = await pick({
      mode: 'import',
      allowMultiSelection: false,
      type: [types.images, types.pdf, types.doc, types.docx], // Added common doc types
    });

    if (!result || result.length === 0) return;

    const fileObj = result[0];
    let filePath = fileObj.uri;

    // Handle Android content:// URIs by creating a local cache copy
    if (Platform.OS === 'android' && filePath.startsWith('content://')) {
      const [copyResult] = await keepLocalCopy({
        files: [{ 
          uri: fileObj.uri, 
          fileName: fileObj.name ?? `document_${Date.now()}` 
        }],
        destination: 'cachesDirectory',
      });

      if (copyResult?.status === 'success') {
        filePath = copyResult.localUri;
      } else {
        throw new Error(copyResult?.copyError || 'Failed to copy file.');
      }
    } 
    // iOS path cleaning - keep the file:// prefix for FormData uploads
    else if (Platform.OS === 'ios') {
       // Note: Standard fetch in RN usually prefers the file:// prefix 
       filePath = decodeURIComponent(fileObj.uri);
    }

    // Size Validation
    const fileSize = fileObj.size ?? (await RNFS.stat(filePath)).size;
    const fileSizeInMB = fileSize / (1024 * 1024);

    if (fileSizeInMB > 2) {
      Toast.show({ 
        type: 'error', 
        text1: 'File Size Error', 
        text2: 'File is over 2MB. Please select a smaller file.' 
      });
      return;
    }

    // Update state with file details for FormData
    setSelectedImage({
      name: fileObj.name,
      size: fileSize,
      type: fileObj.type,
      uri: filePath // Raw path used for multipart/form-data
    });

    Toast.show({ type: 'success', text1: 'File Selected', text2: fileObj.name });

  } catch (error) {
    if (error?.code === 'OPERATION_CANCELED' || error?.code === 'DOCUMENTS_PICKER_CANCELED') {
      console.log('User cancelled selection');
    } else {
      console.error('Picker Error:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to pick document' });
    }
  }
}, []);
   

const handleModalSubmit = async () => {
  // 1. Validation (Minimum 50 characters for Subject)
  if (issueCategory.length > 50 || !issueDescription) {
    Alert.alert("Error", "Subject must be at most 50 characters and description is required.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('subject', issueCategory);
    formData.append('message', issueDescription);

    // 2. Handle Attachment (Image or PDF)
    if (selectedImage && selectedImage.uri) {
      // Use the properties already captured in your openGallery function
      formData.append('document', {
        uri: selectedImage.uri,
        name: selectedImage.name || 'attachment',
        type: selectedImage.type || 'application/octet-stream', // Handles both image/jpeg and application/pdf
      });
    }

    // 3. Trigger API Call
    const response = await addSupportTicket(formData).unwrap();
    console.log("Support Ticket API Response:", response);

    // 4. Success UI Flow
    setModalVisible(false);

    const ticketMsg = {
      id: Date.now(),
      sender: 'user',
      type: 'ticket',
      data: { 
        category: issueCategory, 
        desc: issueDescription, 
        img: selectedImage.uri, // Storing URI for local preview
        fileName: selectedImage.name,
        ticketId: response?.ticketId 
      }
    };
    setMessages(prev => [...prev, ticketMsg]);

    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: `Success! We have logged your request. Your Ticket ID is #${response?.data?.ticketNumber || 'ZOOM-' + Math.floor(1000 + Math.random() * 9000)}. Our support team will contact you shortly.`, 
        sender: 'bot', 
        type: 'text' 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Reset Form State
      setIssueCategory('');
      setIssueDescription('');
      setSelectedImage(null); // Ensure this matches your state setter name
      
      // setCurrentOptions(CHAT_FLOW.root.options);
    }, 1500);

  } catch (error) {
    console.error("Support Ticket API Error:", error);
    Alert.alert("Submission Failed", "Something went wrong. Please try again.");
  }
};
  const renderMessageItem = ({ item, index }) => {
    const isUser = item.sender === 'user';
    const isLastMessage = index === messages.length - 1;

    return (
      <View>
        <View style={[styles.messageRow, isUser ? styles.messageRowRight : styles.messageRowLeft]}>
          {!isUser && <Image source={{ uri: BOT_AVATAR }} style={styles.botAvatar} />}
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{item.text}</Text>
          </View>
        </View>

        {!isUser && isLastMessage && !isTyping && currentOptions.length > 0 && (
          <View style={styles.inlineOptionsContainer}>
            {currentOptions.map((opt) => (
              <TouchableOpacity key={opt.id} style={styles.inlineOptionChip} onPress={() => handleOptionPress(opt)}>
                <Text style={styles.inlineOptionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={hp(2.8)} color={COLORS.textDark} />
          <Text style={styles.headerTitle}>Support Assistant</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={isTyping && (
          <View style={styles.typingContainer}><Text style={styles.typingText}>Assistant is typing...</Text></View>
        )}
      />

      {/* Other Query & Exit Modals would go here (truncated for brevity) */}
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
        
        {/* Subject Input (Replaced Dropdown) */}
        <View style={{ marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Subject</Text>
            <Text style={[
              styles.charCount, 
              { color: issueCategory.length > 50 ? '#EF4444' : '#10B981' }
            ]}>
              {issueCategory.length}/50
            </Text>
          </View>
          <TextInput
            style={[
              styles.inputField, 
              issueCategory.length > 0 && issueCategory.length > 50 && { borderColor: '#EF4444' }
            ]}
            placeholder="Enter subject (maximum 50 characters)..."
            value={issueCategory} // Reusing your existing state variable
            onChangeText={setIssueCategory}
            placeholderTextColor="#999"
          />
          {issueCategory.length > 0 && issueCategory.length > 50 && (
            <Text style={styles.errorText}>Subject must be at most 50 characters.</Text>
          )}
        </View>

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
        <TouchableOpacity style={styles.uploadButton} onPress={openGallery}>
          <Text style={styles.uploadText}>
            {selectedImage ? selectedImage?.name : "Upload Document/Screenshot"}
          </Text>
        </TouchableOpacity>
        
        {/* {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        )} */}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            issueCategory.length < 50 && { backgroundColor: '#9CA3AF' } // Gray out if invalid
          ]} 
          onPress={handleModalSubmit}
          disabled={issueCategory.length > 50} // Prevent submission
        >
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  </KeyboardAvoidingView>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: hp(1.5), backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center',marginTop:hp(3) },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: hp(2.2), fontWeight: 'bold', marginLeft: wp(2), color: COLORS.textDark },
  chatList: { padding: wp(4), paddingBottom: hp(3) },
  messageRow: { flexDirection: 'row', marginBottom: hp(1.2), alignItems: 'flex-end' },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
  botAvatar: { width: wp(8), height: wp(8), borderRadius: wp(4), marginRight: wp(2) },
  bubble: { maxWidth: '82%', padding: wp(3.5), borderRadius: wp(3.5) },
  botBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 2, elevation: 1 },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  messageText: { fontSize: hp(1.85), lineHeight: hp(2.5), color: COLORS.textDark }, // Slightly decreased
  userText: { color: '#fff' },
  botText: { color: COLORS.textDark },

  inlineOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: wp(10), 
    marginTop: hp(0.5),
    marginBottom: hp(2),
    justifyContent: 'flex-start', // Aligns chips in a row
  },
  inlineOptionChip: {
    backgroundColor: '#fff',
    borderWidth: 1.2,
    borderColor: COLORS.primary,
    borderRadius: wp(5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.7),
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  inlineOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: hp(1.7), // Slightly decreased
  },
  typingContainer: { marginLeft: wp(10), marginBottom: hp(2) },
  typingText: { fontStyle: 'italic', color: '#999', fontSize: hp(1.6) },
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
  inputField: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: '#F9FAFB',
  },
  charCount: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Montserrat-Regular',
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

export default ChatScreen;