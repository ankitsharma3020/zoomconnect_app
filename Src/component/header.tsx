import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetApi } from './Apifunctions';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

// 1. Import the hook
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { wp, hp } from '../utilites/Dimension';
import { DOMAIN_URI } from '../redux/apiSlice';
import { useSelector } from 'react-redux';

type Props = {
  userName?: string;
  userImage?: string;
  companyLogo?: any;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
};

export default function Header({
  userName = "Brijesh Kumar",
  userImage = "https://i.pravatar.cc/80?img=13",
  companyLogo = require('../../assets/bharatpelogo.png'),
  showBack = false,
  onBack,
  title = ""
}: Props) {
  // 2. Get real-time safe area insets
  const insets = useSafeAreaInsets();
  
  // 3. CALCULATE PADDING WITH FALLBACK
  // If insets.top is 0 (during nav transition), fallback to standard heights 
  // (44 for iOS, 24 for Android) to prevent the "jump".
  const iosNotch = insets.top > 0 ? insets.top : 44; 
  const androidStatusBar = StatusBar.currentHeight || 24;
  
  const paddingTop = Platform.OS === 'android' 
    ? androidStatusBar + hp(1.5)
    : iosNotch + hp(1);

  const [greeting, setGreeting] = useState('Good Morning');
  const [profileData, setProfileData] = useState(null);
  const navigation = useNavigation();
  const PROFILE_URL = '/profile';
  const selector=useSelector((state:any)=>state.profile)
  const {data, isLoading, error} = useSelector((state:any)=>state.profile)
  // console.log("profile data in header",data)

  

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    // 4. Use standard View with our calculated stable padding
    <View style={[styles.headerRow, { paddingTop }]}>
      
      {/* --- LEFT SECTION --- */}
      <View style={styles.leftContent}>
        {showBack ? (
          <View style={styles.backContainer}>
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png' }}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('profile')}
            style={styles.profileContainer}
            activeOpacity={0.8}
          >
            {data?.data?.user?.gender === 'male' ? (
              <Image source={require('../../assets/profileman.png')} style={styles.avatar} />
            ) : (
              <Image source={require('../../assets/profilewomen.png')} style={styles.avatar} />
            )}
            <View>
              <Text style={styles.greetSmall}>{greeting}</Text>
              <Text style={styles.greetName} numberOfLines={1}>{data?.data?.user.full_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* --- RIGHT SECTION --- */}
      <Image
        source={companyLogo}
        style={styles.companyLogo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    
    backgroundColor: '#F6F7FB',
    // paddingTop is now handled inline
  },
  
  // Wrapper for the left side
  leftContent: {
    flex: 1,
    marginRight: wp(4),
  },

  // --- Home State Styles ---
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 avatar: {
  width: wp(12),
  height: wp(12),
  borderRadius: wp(6),
  marginRight: wp(3),
  
  // Border refinement
  borderWidth: 1.5, // Slightly thinner for a smaller icon
  borderColor: '#FFFFFF',
  backgroundColor: '#F0F0F0', // Placeholder color while image loads

  // iOS Shadow (Subtle & Crisp)
  shadowColor: '#000',
  shadowOffset: { 
    width: 0, 
    height: 2 // Reduced from hp(0.25) for better scaling
  },
  shadowOpacity: 0.15, // Slightly higher to compensate for smaller size
  shadowRadius: 3,

  // Android Shadow
  elevation: 3, // Balanced for a small UI element
},
  greetSmall: {
    color: '#64748B',
    fontSize: hp(1.2),
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: hp(0.25),
  },
  greetName: {
    color: '#1E293B',
    fontSize: hp(1.45),
    fontFamily: 'Montserrat-Bold',
    letterSpacing: -0.5,
  },

  // --- Back State Styles ---
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: wp(2),
    marginLeft: -wp(2),
    marginRight: wp(2),
  },
  backIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: '#1E293B',
  },
  headerTitle: {
    fontSize: hp(2),
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B',
  },

  // --- Company Logo ---
  companyLogo: {
    width: wp(25),
    height: hp(5),
  },
});