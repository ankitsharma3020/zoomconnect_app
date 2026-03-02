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
import { wp, hp } from '../utilites/Dimension'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCloseChatMutation, useGetMessageforChatMutation, useGetNewChatMutation } from '../redux/service/user/user';
import { useDispatch, useSelector } from 'react-redux';
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

  const [startMessages] = useGetNewChatMutation();
  const [getMessages] = useGetMessageforChatMutation();
  
  const { data: ticketChatData } = useSelector(state => state.chat);
  
  const [messages, setMessages] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [chatContext, setChatContext] = useState({ ticket_id: ticketId || null, state_key: null });

  const [modalVisible, setModalVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false); 
  const [isTyping, setIsTyping] = useState(false); 
  const [issueCategory, setIssueCategory] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

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
        setChatContext({ ticket_id: res.data.ticket_id, state_key: res.data.state_key });
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
        token, ticket_id: chatContext.ticket_id, state_key: chatContext.state_key, selected_option_id: option.id
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
        <TouchableOpacity style={styles.backBtn} onPress={() => setExitModalVisible(true)}>
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
});

export default ChatScreen;