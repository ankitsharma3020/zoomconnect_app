import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

const WalkableView = walkthroughable(View);
const { width, height } = Dimensions.get('window');

const BottomTabTutorialWrapper = ({
  name,
  order,
  stepNumber,
  totalSteps = 5,
  title,
  description,
  children,
}) => {
  const { currentStep } = useCopilot();
  const isActive = currentStep?.name === name;

  return (
    <View style={styles.relativeContainer}>
      
      {/* Background Illusion for Bottom Tabs */}
      {isActive && (
        <View style={styles.bottomWhiteArea} />
      )}

      {/* Text perfectly positioned above the bottom tab */}
      {isActive && (
        <View style={styles.textContainer}>
          <Text style={styles.counter}>
            {String(stepNumber).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}
          </Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}

      {/* Target Tab */}
      <CopilotStep name={name} order={order} text="dummy">
        <WalkableView style={styles.targetWrapper}>
          {children}
        </WalkableView>
      </CopilotStep>
    </View>
  );
};

export default BottomTabTutorialWrapper;

const styles = StyleSheet.create({
  relativeContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 100,
  },
  bottomWhiteArea: {
    position: 'absolute',
    bottom: -50, // Tuck under the screen slightly
    left: -width / 2, // Ensure it covers the width of the whole tab bar
    width: width * 2,
    height: height * 0.45, // Only covers the bottom portion of the screen
    backgroundColor: '#F6F7FB',
    zIndex: 10,
  },
  textContainer: {
    position: 'absolute',
    // Push the text UP so it sits well above the bottom navigation bar
    bottom: 160, 
    // Anchor to the left side of the screen
    left: -Dimensions.get('window').width / 2 + 60, 
    width: width * 0.85, 
    zIndex: 100, 
  },
  targetWrapper: {
    zIndex: 20, 
    width: '100%',
  },
  counter: {
    color: '#FF7A59',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#64748B',
    lineHeight: 22,
  },
});