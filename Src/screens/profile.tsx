import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Dimensions, Image, Platform, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/service/userSlice';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path

const { width } = Dimensions.get('window');

// --- DUMMY DATA ---
const dummyProfile = {
  id: '12345',
  employees_code: 'EMP-001',
  email: 'hadijafari.official@gmail.com',
  mobile: '+91 98765 43210',
  full_name: 'Hadi Jafari',
  photo: 'https://i.pravatar.cc/300?img=12',
  designation: 'Product Designer',
  location: 'Madrid, Spain',
  dob: '1990-05-15',
  date_of_joining: '2018-08-01',
  comp_name: 'Tech Solutions Pvt. Ltd.',
};

// --- SVG Pattern Component ---
const ProfilePattern = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <Circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.2)" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dots)" />
      <Circle cx="0%" cy="0%" r="150" fill="rgba(255,255,255,0.1)" />
      <Circle cx="100%" cy="50%" r="100" fill="rgba(255,255,255,0.1)" />
    </Svg>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = dummyProfile; 
  const [loading, setLoading] = useState(false);
  const [showFullEmail, setShowFullEmail] = useState(false);
  
  // --- Editable State ---
  const [mobile, setMobile] = useState(user.mobile);
  const [photo, setPhoto] = useState(user.photo);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toggleShowFullEmail = () => {
    setShowFullEmail(!showFullEmail);
  };

  const handleEditPhoto = () => {
    console.log("Open Image Picker");
    // Implement Image Picker logic here
  };

  // --- ICONS ---
  const IdCardIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Path d="M16 2v4" />
      <Path d="M8 2v4" />
      <Path d="M3 10h18" />
    </Svg>
  );

  const PhoneIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );

  const CompanyIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 21h18" />
      <Path d="M5 21V7l8-4 8 4v14" />
      <Path d="M13 21v-9" />
    </Svg>
  );

  const CalendarIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Path d="M16 2v4" />
      <Path d="M8 2v4" />
      <Path d="M3 10h18" />
    </Svg>
  );

  const PrivacyIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );

  const ContactIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
  const LockIcon = ({ color = "#374151" }) => (
  <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

  const LogoutIcon = () => (
    <Svg width={wp(5)} height={wp(5)} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="M16 17l5-5-5-5" />
      <Path d="M21 12H9" />
    </Svg>
  );

  const ChevronRight = () => (
    <Svg width={wp(4)} height={wp(4)} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );

  return loading ? (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#F97316" />
    </View>
  ) : (
    <View style={styles.container}>
        
        {/* --- 1. BACKGROUND GRADIENT --- */}
        <LinearGradient
            colors={['#FFE8D6', '#FFF5EC', '#FFFFFF']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.8 }}
            style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* --- 2. HEADER --- */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image 
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png' }} 
                            style={styles.backIcon} 
                        />
                    </TouchableOpacity>
                    <Text style={styles.screenTitle}>Profile</Text>
                </View>

                {/* --- 3. MAIN PROFILE CARD --- */}
                <View style={styles.profileCard}>
                    
                    {/* Editable Avatar */}
                    <TouchableOpacity style={styles.avatarContainer} onPress={handleEditPhoto} activeOpacity={0.8}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.avatarImage} resizeMode="cover" />
                        ) : (
                            <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarInitials}>{user.full_name?.charAt(0)}</Text>
                            </View>
                        )}
                        {/* Camera Badge Overlay */}
                        <View style={styles.cameraBadge}>
                            <Svg width={wp(4)} height={wp(4)} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <Circle cx="12" cy="13" r="4" />
                            </Svg>
                        </View>
                    </TouchableOpacity>

                    {/* User Info */}
                    <Text style={styles.userName}>{user.full_name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userRole}>{user.designation}  •  {user.location}</Text>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Information Grid */}
                    <View style={styles.infoGrid}>
                        <InfoItem 
                            label="Employee ID" 
                            value={user.employees_code} 
                            Icon={IdCardIcon}
                        />
                        
                        {/* Editable Mobile Number */}
                        <InfoItem 
                            label="Mobile" 
                            value={mobile} 
                            Icon={PhoneIcon}
                            isEditable={true}
                            onChangeText={(text) => setMobile(text)}
                        />

                        <InfoItem 
                            label="Company" 
                            value={user.comp_name} 
                            Icon={CompanyIcon}
                        />
                        <InfoItem 
                            label="Joined" 
                            value={formatDate(user.date_of_joining)} 
                            Icon={CalendarIcon} 
                        />
                    </View>

                </View>

                {/* --- 4. MENU ITEMS --- */}
                <View style={styles.menuContainer}>
                    
                    {/* Your Functional Items */}
                    {/* <MenuItem 
                        title="Privacy Policy" 
                        Icon={PrivacyIcon}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    /> */}
                    <MenuItem 
                        title="Contact Us" 
                        Icon={ContactIcon}
                        onPress={() => navigation.navigate('Contactus')}
                    />
                        <MenuItem 
                        title="Reset Password" 
                        Icon={LockIcon}
                        onPress={() => navigation.navigate('ResetPassword')}
                    />
                    <MenuItem 
                        title="Logout" 
                        Icon={LogoutIcon}
                        onPress={() => dispatch(setUser(false))}
                        isLast
                        isDestructive
                        showArrow={false}
                    />

                </View>

                {/* --- 5. FOOTER LINKS (Text Only) --- */}
                <View style={styles.footerLinksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('About')}>
                        <Text style={styles.footerLinkText}>About Us</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerSeparator}>|</Text>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('TermsOfUse')}>
                        <Text style={styles.footerLinkText}>Terms of Use</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerSeparator}>|</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={styles.footerLinkText}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    </View>
  );
};

