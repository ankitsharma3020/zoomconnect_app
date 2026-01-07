import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp } from '../utilites/Dimension'; // Adjusted import path

const { width } = Dimensions.get('window');

// --- COLORS ---
const COLORS = {
  background: '#FFE8D6', 
  primary: '#934790',     
  primaryDark: '#7A3A75',
  primaryLight: '#B565B0',
  white: '#FFFFFF',
  textDark: '#333333',
  textGrey: '#666666',
  accentGreen: '#040e07ff',
  cardBg: '#FFF5FA', 
};

// --- DATA MAPPING ---
const featuresData = [
  { 
    id: 1, 
    title: 'Unlimited Access',
    icon: 'infinity', 
    text: 'Unlimited free Online Consultations in a year.' 
  },
  { 
    id: 2, 
    title: 'Qualified Doctors',
    icon: 'doctor', 
    text: 'GP Consultations provided through Inhouse team of Qualified MBBS Doctors.' 
  },
  { 
    id: 3, 
    title: 'Multilingual Support',
    icon: 'translate', 
    text: 'Multilingual Team of Doctors and Customer Relationship Managers.' 
  },
  { 
    id: 4, 
    title: 'Video & Voice',
    icon: 'video', 
    text: 'Voice and Video Calls.' 
  },
  { 
    id: 5, 
    title: 'Easy Report Upload',
    icon: 'file-upload', 
    text: 'Facility of uploading Test reports through Whatsapp.' 
  },
  { 
    id: 6, 
    title: 'Instant Prescription',
    icon: 'file-pdf-box', 
    text: 'Immediate Prescription sharing in PDF format after each consultation.' 
  }
];

