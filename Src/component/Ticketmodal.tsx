import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../utilites/Dimension'; 
import { useReplytoticketMutation } from '../redux/service/user/user'; 
import { useSelector } from 'react-redux';

const TicketModal = ({ visible, onClose, ticket, onReplySuccess }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const scrollViewRef = useRef(); // ADDED: Ref for ScrollView
  
  // RTK Query Mutation for replying
  const [replyticket, { isLoading: isReplying }] = useReplytoticketMutation();
  
  // Get Chat Data from Redux
  const { data: ticketdata, isLoading: isLoadingChat } = useSelector(state => state.chat);

  // Fallback to passed ticket if Redux data is still loading
  const ticketInfo = ticketdata?.ticket || ticket;
  const messagesList = ticketdata?.messages || [];

  // Function to handle send action
  const handleSend = async () => {
    if (replyMessage.trim().length === 0) return;

    try {
      let response = await replyticket({ 
        ticketId: ticketInfo?.ticket_id, 
        message: replyMessage 
      }).unwrap();

      if (response?.success) {
        setReplyMessage(""); 
        if (onReplySuccess) {
          onReplySuccess(); 
        }
      }
    } catch (error) {
      console.log("reply error", error);
    }
  };

  const handleClose = () => {
    setReplyMessage("");
    onClose();
  };

  // ADDED: Auto-scroll to bottom when messages update
  useEffect(() => {
    if (visible && messagesList.length > 0) {
      // Small timeout ensures the layout is rendered before scrolling
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visible, messagesList]);

  if (!ticketInfo) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          {/* Header Row */}
          <View style={styles.headerRow}>
             <View>
                <Text style={styles.headerTitle}>{ticketInfo.subject || 'Ticket Details'}</Text>
                <View style={styles.subHeaderRow}>
                    <Text style={styles.ticketId}>#{ticketInfo.ticket_id}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: ticketInfo.status === 'open' ? '#dbeafe' : '#f1f5f9' }
                    ]}>
                       <Text style={[
                         styles.statusBadgeText,
                         { color: ticketInfo.status === 'open' ? '#2563eb' : '#64748b' }
                       ]}>
                         {ticketInfo.status || 'open'}
                       </Text>
                    </View>
                </View>
             </View>
             <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
               <Icon name="close" size={hp(2.5)} color="#94a3b8" />
             </TouchableOpacity>
          </View>

          {/* Info Cards Row */}
          <View style={styles.infoRow}>
             <View style={styles.infoCard}>
                <View style={styles.infoIconRow}>
                   <Icon name="clock-outline" size={hp(1.8)} color="#64748b" />
                   <Text style={styles.infoLabel}>Created</Text>
                </View>
                <Text style={styles.infoValue}>
                   {ticketInfo.created_at ? new Date(ticketInfo.created_at).toLocaleDateString() : 'N/A'}
                </Text>
             </View>

             <View style={[styles.infoCard, { marginLeft: wp(3) }]}>
                <View style={styles.infoIconRow}>
                   <Icon name="message-outline" size={hp(1.8)} color="#64748b" />
                   <Text style={styles.infoLabel}>Messages</Text>
                </View>
                <Text style={styles.infoValue}>
                   {messagesList.length} replies
                </Text>
             </View>
          </View>

          {/* Chat Bubble Area */}
          <ScrollView 
            ref={scrollViewRef} // ADDED: Attach ref
            style={styles.chatArea} 
            contentContainerStyle={styles.chatContentContainer} // ADDED: Content container style for bottom padding
            showsVerticalScrollIndicator={false}
          >
             {isLoadingChat ? (
               <ActivityIndicator size="small" color="#2563eb" style={{marginTop: hp(2)}} />
             ) : messagesList.length === 0 ? (
               <Text style={styles.emptyChatText}>No messages yet.</Text>
             ) : (
               messagesList.map((msg, index) => {
                 // Logic to identify sender. Empty string '' is treated as 'user'
                 const isUser = !msg.sender_type || msg.sender_type.toLowerCase() === 'user';
                 
                 return (
                   <View 
                     key={msg.id || index} 
                     style={[
                       styles.chatBubble, 
                       isUser ? styles.chatBubbleUser : styles.chatBubbleSupport
                     ]}
                   >
                      <View style={styles.chatHeader}>
                         <View style={[styles.avatar, isUser ? styles.avatarUser : styles.avatarSupport]}>
                            <Text style={[styles.avatarText, isUser ? styles.avatarTextUser : styles.avatarTextSupport]}>
                              {isUser ? 'U' : 'S'}
                            </Text>
                         </View>
                         <View>
                            <Text style={styles.senderName}>{isUser ? 'You' : 'Support Team'}</Text>
                            <Text style={styles.messageTime}>
                               {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </Text>
                         </View>
                      </View>
                      
                      <Text style={styles.messageText}>{msg.message}</Text>
                      
                      {/* Attachment indicator if present */}
                      {msg.attachment && (
                        <View style={styles.attachmentBox}>
                          <Icon name="paperclip" size={hp(1.8)} color="#64748b" />
                          <Text style={styles.attachmentText}>Attachment Included</Text>
                        </View>
                      )}
                   </View>
                 );
               })
             )}
          </ScrollView>

          {/* Input Area */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
             <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                   <TextInput 
                     style={styles.input}
                     placeholder="Type your message..."
                     placeholderTextColor="#94a3b8"
                     value={replyMessage}
                     onChangeText={setReplyMessage}
                     multiline={true}
                     editable={!isReplying}
                   />
                </View>
                <TouchableOpacity 
                  style={[styles.sendButton, { opacity: replyMessage.trim() && !isReplying ? 1 : 0.5 }]} 
                  onPress={handleSend}
                  disabled={!replyMessage.trim() || isReplying}
                >
                   {isReplying ? (
                     <ActivityIndicator size="small" color="#fff" />
                   ) : (
                     <Icon name="send-outline" size={hp(2.5)} color="#fff" style={{ transform: [{ rotate: '-45deg' }] }} />
                   )}
                </TouchableOpacity>
             </View>
             <Text style={styles.enterHint}>Press Enter to send</Text>
          </KeyboardAvoidingView>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#F8F9FD', borderTopLeftRadius: wp(6), borderTopRightRadius: wp(6), height: hp(85), paddingTop: hp(2) },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: wp(5), marginBottom: hp(2) },
  headerTitle: { fontSize: hp(2.2), fontFamily: 'Montserrat-Bold', color: '#0f172a', marginBottom: hp(0.5) },
  subHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  ticketId: { fontSize: hp(1.4), fontFamily: 'Montserrat-Medium', color: '#64748b' },
  dotSeparator: { marginHorizontal: wp(2), color: '#cbd5e1' },
  statusBadge: { paddingHorizontal: wp(2.5), paddingVertical: hp(0.3), borderRadius: wp(3) },
  statusBadgeText: { fontSize: hp(1.3), fontFamily: 'Montserrat-SemiBold', textTransform: 'capitalize' },
  closeButton: { padding: wp(1) },
  infoRow: { flexDirection: 'row', paddingHorizontal: wp(5), marginBottom: hp(2) },
  infoCard: { flex: 1, backgroundColor: '#fff', borderRadius: wp(3), padding: wp(3.5), borderWidth: 1, borderColor: '#e2e8f0' },
  infoIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1) },
  infoLabel: { fontSize: hp(1.4), color: '#64748b', marginLeft: wp(1.5), fontFamily: 'Montserrat-Medium' },
  infoValue: { fontSize: hp(1.6), color: '#0f172a', fontFamily: 'Montserrat-Bold' },
  
  chatArea: { flex: 1, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: wp(5) },
  // ADDED: Padding bottom to ensure last message is fully visible
  chatContentContainer: { paddingBottom: hp(4), paddingTop: hp(2) }, 
  
  // Chat Bubble Base Styles
  chatBubble: { borderRadius: wp(4), padding: wp(4), borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, marginBottom: hp(2), maxWidth: '85%' },
  
  // Differentiating Support vs User
  chatBubbleSupport: { alignSelf: 'flex-start', backgroundColor: '#fff', borderColor: '#e2e8f0' },
  chatBubbleUser: { alignSelf: 'flex-end', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }, // Light green/blue for user
  
  chatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5) },
  avatar: { width: wp(8), height: wp(8), borderRadius: wp(4), alignItems: 'center', justifyContent: 'center', marginRight: wp(2.5) },
  
  // Differentiating Avatars
  avatarSupport: { backgroundColor: '#e0e7ff' },
  avatarUser: { backgroundColor: '#dcfce7' },
  avatarTextSupport: { color: '#4f46e5', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
  avatarTextUser: { color: '#16a34a', fontFamily: 'Montserrat-Bold', fontSize: hp(1.6) },
  
  senderName: { fontSize: hp(1.5), fontFamily: 'Montserrat-Bold', color: '#0f172a' },
  messageTime: { fontSize: hp(1.2), color: '#94a3b8', fontFamily: 'Montserrat-Regular', marginTop: hp(0.2) },
  messageText: { fontSize: hp(1.5), color: '#334155', fontFamily: 'Montserrat-Regular', lineHeight: hp(2.2) },
  
  attachmentBox: { flexDirection: 'row', alignItems: 'center', marginTop: hp(1), padding: wp(2), backgroundColor: '#f1f5f9', borderRadius: wp(2) },
  attachmentText: { fontSize: hp(1.3), color: '#64748b', marginLeft: wp(1), fontFamily: 'Montserrat-Medium' },
  emptyChatText: { textAlign: 'center', color: '#94a3b8', marginTop: hp(5), fontFamily: 'Montserrat-Medium' },

  inputContainer: { flexDirection: 'row', padding: wp(4), backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  inputWrapper: { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: wp(5), paddingHorizontal: wp(4), marginRight: wp(3), height: hp(6), justifyContent: 'center' },
  input: { flex: 1, fontSize: hp(1.5), fontFamily: 'Montserrat-Regular', color: '#0f172a' },
  sendButton: { width: hp(6), height: hp(6), borderRadius: hp(3), backgroundColor: '#a78bfa', alignItems: 'center', justifyContent: 'center' },
  enterHint: { textAlign: 'center', color: '#94a3b8', fontSize: hp(1.3), fontFamily: 'Montserrat-Regular', backgroundColor: '#fff', paddingBottom: Platform.OS === 'ios' ? hp(3) : hp(2) }
});

export default TicketModal;