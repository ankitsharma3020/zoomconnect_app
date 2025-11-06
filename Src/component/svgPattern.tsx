import React from 'react';
import { StyleSheet } from 'react-native';
import { Svg, Defs, Pattern, Rect, Circle } from 'react-native-svg';

const SvgPattern = ({ color = '#FFFFFF', opacity = 0.1 }) => {
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        {/* This defines the pattern's "tile" */}
        <Pattern
          id="dot"
          width="10" // The tile is 10x10 pixels
          height="10"
          patternUnits="userSpaceOnUse"
        >
          {/* A 1-pixel radius circle in the middle of the tile */}
          <Circle cx="5" cy="5" r="1" fill={color} />
        </Pattern>
      </Defs>

      {/* This fills the entire screen with the pattern tile */}
      <Rect
        width="100%"
        height="100%"
        fill="url(#dot)"
        opacity={opacity}
      />
    </Svg>
  );
};

export default SvgPattern;