import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Platform,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { wp, hp } from '../utilites/Dimension';
import { 
  useLoginemailMutation, 
  useLoginmobileMutation, 
  useLoginemployeeMutation // Added this mutation
} from '../redux/service/user/user';
import { GetApi } from '../component/Apifunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../redux/service/userSlice';

const { height } = Dimensions.get('window');

// --- CONSTANTS ---
const START_HEIGHT = hp(45);
const END_HEIGHT = START_HEIGHT / 1.5;
const OVERLAP = hp(6);
const PILL_WIDTH = wp(75); 
const PILL_PADDING = wp(0.8);
const THUMB_WIDTH = (PILL_WIDTH - (PILL_PADDING * 2)) / 2;

const COLORS_DEF = {
  primary: '#934790',     
  primaryDark: '#6A2C66', 
  primaryLight: '#B565B0',
  secondary: '#FFE8D6',
  white: '#FFFFFF',
  bg: '#FDF8F5', 
  text: '#4A4A4A',
  placeholder: '#A0A0A0',
  inputBorder: '#EADDF2',
  inputBg: '#FAFAFC',
};

const Images = {
  gmail: require('../../assets/Google.png'),
  microsoft: require('../../assets/micosoft.png'),
};

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // API Mutations
  const [Emaillogin] = useLoginemailMutation();
  const [Mobilelogin] = useLoginmobileMutation();
  const [LoginEmployee] = useLoginemployeeMutation();
  
  // State
  const [loginMode, setLoginMode] = useState('email');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Company Dropdown States
  const [companyList, setCompanyList] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Animations
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const topSectionHeightAnim = useRef(new Animated.Value(START_HEIGHT)).current;

  useEffect(() => {
    GetCompanyList();
  }, []);

  const GetCompanyList = async () => {
    try {
      const endpoint = '/login/companies'; 
      const response = await GetApi(endpoint);
      console.log('Company List Response:', response);
      setCompanyList(response?.data?.companies || []);
    } catch (error) {
      console.error('Error fetching company list:', error);
    }
  };

  // Search Filter logic: show only 4 companies at a time
  useEffect(() => {
    if (companySearch.length > 0) {
      const filtered = companyList?.filter(item => item.name.toLowerCase().includes(companySearch.toLowerCase())).slice(0, 4);
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companyList?.slice(0, 4));
    }
  }, [companySearch, companyList]);

  // Keyboard Handlers
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      Animated.timing(keyboardOffset, {
        toValue: -Math.max(0, h - hp(15)), // Adjusted for extra field
        duration: 250,
        useNativeDriver: false, 
      }).start();
    };
    const onHide = () => {
      Animated.timing(keyboardOffset, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    };
    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);
    return () => { subShow.remove(); subHide.remove(); };
  }, [keyboardOffset]);

  useEffect(() => {
    Animated.timing(topSectionHeightAnim, { toValue: END_HEIGHT, duration: 800, useNativeDriver: false }).start();
  }, []);

  useEffect(() => {
    if (loginMode === 'employee') return;
    Animated.timing(toggleAnim, { toValue: loginMode === 'phone' ? 1 : 0, duration: 250, useNativeDriver: false }).start();
  }, [loginMode]);

  const handleSetLoginMode = (mode) => {
    setLoginMode(mode);
    setUsername('');
    setPassword('');
    setCompanySearch('');
    setSelectedCompanyId(null);
    setIsDropdownVisible(false);
  };

