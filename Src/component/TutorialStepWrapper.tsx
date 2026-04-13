import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';
import { hp, wp } from '../utilites/Dimension';

const WalkableView = walkthroughable(View);
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 1.5;
const TutorialStepWrapper = ({
  name,
  order,
  stepNumber,
  totalSteps = 5,
  title,
  description,
  children,
  // Adjust this negative value to move the white circle & text higher or lower relative to your card
  circleTopOffset = -220, 
}) => {
  const { currentStep } = useCopilot();
  const isActive = currentStep?.name === name;

  return (
    <View style={styles.relativeContainer}>
      {/* THE ILLUSION: 
        When active, render a massive solid white circle behind the component. 
        This hides the background headers and holds your text.
      */}
      {isActive && (
        <View style={[styles.giantWhiteCircle, { top: circleTopOffset }]}>
          <View style={[styles.textContainer]}>
            <Text style={styles.counter}>
              {String(stepNumber).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      )}

      {/* THE TARGET: Only your card is passed to Copilot so it centers perfectly */}
      <CopilotStep name={name} order={order} text="dummy">
        <WalkableView style={styles.targetWrapper}>
          {children}
        </WalkableView>
      </CopilotStep>
    </View>
  );
};

export default TutorialStepWrapper;

const styles = StyleSheet.create({
  relativeContainer: {
    position: 'relative',
    zIndex: 1,
  },
  giantWhiteCircle: {
    position: 'absolute',
    alignSelf: 'center',
    width: width * 2.5,  // Massive width to ensure it covers the screen horizontally
    height: width * 2.5,
    backgroundColor: '#F4F5F9', // Solid off-white background matching your screenshot
    borderRadius: width * 1.25, // Perfect circle
    zIndex: 10,
    alignItems: 'center',
    // paddingTop: 80, // Pushes the text down from the top edge of the circle
  },
  textContainer: {
    width: wp(98),
    paddingHorizontal: wp(3.5),
    // 🔥 THE FIX: Pushes the content below the header area dynamically
    paddingTop: hp(1), 
    zIndex: 10,
  },
  targetWrapper: {
    zIndex: 20, // Ensures your card renders ON TOP of the giant white circle
  },
  counter: {
    color: '#FF7A59',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 8,
  },
title: {
    fontSize: wp(4.7),
    fontFamily: 'Montserrat-Bold',
    color: '#1E293B',
    marginTop: hp(0.5),
  },
description: {
    fontSize: wp(3),
    fontFamily: 'Montserrat-SemiBold',
    color: '#393e46',
    // 🔥 Added lineHeight so the 4 lines have clean spacing
    lineHeight: hp(1.8), 
    marginTop: hp(1),
  },
});