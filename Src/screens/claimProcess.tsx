import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import Header from '../component/header';
import { wp, hp } from '../utilites/Dimension';

const ClaimProcessPage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Cashless');

  const CashlessContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.mainHeading}>What are Cashless Claims ?</Text>
      <Text style={styles.description}>
        Cashless claims facility assures that hospitalisation expenses are borne by insurers.{"\n\n"}
        It is a specialized service provided by an insurance company or a third-party administrator (TPA), where the payment for the cost of treatment undergone by the policyholder is directly made by the insurer to the network provider in accordance with the policy terms and conditions.{"\n\n"}
        If an insured person undergoes treatment at any of the network hospitals, there is no need for the person to pay the hospital bills.{"\n\n"}
        Please check your network hospitals <Text style={styles.linkText} onPress={() => Linking.openURL('https://example.com')}>here</Text>.
      </Text>

      <Text style={styles.subHeading}>How to claim ?</Text>

      <StepItem 
        number="1" 
        text="Go to the hospital's TPA desk with the patient's health ID card." 
      />
      <StepItem 
        number="2" 
        text="You may be required to make a refundable deposit of Rs. 10,000 or more (varies)." 
      />
      <StepItem 
        number="3" 
        text="Submit the following document(s) to avail the cashless facility :" 
        bullets={[
          "Patient's Health ID Card",
          "Patient's Identity card (Aadhar Card/Passport)",
          "A first consultation paper issued by your doctor (if issued).",
          "Hospitalization advice issued by your doctor (if issued).",
          "All supporting lab medical reports. (e.g. Blood reports/X-Ray/USG/CT Scan/MRI etc)",
          "The Hospital's TPA desk will receive a pre-authorization approval from the Ins. Co/TPA within 2 hours.",
          "Similarly, during discharge, final authorization approval will be received from the Ins. Co/TPA within 2 hours."
        ]}
      />
      <StepItem 
        number="4" 
        text="Your work is done. Now wait for some time as the approval usually takes up to 4 hrs." 
      />
    </View>
  );

  const ReimbursementContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.mainHeading}>Reimbursement</Text>
      <Text style={styles.description}>
        A reimbursement claim means settling the hospital bill from out-of-pocket and then apply for reimbursement from the insurance company.
      </Text>

      <Text style={styles.subHeading}>How to claim ?</Text>

      <StepItem 
        number="1" 
        text="During your stay in the hospital, you must pay for your own expenses. The insurance company will reimburse the hospitalisation and post-hospitalization charges." 
      />
      <StepItem number="2" text="Claim step 2 text" />
      <StepItem number="3" text="Claim step 3 text" />
      <StepItem 
        number="4" 
        text="For this, you will need to submit these document(s) :-" 
        bullets={[
          "Claim form (download empty claim form)",
          "Your original Discharge Card",
          "Your original Final Bill",
          "Your original Paid Receipt",
          "First Consultation Paper issued by your GD/MD/MS",
          "Hospitalization Advice issued by your GD/MD/MS",
          "Your Investigation Reports (Blood/Radiology)",
          "Your Medical Bills (pharmacy)",
          "Your Indoor Case Papers (ICP) attested by hospital",
          "Your Cancelled Cheque with printed name",
          "Your Corporate ID Card",
          "Your KYC (Aadhar Card/Passport)"
        ]}
      />
    </View>
  );

  const StepItem = ({ number, text, bullets }) => (
    <View style={styles.stepRow}>
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.stepTextContainer}>
        <Text style={styles.stepMainText}>{text}</Text>
        {bullets && bullets.map((bullet, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header showBack={true} onBack={() => navigation.goBack()} title="Claim Process" />
     <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Cashless' && styles.activeTab]} 
          onPress={() => setActiveTab('Cashless')}
        >
          <Text style={[styles.tabText, activeTab === 'Cashless' && styles.activeTabText]}>
            Cashless claims
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Reimbursement' && styles.activeTab]} 
          onPress={() => setActiveTab('Reimbursement')}
        >
          <Text style={[styles.tabText, activeTab === 'Reimbursement' && styles.activeTabText]}>
            Reimbursement
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(5) }}>
        {activeTab === 'Cashless' ? <CashlessContent /> : <ReimbursementContent />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#ffffff',
  },
  tab: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
    marginRight: wp(3),
    borderWidth: 1,
    borderColor: '#6c5ce7', // Purple border for inactive
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#6c5ce7', // Purple fill for active
  },
  tabText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: wp(3.5),
    color: '#6c5ce7', // Purple text for inactive
  },
  activeTabText: {
    color: '#ffffff', // White text for active
  },
  activeTabTextPurple: {
    color: '#6c5ce7',
  },
  contentContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },
  mainHeading: {
    fontFamily: 'Montserrat-Bold',
    fontSize: wp(5.5),
    color: '#2d3436',
    marginBottom: hp(2),
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    fontSize: wp(3.8),
    color: '#636e72',
    lineHeight: wp(5.5),
    marginBottom: hp(3),
  },
  linkText: {
    color: '#0984e3',
    textDecorationLine: 'underline',
  },
  subHeading: {
    fontFamily: 'Montserrat-Bold',
    fontSize: wp(5),
    color: '#2d3436',
    marginBottom: hp(2),
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: hp(2.5),
  },
  numberCircle: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: '#2d3436',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  numberText: {
    color: '#ffffff',
    fontFamily: 'Montserrat-Bold',
    fontSize: wp(3.2),
  },
  stepTextContainer: {
    flex: 1,
    paddingLeft: wp(3),
  },
  stepMainText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: wp(3.8),
    color: '#2d3436',
    lineHeight: wp(5.5),
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: hp(1),
    paddingLeft: wp(2),
  },
  bulletDot: {
    fontSize: wp(4),
    color: '#636e72',
    marginRight: wp(2),
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    fontSize: wp(3.5),
    color: '#636e72',
    lineHeight: wp(5),
  },
});

export default ClaimProcessPage;