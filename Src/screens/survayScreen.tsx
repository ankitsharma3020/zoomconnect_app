import React, { useState, useEffect, useRef, use } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  SectionList,
  Platform,
  Image,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

// --- THEME COLORS ---
const COLORS = {
  bg: '#F0F3F7', 
  text: '#2D3436',
  textLight: '#636E72',
  white: '#FFFFFF',
  
  // Section Header
  headerGradStart: '#774196ff',
  headerGradEnd: '#9c16b4ff',

  // Card Styling
  cardBgStart: 'rgba(255, 255, 255, 0.95)', 
  cardBgEnd: 'rgba(245, 247, 250, 0.9)',    
  cardBorder: 'rgba(255, 255, 255, 0.6)',
  shadowColor: '#1e022e', 

  // Button Colors
  btnActiveStart: '#6f4d83ff',
  btnActiveEnd: '#a235b3ff',
  btnDisabledBg: '#DFE6E9',
  btnTextDisabled: '#B2BEC3',
};

// --- DUMMY DATA ---
const SURVEY_SECTIONS = [
  {
    title: 'Active Surveys',
    data: [
      {
        id: '1',
        title: 'Employee Satisfaction 2025',
        desc: 'Share your thoughts in our annual quick survey!',
        dateRange: '24 Oct - 24 Nov 2025',
        status: 'active',
        // Darker pastel gradient for image background
        gradient: ['#cab0acff', '#deb0e2ff'], // Pastel Red/Pink
        icon: require('../../assets/empsu.png')  
      },
      {
        id: '2',
        title: 'Workplace Wellness Check',
        desc: 'Help us improve the office environment.',
        dateRange: '01 Nov - 15 Nov 2025',
        status: 'active',
        gradient: ['#B5EAD7', '#C7CEEA'], // Pastel Green/Blue
        icon: require('../../assets/empsu1.png') 
      },
    ]
  },
  {
    title: 'Upcoming Surveys',
    data: [
      {
        id: '3',
        title: 'Q4 Performance Review',
        desc: 'Self-evaluation and peer feedback period.',
        dateRange: 'Starts 01 Dec 2025',
        status: 'upcoming',
        gradient: ['#FFDAC1', '#FF9AA2'], // Pastel Peach/Pink
        icon: require('../../assets/empsu.png')
      },
      {
        id: '4',
        title: 'Cafeteria Menu Feedback',
        desc: 'Vote on the new lunch options for 2026.',
        dateRange: 'Starts 10 Dec 2025',
        status: 'upcoming',
        gradient: ['#E2F0CB', '#B5EAD7'], // Pastel Green
        icon: require('../../assets/empsu1.png')
      },
    ]
  }
];

// --- BACKGROUND PATTERN ---
const BackgroundPattern = () => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: -hp(10), right: -wp(12.5), width: wp(62.5), height: wp(62.5), borderRadius: wp(31.25), backgroundColor: 'rgba(62, 22, 86, 0.04)' }} />
        <View style={{ position: 'absolute', top: height * 0.3, left: -wp(20), width: wp(50), height: wp(50), borderRadius: wp(25), backgroundColor: 'rgba(62, 22, 86, 0.04)' }} />
        <View style={{ position: 'absolute', bottom: hp(12.5), right: wp(10), width: wp(30), height: wp(30), borderRadius: wp(7.5), backgroundColor: 'rgba(62, 22, 86, 0.03)', transform: [{rotate: '30deg'}] }} />
    </View>
);

// --- SHIMMER COMPONENT ---
const ShimmerCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.cardOuterShadow}>
      <View style={[styles.cardMainBody, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.cardContent}>
          <Animated.View style={{ width: wp(20), height: hp(1.5), backgroundColor: '#E0E0E0', borderRadius: 4, marginBottom: 8, opacity }} />
          <Animated.View style={{ width: wp(40), height: hp(2.5), backgroundColor: '#E0E0E0', borderRadius: 4, marginBottom: 6, opacity }} />
          <Animated.View style={{ width: wp(50), height: hp(1.5), backgroundColor: '#E0E0E0', borderRadius: 4, marginBottom: 14, opacity }} />
          <Animated.View style={{ width: wp(25), height: hp(4), backgroundColor: '#E0E0E0', borderRadius: 12, opacity }} />
        </View>
        <Animated.View style={{ width: wp(28.5), height: '100%', backgroundColor: '#E0E0E0', opacity }} />
      </View>
    </View>
  );
};

const SurveyListScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation=useNavigation();
  // --- Animation State for List Items ---
  // We need a way to trigger animations for items. 
  // Since SectionList renders items lazily, we can animate them in the renderItem.
  // Using a map to store animated values for each item ID would be ideal, 
  // but for simplicity in this example, we'll animate them as they mount.

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePress = (item) => {
    if (item.status === 'active') {
     navigation.navigate('SurvayDetails');
    }
  };

  // --- RENDER SINGLE BANNER ITEM ---
  const renderBanner = ({ item, index, section }) => {
    // Simple fade-in and slide-up animation on mount
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (!loading) {
            // Stagger based on index slightly if possible, or just animate on mount
            // For true staggering across sections, complex logic is needed.
            // Here we animate when the component mounts after loading is false.
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    delay: index * 100, // Simple delay based on index within section
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    delay: index * 100,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [loading]);

    if (loading) return null; // Don't render real items while loading

    const isActive = item.status === 'active';

    const ButtonContent = () => (
        <Text style={[
            styles.btnText, 
            isActive ? { color: COLORS.white } : { color: COLORS.btnTextDisabled }
        ]}>
            {isActive ? 'Take Survey' : 'Upcoming'}
        </Text>
    );

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity 
            activeOpacity={isActive ? 0.9 : 1}
            onPress={() => isActive && handlePress(item)}
            style={styles.cardOuterShadow}
          >
            {/* Main Card Body Gradient (Subtle Glass effect) */}
            <LinearGradient
                colors={[COLORS.cardBgStart, COLORS.cardBgEnd]}
                style={styles.cardMainBody}
            >
              
              {/* LEFT SIDE: CONTENT */}
              <View style={styles.cardContent}>
                <View>
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusUpcoming]}>
                        <Text style={styles.dateText}>{item.dateRange}</Text>
                    </View>
                    
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
                </View>

                {/* Action Button */}
                {isActive ? (
                    <LinearGradient
                        colors={[COLORS.btnActiveStart, COLORS.btnActiveEnd]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        style={styles.actionBtnGradient}
                    >
                        <ButtonContent />
                    </LinearGradient>
                ) : (
                    <View style={[styles.actionBtnGradient, { backgroundColor: COLORS.btnDisabledBg }]}>
                        <ButtonContent />
                    </View>
                )}
              </View>

              {/* RIGHT SIDE: Floating Graphic */}
              <LinearGradient 
                colors={item.gradient} 
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={styles.floatingGraphic}
              >
                 <View style={styles.graphicCircle1} />
                 <View style={styles.graphicCircle2} />
                 <Image
                    source={item.icon}
                    style={styles.graphicIcon}
                    resizeMode="cover" // Changed to contain for better fit inside the graphic area
                 />
              </LinearGradient>

            </LinearGradient>
          </TouchableOpacity>
      </Animated.View>
    );
  };

  // --- RENDER SECTION HEADER ---
  const renderSectionHeader = ({ section: { title } }) => {
      if (loading) return null;
      return (
        <View style={styles.sectionHeaderContainer}>
            <LinearGradient
                colors={[COLORS.headerGradStart, COLORS.headerGradEnd]}
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                style={styles.sectionHeaderGradient}
            >
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </LinearGradient>
        </View>
      );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <BackgroundPattern />
      
      <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={styles.topBar} onPress={()=>navigation.goBack()} >
                        <Icon name="arrow-left" size={hp(3.2)} color={COLORS.textDark} />
                         <Text style={styles.screenTitle}>Surveys</Text>
                    </TouchableOpacity>
     

        {loading ? (
            <View style={{ paddingHorizontal: 0, paddingTop: 20 }}>
                {/* Render Shimmer Cards */}
                <View style={{paddingHorizontal: wp(5.5), paddingBottom: 15}}><View style={[styles.sectionHeaderGradient, {width: 120, height: 30, backgroundColor: '#E0E0E0'}]} /></View>
                <ShimmerCard />
                <ShimmerCard />
                <View style={{paddingHorizontal: wp(5.5), paddingBottom: 15, paddingTop: 20}}><View style={[styles.sectionHeaderGradient, {width: 120, height: 30, backgroundColor: '#E0E0E0'}]} /></View>
                <ShimmerCard />
            </View>
        ) : (
            <SectionList
              sections={SURVEY_SECTIONS}
              keyExtractor={(item) => item.id}
              renderItem={renderBanner}
              renderSectionHeader={renderSectionHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
            />
        )}
      </SafeAreaView>
    </View>
  );
};

