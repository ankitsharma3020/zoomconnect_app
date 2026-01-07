import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient'; 
import DependantModal from '../component/Adddependentmodal';
import { wp, hp } from '../utilites/Dimension'; // Ensure hp is imported

const { width, height } = Dimensions.get('window');

// Mock Data
const DEPENDANTS_DATA = [
  {
    id: 1,
    name: 'Arav Kumar',
    relation: 'Child',
    gender: 'Male',
    dob: '2024-10-30',
    status: 'Pending',
    avatarUrl: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg', 
  },
  {
    id: 2,
    name: 'Priya Sharma',
    relation: 'Spouse',
    gender: 'Female',
    dob: '1995-05-15',
    status: 'Approved',
    avatarUrl: 'https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg',
  },
];

const NaturaAddition = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <BackgroundBubbles />

      {/* --- 1. Header --- */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
        >
            <Icon name="arrow-left" size={hp(3)} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dependants</Text>
        <View style={{ width: wp(10) }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- 2. 3D Gradient Banner --- */}
        <View style={styles.bannerContainer}>
            <LinearGradient 
                colors={['#894c87ff', '#e235dcff']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 1}}
                style={styles.bannerCard}
            >
              <View style={styles.bannerCard1}>
                 <View style={styles.bannerGloss} />
                
                <View style={styles.bannerContent}>
                    <View style={styles.bannerTextContainer}>
                        <View style={styles.bannerBadge}>
                            <Icon name="shield-check" size={hp(1.5)} color="#fff" style={{marginRight: wp(1)}} />
                            <Text style={styles.bannerBadgeText}>Secure Family</Text>
                        </View>
                        <Text style={styles.bannerTitle}>Protect Your Loved Ones</Text>
                        <Text style={styles.bannerDesc}>
                        Add your spouse or child to your policy instantly. Complete coverage for the whole family.
                        </Text>
                    </View>
                    <Image 
                        source={require('./../../assets/family3d.png')} 
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>
              </View>
               
            </LinearGradient>
            <View style={styles.bannerShadow} />
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Dependants</Text>
            <View style={styles.countBadge}>
                <Text style={styles.countText}>{DEPENDANTS_DATA.length}</Text>
            </View>
        </View>

        {/* --- 3. Large Cards --- */}
        <View style={styles.cardList}>
          {DEPENDANTS_DATA.map((item) => (
            <DependantCard key={item.id} data={item} />
          ))}
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.addButton} 
            activeOpacity={0.9} 
            onPress={() => setModalVisible(true)}
        >
            <LinearGradient
                colors={['#894c87ff', '#d726d1ff']}
                style={styles.addButtonGradient}
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            >
              <View style={styles.addButtonGradient1}>
                  <Icon name="plus" size={hp(3.2)} color="#fff" style={{ marginRight: wp(2) }} />
                <Text style={styles.addButtonText}>Add New Dependant</Text>
              </View>
              
            </LinearGradient>
        </TouchableOpacity>
      </View>

      <DependantModal
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </SafeAreaView>
  );
};

