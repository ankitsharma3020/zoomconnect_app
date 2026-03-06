import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import navigationservice from './navigationservice';

// Agar aapko manually local notification trigger karni ho
export const triggerLocalNotification = async (notification) => {
  
  // 1. Android ki default configuration set karein (bina largeIcon ke)
  const androidConfig = {
    channelId: 'channel-id',
   smallIcon: 'ic_launcher', // drawable folder mein hona chahiye
    importance: AndroidImportance.HIGH, // Foreground mein popup ke liye HIGH zaroori hai
    pressAction: {
      id: 'default', // User tap karega toh event trigger hoga
    },
  };

  // 2. Agar imageUrl valid string hai, tabhi use config mein add karein
  if (notification?.bigPictureUrl && typeof notification.bigPictureUrl === 'string') {
    androidConfig.largeIcon = notification.bigPictureUrl;
  }

  // 3. Notifee se notification display karein
  await notifee.displayNotification({
    title: notification?.title,
    body: notification?.message,
    data: notification?.data,
    android: androidConfig,
  });
};

const PushNotificationComponent = () => {

  useEffect(() => {
    // 1. Create notification channel
    async function setupChannel() {
      const channelId = await notifee.createChannel({
        id: 'channel-id',
        name: 'local-channel',
        description: 'A channel to categorize your notifications',
        importance: AndroidImportance.HIGH, 
        vibrate: true, 
      });
      console.log(`createChannel returned '${channelId}'`);
    }

    setupChannel();

    // 2. FOREGROUND MESSAGE LISTENER
    // Jab app open ho aur push aaye, tab popup dikhane ke liye
    const unsubscribeMessaging = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received!', remoteMessage);
      
      // Firebase se aaye payload ko extract karke local notification trigger karo
      await triggerLocalNotification({
        title: remoteMessage.notification?.title || remoteMessage.data?.title,
        message: remoteMessage.notification?.body || remoteMessage.data?.body,
        data: remoteMessage.data,
        bigPictureUrl: remoteMessage.notification?.android?.imageUrl, // Yeh undefined bhi ho sakta hai
      });
    });

    // 3. FOREGROUND INTERACTION LISTENER
    // Jab user popup par tap karega
    const unsubscribeForeground = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const notificationData = detail.notification?.data;
        console.log('NOTIFICATION TYPE:', notificationData?.type);

        let targetScreen = 'Home'; 
      
        switch (notificationData?.type) {
          case 'Wellness': targetScreen = 'WELLNESS'; break;
          case 'Policy': targetScreen = 'POLICY'; break;
          case 'Claims': targetScreen = 'CLAIMS'; break;
          case 'Help': targetScreen = 'HELP'; break;
          default: targetScreen = 'Home'; break;
        }
      
        navigationservice.navigate('Main', { screen: targetScreen });
      
        setTimeout(async () => {
          await notifee.cancelAllNotifications();
        }, 10);
      }
    });

    // Cleanup listeners
    return () => {
      unsubscribeForeground();
      unsubscribeMessaging(); 
    };
  }, []);

  return null;
};

export default PushNotificationComponent;