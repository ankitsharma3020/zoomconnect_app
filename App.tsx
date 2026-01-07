import React from 'react';
import { StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RouteManager from './Src/navigation/routemanager';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import store from './Src/redux/store';

const { width, height } = Dimensions.get('window');

// 1. Create a simple static component for the milliseconds it takes Redux to load
const BootSplash = () => (
     <View style={styles.container}>
       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
       {/* We keep this empty/white to match the START of your Splash.tsx animation 
          (where the background image hasn't slid up yet). 
          This prevents a "flash" of content.
       */}
     </View>
);

const App = () => {
  let persistor = persistStore(store);
  
  return (
     <StoreProvider store={store}>
      {/* 2. Pass BootSplash here. It has NO navigation logic. */}
      <PersistGate persistor={persistor} loading={<BootSplash />}>
        <NavigationContainer>
          {/* 3. Your real interactive Splash screen should be the first route in RouteManager */}
          <RouteManager />
        </NavigationContainer>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bootLogo: {
    width: width * 0.7,
    height: height * 0.3,
  }
});