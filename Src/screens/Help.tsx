import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path

// --- Import your custom headers ---
import Header from '../component/header'; 
import ActivePolicyHeader from '../component/activpolicy';

const { width } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = hp(10); // approx 80

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Mock Data ---
const FAQ_DATA = [
  {
    id: 1,
    category: 'POLICY',
    question: 'How do I add a new dependant to my existing policy?',
    answer: 'Navigate to the Home screen and click on the "Add Dependant" tile. You will need to upload a valid marriage certificate or birth certificate to complete the process.',
    icon: 'account-plus',
    color: '#2563eb', // Royal Blue
  },
  {
    id: 2,
    category: 'CLAIMS',
    question: 'Why was my reimbursement claim rejected?',
    answer: 'Claims are typically rejected due to insufficient documentation or non-covered ailments. Please check your registered email for the detailed rejection letter.',
    icon: 'file-alert-outline', // CHANGED ICON
    color: '#ea580c', // Orange
  },
  {
    id: 3,
    category: 'E-CARD',
    question: 'Where can I download my E-Card for hospitalization?',
    answer: 'Go to the "My Policy" tab, select "View Details", and click on "Download E-Card". It is available in PDF format and is valid for cashless hospitalization.',
    icon: 'card-account-details',
    color: '#7c3aed', // Violet
  },
  {
    id: 4,
    category: 'PAYMENT',
    question: 'Money was deducted but my policy is still inactive.',
    answer: 'This usually happens due to a banking server delay. If the status does not change within 24 hours, please raise a ticket with your Transaction ID.',
    icon: 'credit-card-clock',
    color: '#dc2626', // Red
  },
];

