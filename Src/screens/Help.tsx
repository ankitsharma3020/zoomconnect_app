import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension';

import Header from '../component/header'; 
import ActivePolicyHeader from '../component/activpolicy';
import { fetchTicketChat, fetchtickets } from './Epicfiles/MainEpic';
import { useDispatch, useSelector } from 'react-redux';
import { GetApi } from '../component/Apifunctions';
import TicketModal from '../component/Ticketmodal';

// Naya component import karein
 

const { width } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); 
const HEADER_HEIGHT = Platform.OS === 'ios' ? hp(14) : hp(13);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past; 
  const diffMins = Math.round(diffMs / 60000);
  const diffHrs = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  return `${diffDays} days ago`;
};

const Help = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);
  const [isLoadingFAQ, setIsLoadingFAQ] = useState(false);  
  const [FAQ_DATA, setFAQ_DATA] = useState();
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const { data, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();

  const getFaq = async () => {
    try {
       setIsLoadingFAQ(true);
       let reponse = await GetApi('/faqs');
       setFAQ_DATA(reponse?.data?.faqs || []);
    } catch (error) {
       console.log("faq error", error);
    } finally {
       setIsLoadingFAQ(false);
    }
  };
 
  useEffect(() => {
    getFaq();
    dispatch(fetchtickets());
    
  }, []);

  const latestTicket = Array.isArray(data) && data.length > 0 ? data[0] : null;

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleTicketClick = (ticket) => {
      setSelectedTicket(ticket);
      dispatch(fetchTicketChat({ticketId: ticket?.ticket_id}));
      setModalVisible(true);
  };

  return (
    <View style={styles.screenWrap}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.backgroundLayer} pointerEvents="none">
        <LinearGradient colors={['#f8fafc', '#f1f5f9']} style={StyleSheet.absoluteFill} />
        <View style={styles.fixedFooterWrap}>
            <Text style={styles.fixedFooterText}>HELP</Text>
        </View>
      </View>

      <View style={styles.safe}>
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: HEADER_HEIGHT }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <ActivePolicyHeader
              title="Help Center"
              subtitle="Find answers or contact support."
              onBack={() => navigation?.goBack?.()}
              illustration={require('../../assets/policies.png')} 
            />
          </View>

          <View style={styles.contentSection}>
            <SectionHeader title="Latest Conversation" icon="message-text-clock-outline" />
            
            {latestTicket ? (
              <>
                <TouchableOpacity 
                  style={styles.ticketCard} 
                  onPress={() => handleTicketClick(latestTicket)}
                  activeOpacity={0.8}
                >
                  <View style={styles.ticketInner}>
                      <View style={styles.ticketTop}>
                        <View style={styles.ticketIdBadge}>
                            <Icon name="pound" size={hp(1.75)} color="#64748b" />
                            <Text style={styles.ticketId}>{latestTicket.ticket_id}</Text>
                        </View>
                        <View style={[styles.statusPill, { backgroundColor: latestTicket.status === 'open' ? '#f0fdf4' : '#f1f5f9' }]}>
                            <View style={[styles.statusDot, { backgroundColor: latestTicket.status === 'open' ? '#22c55e' : '#64748b' }]} />
                            <Text style={[styles.statusText, { color: latestTicket.status === 'open' ? '#16a34a' : '#64748b' }]}>
                              {latestTicket.status ? latestTicket.status.toUpperCase() : 'UNKNOWN'}
                            </Text>
                        </View>
                      </View>

                      <View style={styles.ticketContent}>
                          <View style={styles.ticketIconBox}>
                              <Icon name="alert-box-outline" size={hp(3)} color="#ea580c" />
                          </View>
                          <View style={{flex: 1, justifyContent: 'center'}}>
                               <Text style={styles.ticketLabel}>Issue: {latestTicket.subject || 'N/A'}</Text>
                          </View>
                      </View>

                      <View style={styles.ticketFooter}>
                          <Text style={styles.timeText}>
                            Last reply: {getTimeAgo(latestTicket.updated_at || latestTicket.created_at)}
                          </Text>
                      </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.viewMoreContainer}
                  onPress={() => navigation.navigate('AllTicketsScreen',{ticketdata:data})} 
                >
                  <Text style={styles.viewMoreText}>View all conversations</Text>
                  <Icon name="arrow-right" size={hp(1.8)} color="#64748b" style={{marginLeft: 4}} />
                </TouchableOpacity>
              </>
            ) : (
               <View style={styles.emptyStateCard}>
                  <Text style={styles.emptyStateText}>No active conversations found.</Text>
               </View>
            )}
          </View>

          <View style={styles.contentSection}>
            <SectionHeader title="Frequently Asked Questions" icon="help-circle-outline" />
            
            <View style={styles.accordionGroup}>
               {isLoadingFAQ ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#2563eb" />
                  </View>
               ) : (
                  FAQ_DATA?.map((item) => {     
                    const isExpanded = expandedId === item.id;
                    return (
                        <View key={item.id} style={[styles.accordionItem, isExpanded && styles.accordionItemActive]}>
                            <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
                                <View style={[styles.iconBubble, { backgroundColor: isExpanded ? (item.color || '#e0e7ff') : '#f1f5f9' }]}>
                                    {item.image_url ? (
                                        <Image source={{ uri: item.image_url }} style={styles.faqImage} resizeMode="contain" />
                                    ) : (
                                        <Icon name="help" size={hp(2.5)} color={isExpanded ? '#fff' : (item.color || '#64748b')} />
                                    )}
                                </View>
                                <View style={styles.accordionTextContainer}>
                                    <Text style={[styles.questionText, isExpanded && styles.questionTextActive]}>{item?.question}</Text>
                                </View>
                                <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={hp(3)} color={isExpanded ? (item.color || '#2563eb') : "#94a3b8"} />
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.accordionBody}>
                                    <View style={styles.separator} />
                                    <Text style={styles.answerText}>{item?.answer}</Text>
                                    <TouchableOpacity style={styles.contactLink} onPress={() => navigation.navigate('ChatScreen')}>
                                        <Text style={styles.contactLinkText}>Did this help? </Text>
                                        <Text style={[styles.contactLinkText, {color: '#2563eb'}]}>Contact Us</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                }))}
            </View>
          </View>

        </ScrollView>
      </View>

      {/* RENDER NEW STANDALONE MODAL */}
      <TicketModal
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        ticket={selectedTicket}
        onReplySuccess={() => dispatch(fetchTicketChat({ticketId: selectedTicket?.ticket_id}))} 
      />

    </View>
  );
};

