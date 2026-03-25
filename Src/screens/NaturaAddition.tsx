import React, { useEffect, useState } from 'react';
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
import { wp, hp } from '../utilites/Dimension'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchDependence } from './Epicfiles/MainEpic';

const { width, height } = Dimensions.get('window');

// --- HELPER FUNCTIONS ---

// 1. Calculate Age from DOB
const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// 2. Get Avatar based on Logic
const getSmartAvatar = (relation, gender, dob) => {
  const age = calculateAge(dob);
  const rel = relation ? relation.toLowerCase() : '';
  const gen = gender ? gender.toLowerCase() : '';

  // --- CHILD LOGIC ---
  if (rel.includes('child') || rel.includes('son') || rel.includes('daughter') || rel.includes('baby')) {
    if (age < 3) {
      return require('./../../assets/baby.png');
    } else {
      if (gen === 'male' || gen === 'm') {
        return require('./../../assets/boy.png'); 
      } else {
        return require('./../../assets/girl.png'); 
      }
    }
  }

  // --- ADULT MALE LOGIC ---
  if (gen === 'male' || gen === 'm') {
    if (age > 40) {
      return require('./../../assets/oldman.png');
    } else {
      return require('./../../assets/man.png');
    }
  }

  // --- ADULT FEMALE LOGIC ---
  if (gen === 'female' || gen === 'f') {
    if (age > 40) {
      return require('./../../assets/oldlady.png');
    } else {
      return require('./../../assets/women.png');
    }
  }

  return require('./../../assets/man.png'); 
};

// 3. Get Status Configuration (0, 1, 2)
const getStatusConfig = (statusCode) => {
  const code = parseInt(statusCode);

  switch (code) {
    case 0:
      return {
        text: 'Pending',
        textColor: '#d97706',
        bgColor: '#fff7ed',   
        borderColor: '#f59e0b' 
      };
    case 1:
    return {
        text: 'Approved',
        textColor: '#059669', 
        bgColor: '#ecfdf5',   
        borderColor: '#10b981' 
      };
    case 2:
      return {
        text: 'Rejected',
        textColor: '#dc2626', 
        bgColor: '#fef2f2',   
        borderColor: '#ef4444' 
      };
    default:
      return {
        text: 'Unknown',
        textColor: '#64748b',
        bgColor: '#f1f5f9',
        borderColor: '#cbd5e1'
      };
  }
};

const NaturaAddition = ({ navigation,route }) => {
  const [isEdit,setIsedit]=useState(false); 
  const {policyid}=route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [editableData,setEditableData]=useState(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(fetchDependence({policyid:policyid}));
  }, []);
const Edit=(data)=>{ 
  setIsedit(true);
  setEditableData(data);
  setModalVisible(true);
 }
 const Add=()=>{ 
  setIsedit(false);
 
  setModalVisible(true);
 }
 // Debug log to check state before opening modal
  const {data} = useSelector(state => state.dependence);
  const listData = Array.isArray(data) ? data : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <BackgroundBubbles />

      {/* --- Header --- */}
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
        
        {/* --- Banner --- */}
        <View style={styles.bannerContainer}>
            <LinearGradient 
                colors={['#885787ff', '#c55cc2ff']} 
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
                        Add your spouse or child to your policy instantly.
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
                <Text style={styles.countText}>{listData.length}</Text>
            </View>
        </View>

        {/* --- List --- */}
        <View style={styles.cardList}>
          {listData.map((item, index) => (
            <DependantCard key={item.id || index} data={item} openModal={Edit}  />
          ))}
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.addButton} 
            activeOpacity={0.9} 
            onPress={() => Add()}
        >
            <LinearGradient
                colors={['#885787ff', '#c55cc2ff']}
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
        data={isEdit ?editableData : null}
        policyId={policyid}
        onClose={() => setModalVisible(false)} 
      />
    </SafeAreaView>
  );
};

// --- Pattern for inside the Dependant Card ---
const CardBubblePattern = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{
      position: 'absolute',
      top: hp(15),
      right: -wp(15),
      width: wp(25),
      height: wp(25),
      borderRadius: wp(17.5),
      backgroundColor: '#fff2fe', 
      opacity: 0.6,
      borderWidth: 15,
      borderColor: '#ffecfb',
    }} />
    
    <View style={{
      position: 'absolute',
      bottom: -hp(2),
      left: -wp(5),
      width: wp(20),
      height: wp(20),
      borderRadius: wp(10),
      backgroundColor: '#fff2fe', 
      borderWidth: 10,
      borderColor: '#ffecfb',
      opacity: 0.5,
    }} />
  </View>
);