const DoctorOnCallScreen = () => {
    const navigation=useNavigation();
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.goBack()} >
            <Icon name="arrow-left" size={hp(3.2)} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Talk to Doctor (GP)</Text>
          <View style={{ width: wp(10) }} /> 
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          
          {/* 1. HERO SECTION */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBanner}
            >
              <View style={styles.heroBanner1}>
                   <View style={styles.heroContent}>
                <View style={styles.heroTextContainer}>
                  <View style={styles.tagContainer}>
                    <Text style={styles.heroTag}>Doctor On Call</Text>
                  </View>
                  
                  <Text style={styles.heroTitle}>
                    Unlimited <Text style={styles.highlightText}>Free Consultations</Text>
                  </Text>
                  
                  <View style={styles.featureRow}>
                    <Icon name="translate" size={hp(1.8)} color="#FFE0F0" />
                    <Text style={styles.heroSmallText}> Multi-Lingual</Text>
                    <Text style={styles.dot}> • </Text>
                    <Icon name="video" size={hp(1.8)} color="#FFE0F0" />
                    <Text style={styles.heroSmallText}> Video Call</Text>
                  </View>

                  {/* Partition Line */}
                  <View style={styles.heroPartitionLine} />
                  
                  <TouchableOpacity style={styles.callNowButton} activeOpacity={0.8}>
                    <Text style={styles.callNowText}>Call Now</Text>
                    <Icon name="phone-in-talk" size={hp(2.2)} color={COLORS.primary} style={{ marginLeft: wp(2) }} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.imageWrapper}>
                    <Image 
                      source={require('../../assets/taltodocgp.png')} 
                      style={styles.heroImage} 
                      resizeMode="contain"
                    />
                </View>
              </View>
              </View>
            
            </LinearGradient>
          </View>

          {/* 2. SERVICES GRID */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services & Benefits</Text>
            <Text style={styles.sectionSubtitle}>Everything included in the package</Text>
          </View>
          
          <View style={styles.gridContainer}>
            <ServiceCard 
              icon="prescription" 
              title="Instant Rx" 
              subtitle="Prescription on WhatsApp" 
              color="#4CAF50"
            />
            <ServiceCard 
              icon="doctor" 
              title="Consultations" 
              subtitle="Voice & Video Calls" 
              color={COLORS.primary}
            />
            <ServiceCard 
              icon="web" 
              title="Multi-Lingual" 
              subtitle="Speak your language" 
              color="#FF9800"
            />
            <ServiceCard 
              icon="clock-check-outline" 
              title="Availability" 
              subtitle="10 AM - 6 PM Daily" 
              color="#E91E63"
            />
          </View>

          {/* 3. PROCESS TIMELINE */}
          <View style={styles.processSection}>
              <LinearGradient 
                colors={[COLORS.primaryLight, COLORS.primary]} 
                style={styles.sectionHeaderBox}
              >
                <View style={styles.sectionHeaderBox1}>
                   <Text style={styles.sectionHeaderBoxText}>Process Flow</Text>
                </View>
                 
              </LinearGradient>
              
              <View style={styles.timelineContainer}>
                  <TimelineItem 
                      number="1" 
                      title="Initiate Call"
                      text="Customer calls the Toll-free number from their registered mobile." 
                      isLast={false}
                  />
                  <TimelineItem 
                      number="2" 
                      title="Language Routing"
                      text="IVR automatically connects you to a CRM of your preferred language." 
                      isLast={false}
                  />
                  <TimelineItem 
                      number="3" 
                      title="Validation"
                      text="CRM validates your details and understands your health requirement." 
                      isLast={false}
                  />
                  <TimelineItem 
                      number="4" 
                      title="Doctor Connect"
                      text="CRM schedules the appointment & confirms the slot verbally." 
                      isLast={true}
                  />
              </View>
          </View>

          {/* 4. KEY FEATURES (Redesigned with Watermark Pattern & Richer Gradient) */}
          <Text style={[styles.sectionTitle, { marginLeft: wp(5), marginTop: hp(3.75) }]}>Key Features</Text>
          <View style={styles.featuresContainer}>
              {featuresData.map((item) => (
                <FeatureCard 
                  key={item.id}
                  title={item.title}
                  text={item.text} 
                  icon={item.icon}
                />
              ))}
          </View>

          {/* Bottom Padding */}
          <View style={{ height: hp(12.5) }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// --- SUB-COMPONENTS ---

const ServiceCard = ({ icon, title, subtitle, color }) => (
  <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9}>
    <LinearGradient
      colors={['#FFFFFF', `${color}10`]} 
      style={styles.cardGradient}
      start={{x: 0, y: 0}} end={{x: 1, y: 1}}
    >
      <View style={styles.cardGradient1}>
         <Icon name={icon} size={hp(10)} color={color} style={styles.watermarkIcon} />

      <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={hp(3.5)} color={color} />
      </View>
      <View style={styles.cardTextContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      </View>
      
    </LinearGradient>
  </TouchableOpacity>
);

const TimelineItem = ({ number, title, text, isLast }) => (
    <View style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
            <View style={styles.timelineDot}>
                <Text style={styles.timelineNumber}>{number}</Text>
            </View>
            {!isLast && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineRight}>
            <Text style={styles.timelineTitle}>{title}</Text>
            <Text style={styles.timelineText}>{text}</Text>
        </View>
    </View>
);

//UPDATED FeatureCard
const FeatureCard = ({ title, text, icon }) => (
    <View style={styles.featureCardNew}>
        <LinearGradient 
          // Richer gradient: White -> Very Light Pink -> Light Purple tint
          colors={['#ffffff', '#FDF2F8', '#F8E1F4']} 
          style={styles.featureGradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        >
          {/* NEW PATTERN: Large Watermark Icon based on the feature type */}
          <Icon name={icon} size={hp(12.5)} color={COLORS.primary} style={styles.featureWatermarkIcon} />

          {/* Content wrapped in a View to ensure it sits above the watermark */}
          <View style={styles.featureContentWrapper}>
            <View style={styles.featureIconBox}>
              <Icon name={icon} size={hp(3)} color={COLORS.primary} />
            </View>
            <View style={styles.featureContentNew}>
              <Text style={styles.featureTitleNew}>{title}</Text>
              <Text style={styles.featureTextNew}>{text}</Text>
            </View>
          </View>
        </LinearGradient>
    </View>
);


// --- STYLES ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4), // approx 16
    paddingVertical: hp(1.5), // approx 12
    backgroundColor: COLORS.white,
    marginTop: Platform.OS === 'android' ? hp(3) : 0, // approx 25
  },
  iconButton: {
    padding: wp(1), // approx 4
  },
  headerTitle: {
    color: COLORS.textDark,
    fontSize: hp(2.2), // approx 18
    fontFamily: 'Montserrat-SemiBold', // Font
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: hp(2.5), // approx 20
  },
  
  // HERO SECTION
  heroContainer: {
    marginTop: hp(2), // approx 16
    marginHorizontal: wp(4), // approx 16
    borderRadius: wp(5), // approx 20
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: hp(0.75) }, 
    shadowOpacity: 0.45, 
    shadowRadius: 8, 
    elevation: 8, 
  },
  heroBanner: {
 
    borderRadius: wp(5), // approx 20
    overflow: 'hidden',
    minHeight: hp(20), // approx 160
  },
    heroBanner1: {
    paddingHorizontal: wp(5), // approx 20
    paddingVertical: hp(2), // approx 16
    borderRadius: wp(5), // approx 20
    overflow: 'hidden',

  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  heroTextContainer: {
    flex: 1,
    marginRight: wp(2.5), // approx 10
    zIndex: 2,
    justifyContent: 'center',
  },
  tagContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: wp(2), // approx 8
    paddingVertical: hp(0.375), // approx 3
    borderRadius: wp(1.5), // approx 6
    alignSelf: 'flex-start',
    marginBottom: hp(1), // approx 8
  },
  heroTag: {
    color: COLORS.white,
    fontSize: hp(1.4), // approx 11
    fontFamily: 'Montserrat-Bold', // Font
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: hp(2.2), // approx 18
    fontFamily: 'Montserrat-SemiBold', // Font
    lineHeight: hp(3), // approx 24
    marginBottom: hp(0.5), // approx 4
  },
  highlightText: {
    fontFamily: 'Montserrat-Bold', // Font
    color: '#FFD700',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5), // approx 12
  },
  heroSmallText: {
    color: '#FFE0F0',
    fontSize: hp(1.4), // approx 11
    fontFamily: 'Montserrat-SemiBold', // Font
  },
  dot: {
    color: '#FFE0F0',
    fontSize: hp(1.25), // approx 10
  },
  
  // Partition Line
  heroPartitionLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: '90%',
    marginBottom: hp(1.5), // approx 12
  },

  callNowButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: wp(4), // approx 16
    paddingVertical: hp(1), // approx 8
    borderRadius: wp(6.25), // approx 25
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  callNowText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold', // Font
    fontSize: hp(1.6), // approx 13
  },
  
  imageWrapper: {
      justifyContent: 'flex-end',
      alignItems: 'center',
  },
  heroImage: {
    width: wp(25), // approx 100
    height: hp(16.25), // approx 130
    borderRadius: wp(2.5), // approx 10
    marginBottom: -hp(0.625), // approx -5
  },

  // SECTION HEADERS
  sectionHeader: {
    marginHorizontal: wp(5), // approx 20
    marginTop: hp(2.5), // approx 20
    marginBottom: hp(1.5), // approx 12
  },
  sectionTitle: {
    fontSize: hp(2.2), // approx 18
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
  },
  sectionSubtitle: {
    fontSize: hp(1.5), // approx 12
    color: COLORS.textGrey,
    marginTop: hp(0.25), // approx 2
    fontFamily: 'Montserrat-Regular', // Font
  },

  // SERVICES GRID
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4), // approx 16
  },
  cardContainer: {
    width: (width - wp(12)) / 2, // approx 48
    borderRadius: wp(4), // approx 16
    marginBottom: hp(1.5), // approx 12
    // Fixed 3D Effect for Android & iOS
    backgroundColor: COLORS.white, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 6, 
  },
  cardGradient: {
   
    borderRadius: wp(4), // approx 16
    flex: 1,
   
    // borderColor: '#FFF5F0',
    overflow: 'hidden', 
    position: 'relative',
  },
    cardGradient1: {
    padding: wp(3.5), // approx 14
    borderRadius: wp(4), // approx 16
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFF5F0',
    overflow: 'hidden', 
    position: 'relative',
  },
  watermarkIcon: {
    position: 'absolute',
    right: -wp(3.75), // approx -15
    bottom: -hp(1.8), // approx -15
    opacity: 0.08, 
    transform: [{ rotate: '-15deg' }]
  },
  iconCircle: {
    width: wp(10.5), // approx 42
    height: wp(10.5),
    borderRadius: wp(3.5), // approx 14
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.25), // approx 10
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: hp(1.75), // approx 14
    fontFamily: 'Montserrat-Bold', // Font
    color: COLORS.textDark,
    marginBottom: hp(0.25), // approx 2
  },
  cardSubtitle: {
    fontSize: hp(1.4), // approx 11
    color: COLORS.textGrey,
    lineHeight: hp(1.75), // approx 14
    fontFamily: 'Montserrat-Regular', // Font
  },

  // PROCESS SECTION
  processSection: {
      marginTop: hp(2), // approx 16
      marginHorizontal: wp(4), // approx 16
      backgroundColor: COLORS.white,
      borderRadius: wp(4), // approx 16
      overflow: 'hidden',
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F0F0F0',
  },
  sectionHeaderBox: {
     
      alignItems: 'center',
  },
    sectionHeaderBox1: {
      padding: wp(3.5), // approx 14
      alignItems: 'center',
  },
  sectionHeaderBoxText: {
      color: COLORS.white,
      fontFamily: 'Montserrat-Bold', // Font
      fontSize: hp(2), // approx 16
  },
  timelineContainer: {
      padding: wp(5), // approx 20
  },
  timelineItem: {
      flexDirection: 'row',
      marginBottom: 0,
  },
  timelineLeft: {
      alignItems: 'center',
      marginRight: wp(3.5), // approx 14
      width: wp(6.5), // approx 26
  },
  timelineDot: {
      width: wp(6), // approx 24
      height: wp(6),
      borderRadius: wp(3), // approx 12
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
      borderWidth: 2,
      borderColor: COLORS.white,
      elevation: 2,
  },
  timelineNumber: {
      color: COLORS.white,
      fontFamily: 'Montserrat-Bold', // Font
      fontSize: hp(1.4), // approx 11
  },
  timelineLine: {
      width: 2,
      flex: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: -hp(0.25), // approx -2
  },
  timelineRight: {
      flex: 1,
      paddingBottom: hp(3), // approx 24
  },
  timelineTitle: {
      fontSize: hp(1.9), // approx 15
      fontFamily: 'Montserrat-Bold', // Font
      color: COLORS.textDark,
      marginBottom: hp(0.5), // approx 4
  },
  timelineText: {
      color: COLORS.textGrey,
      fontSize: hp(1.5), // approx 12
      lineHeight: hp(2.25), // approx 18
      fontFamily: 'Montserrat-Regular', // Font
  },

  // FEATURES SECTION (UPDATED STYLES)
  featuresContainer: {
      paddingHorizontal: wp(4), // approx 16
      marginTop: hp(1.5), // approx 12
  },
  featureCardNew: {
      borderRadius: wp(4), // approx 16
      marginBottom: hp(1.5), // approx 12
      // 3D effect
      backgroundColor: COLORS.white,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: hp(0.375) },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
  },
  featureGradient: {
      borderRadius: wp(4), // approx 16
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: '#FCE4EC', 
  },
  // NEW STYLE: Feature Watermark
  featureWatermarkIcon: {
    position: 'absolute',
    right: -wp(6.25), // approx -25
    bottom: -hp(3.125), // approx -25
    opacity: 0.06, // Very faint
    transform: [{ rotate: '-20deg' }],
    zIndex: 0,
  },
  featureContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4), // approx 16
    zIndex: 1, 
  },
  featureIconBox: {
      width: wp(11.5), // approx 46
      height: wp(11.5),
      borderRadius: wp(5.75), // approx 23
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp(4), // approx 16
      elevation: 2, 
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 2,
  },
  featureContentNew: {
      flex: 1,
  },
  featureTitleNew: {
      fontSize: hp(1.9), // approx 15
      fontFamily: 'Montserrat-Bold', // Font
      color: COLORS.textDark,
      marginBottom: hp(0.25), // approx 2
  },
  featureTextNew: {
      fontSize: hp(1.5), // approx 12
      color: COLORS.textGrey,
      lineHeight: hp(2), // approx 16
      fontFamily: 'Montserrat-Regular', // Font
  },
});
export default DoctorOnCallScreen;