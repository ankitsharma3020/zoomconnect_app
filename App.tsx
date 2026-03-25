import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RouteManager from './Src/navigation/routemanager';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import store from './Src/redux/store';

// 1. Import SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';
import navigationservice from './Src/component/pushNotification/navigationservice';
import PushNotification from "react-native-push-notification";
import PushNotificationComponent from './Src/component/pushNotification/pushNotification';

const { width, height } = Dimensions.get('window');

const BootSplash = () => (
     <View style={styles.container}>
       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
     </View>
);

const App = () => {
  //  useEffect(() => {
  //   PushNotification.configure({
  //     // (optional) Called when a remote is received or opened, or local notification is opened
  //     onNotification: function (notification) {
  //       console.log("NOTIFICATION:", notification);
  //     },
    
  //     // Should the initial notification be popped automatically
  //     // default: true
  //     popInitialNotification: true,
    
  //     /**
  //      * (optional) default: true
  //      * - Specified if permissions (ios) and channel (android) are requested or not,
  //      * - if not, you must call PushNotification.requestPermissions() later
  //      * - if you are not using remote notification or do not have Firebase installed, use this:
  //      * requestPermissions: Platform.OS === 'ios'
  //      */
  //     requestPermissions: true,
  //   });
    
  //   // Create a channel for Android notifications (does nothing on iOS)
  //   PushNotification.createChannel(
  //     {
  //       channelId: "background-fetch-test-channel", // (required)
  //       channelName: "Background Task Notifications", // (required)
  //       channelDescription: "A channel for notifications from background tasks",
  //       soundName: "default",
  //       importance: 4, // Importance.HIGH
  //       vibrate: true,
  //     },
  //     (created) => console.log(`createChannel returned '${created}'`)
  //   );
  // }, []); 
  let persistor = persistStore(store);
  
  return (
     <StoreProvider store={store}>
      <PersistGate persistor={persistor} >
        {/* 2. Wrap your NavigationContainer with SafeAreaProvider */}
        <SafeAreaProvider>
          <NavigationContainer ref={(e) => navigationservice.setToplevelNavigation(e)}>
            <PushNotificationComponent />
            <RouteManager />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#e1d1e1', 
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  bootLogo: {
    width: width * 0.7,
    height: height * 0.3,
  }
});