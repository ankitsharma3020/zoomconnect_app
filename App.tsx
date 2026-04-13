import React from 'react';
import { Dimensions, Easing, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RouteManager from './Src/navigation/routemanager';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as StoreProvider } from 'react-redux';
import { persistStore } from 'redux-persist';
import store from './Src/redux/store';
import { CopilotProvider } from 'react-native-copilot';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import navigationservice from './Src/component/pushNotification/navigationservice';
import PushNotificationComponent from './Src/component/pushNotification/pushNotification';
import CustomCopilotTooltip from './Src/component/CustomCopilotTooltip';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
//  LARGE CIRCLE SVG MASK
//
//  What the screenshots show:
//    • The entire TOP portion of the screen is revealed inside a big white circle
//    • The bottom (where tooltip sits) stays dark / outside the circle
//    • The circle is centred on the highlighted element but is VERY large —
//      roughly half the screen width as radius — so it feels like a "spotlight"
//      that exposes a whole section, not just a small cutout.
//
//  How it works:
//    1. Full canvas rect drawn clockwise  → fills everything with the overlay
//    2. Large circle drawn counter-clockwise → punches a transparent hole
//
//  The radius multiplier (RADIUS_FACTOR) controls how big the spotlight is.
//  1.2 ≈ matches the screenshots.  Increase it for a bigger circle.
// ──────────────────────────────────────────────────────────────────────────── ─
const RADIUS_FACTOR = 0.85; // Locked size

const circularSvgMaskPath = ({ size, position, canvasSize, step }) => {
  const canvasX = canvasSize?.x ?? Dimensions.get('window').width;
  const canvasY = canvasSize?.y ?? Dimensions.get('window').height;

  // Safely extract values
  const posY = position?.y?._value ?? position?.y ?? 0;
  const posX = position?.x?._value ?? position?.x ?? 0;
  const sizeX = size?.x?._value ?? size?.x ?? 0;
  const sizeY = size?.y?._value ?? size?.y ?? 0;

  // 🔥 Fallback safe path prevents the mask from ever crashing!
  const safeFallback = `M0,0H${canvasX}V${canvasY}H0V0Z`;

  if (canvasX === 0) return safeFallback;

  // 🔥 SMART IDENTIFICATION: Use step.name instead of guessing by Y position!
  const stepName = step?.name;

  if (stepName === 'profile') {
    // ── TIGHT CIRCULAR CUTOUT (Step 5) ──
    const cx = posX + (sizeX / 2);
    const cy = posY + (sizeY / 2);
    const r = (Math.max(sizeX, sizeY) / 2) + 15; // Clean circle framing your real avatar

    if (isNaN(cx) || isNaN(cy) || isNaN(r)) return safeFallback;

    return [
      `M0,0 H${canvasX} V${canvasY} H0 V0 Z`,
      `M${cx},${cy - r}`,
      `A${r},${r} 0 1,0 ${cx},${cy + r}`,
      `A${r},${r} 0 1,0 ${cx},${cy - r}`,
      `Z`,
    ].join(' ');
  }

  if (stepName === 'claimsTab' || stepName === 'wellnessTab' || stepName === 'helpTab') {
    // ── BOTTOM DOME (Steps 2, 3, 4) ──
    const cx = canvasX / 2;
    const cy = canvasY + (canvasX * 0.4); 
    const r = canvasX * 1.35; 
    
    if (isNaN(cx) || isNaN(cy) || isNaN(r)) return safeFallback;
    
    return [
      `M0,0 H${canvasX} V${canvasY} H0 V0 Z`,
      `M${cx},${cy - r}`, `A${r},${r} 0 1,0 ${cx},${cy + r}`, `A${r},${r} 0 1,0 ${cx},${cy - r}`, `Z`,
    ].join(' ');
  }

  // ── TOP SWEEP (Step 1 - policyCard) ──
  const cx = canvasX / 2;
  const cy = posY - 20; 
  const r = canvasX * 0.95; 
  
  if (isNaN(cx) || isNaN(cy) || isNaN(r)) return safeFallback;
  
  return [
    `M0,0 H${canvasX} V${canvasY} H0 V0 Z`,
    `M${cx},${cy - r}`, `A${r},${r} 0 1,0 ${cx},${cy + r}`, `A${r},${r} 0 1,0 ${cx},${cy - r}`, `Z`,
  ].join(' ');
};
// const circularSvgMaskPath = ({ size, position, canvasSize }: any): string => {
//   const canvasX = canvasSize?.x ?? width;
//   const canvasY = canvasSize?.y ?? height;
//   const posY = position?.y?._value ?? position?.y ?? 0;
  
//   const cx = canvasX / 2;
//   // Shift the center slightly higher
//   const cy = posY - 120; 
//   // 🔥 Reduce radius from 1.1 to 0.95 to bring the black mask higher up
//   const r = canvasX * 0.95; 

//   if (canvasX === 0) return `M0,0H${canvasX}V${canvasY}H0V0Z`;

//   return [
//     `M0,0 H${canvasX} V${canvasY} H0 V0 Z`,
//     `M${cx},${cy - r}`,
//     `A${r},${r} 0 1,0 ${cx},${cy + r}`,
//     `A${r},${r} 0 1,0 ${cx},${cy - r}`,
//     `Z`,
//   ].join(' ');
// };
// ─────────────────────────────────────────────────────────────────────────────
const App = () => {
  const persistor = persistStore(store);

  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
       <CopilotProvider
  tooltipComponent={CustomCopilotTooltip}
  stepNumberComponent={() => null}   
  arrowColor="transparent"
  tooltipStyle={{ 
    position: 'absolute', 
    bottom: 40, 
    left: 0, // Forces it to start at the exact left edge
    
    // 🔥 ADD THESE 3 LINES TO BREAK OUT OF COPILOT'S WIDTH LIMITS 🔥
    width: width, // Forces the wrapper to take the full screen width
    maxWidth: width, // Overrides Copilot's automatic shrinking
    overflow: 'visible', // Ensures nothing gets clipped if it shifts slightly
    
    backgroundColor: 'transparent', 
    elevation: 0, 
    shadowOpacity: 0 
  }}

  overlay="svg"
  backdropColor="rgba(0, 0, 0, 0.85)"
  svgMaskPath={circularSvgMaskPath}
  animationDuration={300}
  easing={Easing.out(Easing.cubic)}
>
            <NavigationContainer
              ref={(e) => navigationservice.setToplevelNavigation(e)}
            >
              <PushNotificationComponent />
              <RouteManager />
            </NavigationContainer>
          </CopilotProvider>
        </SafeAreaProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  bootLogo: {
    width:  width  * 0.7,
    height: height * 0.3,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
//  HOW TO USE ON ANY SCREEN
// ─────────────────────────────────────────────────────────────────────────────
//
//  import { CopilotStep, walkthroughable } from 'react-native-copilot';
//  const WalkableView = walkthroughable(View);
//
//  Step text uses "\n" to split title from description:
//
//  <CopilotStep
//    name="policyCard"          ← must match key in STEP_MAP
//    order={1}
//    text={"Policy\nGet a quick overview of your policy details from Policy Card."}
//  >
//    <WalkableView><PolicyCard /></WalkableView>
//  </CopilotStep>
//
//  <CopilotStep name="claimsTab" order={2}
//    text={"Register or track a claim\nFile a new claim or track ongoing and past claims here!"}>
//    <WalkableView><ClaimsTab /></WalkableView>
//  </CopilotStep>