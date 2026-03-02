import React from 'react';
import { StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RouteManager from './Src/navigation/routemanager';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import store from './Src/redux/store';

// 1. Import SafeAreaProvider
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BootSplash = () => (
     <View style={styles.container}>
       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
     </View>
);

const App = () => {
  let persistor = persistStore(store);
  
  return (
     <StoreProvider store={store}>
      <PersistGate persistor={persistor} loading={<BootSplash />}>
        {/* 2. Wrap your NavigationContainer with SafeAreaProvider */}
        <SafeAreaProvider>
          <NavigationContainer>
            <RouteManager />
          </NavigationContainer>
        </SafeAreaProvider>
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