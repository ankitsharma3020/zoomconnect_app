import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { wp, hp } from '../utilites/Dimension'; 
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSurveys } from './Epicfiles/MainEpic';

const { height, width } = Dimensions.get('window');

// --- THEME COLORS ---
const COLORS = {
  bg: '#F0F3F7', 
  text: '#2D3436',
  textLight: '#636E72',
  white: '#FFFFFF',
  
  headerGradStart: '#774196ff',
  headerGradEnd: '#9c16b4ff',

  cardBgStart: 'rgba(255, 255, 255, 0.95)', 
  cardBgEnd: 'rgba(245, 247, 250, 0.9)',    
  cardBorder: 'rgba(255, 255, 255, 0.6)',
  shadowColor: '#1e022e', 

  btnActiveStart: '#6f4d83ff',
  btnActiveEnd: '#a235b3ff',
  btnDisabledBg: '#DFE6E9',
  btnTextDisabled: '#B2BEC3',
  
  // Added for Submitted State
  submittedText: '#27ae60', 
};

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
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Select data from Redux
  const { data, isLoading, error } = useSelector((state) => state.surveys);

  useEffect(() => {
    dispatch(fetchSurveys());
  }, []);

  useEffect(() => {
    // If Redux is loading, show shimmer
    setLoading(isLoading);
  }, [isLoading]);

  // --- TRANSFORM API DATA TO UI SECTIONS ---
  const sections = useMemo(() => {
    if (!data?.surveys || data.surveys.length === 0) return [];

    // Map API object to UI object
    const mappedSurveys = data.surveys.map((survey, index) => ({
        id: survey.id || index.toString(),
        title: survey.name,
        // Using static description as requested not to break UI, or use data from API if available later
        desc: 'Share your thoughts and feedback with us.', 
        dateRange: `${survey.survey_start_date} - ${survey.survey_end_date}`,
        status: survey.is_active === 1 ? 'active' : 'inactive',
        is_submit: survey.is_submit, // 1 = Submitted, 0/null = Not Submitted
        survayid: survey?.survey_id,
      
        // Cosmetic properties (Alternating colors for visual appeal)
        gradient: index % 2 === 0 ? ['#cab0acff', '#deb0e2ff'] : ['#B5EAD7', '#C7CEEA'],
        icon: index % 2 === 0 ? require('../../assets/empsu.png') : require('../../assets/empsu1.png')
    }));

    return [
        {
            title: 'Active Surveys',
            data: mappedSurveys
        }
    ];
  }, [data]);


  const handlePress = (item) => {
    // Only navigate if active AND NOT submitted
    if (item.status === 'active' && item.is_submit !== 1) {
       navigation.navigate('SurvayDetails', { surveyId: item.survayid, surveyData: item });
    }
  };

  // --- RENDER SINGLE BANNER ITEM ---
  const renderBanner = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (!loading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0, duration: 500, delay: index * 100, useNativeDriver: true,
                })
            ]).start();
        }
    }, [loading]);

    if (loading) return null;

    const isActive = item.status === 'active';
    const isSubmitted = item.is_submit === 1;

    // --- BUTTON TEXT LOGIC ---
    const getButtonText = () => {
        if (isSubmitted) return 'Submitted';
        if (isActive) return 'Start Survey';
        return 'Upcoming';
    };

    const ButtonContent = () => (
        <Text style={[
            styles.btnText, 
            (isActive && !isSubmitted) ? { color: COLORS.white } : { color: COLORS.btnTextDisabled }
        ]}>
            {getButtonText()}
        </Text>
    );

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <TouchableOpacity 
            activeOpacity={(isActive && !isSubmitted) ? 0.9 : 1}
            onPress={() => handlePress(item)}
            style={styles.cardOuterShadow}
          >
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

                {/* --- ACTION BUTTON LOGIC --- */}
                {isActive && !isSubmitted ? (
                    // CASE 1: Active & Not Submitted -> Show Gradient Button
                    <LinearGradient
                        colors={[COLORS.btnActiveStart, COLORS.btnActiveEnd]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        style={styles.actionBtnGradient}
                    >
                        <ButtonContent />
                    </LinearGradient>
                ) : (
                    // CASE 2: Submitted OR Inactive -> Show Grey Button
                    <View style={[styles.actionBtnGradient, { backgroundColor: COLORS.btnDisabledBg }]}>
                        {isSubmitted && (
                             <Icon name="check-circle" size={14} color={COLORS.btnTextDisabled} style={{marginRight: 6}} />
                        )}
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
                    resizeMode="contain" 
                 />
              </LinearGradient>

            </LinearGradient>
          </TouchableOpacity>
      </Animated.View>
    );
  };

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
                <Icon name="arrow-left" size={hp(3.2)} color={COLORS.text} />
                <Text style={styles.screenTitle}>Surveys</Text>
          </TouchableOpacity>
     

        {loading ? (
            <View style={{ paddingHorizontal: 0, paddingTop: 20 }}>
                <View style={{paddingHorizontal: wp(5.5), paddingBottom: 15}}><View style={[styles.sectionHeaderGradient, {width: 120, height: 30, backgroundColor: '#E0E0E0'}]} /></View>
                <ShimmerCard />
                <ShimmerCard />
            </View>
        ) : (
            <SectionList
              sections={sections} 
              keyExtractor={(item) => item.id}
              renderItem={renderBanner}
              renderSectionHeader={renderSectionHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
              ListEmptyComponent={
                  <View style={{alignItems: 'center', marginTop: hp(10)}}>
                      <Text style={{color: COLORS.textLight, fontFamily: 'Montserrat-Regular'}}>No active surveys found.</Text>
                  </View>
              }
            />
        )}
      </SafeAreaView>
    </View>
  );
};

