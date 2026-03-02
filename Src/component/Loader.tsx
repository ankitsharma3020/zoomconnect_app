import React from 'react';
import { StyleSheet, View, StatusBar, ImageBackground } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { hp, wp } from '../utilites/Dimension';
 // Adjust path if necessary

// --- ASSETS ---
const IMG_MAIN_GIF = require('../../assets/whitelogoanimation.gif');
const BG_IMAGE = require('../../assets/Splashbg.jpg');

const Loader = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e0f9" />

      <ImageBackground
        source={BG_IMAGE}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <FastImage
          source={IMG_MAIN_GIF}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.gifLogo} 
        />
      </ImageBackground>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    // These two properties ensure whatever is inside is perfectly centered
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gifLogo: {
    width: wp(70),  
    height: hp(30), 
  },
});