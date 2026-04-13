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
  ActivityIndicator
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

// --- MOCK DATA FOR DEPARTMENTS ---
const departments = [
  { id: 'claims', title: 'Claims', desc: 'Issues related to claim filing, status, or settlement', icon: 'shield-check-outline', color: '#3b82f6' },
  { id: 'data', title: 'Data Issue', desc: 'Wrong details, missing info, or data correction', icon: 'database-outline', color: '#f97316' },
  { id: 'it', title: 'IT Support', desc: 'Login, app access, technical or platform issues', icon: 'monitor', color: '#d946ef' },
];

const ChatScreen = ({ route }) => {
  const { ticketId } = route.params || {};
  const navigation = useNavigation();
  const flatListRef = useRef();
  const dispatch = useDispatch();
  const [addSupportTicket, { isLoading }] = useAddsupportticketMutation();
  const [startMessages] = useGetNewChatMutation();
  const [getMessages] = useGetMessageforChatMutation();
    
  const { data: ticketChatData } = useSelector(state => state.chat);
  
  // --- REDUX POLICY DATA ---
  const { data: PolicyData, isLoading: policyLoading } = useSelector((state:any) => state.policy);
  const policies = PolicyData?.data?.policy_details || [];
  
  const [messages, setMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [chatContext, setChatContext] = useState({ ticket_id: ticketId || null, state_key: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false); 
  const [issueDescription, setIssueDescription] = useState('');

  // --- NEW MULTI-STEP STATE ---
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Now stores whole object
  const [selectedPolicy, setSelectedPolicy] = useState(null);

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
    try {
      setIsTyping(true);
      const token = tokenProp || await AsyncStorage.getItem('token');
      const res = await startMessages({ token }).unwrap(); 
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
      const res = await getMessages({
        token, conversation_id: chatContext.ticket_id, selected_option: option.id
      }).unwrap();
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
        type: [types.images, types.pdf, types.doc, types.docx], 
      });

      if (!result || result.length === 0) return;

      const fileObj = result[0];
      let filePath = fileObj.uri;

      if (Platform.OS === 'android' && filePath.startsWith('content://')) {
        const [copyResult] = await keepLocalCopy({
          files: [{ uri: fileObj.uri, fileName: fileObj.name ?? `document_${Date.now()}` }],
          destination: 'cachesDirectory',
        });
        if (copyResult?.status === 'success') filePath = copyResult.localUri;
        else throw new Error(copyResult?.copyError || 'Failed to copy file.');
      } 
      else if (Platform.OS === 'ios') {
         filePath = decodeURIComponent(fileObj.uri);
      }

      const fileSize = fileObj.size ?? (await RNFS.stat(filePath)).size;
      const fileSizeInMB = fileSize / (1024 * 1024);

      if (fileSizeInMB > 5) { 
        Toast.show({ type: 'error', text1: 'File Size Error', text2: 'File is over 5MB. Please select a smaller file.' });
        return;
      }

      setSelectedImage({
        name: fileObj.name,
        size: fileSize,
        type: fileObj.type,
        uri: filePath 
      });

      Toast.show({ type: 'success', text1: 'File Selected', text2: fileObj.name });

    } catch (error) {
      if (error?.code !== 'OPERATION_CANCELED' && error?.code !== 'DOCUMENTS_PICKER_CANCELED') {
        console.error('Picker Error:', error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to pick document' });
      }
    }
  }, []);
   
  const handleCloseModal = () => {
    setStep(1);
    setSelectedDepartment(null);
    setSelectedPolicy(null);
    setIssueDescription('');
    setSelectedImage(null);
    setModalVisible(false);
  };

  // --- UPDATED API PAYLOAD ---
  const handleModalSubmit = async () => {
    if (!issueDescription.trim()) {
      Alert.alert("Error", "Description is required.");
      return;
    }

    try {
      const formData = new FormData();
      
      // 1. subject = "Issue with [department]"
      const deptName = selectedDepartment?.title ? selectedDepartment.title.toLowerCase() : 'support';
      const finalSubject = `Issue with ${deptName}`;
      formData.append('subject', finalSubject);
      
      // 2. message = issueDescription
      formData.append('message', issueDescription);

      // 3. department = ID string (e.g., 'claims', 'it', 'data')
      if (selectedDepartment) {
        formData.append('department', selectedDepartment.id);
      }

      // 4. policy_id = policy ID from API
      if (selectedPolicy) {
        // Fallback to policy_id or id depending on your API structure
        formData.append('policy_id', selectedPolicy.id || selectedPolicy.policy_id || '');
      }

      // 5. document = attached file
      if (selectedImage && selectedImage.uri) {
        formData.append('document', {
          uri: selectedImage.uri,
          name: selectedImage.name || 'attachment',
          type: selectedImage.type || 'application/octet-stream', 
        });
      }

      const response = await addSupportTicket(formData).unwrap();
      
      handleCloseModal(); // Close and reset

      const ticketMsg = {
        id: Date.now(),
        sender: 'user',
        type: 'ticket',
        data: { 
          category: finalSubject, 
          desc: issueDescription, 
          img: selectedImage?.uri, 
          fileName: selectedImage?.name,
          ticketId: response?.ticketId 
        }
      };
      setMessages(prev => [...prev, ticketMsg]);
      dispatch(fetchtickets());
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
            
            {/* --- NEW: Handle the custom Ticket data layout --- */}
            {item.type === 'ticket' ? (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: hp(0.5) }}>
                  <Icon name="ticket-confirmation-outline" size={hp(2)} color="#fff" style={{ marginRight: wp(1) }} />
                  <Text style={[styles.messageText, styles.userText, { fontFamily: 'Montserrat-Bold' }]}>
                    Ticket Submitted
                  </Text>
                </View>
                
                <Text style={[styles.messageText, styles.userText, { fontSize: hp(1.5), marginTop: hp(0.5) }]}>
                  <Text style={{ fontFamily: 'Montserrat-Bold' }}>Subject: </Text>
                  {item.data?.category}
                </Text>
                
                <Text style={[styles.messageText, styles.userText, { fontSize: hp(1.5), marginTop: hp(0.5) }]}>
                  <Text style={{ fontFamily: 'Montserrat-Bold' }}>Issue: </Text>
                  {item.data?.desc}
                </Text>
                
                {item.data?.fileName && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1), backgroundColor: 'rgba(255,255,255,0.2)', padding: wp(1.5), borderRadius: wp(1.5) }}>
                    <Icon name="paperclip" size={hp(1.6)} color="#fff" style={{ marginRight: wp(1) }} />
                    <Text style={[styles.messageText, styles.userText, { fontSize: hp(1.3), flexShrink: 1 }]} numberOfLines={1}>
                      {item.data.fileName}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              /* --- Original Text Render --- */
              <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
                {item.text}
              </Text>
            )}

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

  // --- MODAL RENDERS ---
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.modalHeaderRow}>
         <View style={styles.titleRow}>
            <Icon name="chat-processing-outline" size={hp(3)} color={COLORS.primary} style={{marginRight: wp(2)}} />
            <Text style={styles.modalTitle}>Raise a Support Ticket</Text>
         </View>
         <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
           <Icon name="close" size={hp(3)} color="#94a3b8" />
         </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>Select the department that best describes your issue:</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
        {departments.map((dept) => (
          <TouchableOpacity 
            key={dept.id} 
            style={styles.selectionCard} 
            onPress={() => { setSelectedDepartment(dept); setStep(2); }} // Storing whole object
            activeOpacity={0.7}
          >
            <View style={[styles.cardIconBox, { backgroundColor: dept.color }]}>
               <Icon name={dept.icon} size={hp(2.5)} color="#fff" />
            </View>
            <View style={styles.cardTextContent}>
               <Text style={styles.cardTitle}>{dept.title}</Text>
               <Text style={styles.cardDesc}>{dept.desc}</Text>
            </View>
            <Icon name="chevron-right" size={hp(2.5)} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.modalHeaderRow}>
         <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => setStep(1)} style={{marginRight: wp(2)}}>
                <Icon name="chevron-left" size={hp(3.5)} color="#94a3b8" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Policy</Text>
         </View>
         <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
           <Icon name="close" size={hp(3)} color="#94a3b8" />
         </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>Choose the policy this ticket relates to:</Text>

      {policyLoading ? (
         <View style={{padding: 20, alignItems: 'center'}}>
            <ActivityIndicator size="small" color={COLORS.primary} />
         </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {policies.map((policy, index) => (
            <TouchableOpacity 
              key={policy.id || index} 
              style={styles.selectionCard} 
              onPress={() => { setSelectedPolicy(policy); setStep(3); }}
              activeOpacity={0.7}
            >
              <View style={styles.policyImageBox}>
                 <Icon name="shield-account-outline" size={hp(3)} color="#94a3b8" />
              </View>
              <View style={styles.cardTextContent}>
                 <Text style={styles.cardTitle}>{policy.policy_name || 'Unknown Policy'}</Text>
                 <Text style={styles.cardDesc}>{policy.insurance_company_name || 'Unknown Company'}</Text>
                 <Text style={styles.cardId}>{policy.policy_number}</Text>
              </View>
              <Icon name="chevron-right" size={hp(2.5)} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
          
          {policies.length === 0 && (
             <Text style={{textAlign: 'center', color: '#94a3b8', marginTop: hp(2)}}>No active policies found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={{flexShrink: 1}}>
      <View style={styles.stepContainer}>
        <View style={styles.modalHeaderRow}>
           <View style={styles.titleRow}>
              <TouchableOpacity onPress={() => setStep(2)} style={{marginRight: wp(2)}}>
                  <Icon name="chevron-left" size={hp(3.5)} color="#94a3b8" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Describe Your Issue</Text>
           </View>
           <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
             <Icon name="close" size={hp(3)} color="#94a3b8" />
           </TouchableOpacity>
        </View>

        <View style={styles.tagsRow}>
            {selectedDepartment && <View style={styles.tagPill}><Text style={styles.tagText}>{selectedDepartment.title}</Text></View>}
            {selectedPolicy && <View style={styles.tagPill}><Text style={styles.tagText}>{selectedPolicy.policy_name}</Text></View>}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{flexShrink: 1, maxHeight: hp(45)}}>
            <Text style={styles.inputLabel}>Your Query <Text style={{color: '#ef4444'}}>*</Text></Text>
            <TextInput 
              style={styles.textArea}
              placeholder="Please describe your issue in detail..."
              placeholderTextColor="#94a3b8"
              value={issueDescription}
              onChangeText={setIssueDescription}
              multiline={true}
              textAlignVertical="top"
              editable={!isLoading}
            />

            <Text style={styles.inputLabel}>Supporting Document <Text style={{color: '#94a3b8'}}>(Optional)</Text></Text>
            <TouchableOpacity style={styles.uploadBox} onPress={openGallery}>
               <Icon name="arrow-up-box" size={hp(2.5)} color={COLORS.primary} style={{marginRight: wp(2)}} />
               <Text style={styles.uploadText} numberOfLines={1}>{selectedImage ? selectedImage.name : "Click to upload file"}</Text>
            </TouchableOpacity>
            <Text style={styles.uploadHint}>Max 5MB • JPG, PNG, PDF, DOC, DOCX</Text>
        </ScrollView>

        <View style={styles.footerButtons}>
           <TouchableOpacity style={styles.cancelBtn} onPress={handleCloseModal}>
               <Text style={styles.cancelBtnText}>Cancel</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
              style={[styles.submitBtn, { opacity: issueDescription.trim() && !isLoading ? 1 : 0.5 }]} 
              onPress={handleModalSubmit}
              disabled={!issueDescription.trim() || isLoading}
           >
               {isLoading ? (
                 <ActivityIndicator color="#fff" size="small" />
               ) : (
                 <>
                   <Icon name="send-outline" size={hp(2)} color="#fff" style={{marginRight: wp(2), marginTop: hp(-0.5), transform: [{ rotate: '-45deg' }]}} />
                   <Text style={styles.submitBtnText}>Submit Ticket</Text>
                 </>
               )}
           </TouchableOpacity>
        </View>

      </View>
    </View>
  );

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- EXISTING CHAT STYLES ---
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: hp(1.5), backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center', marginTop: hp(3) },
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
  messageText: { fontSize: hp(1.85), lineHeight: hp(2.5), color: COLORS.textDark }, 
  userText: { color: '#fff' },
  botText: { color: COLORS.textDark },
  inlineOptionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: wp(10), marginTop: hp(0.5), marginBottom: hp(2), justifyContent: 'flex-start' },
  inlineOptionChip: { backgroundColor: '#fff', borderWidth: 1.2, borderColor: COLORS.primary, borderRadius: wp(5), paddingHorizontal: wp(3.5), paddingVertical: hp(0.7), marginRight: wp(2), marginBottom: hp(1) },
  inlineOptionText: { color: COLORS.primary, fontWeight: '600', fontSize: hp(1.7) },
  typingContainer: { marginLeft: wp(10), marginBottom: hp(2) },
  typingText: { fontStyle: 'italic', color: '#999', fontSize: hp(1.6) },
  
  // --- MODAL WRAPPER STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FCFAFF', borderTopLeftRadius: wp(6), borderTopRightRadius: wp(6), padding: wp(5), paddingBottom: Platform.OS === 'ios' ? hp(5) : hp(3) },
  
  // --- NEW MULTI-STEP MODAL STYLES ---
  stepContainer: { flexShrink: 1 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1) },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  modalTitle: { fontSize: hp(2.2), fontFamily: 'Montserrat-Bold', color: '#1e293b' },
  closeButton: { padding: wp(1) },
  subTitle: { fontSize: hp(1.6), fontFamily: 'Montserrat-Medium', color: '#64748b', marginBottom: hp(2.5) },
  
  listContainer: { paddingBottom: hp(2), maxHeight: hp(50) },
  selectionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: wp(4), padding: wp(4), marginBottom: hp(1.5), borderWidth: 1, borderColor: '#e2e8f0' },
  cardIconBox: { width: wp(12), height: wp(12), borderRadius: wp(3), alignItems: 'center', justifyContent: 'center', marginRight: wp(3) },
  policyImageBox: { width: wp(12), height: wp(12), borderRadius: wp(3), backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginRight: wp(3), borderWidth: 1, borderColor: '#e2e8f0' },
  cardTextContent: { flex: 1, paddingRight: wp(2) },
  cardTitle: { fontSize: hp(1.8), fontFamily: 'Montserrat-Bold', color: '#1e293b', marginBottom: hp(0.2) },
  cardDesc: { fontSize: hp(1.4), fontFamily: 'Montserrat-Medium', color: '#64748b' },
  cardId: { fontSize: hp(1.3), fontFamily: 'Montserrat-Regular', color: '#94a3b8', marginTop: hp(0.5) },
  
  tagsRow: { flexDirection: 'row', marginBottom: hp(2.5) },
  tagPill: { backgroundColor: '#f3e8ff', paddingHorizontal: wp(3), paddingVertical: hp(0.6), borderRadius: wp(4), marginRight: wp(2) },
  tagText: { color: COLORS.primary, fontFamily: 'Montserrat-SemiBold', fontSize: hp(1.4) },
  
  inputLabel: { fontSize: hp(1.6), fontFamily: 'Montserrat-Bold', color: '#334155', marginBottom: hp(1) },
  textArea: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e9d5ff', borderRadius: wp(3), height: hp(15), padding: wp(3), fontSize: hp(1.6), fontFamily: 'Montserrat-Medium', color: '#1e293b', marginBottom: hp(2.5) },
  
  uploadBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#d8b4e2', borderRadius: wp(3), height: hp(7), backgroundColor: '#faf5ff', overflow: 'hidden' },
  uploadText: { fontSize: hp(1.5), fontFamily: 'Montserrat-Medium', color: '#64748b', maxWidth: wp(60), flexShrink: 1, paddingHorizontal: wp(2) },
  uploadHint: { textAlign: 'center', fontSize: hp(1.3), fontFamily: 'Montserrat-Regular', color: '#94a3b8', marginTop: hp(1), marginBottom: hp(3) },
  
  footerButtons: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: hp(1), marginTop: hp(1) },
  cancelBtn: { flex: 1, backgroundColor: '#f8fafc', paddingVertical: hp(1.8), borderRadius: wp(3), alignItems: 'center', marginRight: wp(2), borderWidth: 1, borderColor: '#e2e8f0' },
  cancelBtnText: { color: '#475569', fontFamily: 'Montserrat-SemiBold', fontSize: hp(1.6) },
  submitBtn: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: hp(1.8), borderRadius: wp(3), alignItems: 'center', justifyContent: 'center', marginLeft: wp(2) },
  submitBtnText: { color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
});

export default ChatScreen;