export default SurveyListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // --- TOP BAR ---
  topBar: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? hp(2) : 0,
    paddingHorizontal: wp(5.5), // approx 22
    paddingVertical: hp(1.8), // approx 15
  },
  screenTitle: {
    fontSize: hp(3.5), // approx 28
    marginLeft: wp(3), // approx 12
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.text,
    letterSpacing: 0.5,
  },

  // --- LIST ---
  listContent: {
    paddingBottom: hp(5), // approx 40
  },
  
  // --- SECTION HEADER ---
  sectionHeaderContainer: {
    paddingHorizontal: wp(5.5), // approx 22
    paddingTop: hp(3), // approx 25
    paddingBottom: hp(1.8), // approx 15
  },
  sectionHeaderGradient: {
    paddingVertical: hp(1), // approx 8
    paddingHorizontal: wp(4), // approx 16
    borderRadius: wp(3), // approx 12
    alignSelf: 'flex-start',
    shadowColor: COLORS.headerGradStart,
    shadowOffset: { width: 0, height: hp(0.375) }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 6,
  },
  sectionHeaderText: {
    fontSize: hp(1.6), // approx 13
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // --- NEW CARD STYLES ---
  
  // 1. Outer Container for deep shadow
  cardOuterShadow: {
    marginHorizontal: wp(5.5), // approx 22
    marginBottom: hp(2.25), // approx 18
    borderRadius: wp(5), // approx 20
    backgroundColor: 'transparent',
    // Deeper, softer shadow
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // 2. Main Card Body with Subtle Gradient & Border
  cardMainBody: {
    flexDirection: 'row',
    borderRadius: wp(5), // approx 20
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: COLORS.cardBorder, 
    minHeight: hp(18.75), // approx 150
    padding: wp(1), // approx 6
  },

  // Left Side Content
  cardContent: {
    flex: 1,
    padding: wp(2), // approx 12
    paddingLeft: wp(1.5), // approx 14
    justifyContent: 'space-between',
  },
  // New Status Badge
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: hp(0.5), // approx 4
    paddingHorizontal: wp(2), // approx 8
    borderRadius: wp(1.5), // approx 6
    marginBottom: hp(1), // approx 8
  },
  statusActive: { backgroundColor: 'rgba(30, 220, 130, 0.1)' },
  statusUpcoming: { backgroundColor: 'rgba(99, 110, 114, 0.1)' },

  dateText: {
    fontSize: hp(1.15), // approx 10
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: hp(1.5), // approx 17
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.text,
    marginBottom: hp(0.15), // approx 6
    lineHeight: hp(2.75), // approx 22
  },
  cardDesc: {
    fontSize: hp(1.2), // approx 13
    color: COLORS.textLight,
    lineHeight: hp(1.65), // approx 18
    fontFamily: 'Montserrat-SemiBold', // Font
  },
  
  // Button Style (Now a Gradient container)
  actionBtnGradient: {
    marginTop: hp(1.75), // approx 14
    paddingVertical: hp(1.25), // approx 10
    paddingHorizontal: wp(5), // approx 20
    borderRadius: wp(3), // approx 12
    alignSelf: 'flex-start',
  },
  btnText: {
    fontSize: hp(1.4), // approx 13
    fontFamily: 'Montserrat-Bold', // Font
  },

  // RIGHT SIDE: Floating Graphic Pill
  floatingGraphic: {
    width: wp(28.5), // approx 110
    borderRadius: wp(4), // approx 16
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginLeft: wp(1), // approx 4
  },
  graphicIcon: {
    height: hp(12), // approx 72
    width: wp(22), // approx 72
    zIndex: 2,
  },
  graphicCircle1: {
    position: 'absolute',
    top: -hp(2.5), right: -wp(5), // approx -20
    width: wp(22.5), height: wp(22.5), // approx 90
    borderRadius: wp(11.25), // approx 45
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  graphicCircle2: {
    position: 'absolute',
    bottom: -hp(3.125), left: -wp(2.5), // approx -25, -10
    width: wp(17.5), height: wp(17.5), // approx 70
    borderRadius: wp(8.75), // approx 35
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});