const DependantCard = ({ data }) => {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient 
        colors={['#ffffff', '#f8fafc']} 
        style={styles.card3D}
      >
        <View style={styles.card3D1}>
            <View style={[
          styles.statusBadge, 
          { backgroundColor: data.status === 'Pending' ? '#fff7ed' : '#ecfdf5' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: data.status === 'Pending' ? '#d97706' : '#059669' }
          ]}>
            {data.status}
          </Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFrame}>
                <Image 
                    source={{ uri: data.avatarUrl }} 
                    style={styles.avatarImage}
                    resizeMode="cover"
                />
            </View>
          </View>

          <View style={styles.detailsColumn}>
            <Text style={styles.nameText}>{data.name}</Text>
            <View style={styles.divider} />

            <InfoRow label="Relation" value={data.relation} icon="account-heart" />
            <InfoRow label="Gender" value={data.gender} icon="gender-male-female" />
            <InfoRow label="DOB" value={data.dob} icon="calendar-month" />
            
            <TouchableOpacity style={styles.docButton}>
                <Text style={styles.docButtonText}>View Documents</Text>
                <Icon name="chevron-right" size={hp(2.2)} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>
        </View>
      
      </LinearGradient>
    </View>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={hp(2)} color="#94a3b8" style={{marginRight: wp(2)}} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const BackgroundBubbles = () => (
    <View style={styles.patternContainer} pointerEvents="none">
        <View style={styles.bubble1} />
        <View style={styles.bubble2} />
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // --- Header Styles ---
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(1),
    backgroundColor: '#f8fafc',
    zIndex: 10,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#0f172a',
  },

  // --- Banner Styles ---
  bannerContainer: {
    marginHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(3),
  },
  bannerCard: {
    borderRadius: wp(6),
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    zIndex: 2,
  },
   bannerCard1: {
    borderRadius: wp(6),
    padding: wp(6), 
    zIndex: 2,
  },
  bannerGloss: {
    position: 'absolute',
    top: -hp(7.5),
    right: -wp(15),
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bannerShadow: {
    position: 'absolute',
    top: hp(2.5),
    left: wp(4),
    right: wp(4),
    bottom: -hp(2),
    backgroundColor: '#4f46e5',
    borderRadius: wp(6),
    opacity: 0.25,
    zIndex: 1,
    transform: [{ scale: 0.95 }],
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: wp(4),
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    alignSelf: 'flex-start',
    marginBottom: hp(1.2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: hp(1.4),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: hp(2.5),
    fontWeight: '800',
    color: '#fff',
    marginBottom: hp(1),
  },
  bannerDesc: {
    fontSize: hp(1.6),
    color: '#e0f2fe',
    lineHeight: hp(2.4),
    fontWeight: '500',
  },
  bannerImage: {
    width: wp(28),
    height: hp(16),
    borderRadius: wp(4),
  },

  // --- Section Header ---
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: '700',
    color: '#1e293b',
    marginRight: wp(2.5),
  },
  countBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(3),
  },
  countText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: hp(1.5),
  },

  // --- Large Card Styles ---
  cardList: {
    paddingHorizontal: wp(5),
    gap: hp(2.5),
    paddingBottom: hp(15), // Space for footer
  },
  cardContainer: {
    borderRadius: wp(6),
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: hp(1.2) },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  card3D: {
    borderRadius: wp(6),
   

  },
  card3D1: {
    borderRadius: wp(6),
    padding: wp(5),
    borderWidth: 1,
    borderColor: '#fff',
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderBottomLeftRadius: wp(4),
    borderTopRightRadius: wp(6),
    zIndex: 1,
  },
  statusText: {
    fontSize: hp(1.4),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  cardContent: {
    flexDirection: 'row',
    marginTop: hp(1.2),
  },
  // Avatar Styles
  avatarContainer: {
    marginRight: wp(4),
    alignItems: 'center',
  },
  avatarFrame: {
    width: wp(22),
    height: hp(12),
    borderRadius: wp(4),
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  
  // Details Styles
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: hp(2.2),
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: hp(1),
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginBottom: hp(1.2),
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  infoLabel: {
    fontSize: hp(1.6),
    color: '#64748b',
    fontWeight: '500',
    width: wp(16),
  },
  infoValue: {
    fontSize: hp(1.75),
    fontWeight: '600',
    color: '#334155',
  },
  
  // Document Button
  docButton: {
    marginTop: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: wp(2.5),
    alignSelf: 'flex-start',
  },
  docButtonText: {
    fontSize: hp(1.6),
    fontWeight: '700',
    color: '#2563eb',
    marginRight: wp(1),
  },

  // --- Footer ---
  footer: {
    position: 'absolute',
    bottom: hp(4),
    alignSelf: 'center',
    width: '90%',
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: hp(1.2) },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  addButton: {
    borderRadius: wp(4.5),
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonGradient1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2), 
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp(2.1),
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // --- Background ---
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  bubble1: {
    position: 'absolute',
    top: -hp(10),
    left: -wp(20),
    width: wp(75),
    height: wp(75),
    borderRadius: wp(37.5),
    backgroundColor: '#e0f2fe',
    opacity: 0.6,
  },
  bubble2: {
    position: 'absolute',
    top: hp(50),
    right: -wp(20),
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: '#f1f5f9',
    borderWidth: wp(7.5),
    borderColor: '#e2e8f0',
    opacity: 0.4,
  },
});

export default NaturaAddition;