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
//  PERFECT CIRCULAR SVG MASK
// ─────────────────────────────────────────────────────────────────────────────
const circularSvgMaskPath = ({ size, position, canvasSize, step }) => {
  const canvasX = canvasSize?.x ?? Dimensions.get('window').width;
  const canvasY = canvasSize?.y ?? Dimensions.get('window').height;

  const posY = position?.y?._value ?? position?.y ?? 0;
  const posX = position?.x?._value ?? position?.x ?? 0;
  const sizeX = size?.x?._value ?? size?.x ?? 0;
  const sizeY = size?.y?._value ?? size?.y ?? 0;

  const safeFallback = `M0,0H${canvasX}V${canvasY}H0V0Z`;

  if (canvasX === 0) return safeFallback;

  const stepName = step?.name;

  // 🔥 STEP 1 (Policy Card): Tiny Invisible Hole
  // Since we anchored this to a 1x1 pixel in PolicyScreen, and our Custom Tooltip 
  // draws the massive white dome, we want to leave the black overlay completely intact!
  if (stepName === 'policyCard') {
    const cx = posX + (sizeX / 2);
    const cy = posY + (sizeY / 2);
    const r = 1; // Tiny 1px hole prevents layout distortion!

    if (isNaN(cx) || isNaN(cy) || isNaN(r)) return safeFallback;

    return [
      `M0,0 H${canvasX} V${canvasY} H0 V0 Z`,
      `M${cx},${cy - r}`,
      `A${r},${r} 0 1,0 ${cx},${cy + r}`,
      `A${r},${r} 0 1,0 ${cx},${cy - r}`,
      `Z`,
    ].join(' ');
  }

  // 🔥 ALL OTHER STEPS (Profile, Claims, Wellness, Help): Tight clean circles!
  // This automatically frames the real elements cleanly.
  const cx = posX + (sizeX / 2);
  const cy = posY + (sizeY / 2);
  const r = (Math.max(sizeX, sizeY) / 2) + 15;

  if (isNaN(cx) || isNaN(cy) || isNaN(r)) return safeFallback;

  return [
    `M0,0 H${canvasX} V${canvasY} H0 V0 Z`,
    `M${cx},${cy - r}`,
    `A${r},${r} 0 1,0 ${cx},${cy + r}`,
    `A${r},${r} 0 1,0 ${cx},${cy - r}`,
    `Z`,
  ].join(' ');
};

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
              // 🔥 REMOVED `bottom: 40` so Step 1 is free to anchor at the top of the screen!
              left: 0, 
              width: width, 
              maxWidth: width, 
              overflow: 'visible', 
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