const Help = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.screenWrap}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Background Pattern */}
      <View style={styles.backgroundLayer} pointerEvents="none">
        <LinearGradient
          colors={['#f8fafc', '#f1f5f9']}
          style={StyleSheet.absoluteFill}
        />
        <BackgroundPattern text="HELP" />
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.fixedHeaderWrapper}>
          <Header />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <ActivePolicyHeader
              title="Help Center"
              subtitle="Find answers or contact support."
              onBack={() => navigation?.goBack?.()}
              illustration={require('../../assets/policies.png')} 
            />
          </View>

          {/* Active Ticket Section */}
          <View style={styles.contentSection}>
            <SectionHeader title="Active Conversations" icon="message-text-clock-outline" />
            
            <TouchableOpacity 
              style={styles.ticketCard} 
              activeOpacity={0.95}
              onPress={() => navigation.navigate('ChatScreen')} // Added Navigation
            >
               <View style={styles.ticketInner}>
                  <View style={styles.ticketTop}>
                    <View style={styles.ticketIdBadge}>
                        <Icon name="pound" size={hp(1.75)} color="#64748b" />
                        <Text style={styles.ticketId}>2235619387</Text>
                    </View>
                    <View style={styles.statusPill}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>In Progress</Text>
                    </View>
                  </View>

                  <View style={styles.ticketContent}>
                      <View style={styles.ticketIconBox}>
                          <Icon name="alert-box-outline" size={hp(3)} color="#ea580c" />
                      </View>
                      <View style={{flex: 1}}>
                          <Text style={styles.ticketLabel}>Issue: Policy Document</Text>
                          <Text style={styles.ticketTitle}>I did not receive my policy PDF</Text>
                      </View>
                  </View>

                  <View style={styles.ticketFooter}>
                      <Text style={styles.timeText}>Last reply: 10 mins ago</Text>
                      <View style={styles.linkRow}>
                          <Text style={styles.linkText}>Open Chat</Text>
                          <Icon name="chevron-right" size={hp(2.25)} color="#2563eb" />
                      </View>
                  </View>
               </View>
            </TouchableOpacity>
          </View>

          {/* FAQ Section - UPDATED UI */}
          <View style={styles.contentSection}>
            <SectionHeader title="Frequently Asked Questions" icon="help-circle-outline" />
            
            <View style={styles.accordionGroup}>
                {FAQ_DATA.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                        <View key={item.id} style={[styles.accordionItem, isExpanded && styles.accordionItemActive]}>
                            <TouchableOpacity 
                                style={styles.accordionHeader} 
                                onPress={() => toggleExpand(item.id)}
                                activeOpacity={0.8}
                            >
                                {/* Left Icon - Always Visible */}
                                <View style={[styles.iconBubble, { backgroundColor: isExpanded ? item.color : '#f1f5f9' }]}>
                                    <Icon 
                                      name={item.icon} 
                                      size={hp(3)} 
                                      color={isExpanded ? '#fff' : item.color} 
                                    />
                                </View>
                                
                                {/* Question Title */}
                                <View style={styles.accordionTextContainer}>
                                    <Text style={styles.categoryText}>{item.category}</Text>
                                    <Text style={[styles.questionText, isExpanded && styles.questionTextActive]}>
                                        {item.question}
                                    </Text>
                                </View>

                                {/* Chevron */}
                                <Icon 
                                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                                    size={hp(3)} 
                                    color={isExpanded ? item.color : "#94a3b8"} 
                                />
                            </TouchableOpacity>

                            {/* Expanded Answer - Large Font */}
                            {isExpanded && (
                                <View style={styles.accordionBody}>
                                    <View style={styles.separator} />
                                    <Text style={styles.answerText}>{item.answer}</Text>
                                    
                                    <TouchableOpacity style={styles.contactLink} onPress={() => navigation.navigate('ChatScreen')}>
                                        <Text style={styles.contactLinkText}>Did this help? </Text>
                                        <Text style={[styles.contactLinkText, {color: '#2563eb'}]}>Contact Us</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// --- Helper Components ---

const SectionHeader = ({ title, icon }) => (
    <View style={styles.sectionHeader}>
        <Icon name={icon} size={hp(2.25)} color="#64748b" style={{ marginRight: wp(2) }} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const BackgroundPattern = ({ text }) => {
    return (
        <View style={styles.patternContainer}>
            {[...Array(20)].map((_, i) => (
                <View key={i} style={[styles.patternRow, { marginLeft: i % 2 === 0 ? 0 : -wp(12.5) }]}>
                    <Text style={styles.patternText}>
                        {text}    {text}    {text}    {text}    {text}    {text}
                    </Text>
                </View>
            ))}
        </View>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
  screenWrap: { flex: 1, backgroundColor: '#f8fafc' },
  safe: { flex: 1, zIndex: 2 },
  
  // Background
  backgroundLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden', opacity: 0.5 },
  patternContainer: { flex: 1, transform: [{ rotate: '-20deg' }, { scale: 1.5 }], justifyContent: 'center' },
  patternRow: { flexDirection: 'row', marginBottom: hp(3.75) }, // approx 30
  patternText: { 
    fontSize: hp(2.5), // approx 20
    fontFamily: 'Montserrat-Bold', // Font (using Bold/Black if available for pattern)
    fontWeight: '900', 
    color: '#e2e8f0', 
    marginRight: wp(10) // approx 40
  },

  fixedHeaderWrapper: { zIndex: 10 },
  scrollContent: { paddingBottom: BOTTOM_TAB_HEIGHT + hp(3.75) }, // approx 30
  headerContainer: { paddingHorizontal: wp(4), marginBottom: hp(1.25) }, // approx 16, 10
  contentSection: { paddingHorizontal: wp(5), marginBottom: hp(3), marginTop: hp(1.25) }, // approx 20, 25

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5), marginLeft: wp(1) }, // approx 12, 4
  sectionTitle: { 
    fontSize: hp(1.55), // approx 14
    fontFamily: 'Montserrat-Bold', // Font
    color: '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: 0.6 
  },

  // Active Ticket
  ticketCard: { 
    backgroundColor: '#fff', 
    borderRadius: wp(4), // approx 16
    borderWidth: 1, 
    borderColor: '#f1f5f9', 
    shadowColor: '#64748b', 
    shadowOffset: { width: 0, height: hp(0.5) }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    elevation: 4 
  },
  ticketInner: { padding: wp(4.5) }, // approx 18
  ticketTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(1.5) }, // approx 12
  ticketIdBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: wp(2), // approx 8
    paddingVertical: hp(0.5), // approx 4
    borderRadius: wp(1.5) // approx 6
  },
  ticketId: { 
    fontSize: hp(1.3), // approx 12
    color: '#64748b', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    fontWeight: '600',
    marginLeft: wp(1) // approx 4
  },
  statusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f0fdf4', 
    paddingHorizontal: wp(2.5), // approx 10
    paddingVertical: hp(0.5), // approx 4
    borderRadius: wp(3) // approx 12
  },
  statusDot: { width: wp(1.5), height: wp(1.5), borderRadius: wp(0.75), backgroundColor: '#22c55e', marginRight: wp(1.25) },
  statusText: { fontSize: hp(1.3), fontFamily: 'Montserrat-Bold', color: '#16a34a' },
  ticketContent: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(2) }, // approx 16
  ticketIconBox: { 
    width: wp(11), // approx 44
    height: wp(11), 
    borderRadius: wp(3), // approx 12
    backgroundColor: '#ffedd5', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: wp(3.5) // approx 14
  },
  ticketLabel: { 
    fontSize: hp(1.2), // approx 11
    color: '#94a3b8', 
    fontFamily: 'Montserrat-Bold', // Font
    textTransform: 'uppercase' 
  },
  ticketTitle: { 
    fontSize: hp(1.5), // approx 15
    fontFamily: 'Montserrat-Bold', // Font
    color: '#334155' 
  },
  ticketFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    paddingTop: hp(1) // approx 12
  },
  timeText: { 
    fontSize: hp(1.3), // approx 12
    color: '#94a3b8',
    fontFamily: 'Montserrat-Regular' // Font
  },
  linkRow: { flexDirection: 'row', alignItems: 'center' },
  linkText: { 
    fontSize: hp(1.5), // approx 13
    fontFamily: 'Montserrat-Bold', // Font
    color: '#2563eb', 
    marginRight: wp(0.5) // approx 2
  },

  // --- UPDATED FAQ STYLES ---
  accordionGroup: { gap: hp(1.75) }, // approx 14
  accordionItem: {
      backgroundColor: '#fff',
      borderRadius: wp(4), // approx 16
      borderWidth: 1,
      borderColor: '#f1f5f9',
      // Deeper shadow for card effect
      shadowColor: '#000',
      shadowOffset: { width: 0, height: hp(0.25) },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
      overflow: 'hidden',
  },
  accordionItemActive: {
      borderColor: '#dbeafe', 
      backgroundColor: '#fff',
  },
  accordionHeader: {
      flexDirection: 'row',
      alignItems: 'center', 
      padding: wp(4), // approx 16
  },
  iconBubble: {
      width: wp(11), // approx 44
      height: wp(11),
      borderRadius: wp(3.5), // approx 14
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: wp(3.5), // approx 14
  },
  accordionTextContainer: { flex: 1, justifyContent: 'center' },
  categoryText: {
      fontSize: hp(1.25), // approx 10
      fontFamily: 'Montserrat-Bold', // Font
      color: '#94a3b8',
      marginBottom: hp(0.5), // approx 4
      letterSpacing: 0.5,
      textTransform: 'uppercase',
  },
  questionText: {
      fontSize: hp(1.45), // approx 14
      fontFamily: 'Montserrat-Bold', // Font
      color: '#495668ff',
      lineHeight: hp(2.15), // approx 22
  },
  questionTextActive: {
      color: '#0a0c10ff',
  },

  // Expanded Body
  accordionBody: {
      paddingHorizontal: wp(4), // approx 16
      paddingBottom: hp(2.5), // approx 20
      paddingLeft: wp(18.5), // approx 74 (indent to align with text)
  },
  separator: {
      height: 1,
      backgroundColor: '#f1f5f9',
      marginBottom: hp(1.5), // approx 12
      width: '100%',
  },
  answerText: {
      fontSize: hp(1.4), // approx 15
      color: '#7b839cff',
      lineHeight: hp(2), // approx 24
      fontFamily: 'Montserrat-Medium', // Font
      marginBottom: hp(1.25), // approx 10
  },
  contactLink: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  contactLinkText: {
      fontSize: hp(1.4), // approx 13
      fontFamily: 'Montserrat-Bold', // Font
      color: '#94a3b8',
  },
});
export default Help;