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
  Image,
  ScrollView, // Added for content
  ActivityIndicator, // Added for button status
  Platform, // Added for platform-specific styles
} from 'react-native';
import React, { useState } from 'react'; // Removed useEffect, useRef
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Removed

// Removed Redux, AsyncStorage, API, and other logic-heavy imports

const { height } = Dimensions.get('window');
const TOP_SECTION_HEIGHT = height * 0.3;

// This component is now a static UI representation of the RegisterScreen
const RegisterScreen = ({ navigation, route }) => {
  // const { params } = route;
  // const isnumber = params?.isnumber;

  // Removed password visibility states as icons are removed
  // const [passwordVisible, setPasswordVisible] = useState(false);
  // const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Simplified state for inputs
  const [mobilenumber, setMobilenumber] = useState('');
  const [employees_code, setEmployees_code] = useState('00UNH72089'); // Placeholder
  const [email, setEmail] = useState('email@example.com'); // Placeholder
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dp, setDP] = useState(null); // State for avatar
  const [focusedInput, setFocusedInput] = useState(null); // State for focused input

  // All logic (onSubmit, handleChoosePhoto, Redux hooks, etc.) has been removed.

  const getButtonStatus = () => {
    // Simplified to always show the button
    return (
      <TouchableOpacity
        onPress={() => console.log('Submit Pressed')}
        style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Get Otp</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#934790" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* Top Section */}
          <View style={styles.topSection}>
            {/* Removed Logout Button/Icon */}
            <View style={styles.headerContainer}>
              <Text style={styles.loginTitle}>Verify your details</Text>
            </View>
          </View>

          {/* Bottom Section - Now part of the main scroll */}
          <View style={styles.bottomSection}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => console.log('Change Photo')}>
                <Image
                  source={
                    dp
                      ? { uri: dp }
                      : require('./assets/user.png')
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <Text style={styles.userName}>Full Name Here</Text>
            </View>

            {/* Employee Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Employee Code</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="00UNH72089"
                  onChangeText={setEmployees_code}
                  placeholderTextColor={'#888'}
                  value={employees_code}
                  editable={false} // Kept as non-editable
                  style={styles.input}
                />
              </View>
            </View>

            {/* Email ID Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email ID</Text>
              <View style={styles.inputWrapper}>
                {/* Removed Image Icon */}
                <TextInput
                  placeholder="email"
                  style={styles.input}
                  placeholderTextColor={'#888'}
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  editable={false} // Kept as non-editable
                />
              </View>
            </View>

            {/* Mobile Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'mobile' && styles.inputWrapperFocused,
                ]}>
                {/* Removed Icon */}
                <TextInput
                  placeholder="phone no."
                  placeholderTextColor={'#888'}
                  style={styles.input}
                  onChangeText={setMobilenumber}
                  value={mobilenumber}
                  keyboardType="numeric"
                  editable={true} // Made editable
                  onFocus={() => setFocusedInput('mobile')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'password' && styles.inputWrapperFocused,
                ]}>
                {/* Removed Icon */}
                <TextInput
                  placeholder="New Password"
                  placeholderTextColor={'#888'}
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry={true} // Set to true
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                {/* Removed Eye Icon */}
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'confirmPassword' &&
                    styles.inputWrapperFocused,
                ]}>
                {/* Removed Icon */}
                <TextInput
                  placeholderTextColor={'#888'}
                  placeholder="Confirm Password"
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  value={confirmPassword}
                  secureTextEntry={true} // Set to true
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                />
                {/* Removed Eye Icon */}
              </View>
            </View>

            {/* Submit Button */}
            {getButtonStatus()}

            {/* Removed Otpverificationmodal */}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default RegisterScreen; // Export changed to RegisterScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8D4B7', // Changed background to match bottom
  },
  container: {
    flex: 1,
    backgroundColor: '#E8D4B7',
  },
  scrollContainer: {
    // padding: 24, // Padding is now on bottomSection
    alignItems: 'center', // Center content horizontally in scrollview
    paddingBottom: 40, // Ensure space at the bottom
  },
  topSection: {
    height: TOP_SECTION_HEIGHT,
    backgroundColor: '#934790',
    borderBottomLeftRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
    // paddingTop: 20, // Removed, padding handled by safearea
    justifyContent: 'center', // Center content vertically
    width: '100%', // Ensure it takes full width
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingTop: 20, // Adjusted padding
  },
  backButton: {
    // Style remains for potential future use, but button is removed
    position: 'absolute',
    right: 20,
    top: 40,
    padding: 10,
    zIndex: 1,
  },
  logoutIcon: {
    // Style remains for potential future use, but button is removed
    width: 25,
    height: 25,
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
    marginTop: 80,
  },
  bottomSection: {
    // flex: 1, // Removed flex: 1
    backgroundColor: '#E8D4B7',
    padding: 24, // Added padding here
    width: '100%', // Ensure it takes full width
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20, // Added margin
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#934790',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  // New inputWrapper style based on original 'input'
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderColor: '#B0AFAF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16, // Adjusted padding as icon is gone
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperFocused: {
    borderColor: '#934790',
    borderWidth: 2,
    shadowColor: '#934790',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: '100%', // Take full height of wrapper
    paddingHorizontal: 0, // Reset padding as it's on wrapper
    fontSize: 16,
    color: '#333',
    fontFamily: 'Roboto-Regular',
  },
  inputIcon: {
    // Style remains for potential future use, but icon is removed
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  eyeIcon: {
    // Style remains for potential future use, but icon is removed
    padding: 5,
  },
  // Renamed loginBtn to submitButton
  submitButton: {
    width: '100%',
    backgroundColor: '#934790',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20, // Added top margin
    // marginBottom: 40, // Removed, bottom padding on scrollContainer
    shadowColor: '#934790',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  // Renamed loginBtnText to submitButtonText
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