const handleLogin = async () => {
  if (loginMode === 'employee') {
    if (!selectedCompanyId || !username || !password) {
      ToastAndroid.show('Please select company and fill all fields', ToastAndroid.SHORT);
      return;
    }
  } else if (!username) {
    ToastAndroid.show('Please fill required fields', ToastAndroid.SHORT);
    return;
  }

  setLoading(true);
  try {
    let response;
    if (loginMode === 'email') {
      response = await Emaillogin({ email: username, password }).unwrap();
    } else if (loginMode === 'phone') {
      response = await Mobilelogin({ mobile: username }).unwrap();
    } else if (loginMode === 'employee') {
      const loginBody = {
        company_id: selectedCompanyId,
        employee_code: username,
        password: password, 
      };
      response = await LoginEmployee(loginBody).unwrap();
    }

    let isSuccess = false;
    if (response && (response.success || response.token || response.data || response.status === 'success')) {
        isSuccess = true;
    }

    if (isSuccess) {
      if (loginMode === 'employee') {
        // FIX 1: Safely extract user to prevent "Cannot read properties of undefined"
        let userData = null;
        if (response.data && response.data.user) {
            userData = response.data.user;
        }
        
        console.log('Login successful, processing response for employee:', userData);

        if (response.data && response.data.token) {
          await AsyncStorage.setItem('token', response.data.token);
          console.log('Token stored from response.data.token');
        } else if (response.token) {
          await AsyncStorage.setItem('token', response.token);
        }
      
        // FIX 2: Safely check for first_login
        let isFirstLogin = false;
        if (userData && userData.first_login === 1) {
            isFirstLogin = true;
        }

        if (isFirstLogin) {
           // FIX 3: Changed 'mode: mode' to 'mode: loginMode' to fix ReferenceError
           navigation.navigate('FirstRegister', { user: userData, firstLogin: true, mode: loginMode }); 
        } else {
          dispatch(setUser(true));
        }
        
        // FIX 4: Changed the fallback message from "Login failed" to "Login Successful"
        let toastMsg = 'Login Successful';
        if (response && response.message) {
            toastMsg = response.message;
        }
        ToastAndroid.show(toastMsg, ToastAndroid.SHORT);
        
      } else {
        navigation.navigate('Otp', { data: username, mode: loginMode });
      }
      
    } else {
      let errorMsg = 'Login failed';
      if (response && response.message) {
          errorMsg = response.message;
      }
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
    }
  } catch (error) {
    let catchMsg = 'Something went wrong';
    if (error && error.data && error.data.message) {
        catchMsg = error.data.message;
    }
    ToastAndroid.show(catchMsg, ToastAndroid.SHORT);
  } finally {
    setLoading(false);
  }
};

  const onSelectCompany = (item) => {
    setCompanySearch(item.name);
    setSelectedCompanyId(item.id);
    setIsDropdownVisible(false);
    Keyboard.dismiss();
  };

  let usernamePlaceholder = loginMode === 'email' ? 'Email Address' : loginMode === 'phone' ? 'Phone Number' : 'Employee Code';
  let keyboardType = loginMode === 'email' ? 'email-address' : loginMode === 'phone' ? 'phone-pad' : 'default';

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setIsDropdownVisible(false); }}>
        <View style={styles.container}>
          
          <Animated.View style={[styles.topSection, { height: topSectionHeightAnim, zIndex: 1 }]}>
            <LinearGradient colors={[COLORS_DEF.primaryDark, COLORS_DEF.primary, COLORS_DEF.primaryLight]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.safeTopContent}>
              <View style={styles.topContentContainer}>
                <Image source={require('../../assets/WhiteNewZoomConnectlogo.png')} style={styles.topLogo} resizeMode="contain" />
              </View>
            </SafeAreaView>
          </Animated.View>

          <Animated.View style={[styles.bottomSection, { top: Animated.subtract(topSectionHeightAnim, OVERLAP), transform: [{ translateY: keyboardOffset }], zIndex: 10 }]}>
            <View style={{ flex: 1 }}>
              <View style={styles.titleContainer}>
                <Text style={styles.welcomeTitle}>
                  <Text style={{ color: COLORS_DEF.primaryDark }}>Welcome </Text>
                  <Text style={{ color: COLORS_DEF.primary }}>Back</Text>
                </Text>
                <View style={styles.titleUnderline} />
              </View>

              {loginMode !== 'employee' && (
                <View style={styles.pillTrack}>
                  <Animated.View style={[styles.pillThumb, { width: THUMB_WIDTH, transform: [{ translateX: toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [PILL_PADDING, PILL_PADDING + THUMB_WIDTH] }) }] }]}>
                    <LinearGradient colors={[COLORS_DEF.primary, COLORS_DEF.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                    <View style={styles.thumbLabelCenter}><Text style={styles.pillLabelActive}>{loginMode === 'email' ? 'Email' : 'Mobile'}</Text></View>
                  </Animated.View>
                  <View style={styles.pillLabelsRow}>
                    <TouchableOpacity style={styles.pillHalf} onPress={() => handleSetLoginMode('email')}><Text style={loginMode !== 'email' ? styles.pillLabelIdle : { opacity: 0 }}>Email</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.pillHalf} onPress={() => handleSetLoginMode('phone')}><Text style={loginMode !== 'phone' ? styles.pillLabelIdle : { opacity: 0 }}>Mobile</Text></TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.formContainer}>
                {/* --- Searchable Company Dropdown --- */}
                {loginMode === 'employee' && (
                  <View style={{ zIndex: 2000 }}>
                    <View style={styles.inputWrapper}>
                      <TextInput 
                        style={styles.inputField} 
                        placeholder="Search Company" 
                        placeholderTextColor={COLORS_DEF.placeholder} 
                        value={companySearch} 
                        onChangeText={(t) => { setCompanySearch(t); setIsDropdownVisible(true); }}
                        onFocus={() => setIsDropdownVisible(true)}
                      />
                      <Text style={{ color: COLORS_DEF.primary }}>▼</Text>
                    </View>
                    
                    {isDropdownVisible && filteredCompanies.length > 0 && (
                      <View style={styles.dropdownBox}>
                        {filteredCompanies.map((item) => (
                          <TouchableOpacity key={item.id} style={styles.dropdownItem} onPress={() => onSelectCompany(item)}>
                            <Text style={styles.dropdownText}>{item.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <TextInput style={styles.inputField} placeholder={usernamePlaceholder} placeholderTextColor={COLORS_DEF.placeholder} keyboardType={keyboardType} value={username} onChangeText={setUsername} autoCapitalize="none" />
                </View>

                {loginMode === 'employee' && (
                  <>
                    <View style={styles.inputWrapper}>
                      <TextInput style={styles.inputField} placeholder="Password" placeholderTextColor={COLORS_DEF.placeholder} secureTextEntry={!showPass} value={password} onChangeText={setPassword} />
                      <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}><Text style={{ fontSize: hp(2.2) }}>{showPass ? '🙈' : '👁️'}</Text></TouchableOpacity>
                    </View>
                    {/* <View style={styles.forgotRow}><TouchableOpacity onPress={() => navigation.navigate('FirstRegister')}><Text style={styles.forgotPasswordText}>Forgot Password?</Text></TouchableOpacity></View> */}
                  </>
                )}
              </View>

              <TouchableOpacity activeOpacity={0.8} onPress={loading ? undefined : handleLogin} style={styles.shadowWrapper} disabled={loading}>
                <LinearGradient colors={[COLORS_DEF.primary, COLORS_DEF.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtn}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.infoTextContainer}>
                {loginMode !== 'employee' ? (
                  <Text style={styles.infoText}>Don't have an account? <Text style={styles.linkText} onPress={() => handleSetLoginMode('employee')}>Try Employee Code</Text></Text>
                ) : (
                  <Text style={styles.infoText}>Switch back to <Text style={styles.linkText} onPress={() => handleSetLoginMode('email')}>Email</Text> or <Text style={styles.linkText} onPress={() => handleSetLoginMode('phone')}>Mobile</Text></Text>
                )}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} /><Text style={styles.dividerText}>Sign in with</Text><View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}><Image source={Images.gmail} style={styles.socialIcon} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Image source={Images.microsoft} style={styles.socialIcon} /></TouchableOpacity>
              </View>
              
              <View style={styles.footerContainer}><Text style={styles.poweredByText}>Powered by Novel Healthtech</Text></View>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS_DEF.primaryDark },
  container: { flex: 1, backgroundColor: COLORS_DEF.bg },
  topSection: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  safeTopContent: { flex: 1 },
  topContentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: hp(5) },
  topLogo: { width: wp(70), height: hp(10) },
  bottomSection: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: wp(10), borderTopRightRadius: wp(10),
    paddingHorizontal: wp(6), paddingTop: hp(4),
    paddingBottom: Platform.OS === 'ios' ? hp(4.5) : hp(2.5),
    shadowColor: COLORS_DEF.primary, shadowOffset: { width: 0, height: -hp(1) },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 25,
  },
  titleContainer: { alignItems: 'center', marginBottom: hp(2.5) },
  welcomeTitle: { fontSize: hp(3.2), fontWeight: '700', textAlign: 'center' },
  titleUnderline: { width: wp(10), height: hp(0.5), backgroundColor: COLORS_DEF.secondary, marginTop: hp(1), borderRadius: wp(0.5) },
pillTrack: { 
    width: PILL_WIDTH, // Fixed: Changed from '85%' to the exact constant
    alignSelf: 'center', 
    height: hp(6), 
    backgroundColor: '#E9EAF0', 
    borderRadius: wp(6), 
    padding: PILL_PADDING, // Best practice: keep padding bound to the constant 
    marginBottom: hp(3), 
    flexDirection: 'row', 
    position: 'relative' 
  },
  pillThumb: { 
    position: 'absolute', 
    left: 0, // Fixed: Explicitly anchor to the left so translation math starts accurately
    top: PILL_PADDING, 
    bottom: PILL_PADDING, 
    borderRadius: wp(5.5), 
    overflow: 'hidden' 
  }, 
  thumbLabelCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pillLabelsRow: { ...StyleSheet.absoluteFillObject, flexDirection: 'row' },
  pillHalf: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pillLabelActive: { color: '#FFFFFF', fontSize: hp(1.5), fontWeight: '700' },
  pillLabelIdle: { color: '#6B7280', fontSize: hp(1.5), fontWeight: '600' },
  formContainer: { marginBottom: hp(1.2) },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS_DEF.inputBg, borderWidth: 1, borderColor: COLORS_DEF.inputBorder, borderRadius: wp(4), height: hp(6.4), paddingHorizontal: wp(4), marginBottom: hp(2) },
  inputField: { flex: 1, fontSize: hp(1.5), color: '#333', height: '100%' },
  
  // DROPDOWN STYLES
  dropdownBox: {
    position: 'absolute', top: hp(6.5), left: 0, right: 0,
    backgroundColor: '#FFF', borderRadius: wp(3), borderWidth: 1, borderColor: COLORS_DEF.inputBorder,
    elevation: 10, zIndex: 5000, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  dropdownItem: { paddingVertical: hp(1.5), paddingHorizontal: wp(4), borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dropdownText: { fontSize: hp(1.6), color: '#333' },

  eyeBtn: { padding: wp(2) },
  forgotRow: { alignItems: 'flex-end', marginBottom: hp(1.2) },
  forgotPasswordText: { color: COLORS_DEF.primary, fontSize: hp(1.5), fontWeight: '600' },
  shadowWrapper: { marginTop: hp(1.2), marginBottom: hp(2.5) },
  loginBtn: { height: hp(6.5), borderRadius: wp(6), justifyContent: 'center', alignItems: 'center' },
  loginBtnText: { color: '#FFFFFF', fontSize: hp(2), fontWeight: '700', letterSpacing: 1 },
  infoTextContainer: { alignItems: 'center', marginBottom: hp(3.8) },
  infoText: { color: '#888', fontSize: hp(1.5) },
  linkText: { color: COLORS_DEF.primary, fontWeight: '700' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(2.5) },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: wp(4), color: '#999', fontSize: hp(1.8) },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: wp(5), marginBottom: hp(3.8) },
  socialBtn: { width: wp(12), height: wp(12), borderRadius: wp(6), backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  socialIcon: { width: wp(6), height: wp(6) },
  footerContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  poweredByText: { fontSize: hp(1.2), color: '#AAAAAA' },
});