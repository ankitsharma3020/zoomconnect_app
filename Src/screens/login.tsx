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
  Alert,
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { wp, hp } from '../utilites/Dimension';
import { 
  useLoginemailMutation, 
  useLoginmobileMutation, 
  useLoginemployeeMutation, 
  useLoginmicrosoftMutation
} from '../redux/service/user/user';
import { GetApi } from '../component/Apifunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authorize } from 'react-native-app-auth';
import { jwtDecode } from 'jwt-decode';
import auth from '@react-native-firebase/auth';
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

const configs = {
  identityserver: {
    issuer: 'https://login.microsoftonline.com/ac7594d5-c933-4baf-b79d-4ccb4aaec90c/v2.0',
    clientId: '151553b6-39f3-48e4-9982-6dc7d4833e59', 
    redirectUrl: Platform.OS === 'android' ? 'msauth.com.zoomconnect://auth' : 'msauth.com.zoomconnect://auth/', 
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email']
  }
};

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // API Mutations
  const [Emaillogin] = useLoginemailMutation();
  const [Mobilelogin] = useLoginmobileMutation();
  const [LoginEmployee] = useLoginemployeeMutation();
  const [MicrosoftLogin] = useLoginmicrosoftMutation();
  
  // State
  const [loginMode, setLoginMode] = useState('email');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false); // Controls ALL login loading states
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
    GoogleSignin.configure({
      webClientId: '23273467961-vbqo2a5m9a07nm43t8dmafc7pr36ogfg.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const GetCompanyList = async () => {
    try {
      const response = await GetApi('/login/companies');
      setCompanyList(response?.data?.companies || []);
    } catch (error) {
      console.error('Error fetching company list:', error);
    }
  };

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
        toValue: -Math.max(0, h - hp(15)), 
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

  // --- REUSABLE SSO API CALLER ---
const handleSSOApiCall = async (email, providerName) => {
  try {
    // Using MicrosoftLogin mutation for both Google and Microsoft as requested
    const response = await MicrosoftLogin({ email: email })
    console.log(`${providerName} API Response:`, response);
    
    let isSuccess = response && (response.data.success || response.data?.data?.token || response.data || response.data.status === 'success');
    
    if (isSuccess) {
      let userData = response.data?.data?.user || null;

      if (response.data?.data?.token) {
        await AsyncStorage.setItem('token', response.data?.data?.token);
        await AsyncStorage.setItem('Enablebio', 'true');
      } else if (response.data?.data?.token) {
        await AsyncStorage.setItem('token', response.data?.data?.token);
        await AsyncStorage.setItem('Enablebio', 'true');
      }
    
      let isFirstLogin = userData?.first_login === 1;

      if (isFirstLogin) {
         navigation.navigate('FirstRegister', { user: userData, firstLogin: true, mode: loginMode }); 
      } else {
        dispatch(setUser(true));
      }
      
      let successMsg = response.data.message || 'Login Successful';
      if (Platform.OS === 'android') {
        ToastAndroid.show(successMsg, ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', successMsg);
      }

    } else {
      let failMsg =res?.error?.data.message || 'Login failed';
      if (Platform.OS === 'android') {
        ToastAndroid.show(failMsg, ToastAndroid.SHORT);
      } else {
        Alert.alert('Notice', failMsg);
      }
    }
  } catch (error) {
    console.error(`${providerName} API Error:`, error);
    let errorMsg = error?.data?.message || 'Something went wrong with backend authentication';
    
    if (Platform.OS === 'android') {
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Error', errorMsg);
    }
  }
};

  // --- GOOGLE LOGIN ---
  const onGoogleButtonPress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult?.data?.idToken || signInResult?.idToken; 
      
      if (!idToken) throw new Error('No ID token found');
      
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const email = userCredential?.user?.email;
      
      if (email) {
        await handleSSOApiCall(email, 'Google');
      } else {
        ToastAndroid.show('Email not found in Google profile', ToastAndroid.SHORT);
      }
    } catch (error) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        console.error('Google Sign-In Error:', error);
        ToastAndroid.show(error?.message || 'Google Sign-In failed', ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- MICROSOFT LOGIN ---
  const handleMicrosoftLogin = async (provider) => {
    if (loading) return;
    setLoading(true);
    try {
      const config = { ...configs[provider] };
      const res = await authorize(config);
      
      if (res.idToken) {
        const decodedToken = jwtDecode(res.idToken);
        const email = decodedToken.email || decodedToken.preferred_username;
        
        if (email) {
          await handleSSOApiCall(email, 'Microsoft');
        } else {
          ToastAndroid.show('Email not found in Microsoft profile', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('ID Token not found in Microsoft response', ToastAndroid.SHORT);
      }
    } catch (error) { 
      console.error("Microsoft Login Error:", error); 
      ToastAndroid.show('Microsoft Login failed', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleSetLoginMode = (mode) => {
    if (loading) return;
    setLoginMode(mode);
    setUsername('');
    setPassword('');
    setCompanySearch('');
    setSelectedCompanyId(null);
    setIsDropdownVisible(false);
  };

  // --- STANDARD LOGIN ---
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
        response = await Emaillogin({ email: username, password })
      } else if (loginMode === 'phone') {
        response = await Mobilelogin({ mobile: username });
      
      } else if (loginMode === 'employee') {
        response = await LoginEmployee({
          company_id: selectedCompanyId,
          employee_code: username,
          password: password, 
        });
      }
      console.log('Login API Response:',  response);
      let isSuccess =  (response?.data?.data|| response.data?.data?.token || response?.data || response?.data?.status === 'success');

      if (isSuccess) {

        console.log('Login successful, processing response...');
        if (loginMode === 'employee') {
          let userData = response.data?.data?.user || null;

          if (response.data.data.token) {
            await AsyncStorage.setItem('token', response.data.data.token);
              await AsyncStorage.setItem('Enablebio', 'true');
          } else if (response.token) {
              await AsyncStorage.setItem('Enablebio', 'true');
            await AsyncStorage.setItem('token', response.token);
          }
        
          let isFirstLogin = userData?.first_login === 1;

          if (isFirstLogin) {
             navigation.navigate('FirstRegister', { user: userData, firstLogin: true, mode: loginMode }); 
          } else {
            dispatch(setUser(true));
          }
          
          ToastAndroid.show(response.data.message || 'Login Successful', ToastAndroid.SHORT);
        } else {

          navigation.navigate('Otp', { data: username, mode: loginMode });
        }
      }   else if (response?.error?.data && response?.error?.data.message) {
        
            if (Platform.OS === 'android') {
              ToastAndroid.show(response?.error?.data.message, ToastAndroid.SHORT);
            } else {
              Alert.alert('Notice', response?.error?.data?.message);
            }
          } 
      
      else {
       
        if (Platform.OS === 'android') {
              ToastAndroid.show( response?.error?.data.message|| 'Login failed', ToastAndroid.SHORT);
            } else {
              Alert.alert('Notice', response?.error?.data?.message|| 'Login failed');
            }
       
      }
    } catch (error) {
      if (Platform.OS === 'android') {
              ToastAndroid.show( error.message|| 'Login failed', ToastAndroid.SHORT);
            } else {
              Alert.alert('Notice', error.message|| 'Login failed');
            }
    

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
      
      {/* Pointer events are disabled when loading is true to ensure 
        the user cannot tap inputs or buttons during API calls 
      */}
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setIsDropdownVisible(false); }}>
        <View style={styles.container} pointerEvents={loading ? 'none' : 'auto'}>
          
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
                {loginMode === 'employee' && (
                  <View style={{ zIndex: 2000 }}>
                    <View style={[styles.inputWrapper, loading && { opacity: 0.7 }]}>
                      <TextInput 
                        style={styles.inputField} 
                        placeholder="Search Company" 
                        placeholderTextColor={COLORS_DEF.placeholder} 
                        value={companySearch} 
                        onChangeText={(t) => { setCompanySearch(t); setIsDropdownVisible(true); }}
                        onFocus={() => setIsDropdownVisible(true)}
                        editable={!loading}
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

                <View style={[styles.inputWrapper, loading && { opacity: 0.7 }]}>
                  <TextInput style={styles.inputField} placeholder={usernamePlaceholder} placeholderTextColor={COLORS_DEF.placeholder} keyboardType={keyboardType} value={username} onChangeText={setUsername} autoCapitalize="none" editable={!loading} />
                </View>

                {loginMode === 'employee' && (
                  <View style={[styles.inputWrapper, loading && { opacity: 0.7 }]}>
                    <TextInput style={styles.inputField} placeholder="Password" placeholderTextColor={COLORS_DEF.placeholder} secureTextEntry={!showPass} value={password} onChangeText={setPassword} editable={!loading} />
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)} disabled={loading}>
                   
                        <Icon name={showPass ? "eye-off" : "eye"} size={hp(2.5)} color="#BBB" />
                      
                      </TouchableOpacity>
                     
                  </View>
                )}
              </View>

              <TouchableOpacity activeOpacity={0.8} onPress={handleLogin} style={styles.shadowWrapper} disabled={loading}>
                <LinearGradient colors={[COLORS_DEF.primary, COLORS_DEF.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtn}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.infoTextContainer}>
                {loginMode !== 'employee' ? (
                  <Text style={styles.infoText}>You can login with <Text style={styles.linkText} onPress={() => handleSetLoginMode('employee')}>Try Employee Code</Text></Text>
                ) : (
                  <Text style={styles.infoText}>Switch back to <Text style={styles.linkText} onPress={() => handleSetLoginMode('email')}>Email</Text> or <Text style={styles.linkText} onPress={() => handleSetLoginMode('phone')}>Mobile</Text></Text>
                )}
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} /><Text style={styles.dividerText}>Sign in with</Text><View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={[styles.socialBtn, loading && { opacity: 0.5 }]} onPress={onGoogleButtonPress} disabled={loading}>
                  <Image source={Images.gmail} style={styles.socialIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialBtn, loading && { opacity: 0.5 }]} onPress={() => handleMicrosoftLogin('identityserver')} disabled={loading}>
                  <Image source={Images.microsoft} style={styles.socialIcon} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.footerContainer}><Text style={styles.poweredByText}>Powered by Novel Healthtech</Text></View>
            </View>
          </Animated.View>

          {/* Full Screen Loading Overlay to prevent interaction during SSO */}
          {loading && (
             <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS_DEF.primary} />
             </View>
          )}

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS_DEF.primaryDark },
  container: { flex: 1, backgroundColor: COLORS_DEF.bg },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.4)', zIndex: 9999, justifyContent: 'center', alignItems: 'center' },
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
    width: PILL_WIDTH, 
    alignSelf: 'center', 
    height: hp(6), 
    backgroundColor: '#E9EAF0', 
    borderRadius: wp(6), 
    padding: PILL_PADDING,  
    marginBottom: hp(3), 
    flexDirection: 'row', 
    position: 'relative' 
  },
  pillThumb: { 
    position: 'absolute', 
    left: 0, 
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
  dropdownBox: {
    position: 'absolute', top: hp(6.5), left: 0, right: 0,
    backgroundColor: '#FFF', borderRadius: wp(3), borderWidth: 1, borderColor: COLORS_DEF.inputBorder,
    elevation: 10, zIndex: 5000, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4,
  },
  dropdownItem: { paddingVertical: hp(1.5), paddingHorizontal: wp(4), borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dropdownText: { fontSize: hp(1.6), color: '#333' },
  eyeBtn: { padding: wp(2) },
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