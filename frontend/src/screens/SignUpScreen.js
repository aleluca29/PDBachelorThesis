import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const colors = {
  primary: '#6F1D1B',
  secondary: '#E7B18D',
  background: '#F6DFB7',
  textDark: '#432C18',
  textLight: '#E7D1B1',
  white: '#FFFFFF',
  black: '#000000',
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  quadrant: {
    position: 'absolute',
    top: 320,
    left: 0,
    right: 0,
    height: 600,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    borderWidth: 1,
    borderColor: colors.textDark,
  },
  icon: {
    width: 60,
    height: 55,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 150,
    left: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textDark,
    position: 'absolute',
    top: 220,
    alignSelf: 'center',
  },
  registrationContainer: {
    position: 'absolute',
    top: 350,
    alignSelf: 'center',
    alignItems: 'center',
  },
  registerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  registerSubtitle: {
    fontSize: 14,
    color: colors.textDark,
    marginTop: 4,
  },
  inputContainer: {
    position: 'absolute',
    top: 440,
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.background,
    width: '100%',
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    color: colors.textDark,
    marginTop: 10,
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 23,
  },
  button: {
    position: 'absolute',
    top: 650,
    left: '10%',
    right: '10%',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    color: colors.textDark,
    fontSize: 16,
  },
  signInTextBold: {
    fontWeight: 'bold',
  },
  ellipsesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  ellipse: {
    position: 'absolute',
    width: 100,
    height: 90,
    resizeMode: 'contain',
  },
  secondEllipsePosition: {
    top: 0,
    right: -10,
    width: 120,
    height: 120,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToLogin = () => {
    navigation.navigate('SignInPage');
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!email) {
      Alert.alert('Registration Failed', 'Please enter your email.');
      return;
    }

    if (!password) {
      Alert.alert('Registration Failed', 'Please enter your password.');
      return;
    }

    if (!confirmPassword) {
      Alert.alert('Registration Failed', 'Please confirm your password.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Registration Successful', 'You can now login.');
        navigateToLogin();
      } else {
        const errorMessage = data.detail || 'An error occurred during registration.';
        Alert.alert('Registration Failed', errorMessage);
      }
    } catch (error) {
      if (error.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('An Error Occurred', 'Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.quadrant} />
      <Image
        source={require('../../assets/images/medical_icon.png')}
        style={styles.icon}
      />
      <Text style={styles.title}>Parkinson Center</Text>

      <View style={styles.registrationContainer}>
        <Text style={styles.registerTitle}>Register with us!</Text>
        <Text style={styles.registerSubtitle}>Your Information is</Text>
        <Text style={styles.registerSubtitle}>safe with us</Text>
      </View>

      <View style={styles.ellipsesContainer}>
        <Image
          source={require('../../assets/images/ellipse1.png')}
          style={styles.ellipse}
        />
        <Image
          source={require('../../assets/images/ellipse2.png')}
          style={[styles.ellipse, styles.secondEllipsePosition]}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={colors.textDark}
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.textDark}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={colors.textDark}
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already have an account? <Text onPress={() => navigation.navigate('SignInPage')} style={styles.signInTextBold}>Sign In</Text>
      </Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default SignUpScreen;