// --- Helper Components ---

const InfoItem = ({ label, value, Icon, isEditable, onChangeText }) => (
    <View style={styles.infoRow}>
        <View style={styles.iconBox}>
            <Icon />
        </View>
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isEditable ? (
                <TextInput 
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.infoValueInput}
                    keyboardType="phone-pad"
                />
            ) : (
                <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
            )}
        </View>
        {isEditable && (
             <Svg width={wp(4)} height={wp(4)} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: wp(2), opacity: 0.7}}>
                <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
             </Svg>
        )}
    </View>
);

const MenuItem = ({ title, Icon, onPress, isLast, isDestructive, showArrow = true }) => (
    <TouchableOpacity 
        style={[styles.menuItem, isLast && styles.menuItemLast]} 
        onPress={onPress} 
        activeOpacity={0.7}
    >
        <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, isDestructive && { backgroundColor: '#FEE2E2' }]}>
                <Icon stroke={isDestructive ? '#EF4444' : '#374151'} />
            </View>
            <Text style={[styles.menuText, isDestructive && styles.destructiveText]}>{title}</Text>
        </View>
        {showArrow && (
            <Svg width={wp(4)} height={wp(4)} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.3}}>
                <Path d="M9 18l6-6-6-6" />
            </Svg>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(5), // approx 40
  },

  // --- Header ---
  headerContainer: {
    paddingHorizontal: wp(6), // approx 24
    paddingTop: Platform.OS === 'android' ? hp(5) : hp(2.5), // approx 40/20
    marginBottom: hp(2.5), // approx 20
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  backButton: {
    width: wp(10), // approx 40
    height: wp(10),
    borderRadius: wp(5), // approx 20
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2), // approx 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'absolute',
    left: wp(6), // approx 24
    top: Platform.OS === 'android' ? hp(5) : hp(2.5), // approx 40/20
    zIndex: 10,
  },
  backIcon: {
    width: wp(4.5), // approx 18
    height: wp(4.5),
    tintColor: '#1F2937',
  },
  screenTitle: {
    fontSize: hp(2.5), // approx 28
    fontFamily: 'Montserrat-Bold', // Font
    color: '#111827', 
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },

  // --- Profile Card ---
  profileCard: {
    marginHorizontal: wp(5), // approx 20
    backgroundColor: '#FFFFFF',
    borderRadius: wp(8), // approx 32
    paddingVertical: hp(4), // approx 32
    paddingHorizontal: wp(5), // approx 20
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(1.25) },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: hp(3), // approx 24
  },
  avatarContainer: {
    marginBottom: hp(2), // approx 16
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative', 
  },
  avatarImage: {
    width: wp(25), // approx 100
    height: wp(25),
    borderRadius: wp(12.5), // approx 50
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F97316',
    width: wp(8), // approx 32
    height: wp(8),
    borderRadius: wp(4), // approx 16
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    width: wp(4), // approx 16
    height: wp(4),
    tintColor: '#FFFFFF',
  },
  userName: {
    fontSize: hp(2.45), // approx 22
    fontFamily: 'Montserrat-Bold', // Font
    color: '#1F2937',
    marginBottom: hp(0.75), // approx 6
    textAlign: 'center',
  },
  userEmail: {
    fontSize: hp(1.55), // approx 14
    color: '#6B7280', 
    marginBottom: hp(0.75), // approx 6
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular' // Font
  },
  userRole: {
    fontSize: hp(1.5), // approx 13
    color: '#9CA3AF', 
    marginBottom: hp(3), // approx 24
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold', // Font
  },
  
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: hp(2.5), // approx 20
  },

  // --- Info Grid ---
  infoGrid: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2), // approx 16
    padding: wp(2.5), // approx 10
    borderRadius: wp(3), // approx 12
  },
  iconBox: {
    width: wp(10), // approx 40
    height: wp(10),
    borderRadius: wp(2.5), // approx 10
    backgroundColor: '#FFF7ED', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3), // approx 12
  },
  smallIcon: {
    width: wp(5), // approx 20
    height: wp(5),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: hp(1.3), // approx 11
    color: '#9CA3AF',
    fontFamily: 'Montserrat-SemiBold', // Font
    marginBottom: hp(0.25), // approx 2
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: hp(1.6), // approx 15
    color: '#374151',
    fontFamily: 'Montserrat-SemiBold', // Font
  },
  infoValueInput: {
    fontSize: hp(1.9), // approx 15
    color: '#374151',
    fontFamily: 'Montserrat-SemiBold', // Font
    padding: 0, 
    margin: 0,
  },
  editIconSmall: {
    width: wp(4), // approx 16
    height: wp(4),
    tintColor: '#F97316',
    marginLeft: wp(2), // approx 8
    opacity: 0.7,
  },

  // --- Menu Items ---
  menuContainer: {
    paddingHorizontal: wp(5), // approx 20
    gap: hp(1.5), // approx 12
    marginBottom: hp(3.75), // approx 30
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp(2.25), // approx 18
    paddingHorizontal: wp(5), // approx 20
    borderRadius: wp(5), // approx 20
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: hp(1.5), // approx 12
  },
  menuItemLast: {
    marginBottom: hp(5), // approx 40
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: wp(10), // approx 40
    height: wp(10),
    borderRadius: wp(5), // approx 20
    backgroundColor: '#F3F4F6', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4), // approx 16
  },
  menuIcon: {
    width: wp(5), // approx 20
    height: wp(5),
    tintColor: '#374151',
  },
  menuText: {
    fontSize: hp(1.8), // approx 16
    fontFamily: 'Montserrat-SemiBold', // Font
    color: '#1F2937',
  },
  destructiveText: {
    color: '#EF4444',
  },
  chevronIcon: {
    width: wp(4), // approx 16
    height: wp(4),
    opacity: 0.3,
    transform: [{ rotate: '-90deg' }] 
  },

  // --- Footer Links ---
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(5), // approx 40
  },
  footerLinkText: {
    fontSize: hp(1.6), // approx 13
    fontFamily: 'Montserrat-SemiBold', // Font
    color: '#6B7280', 
    textDecorationLine: 'underline', 
  },
  footerSeparator: {
    fontSize: hp(1.6), // approx 13
    color: '#D1D5DB', 
    marginHorizontal: wp(3), // approx 12
  },
});
export default ProfileScreen;