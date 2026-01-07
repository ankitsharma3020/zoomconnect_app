import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import PolicyScreen from '../screens/PolicyScreen';
import claimScreen from '../screens/claims';
import wellness from '../screens/wellness';
import Dashboard from '../screens/dashboard';
import Help from '../screens/Help';
import { hp } from '../utilites/Dimension';

const { width } = Dimensions.get('window');

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

const PolicyIcon = ({ size = 24, color = '#8E9AAF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 13H8M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClaimsIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <>
        <Path d="M9 2C8.46957 2 7.96086 2.21071 7.58579 2.58579C7.21071 2.96086 7 3.46957 7 4V5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H17V4C17 3.46957 16.7893 2.96086 16.4142 2.58579C16.0391 2.21071 15.5304 2 15 2H9Z" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M7 10H17M7 14H17M7 18H13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ) : (
      <>
        <Path d="M9 2C8.46957 2 7.96086 2.21071 7.58579 2.58579C7.21071 2.96086 7 3.46957 7 4V5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H17V4C17 3.46957 16.7893 2.96086 16.4142 2.58579C16.0391 2.21071 15.5304 2 15 2H9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M7 10H17M7 14H17M7 18H13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    )}
  </Svg>
);

const WellnessIcon = ({ size = 24, color = '#8E9AAF', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
      fill={filled ? color : 'none'}
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const HelpIcon = ({ size = 20, color = '#5B6EF5', filled = false }) => (
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








const BottomTabBar = () => {
  const [activeTab, setActiveTab] = useState('Policy');

  const tabs = [
    { name: 'Home', icon: HomeIcon, screen: Dashboard },
    { name: 'Claims', icon: ClaimsIcon, screen: claimScreen },
    { name: 'Policy', icon: PolicyIcon, screen: PolicyScreen },
    { name: 'Wellness', icon: WellnessIcon, screen: wellness },
    { name: 'Help', icon: HelpIcon, screen: Help },
  ];

  const centerIndex = Math.floor(tabs.length / 2);
  const ActiveScreen = tabs.find(tab => tab.name === activeTab)?.screen || PolicyScreen;

  return (
    <View style={styles.safeArea}>
      <View style={styles.content}>
     <ScrollView contentContainerStyle={styles.scrollContent}>
       
          {tabs.map((tab) => {
            const ScreenComponent = tab.screen;
            const isActive = activeTab === tab.name;
            
            return (
              <View 
                key={tab.name} 
                style={{ 
                  // If active, show it. If not, hide it but keep it in memory.
                  display: isActive ? 'flex' : 'none',
                  flex: 1 
                }}
              >
                <ScreenComponent />
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.container}>
        <Svg
          height="100"
          width={width}
          style={styles.wave}
        >
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
              <Stop offset="1" stopColor="#f8f9fa" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d={`
              M 0 25
              L 0 100
              L ${width} 100
              L ${width} 25
              Q ${width * 0.625} 25 ${width * 0.575} 12
              Q ${width * 0.5} -5 ${width * 0.425} 12
              Q ${width * 0.375} 25 0 25
              Z
            `}
            fill="url(#grad)"
            stroke="#e0e0e0"
            strokeWidth="0.5"
          />
        </Svg>

        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => {
            const isCenter = index === centerIndex;
            const isActive = activeTab === tab.name;
            const IconComponent = tab.icon;

            if (isCenter) {
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.centerTabWrapper}
                  onPress={() => setActiveTab(tab.name)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.centerButton,
                    isActive && styles.centerButtonActive
                  ]}>
                    <View style={[
                      styles.centerButtonInner,
                      styles.centerButtonInnerActive
                    ]}>
                      <IconComponent 
                        size={28} 
                        color="#ffffff"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => setActiveTab(tab.name)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconWrapper,
                  isActive && styles.iconWrapperActive
                ]}>
                  <IconComponent 
                    size={24} 
                    color={isActive ? '#934790' : '#8E9AAF'}
                    filled={isActive}
                  />
                </View>
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive
                ]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // height:-hp('9'),
    // backgroundColor: 'red',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    // flexGrow: 1,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(9),
  },
  screenText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  screenSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  screenDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  container: {
    position: 'relative',
   
    // backgroundColor: 'red',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  iconWrapperActive: {
    transform: [{ scale: 1.1 }, { translateY: -2 }],
  },
  tabLabel: {
    fontSize: 11,
    color: '#8E9AAF',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#934790',
    fontWeight: '600',
  },
  centerTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    top: -30,
  },
  centerButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  centerButtonActive: {
    backgroundColor: '#934790',
    transform: [{ scale: 1.05 }],
    shadowColor: '#934790',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  centerButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonInnerActive: {
    backgroundColor: '#934790',
  },
});

export default BottomTabBar;