export default SurveyListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? hp(2) : 0,
    paddingHorizontal: wp(5.5), 
    paddingVertical: hp(1.8),
  },
  screenTitle: {
    fontSize: hp(3),
    marginLeft: wp(3), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.text,
    letterSpacing: 0.5,
  },

  listContent: {
    paddingBottom: hp(5), 
  },
  
  sectionHeaderContainer: {
    paddingHorizontal: wp(5.5), 
    paddingTop: hp(3), 
    paddingBottom: hp(1.8),
  },
  sectionHeaderGradient: {
    paddingVertical: hp(1), 
    paddingHorizontal: wp(4), 
    borderRadius: wp(3), 
    alignSelf: 'flex-start',
    shadowColor: COLORS.headerGradStart,
    shadowOffset: { width: 0, height: hp(0.375) }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 6,
  },
  sectionHeaderText: {
    fontSize: hp(1.6), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  cardOuterShadow: {
    marginHorizontal: wp(5.5), 
    marginBottom: hp(2.25), 
    borderRadius: wp(5), 
    backgroundColor: 'transparent',
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  cardMainBody: {
    flexDirection: 'row',
    borderRadius: wp(5), 
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: COLORS.cardBorder, 
    minHeight: hp(18.75), 
    padding: wp(1),
  },

  cardContent: {
    flex: 1,
    padding: wp(2), 
    paddingLeft: wp(1.5), 
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: hp(0.5), 
    paddingHorizontal: wp(2), 
    borderRadius: wp(1.5), 
    marginBottom: hp(1), 
  },
  statusActive: { backgroundColor: 'rgba(30, 220, 130, 0.1)' },
  statusUpcoming: { backgroundColor: 'rgba(99, 110, 114, 0.1)' },

  dateText: {
    fontSize: hp(1.15), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: hp(1.5), 
    fontFamily: 'Montserrat-Bold', 
    color: COLORS.text,
    marginBottom: hp(0.15), 
    lineHeight: hp(2.75), 
  },
  cardDesc: {
    fontSize: hp(1.2), 
    color: COLORS.textLight,
    lineHeight: hp(1.65), 
    fontFamily: 'Montserrat-SemiBold', 
  },
  
  actionBtnGradient: {
    marginTop: hp(1.75), 
    paddingVertical: hp(1.25), 
    paddingHorizontal: wp(5), 
    borderRadius: wp(3), 
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: hp(1.4), 
    fontFamily: 'Montserrat-Bold', 
  },

  floatingGraphic: {
    width: wp(28.5), 
    borderRadius: wp(4), 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginLeft: wp(1), 
  },
  graphicIcon: {
    height: hp(10), 
    width: wp(20), 
    zIndex: 2,
  },
  graphicCircle1: {
    position: 'absolute',
    top: -hp(2.5), right: -wp(5), 
    width: wp(22.5), height: wp(22.5), 
    borderRadius: wp(11.25), 
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  graphicCircle2: {
    position: 'absolute',
    bottom: -hp(3.125), left: -wp(2.5), 
    width: wp(17.5), height: wp(17.5), 
    borderRadius: wp(8.75), 
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});