const DependantCard = ({ data ,openModal}) => {
  const statusConfig = getStatusConfig(data.status);
  const avatarSource = getSmartAvatar(data.relation, data.gender, data.dob);
  const age = calculateAge(data.dob);

  return (
    <View style={styles.cardContainer}>
      <LinearGradient 
        colors={['#ffffff', '#f8fafc']} 
        style={styles.card3D}
      >
        <View style={styles.card3D1}>
          
          <CardBubblePattern />
          
          <View style={[
            styles.statusBadge, 
            { backgroundColor: statusConfig.bgColor, borderColor: statusConfig.borderColor }
          ]}>
            <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
              {statusConfig.text}
            </Text>
          </View>

          <View style={styles.cardContent}>
            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarFrame}>
                  <Image 
                      source={ avatarSource } 
                      style={styles.avatarImage}
                      resizeMode="cover"
                  />
              </View>
              <Text style={styles.ageTag}>{age} Yrs</Text>
            </View>

            {/* Details Section */}
            <View style={styles.detailsColumn}>
              <Text style={styles.nameText}>{data.insured_name}</Text>
              <View style={styles.divider} />

              <InfoRow label="Relation" value={data.relation} icon="account-heart" />
              <InfoRow label="Gender" value={data.gender} icon="gender-male-female" />
              <InfoRow label="DOB" value={data.dob} icon="calendar-month" />
              
              {/* --- ACTION BUTTONS ROW --- */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.docButton}>
                    <Icon name="file-document-outline" size={hp(2)} color="#2563eb" style={{marginRight: wp(1)}}/>
                    <Text style={styles.docButtonText}>View Docs</Text>
                </TouchableOpacity>
              {(data.status === "2")&& (
                <TouchableOpacity style={styles.editButton}
                 onPress={() => openModal(data)}
                >
                    <Icon name="pencil-outline" size={hp(2)} color="#934790" style={{marginRight: wp(1)}}/>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
               
              </View>

              {/* --- REASON TEXT (Shows if there is a reason/remark) --- */}
              {/* Replace `data.reason` with your API's actual key (e.g., `data.remark` or `data.rejection_reason`) */}
              {(data.reason || data.status === 2 || data.status === "2") && (
                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Reason:</Text>
                  <Text style={styles.reasonText}>
                    {data.reason ? data.reason : "Invalid document attached. Please re-upload valid proof."}
                  </Text>
                </View>
              )}

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
    marginTop: StatusBar.currentHeight || 0,
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
    fontSize: hp(2.2),
    fontWeight: '800',
    color: '#fff',
    marginBottom: hp(1),
  },
  bannerDesc: {
    fontSize: hp(1.4),
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
    fontSize: hp(2.1),
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
    paddingBottom: hp(15), 
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
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden', 
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderBottomLeftRadius: wp(4),
    zIndex: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  statusText: {
    fontSize: hp(1.2),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    marginTop: hp(2.5), 
    paddingLeft: wp(2),
    paddingBottom: wp(2),
  },
  avatarContainer: {
    marginRight: wp(4),
    alignItems: 'center',
  },
  avatarFrame: {
    width: wp(19),
    height: hp(10),
    borderRadius: wp(10),
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
  ageTag: {
    marginTop: hp(1),
    fontSize: hp(1.3),
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: hp(2.0),
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
    fontSize: hp(1.3),
    color: '#64748b',
    fontWeight: '500',
    width: wp(16),
  },
  infoValue: {
    fontSize: hp(1.4),
    fontWeight: '600',
    color: '#334155',
  },
  
  // --- New Action Row Buttons ---
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.5),
    flexWrap: 'wrap', // Prevents overflow on smaller devices
  },
  docButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff', // Light Blue
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(2.5),
    marginRight: wp(2),
  },
  docButtonText: {
    fontSize: hp(1.3),
    fontWeight: '700',
    color: '#2563eb',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf4fd', // Light Brand Purple
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2.5),
  },
  editButtonText: {
    fontSize: hp(1.3),
    fontWeight: '700',
    color: '#934790',
  },

  // --- New Reason Text ---
  reasonContainer: {
    marginTop: hp(1.5),
    padding: wp(2.5),
    backgroundColor: '#fef2f2', // Light Red for emphasis
    borderRadius: wp(2),
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444', // Red border
  },
  reasonLabel: {
    fontSize: hp(1.3),
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: hp(0.3),
  },
  reasonText: {
    fontSize: hp(1.3),
    color: '#991b1b',
    lineHeight: hp(1.8),
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