const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
        <Icon name={icon} size={hp(2.25)} color="#64748b" style={{ marginRight: wp(2) }} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
  screenWrap: { flex: 1, backgroundColor: '#f8fafc' },
  safe: { flex: 1, zIndex: 2 },
  backgroundLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden', opacity: 0.5 },
  fixedHeaderWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, elevation: 10, backgroundColor: '#F8F9FD' },
  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(3.75) },
  headerContainer: { paddingHorizontal: Platform.OS === 'ios' ? 0 : wp(4), marginBottom: hp(3), marginTop: hp(2) },
  contentSection: { paddingHorizontal: wp(5), marginBottom: hp(3), marginTop: hp(1.25) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5), marginLeft: wp(1) },
  sectionTitle: { fontSize: hp(1.55), fontFamily: 'Montserrat-Bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  ticketCard: { backgroundColor: '#fff', borderRadius: wp(4), borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#64748b', shadowOffset: { width: 0, height: hp(0.5) }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  ticketInner: { padding: wp(4.5) }, 
  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(1.5) }, 
  ticketIdBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: wp(2), paddingVertical: hp(0.5), borderRadius: wp(1.5) },
  ticketId: { fontSize: hp(1.3), color: '#64748b', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: '600', marginLeft: wp(1) },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(2.5), paddingVertical: hp(0.5), borderRadius: wp(3) },
  statusDot: { width: wp(1.5), height: wp(1.5), borderRadius: wp(0.75), marginRight: wp(1.25) },
  statusText: { fontSize: hp(1.3), fontFamily: 'Montserrat-Bold' },
  ticketContent: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) },
  ticketIconBox: { width: wp(11), height: wp(11), borderRadius: wp(3), backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center', marginRight: wp(3.5) },
  ticketLabel: { fontSize: hp(1.6), color: '#334155', fontFamily: 'Montserrat-Bold', textTransform: 'capitalize' },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: hp(1) },
  timeText: { fontSize: hp(1.3), color: '#94a3b8', fontFamily: 'Montserrat-Regular' },
  viewMoreContainer: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: hp(1.5), paddingVertical: hp(0.5) },
  viewMoreText: { fontSize: hp(1.5), color: '#64748b', fontFamily: 'Montserrat-SemiBold' },
  emptyStateCard: { padding: hp(3), backgroundColor: '#fff', borderRadius: wp(4), alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyStateText: { fontSize: hp(1.6), color: '#94a3b8', fontFamily: 'Montserrat-Medium' },
  accordionGroup: { gap: hp(1.75) },
  accordionItem: { backgroundColor: '#fff', borderRadius: wp(4), borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: hp(0.25) }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, overflow: 'hidden' },
  accordionItemActive: { borderColor: '#dbeafe', backgroundColor: '#fff' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: wp(4) },
  iconBubble: { width: wp(11), height: wp(11), borderRadius: wp(3.5), alignItems: 'center', justifyContent: 'center', marginRight: wp(3.5) },
  faqImage: { width: hp(2.5), height: hp(2.5) },
  accordionTextContainer: { flex: 1, justifyContent: 'center', paddingRight: wp(2) },
  questionText: { fontSize: hp(1.45), fontFamily: 'Montserrat-Bold', color: '#495668ff', lineHeight: hp(2.15) },
  questionTextActive: { color: '#0a0c10ff' },
  accordionBody: { paddingHorizontal: wp(4), paddingBottom: hp(2.5), paddingLeft: wp(18.5) },
  separator: { height: 1, backgroundColor: '#f1f5f9', marginBottom: hp(1.5), width: '100%' },
  answerText: { fontSize: hp(1.4), color: '#7b839cff', lineHeight: hp(2), fontFamily: 'Montserrat-Medium', marginBottom: hp(1.25) },
  contactLink: { flexDirection: 'row', alignItems: 'center' },
  contactLinkText: { fontSize: hp(1.4), fontFamily: 'Montserrat-Bold', color: '#94a3b8' },
  fixedFooterWrap: { position: 'absolute', left: 0, right: 0, bottom: BOTTOM_TAB_HEIGHT + hp(3.7), alignItems: 'center', zIndex: 0 },
  fixedFooterText: { fontSize: hp(7.5), fontFamily: 'Montserrat-Bold', color: 'rgba(15,17,32,0.06)', textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center' },
  loadingContainer: { paddingVertical: hp(3), alignItems: 'center', justifyContent: 'center' },
});

export default Help;