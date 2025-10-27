import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Image, // Import Image component
} from 'react-native';
import React, { useState } from 'react'; // Import useRef

const { height } = Dimensions.get('window');
const TOP_SECTION_HEIGHT = height * 0.3;
// Removed CORRECT_OTP constant

const ForgotPassword = () => {
  // State for Email input
  const [email, setEmail] = useState('');

  // Handle submission
  const handleSubmit = () => {
    console.log('Password reset requested for:', email);
    Keyboard.dismiss();
    // Add navigation logic or API call here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#934790" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText}>{'<'}</Text>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              {/* Title changed to Forgot Password */}
              <Text style={styles.loginTitle}>Forgot Password</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Title changed for Forgot Password context */}
            <Text style={styles.title}>
              Enter your email to reset password
            </Text>

            {/* Email Input Field */}
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#888"
              autoCapitalize="none"
            />

            {/* Button text changed to Submit */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
              <Text style={styles.loginBtnText}>Submit</Text>
            </TouchableOpacity>

            {/* All other buttons have been removed */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassword; // Export changed to ForgotPassword

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#934790',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8D4B7',
  },
  topSection: {
    height: TOP_SECTION_HEIGHT,
    backgroundColor: '#934790',
    borderBottomLeftRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10, // Kept elevation for shadow
    position: 'relative',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingTop: 40, // Adjusted padding for better alignment
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    padding: 10,
    zIndex: 1,
  },
  backText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  loginTitle: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 130, // Added top margin
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#E8D4B7',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18, // Slightly smaller for the new text
    marginBottom: 40, // Increased margin
    fontWeight: '600',
    color: '#333', // Fixed color
    textAlign: 'center',
    marginTop: 20, // Added top margin
  },
  // Added back the input style
  input: {
    width: '100%',
    height: 55,
    borderColor: '#B0AFAF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 30, // Spacing before submit button
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#934790',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 0, // Removed top margin, input has marginBottom
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Removed all otpContainer and otpInput styles
});

