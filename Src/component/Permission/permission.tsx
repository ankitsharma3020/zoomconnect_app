import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

// --- List of all permissions requested on first launch ---
const ANDROID_PERMISSIONS_TO_REQUEST = [
  // For Step Counter
 
  
  // For Background Service Notifications (Android 13+)
  ...(Platform.Version >= 33 ? [PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] : []),
  
  // --- Newly Added Permissions ---
  


  PermissionsAndroid.PERMISSIONS.READ_SMS,
  PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
];

const PermissionRequestScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleAllPermissions = async () => {
      // Request Push Notification Permission (handled by Firebase for both platforms)
      await messaging().requestPermission();

      // Request all other Android permissions at once
      if (Platform.OS === 'android') {
        try {
          console.log('Requesting all necessary Android permissions...');
          const statuses = await PermissionsAndroid.requestMultiple(ANDROID_PERMISSIONS_TO_REQUEST);
          console.log('Permission statuses:', statuses);
        } catch (err) {
          console.warn('Permission request error:', err);
        }
      }
      
      // Mark the process as complete to ensure this screen only runs once
      await AsyncStorage.setItem('hasRequestedPermissions', 'true');
      
      // Navigate to the main app flow
      navigation.replace('Dashboard'); 
    };

    handleAllPermissions();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#095B7E" />
      <Text style={styles.text}>Preparing your app...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default PermissionRequestScreen;
