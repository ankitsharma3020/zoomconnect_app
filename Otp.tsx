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
import React, { useState, useRef } from 'react'; // Import useRef

const { height } = Dimensions.get('window');
const TOP_SECTION_HEIGHT = height * 0.25;
const CORRECT_OTP = '123456'; // Dummy correct OTP for testing

const Otp = () => {
  // State for OTP inputs
  const [otp, setOtp] = useState(new Array(6).fill(''));
  // Refs to manage focus between inputs
  const inputsRef = useRef([]);
  // State to track focused input
  const [focusedIndex, setFocusedIndex] = useState(-1);
  // State for submission status
  const [isError, setIsError] = useState(false);
  const [isOtpCorrect, setIsOtpCorrect] = useState(false);

  // Function to reset submission status
  const resetSubmissionStatus = () => {
    setIsError(false);
    setIsOtpCorrect(false);
  };

  // Handle OTP digit input
  const handleOtpChange = (text, index) => {
    resetSubmissionStatus(); // Reset on new input
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input if a digit is entered
    if (text && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace key press
  const handleOtpKeyPress = (e, index) => {
    resetSubmissionStatus(); // Reset on backspace
    // Move focus to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle submission
  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === CORRECT_OTP) {
      setIsOtpCorrect(true);
      setIsError(false);
      Keyboard.dismiss();
      // Add navigation logic here
    } else {
      setIsError(true);
      setIsOtpCorrect(false);
    }
  };

  // Get dynamic styles for each input
  const getDynamicInputStyle = (index) => {
    if (isError) {
      return { borderColor: '#D9534F', borderWidth: 2 }; // Red for error
    }
    if (isOtpCorrect) {
      return { borderColor: '#5CB85C', borderWidth: 2 }; // Green for correct
    }
    if (focusedIndex === index) {
      return { borderColor: '#007AFF', borderWidth: 2 }; // Blue for focused
    }
    if (otp[index].length > 0) {
      return { borderColor: '#333', borderWidth: 1.5 }; // Black for filled
    }
    return { borderColor: '#B0AFAF', borderWidth: 1 }; // Gray for empty (default)
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
              {/* Title changed to OTP */}
              <Text style={styles.loginTitle}>OTP</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Title changed for OTP context */}
            <Text style={styles.title}>Receive OTP on +91 98XXXXXX99</Text>

            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  // Apply dynamic styles
                  style={[styles.otpInput, getDynamicInputStyle(index)]}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(-1)}
                  value={digit}
                  placeholder="-"
                  placeholderTextColor="#ccc"
                />
              ))}
            </View>

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

export default Otp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#934790',
  },
  container: {
    flex: 1,
    backgroundColor: '#F1F2F6',
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
    paddingTop: 160, // Adjusted padding for better alignment
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
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#F1F2F6',
    padding: 24,
    alignItems: 'center',
  },
  title: {
     marginTop: 20,
    fontSize: 18, // Slightly smaller for the new text
    marginBottom: 40, // Increased margin
    fontWeight: '700',
    color: '',
  },
  // Removed original input style
  loginBtn: {
    width: '100%',
    backgroundColor: '#934790',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20, // Added margin top to space from OTP boxes
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
  // New styles for OTP inputs
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed for better spacing
    width: '100%',
    // paddingHorizontal: 10, // Removed for space-around
    marginBottom: 40, // Increased margin
    // Added top margin for spacing from title
  },
  otpInput: {
    width: 55, // Increased width
    height: 65, // Increased height
    borderColor: '#B0AFAF', // Default border color (gray)
    borderWidth: 1.5, // Default border width
    borderRadius: 16, // More rounded
    paddingHorizontal: 0, // Keep 0 for center align
    fontSize: 26, // Increased font size
    backgroundColor: '#FFFFFF',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Adjusted shadow
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 6,
    elevation: 7, // Slightly higher elevation
    textAlign: 'center', // Ensures cursor and text are centered
    fontWeight: '700',
  },
  // Removed all optionBtn styles
});

