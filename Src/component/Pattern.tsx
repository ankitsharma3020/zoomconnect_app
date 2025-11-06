import React from 'react';
import { StyleSheet } from 'react-native';
import { Svg, Defs, Pattern, Rect, Circle } from 'react-native-svg';

const DotPattern = ({ color = '#FFFFFF', opacity = 0.1 }) => {
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        {/* This defines the pattern tile */}
        <Pattern
          id="dot"
          width="10" // The tile is 10x10
          height="10"
          patternUnits="userSpaceOnUse"
        >
          {/* A 1-radius circle in the middle of the tile */}
          <Circle cx="5" cy="5" r="1" fill={color} />
        </Pattern>
      </Defs>

      {/* This fills the entire Svg area with the pattern */}
      <Rect
        width="100%"
        height="100%"
        fill="url(#dot)"
        opacity={opacity}
      />
    </Svg>
  );
};

export default DotPattern;