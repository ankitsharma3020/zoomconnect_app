import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetApi } from  './Apifunctions';

import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Platform, 
  StatusBar, 
  TouchableOpacity 
} from 'react-native';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import
import { DOMAIN_URI } from '../redux/apiSlice';

type Props = {
  userName?: string;
  userImage?: string;
  companyLogo?: any;
  // New Props
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
  const [greeting, setGreeting] = useState('Good Morning');
  const [profileData, setProfileData] = useState(null);
  console.log('Profile Data:', profileData?.data?.user.full_name);
  const navigation = useNavigation();
   const PROFILE_URL = '/profile';
 const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await GetApi(PROFILE_URL, {}, token);
      setProfileData(response);
    } catch (error) {
      showErrorToast('Failed to fetch profile');
      console.error('Profile error:', error);
    }
  };

    useEffect(() => {
   fetchProfile()
  }, []);
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <View style={styles.headerRow}>
      
      {/* --- LEFT SECTION (Conditional) --- */}
      <View style={styles.leftContent}>
        {showBack ? (
          // 1. Back State: Show Arrow + Title
          <View style={styles.backContainer}>
            <TouchableOpacity 
              onPress={onBack} 
              activeOpacity={0.7}
              style={styles.backButton}
            >
              {/* Using a generic back arrow image URL. Replace with your local asset/icon */}
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png' }} 
                style={styles.backIcon} 
              />
            </TouchableOpacity>
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
          </View>
        ) : (
          // 2. Home State: Show Avatar + Greeting
          <TouchableOpacity 
            onPress={() => navigation.navigate('profile')}
            style={styles.profileContainer}
          >
            <Image 
              source={{ uri: `${DOMAIN_URI}/${profileData?.data?.user.photo}` }} 
              style={styles.avatar} 
            />
            <View>
              <Text style={styles.greetSmall}>{greeting}</Text>
              <Text style={styles.greetName} numberOfLines={1}>{profileData?.data?.user.full_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* --- RIGHT SECTION (Always Visible) --- */}
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
    paddingHorizontal: wp(5), // approx 20
    paddingBottom: hp(2), // approx 16
    // Adjust top padding for StatusBar + spacing
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + hp(1.5) : hp(0.5),
    backgroundColor: 'transparent',
  },
  
  // Wrapper for the left side
  leftContent: {
    flex: 1,
    marginRight: wp(4), // approx 16
  },

  // --- Home State Styles ---
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(12), // approx 48
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3), // approx 12
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: hp(0.25) },
  },
  greetSmall: {
    color: '#64748B',
    fontSize: hp(1.2), // approx 13
    fontFamily: 'Montserrat-SemiBold', // Font
    marginBottom: hp(0.25),
  },
  greetName: {
    color: '#1E293B',
    fontSize: hp(1.45), // approx 18
    fontFamily: 'Montserrat-Bold', // Font
    letterSpacing: -0.5,
  },

  // --- Back State Styles ---
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: wp(2), // approx 8
    marginLeft: -wp(2), // Negative margin for visual alignment
    marginRight: wp(2),
  },
  backIcon: {
    width: wp(4), // approx 24
    height: wp(4),
    tintColor: '#1E293B', 
  },
  headerTitle: {
    fontSize: hp(2), // approx 20
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B',
  },

  // --- Company Logo ---
  companyLogo: {
    width: wp(25), // approx 100
    height: hp(5), // approx 40
  },
});