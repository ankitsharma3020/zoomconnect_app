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
import React, { useState } from 'react';

const { height } = Dimensions.get('window');
const TOP_SECTION_HEIGHT = height * 0.3;

// Placeholder for images. In a real app, you'd have these paths point to your actual images.
// Make sure you have these images in an 'assets' folder in your project root.
const Images = {
  gmail: require('./assets/Google.png'), // Add google.png to your assets folder
  microsoft: require('./assets/micosoft.png'), // Add microsoft.png to your assets folder
  phone: require('./assets/phone.png'), // Add phone.png to your assets folder
  email: require('./assets/email.png'), // Add email.png to your assets folder
  //   employee: require('./assets/id_card.png'), // Add id_card.png for employee iconr
};

const Login = () => {
  const [loginMode, setLoginMode] = useState('phone');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  let title = 'Enter your number';
  let placeholder = 'Phone Number';
  let keyboardType = 'phone-pad';

  if (loginMode === 'email') {
    title = 'Enter your email';
    placeholder = 'Email Address';
    keyboardType = 'email-address';
  } else if (loginMode === 'employee') {
    title = 'Employee Login';
    placeholder = 'Employee Code';
    keyboardType = 'default';
  }

  const handleSetLoginMode = (mode) => {
    setLoginMode(mode);
    setUsername('');
    setPassword('');
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
              <Text style={styles.loginTitle}>Login</Text>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.title}>{title}</Text>

            <TextInput
              style={styles.input}
              placeholder={placeholder}
              keyboardType={keyboardType}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#888"
              autoCapitalize="none"
            />

            {loginMode === 'employee' && (
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#888"
              />
            )}

            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>

            {/* Other Login Options - REORDERED */}

            {loginMode !== 'phone' && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => handleSetLoginMode('phone')}>
                <Image source={Images.phone} style={styles.optionBtnIcon} />
                <Text style={styles.optionBtnText}>Login with Number</Text>
              </TouchableOpacity>
            )}

            {loginMode !== 'email' && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => handleSetLoginMode('email')}>
                <Image source={Images.email} style={styles.optionBtnIcon} />
                <Text style={styles.optionBtnText}>Login with Email</Text>
              </TouchableOpacity>
            )}

            {loginMode !== 'employee' && (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => handleSetLoginMode('employee')}>
                {/* <Image source={Images.employee} style={styles.optionBtnIcon} /> */}
                <Text style={styles.optionBtnText}>Other Option</Text>
              </TouchableOpacity>
            )}

            {/* Gmail and Microsoft buttons in a row */}
            <View style={styles.optionBtnRow}>
              <TouchableOpacity style={[styles.optionBtn1, styles.optionBtnHalf]}>
                <Image source={Images.gmail} style={styles.optionBtnIcon} />
                <Text style={styles.optionBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.optionBtn1, styles.optionBtnHalf]}>
                <Image source={Images.microsoft} style={[styles.optionBtnIcon,{width: 34,height: 44,resizeMode:'cover'}]} />
                <Text style={styles.optionBtnText}>Microsoft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

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
    elevation: 3,
    position: 'relative',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingTop: 160, // Adjusted to bring title slightly up for better centering relative to its new position
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
    backgroundColor: '#E8D4B7',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    fontWeight: '700', // Made title bolder
    color: '#333',
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#B0AFAF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
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
    marginBottom: 24,
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
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
    optionBtn1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    // padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionBtnText: {
    color: '#333', // Darker text
    fontSize: 16,
    fontWeight: '700', // Bolder text
    // marginLeft: 12, // Removed: Space is now on the icon
  },
  optionBtnIcon: {
    width: 24, // Size of your icons
    height: 24,
    resizeMode: 'contain', // Ensures image fits without cropping
    marginRight: 12, // Added: Space between icon and text
  },
  // Added styles for the row
  optionBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionBtnHalf: {
    width: '48.5%', // Set to just under 50% to create a gap
  },
});