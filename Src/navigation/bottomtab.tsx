import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🔥 IMPORT REACT-NATIVE-COPILOT 🔥
import { useCopilot, CopilotStep, walkthroughable } from 'react-native-copilot';

// Import screens
import Dashboard from '../screens/dashboard';
import claimScreen from '../screens/claims';
import PolicyScreen from '../screens/PolicyScreen';
import wellness from '../screens/wellness';
import Help from '../screens/Help';
import { hp } from '../utilites/Dimension';
import TutorialStepWrapper from '../component/TutorialStepWrapper';
import BottomTabTutorialWrapper from '../component/BottomTabTutorialWrapper';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// 🔥 DEFINE THIS OUTSIDE THE COMPONENT 🔥
const CopilotView = walkthroughable(View);

// --- ICONS ---
const HomeIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M9 12H15V21H9V12Z" fill="#ffffff"/>
      </>
    ) : (
      <>
        <Path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M9 21V12H15V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    )}
  </Svg>
);

const PolicyIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Path d="M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <>
        <Path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </Svg>
);

const ClaimsIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Path d="M12 2.714A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 12.75 11.25 15 15 9.75" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ) : (
      <>
        <Path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </Svg>
);

const WellnessIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpIcon = ({ size = 20, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Path d="M12 2C7.58 2 4 5.58 4 10C4 13.87 6.67 16.54 9 17.5V19C9 19.55 9.45 20 10 20H14C14.55 20 15 19.55 15 19V17.5C17.33 16.54 20 13.87 20 10C20 5.58 16.42 2 12 2Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M11 18H13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ) : (
      <>
        <Path d="M11 18H13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M12 2C7.58 2 4 5.58 4 10C4 13.87 6.67 16.54 9 17.5V19C9 19.55 9.45 20 10 20H14C14.55 20 15 19.55 15 19V17.5C17.33 16.54 20 13.87 20 10C20 5.58 16.42 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    )}
  </Svg>
);

// --- CUSTOM TAB BAR COMPONENT ---
// --- CUSTOM TAB BAR COMPONENT ---
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const {data:PolicyData, isLoading:policyLoading} = useSelector((state:any)=>state.policy);
  let enrollmentlistdata = PolicyData?.data?.enrolment;
console.log("enrollmentlistdata", enrollmentlistdata);
const enrollmentLogic = useMemo(() => {
    if (!enrollmentlistdata) return { shouldShowImage: false };

    // Check if new_enrolment_assigned exists and has at least one item
    const shouldShowImage = enrollmentlistdata?.new_enrolment_assigned?.length > 0;

    return { shouldShowImage };
  }, [enrollmentlistdata]);
  
  const { currentStep } = useCopilot();
  const isTabStep = ['claimsTab', 'wellnessTab', 'helpTab'].includes(currentStep?.name);

  const baseSvgHeight = hp(11); 
  const dynamicSvgHeight = baseSvgHeight + insets.bottom;
  const dynamicContainerHeight = hp(5) + insets.bottom;
  const dynamicPaddingBottom = hp(0.9) + insets.bottom;

  const getIcon = (routeName, focused) => {
    switch (routeName) {
      case 'Home': return <HomeIcon size={24} color={focused ? '#934790' : '#8E9AAF'} filled={focused} />;
      case 'Claims': return <ClaimsIcon size={24} color={focused ? '#934790' : '#8E9AAF'} filled={focused} />;
      case 'Policy': return <PolicyIcon size={28} color="#ffffff" />; 
      case 'Wellness': return <WellnessIcon size={24} color={focused ? '#934790' : '#8E9AAF'} filled={focused} />;
      case 'Help': return <HelpIcon size={20} color={focused ? '#934790' : '#8E9AAF'} filled={focused} />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <Svg height={dynamicSvgHeight} width={width} style={styles.wave}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="1" stopColor="#f8f9fa" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M 0 25 L 0 ${dynamicSvgHeight} L ${width} ${dynamicSvgHeight} L ${width} 25 Q ${width * 0.625} 25 ${width * 0.575} 12 Q ${width * 0.5} -5 ${width * 0.425} 12 Q ${width * 0.375} 25 0 25 Z`}
          fill="url(#grad)"
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      </Svg>

      <View style={[styles.tabContainer, { height: dynamicContainerHeight, paddingBottom: dynamicPaddingBottom }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;
          const isCenter = route.name === 'Policy'; 

          // Determine if the current tab should be disabled
          const isTabDisabled = 
  (!PolicyData?.data?.policy_details || PolicyData?.data?.policy_details?.length === 0) && 
  (route.name === 'Home' || route.name === 'Claims');

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          if (isCenter) {
            return (
              <TouchableOpacity key={route.key} style={styles.centerTabWrapper} onPress={onPress} activeOpacity={0.8}>
                <View style={[styles.centerButton, isFocused && styles.centerButtonActive]}>
                  <View style={[styles.centerButtonInner, styles.centerButtonInnerActive]}>
                    {getIcon(route.name, isFocused)}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          const tabContent = (
            <TouchableOpacity 
              style={[styles.tabInner, isTabDisabled && { opacity: 0.35 }]} 
              onPress={onPress} 
              activeOpacity={0.7}
              disabled={isTabDisabled} // 🔥 THIS KILLS ALL CLICKING EFFECTS 🔥
            >
              <View style={[styles.iconWrapper, isFocused && !isTabDisabled && styles.iconWrapperActive]}>
                 {getIcon(route.name, isFocused)}
              </View>
              <Text style={[styles.tabLabel, isFocused && !isTabDisabled && styles.tabLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );

          if (route.name === 'Claims') {
            return (
              <CopilotStep 
                name="claimsTab" 
                order={2} 
                text={"Register or track a claim\nFile a new claim or track ongoing and past claims here!"}
              >
                <CopilotView style={styles.tabWrapper}>
                  {tabContent}
                </CopilotView>
              </CopilotStep>
            );
          }

          if (route.name === 'Wellness') {
            return (
              <CopilotStep 
                name="wellnessTab" 
                order={3} 
                text={"Your Wellness Journey\nUnlock exclusive health programs to elevate your daily lifestyle."}
              >
                <CopilotView style={styles.tabWrapper}>
                  {tabContent}
                </CopilotView>
              </CopilotStep>
            );
          }

          if (route.name === 'Help') {
            return (
              <CopilotStep 
                name="helpTab" 
                order={4} 
                text={"Help & Support\nNeed assistance? Get help and support for your policies here."}
              >
                <CopilotView style={styles.tabWrapper}>
                  {tabContent}
                </CopilotView>
              </CopilotStep>
            );
          }

          return (
            <View key={route.key} style={styles.tabWrapper}>
              {tabContent}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// --- MAIN NAVIGATOR ---
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      initialRouteName="Policy"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Claims" component={claimScreen} />
      <Tab.Screen name="Policy" component={PolicyScreen} />
      <Tab.Screen name="Wellness" component={wellness} />
      <Tab.Screen name="Help" component={Help} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 0 },
  wave: { position: 'absolute', bottom: 0, left: 0 },
  tabContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: 'transparent' },
  tabWrapper: { flex: 1 }, 
  tabInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, width: '100%' },
  iconWrapper: { marginBottom: 4 },
  iconWrapperActive: { transform: [{ scale: 1.1 }, { translateY: -2 }] },
  tabLabel: { fontSize: 11, color: '#8E9AAF', fontWeight: '500' },
  tabLabelActive: { color: '#934790', fontWeight: '600' },
  centerTabWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', position: 'relative', top: -35 },
  centerButton: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#d0d0d0', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 12 },
  centerButtonActive: { backgroundColor: '#934790', transform: [{ scale: 1.05 }], shadowColor: '#934790', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 16 },
  centerButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center' },
  centerButtonInnerActive: { backgroundColor: '#934790' },
});

export default MainTabs;