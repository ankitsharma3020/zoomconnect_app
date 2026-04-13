import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
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

// 1. Import the safe area hook
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🔥 2. IMPORT COPILOT 🔥
import { CopilotStep, walkthroughable } from 'react-native-copilot';

import { wp, hp } from '../utilites/Dimension';
import { DOMAIN_URI } from '../redux/apiSlice';
import { useSelector } from 'react-redux';
import FastImage from '@d11/react-native-fast-image';

// 🔥 3. CREATE WALKTHROUGHABLE COMPONENT 🔥
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

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
  // Get real-time safe area insets
  const insets = useSafeAreaInsets();
  
  // CALCULATE PADDING WITH FALLBACK
  const iosNotch = insets.top > 0 ? insets.top : 44; 
  const androidStatusBar = StatusBar.currentHeight || 24;
  
  const paddingTop = Platform.OS === 'android' 
    ? androidStatusBar + hp(1.5)
    : iosNotch + hp(1);

  const [greeting, setGreeting] = useState('Good Morning');
  const navigation = useNavigation();
  const { data, isLoading, error } = useSelector((state:any) => state.profile);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
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
              <FastImage
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png' }}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
          </View>
        ) : (
          /* 🔥 STEP 5: PROFILE STEP IMPLEMENTATION 🔥 */
          <CopilotStep 
          name="profile"
          order={5}
           text={"Profile\nManage your profile and account settings here!"}
            >
            <CopilotTouchableOpacity
              onPress={() => navigation.navigate('profile')}
              style={styles.profileContainer}
              activeOpacity={0.8}
            >
              {data?.data?.user?.gender === 'male' ? (
                <FastImage source={require('../../assets/profileman.png')} style={styles.avatar} />
              ) : (
                <FastImage source={require('../../assets/profilewomen.png')} style={styles.avatar} />
              )}
              <View>
                <Text style={styles.greetSmall}>{greeting}</Text>
                <Text style={styles.greetName} numberOfLines={1}>{data?.data?.user?.full_name}</Text>
              </View>
            </CopilotTouchableOpacity>
          </CopilotStep>
        )}
      </View>

      {/* --- RIGHT SECTION --- */}
      <FastImage
        source={{ uri: `${DOMAIN_URI}/${data?.data?.user?.company?.comp_icon_url}` }}
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
  },
  leftContent: {
    flex: 1,
    marginRight: wp(4),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3),
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, 
    shadowRadius: 3,
    elevation: 3, 
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
    fontSize: hp(1.7),
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B',
  },
  companyLogo: {
    width: wp(25),
    height: hp(5),
  },
});