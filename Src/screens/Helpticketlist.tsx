import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wp, hp } from '../utilites/Dimension'; 

// Import your custom header (Adjust path if needed)
import Header from '../component/header'; 
import { useSelector } from 'react-redux';

// --- Helper: Calculate Time Ago ---
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

const Helpticketlist = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get data from navigation params
  // Default to empty array if undefined
  // const { ticketdata } = route.params || { ticketdata: [] };
  const { data, isLoading } = useSelector((state) => state.tickets);
const ticketdata = data || [];
  console.log("Ticket Data Received:", data);

  const renderTicketItem = ({ item }) => {
    const isClosed = item.status === 'closed' || item.status === 'resolved';

    return (
      <TouchableOpacity 
        style={styles.ticketCard} 
        activeOpacity={0.95}
        onPress={() => navigation.navigate('ChatScreen', { ticketId: item.ticket_id })}
      >
        <View style={styles.ticketInner}>
          {/* Top Row: ID and Status */}
          <View style={styles.ticketTop}>
            <View style={styles.ticketIdBadge}>
              <Icon name="pound" size={hp(1.75)} color="#64748b" />
              <Text style={styles.ticketId}>{item.ticket_id}</Text>
            </View>
            
            <View style={[styles.statusPill, 
              { backgroundColor: isClosed ? '#f1f5f9' : '#f0fdf4' }
            ]}>
              <View style={[styles.statusDot, 
                { backgroundColor: isClosed ? '#64748b' : '#22c55e' }
              ]} />
              <Text style={[styles.statusText, 
                { color: isClosed ? '#64748b' : '#16a34a' }
              ]}>
                {item.status ? item.status.toUpperCase() : 'UNKNOWN'}
              </Text>
            </View>
          </View>

          {/* Middle Row: Icon and Details */}
          <View style={styles.ticketContent}>
            <View style={[styles.ticketIconBox, 
              { backgroundColor: isClosed ? '#f1f5f9' : '#ffedd5' } 
            ]}>
              <Icon 
                name={isClosed ? "check-circle-outline" : "alert-box-outline"} 
                size={hp(3)} 
                color={isClosed ? "#94a3b8" : "#ea580c"} 
              />
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
               {/* Displaying Status as the main label, similar to previous design */}
               <Text style={styles.ticketLabel}>Current Status</Text>
               <Text style={styles.ticketTitle}>{item.status}</Text>
            </View>
          </View>

          {/* Footer: Time and Link */}
          <View style={styles.ticketFooter}>
            <Text style={styles.timeText}>
              Last updated: {getTimeAgo(item.updated_at || item.created_at)}
            </Text>
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>View Chat</Text>
              <Icon name="chevron-right" size={hp(2.25)} color="#2563eb" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />
      
      {/* Header Implementation */}
      <View style={styles.headerWrapper}>
        <Header
          showBack={true} 
          onBack={() => navigation.goBack()} 
          title="Support Tickets" // Changed title to match context
        />
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={ticketdata}
          keyExtractor={(item) => item.ticket_id}
          renderItem={renderTicketItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <Icon name="ticket-confirmation-outline" size={hp(8)} color="#cbd5e1" />
               <Text style={styles.emptyText}>No tickets found.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Helpticketlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerWrapper: {
    backgroundColor: '#F8F9FD',
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(5),
  },

  // --- Ticket Card Styles ---
  ticketCard: { 
    backgroundColor: '#fff', 
    borderRadius: wp(4), 
    marginBottom: hp(2), // Spacing between cards
    borderWidth: 1, 
    borderColor: '#f1f5f9', 
    shadowColor: '#64748b', 
    shadowOffset: { width: 0, height: hp(0.5) }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    elevation: 3,
  },
  ticketInner: { 
    padding: wp(4.5), 
  }, 
  ticketTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp(1.5), 
  }, 
  ticketIdBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    paddingHorizontal: wp(2), 
    paddingVertical: hp(0.5), 
    borderRadius: wp(1.5), 
  },
  ticketId: { 
    fontSize: hp(1.3), 
    color: '#64748b', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    fontWeight: '600',
    marginLeft: wp(1), 
  },
  statusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: wp(2.5), 
    paddingVertical: hp(0.5), 
    borderRadius: wp(3), 
  },
  statusDot: { 
    width: wp(1.5), 
    height: wp(1.5), 
    borderRadius: wp(0.75), 
    marginRight: wp(1.25), 
  },
  statusText: { 
    fontSize: hp(1.3), 
    fontFamily: 'Montserrat-Bold', 
  },
  ticketContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: hp(2), 
  },
  ticketIconBox: { 
    width: wp(11), 
    height: wp(11), 
    borderRadius: wp(3), 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: wp(3.5), 
  },
  ticketLabel: { 
    fontSize: hp(1.2), 
    color: '#94a3b8', 
    fontFamily: 'Montserrat-Bold', 
    textTransform: 'uppercase', 
    marginBottom: 2,
  },
  ticketTitle: { 
    fontSize: hp(1.6), 
    fontFamily: 'Montserrat-Bold', 
    color: '#334155',
    textTransform: 'capitalize',
  },
  ticketFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    paddingTop: hp(1), 
  },
  timeText: { 
    fontSize: hp(1.3), 
    color: '#94a3b8',
    fontFamily: 'Montserrat-Regular', 
  },
  linkRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  linkText: { 
    fontSize: hp(1.5), 
    fontFamily: 'Montserrat-Bold', 
    color: '#2563eb', 
    marginRight: wp(0.5), 
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(10),
  },
  emptyText: {
    marginTop: hp(2),
    fontSize: hp(1.8),
    color: '#94a3b8',
    fontFamily: 'Montserrat-Medium',
  }
});