import React from 'react';
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native';

const BootSplash = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* We keep this empty/white to match the START of your Splash.tsx animation 
         (where the background image hasn't slid up yet). 
         This prevents a "flash" of content.
      */}
    </View>
  );
};

export default BootSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});