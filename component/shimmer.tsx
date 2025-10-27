// ShimmerPlaceholder.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SHIMMER_BAR_HEIGHT = 150; // The height of the light bar, you can adjust this

const ShimmerPlaceholder = ({ width, height, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // The animation loop remains the same, driving the effect
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1800, // Speed of the animation
        easing: Easing.inOut(Easing.ease), // Smoother start and end
        useNativeDriver: true,
      })
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  // --- NEW ANIMATION LOGIC ---

  // 1. Top Bar Animation: Moves from the top edge down to the center
  const topBarTranslateY = shimmerAnim.interpolate({
    inputRange: [0, 1],
    // Starts at Y=0 (top edge) and moves to the middle of the screen
    outputRange: [0, height / 2 - SHIMMER_BAR_HEIGHT / 2],
  });

  // 2. Bottom Bar Animation: Moves from the bottom edge up to the center
  const bottomBarTranslateY = shimmerAnim.interpolate({
    inputRange: [0, 1],
    // Starts at the bottom edge (Y=height) and moves to the middle
    outputRange: [height, height / 2 - SHIMMER_BAR_HEIGHT / 2],
  });

  return (
    <View style={[styles.shimmerContainer, { width, height }, style]}>
      {/* --- TOP SHIMMER BAR --- */}
      <Animated.View
        style={[
          styles.shimmerBar,
          { width, height: SHIMMER_BAR_HEIGHT },
          { transform: [{ translateY: topBarTranslateY }] },
        ]}
      >
        <LinearGradient
          colors={['#C59AC3', '#EAE1EA', '#C59AC3']} // Base -> Lighter highlight -> Base
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* --- BOTTOM SHIMMER BAR --- */}
      <Animated.View
        style={[
          styles.shimmerBar,
          { width, height: SHIMMER_BAR_HEIGHT },
          { transform: [{ translateY: bottomBarTranslateY }] },
        ]}
      >
        <LinearGradient
          colors={['#C59AC3', '#EAE1EA', '#C59AC3']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    overflow: 'hidden',
    backgroundColor: '#C59AC3', // Base color of the placeholder
  },
  shimmerBar: {
    position: 'absolute', // Position the bars independently
    left: 0,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});

export default ShimmerPlaceholder;