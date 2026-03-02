import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PoliciesGlossyRibbon = () => {
  return (
    <View style={styles.container}>
      
      {/* LEFT UNDER-FOLD (Rounded Loop) */}
      {/* <View style={[styles.fold, styles.leftFold]} /> */}
      
      {/* RIGHT UNDER-FOLD (Rounded Loop) */}
      {/* <View style={[styles.fold, styles.rightFold]} /> */}

      {/* MAIN RIBBON BODY */}
      <LinearGradient
        colors={['#D2B5FF', '#F1E9FF', '#C4D7FF']} // Soft lavender to white to light blue
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.mainRibbon}
      >
        {/* Decorative Wavy Lines (Right side) */}
        <View style={styles.wave1} />
        <View style={styles.wave2} />

        {/* Decorative Sparkles (Left side) */}
        {/* <Text style={[styles.sparkle, { top: 12, left: 20, fontSize: 14 }]}>✦</Text>
        <Text style={[styles.sparkle, { top: 35, left: 45, fontSize: 8 }]}>✦</Text>
        <Text style={[styles.sparkle, { top: 20, left: 70, fontSize: 6 }]}>✦</Text> */}

        {/* Glossy Top Highlight (Creates the Glass/Shine effect) */}
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.glossHighlight}
        />

        {/* Bottom Inner Shadow for 3D depth */}
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.06)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bottomShadow}
        />

        {/* TITLE */}
        <Text style={styles.title}>Policies</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: 20, 
    position: 'relative',
  },
  mainRibbon: {
    width: '100%',
    height: 58, // Fixed height to match the pill-like look in the image
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16, // Very rounded edges
    shadowColor: '#8C9EFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden', // Keeps gloss and waves contained inside the rounded borders
  },
  title: {
    fontSize: 22,
    color: '#251E5B', // Deep navy/purple matching the image text
    fontWeight: '800',
    letterSpacing: 0.5,
    zIndex: 10,
  },

  /* --- LIGHTING EFFECTS --- */
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%', // Shine only covers the top half
    zIndex: 5,
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 12,
    zIndex: 5,
  },
  
  /* --- UNDER-FOLDS (Loops) --- */
  fold: {
    position: 'absolute',
    bottom: -8, // Hangs slightly below the main ribbon
    width: 35,
    height: 20,
    zIndex: -1, // Places it behind the main ribbon
  },
  leftFold: {
    left: 1,
    width: 120,
    backgroundColor: '#d2b2ef', // Magenta shadow
    borderBottomLeftRadius: 12, // Rounded loop
    transform: [{ skewX: '-25deg' }], // Angles it inwards to look like a fold
  },
  rightFold: {
    right: 7,
    width: 120,
    backgroundColor: '#b2bcf6', // Blue shadow
    borderBottomRightRadius: 12, // Rounded loop
    transform: [{ skewX: '25deg' }], // Angles it inwards
  },

  /* --- DECORATIONS --- */
  wave1: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 120,
    height: 80,
    borderRadius: 60,
    backgroundColor: 'rgba(176, 196, 255, 0.4)', // Soft translucent blue
    transform: [{ rotate: '-15deg' }, { scaleX: 1.5 }],
    zIndex: 1,
  },
  wave2: {
    position: 'absolute',
    right: -40,
    bottom: -10,
    width: 100,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'rgba(210, 220, 255, 0.5)',
    transform: [{ rotate: '-25deg' }, { scaleX: 1.8 }],
    zIndex: 2,
  },
  sparkle: {
    position: 'absolute',
    color: '#FFFFFF',
    opacity: 0.8,
    zIndex: 3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  }
});

export default PoliciesGlossyRibbon;