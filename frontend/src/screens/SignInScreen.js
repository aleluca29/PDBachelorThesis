import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserContext } from '../contexts/UserContext';

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
  logInTitle: {
    position: 'absolute',
    top: 350,
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  inputContainer: {
    position: 'absolute',
    top: 530,
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
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 23,
  },
  button: {
    position: 'absolute',
    top: 680,
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
  signUpText: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    color: colors.textDark,
    fontSize: 16,
  },
  signUpTextBold: {
    fontWeight: 'bold',
  },
  image: {
    marginTop: 320,
    width: 150,
    height: 157,
    resizeMode: 'contain',
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

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setAvatarUri } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToHomePage = () => {
    navigation.navigate('HomePage');
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Login Failed', 'Please enter your email.');
      return;
    }

    if (!password) {
      Alert.alert('Login Failed', 'Please enter your password.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userEmail', email);
        const userResponse = await fetch(`${API_BASE_URL}/user/profile/${email}`);
        const userData = await userResponse.json();
        if (userData && userData.profile_image) {
          setAvatarUri(userData.profile_image);
          await AsyncStorage.setItem('profileImage', userData.profile_image);
        }
        navigateToHomePage();
      } else {
        const errorMessage = data.detail || 'Please check your credentials and try again.';
        Alert.alert('Login Failed', errorMessage);
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

      <Text style={styles.logInTitle}>Welcome back!</Text>
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
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        Don't have an account? <Text onPress={() => navigation.navigate('SignUpPage')} style={styles.signUpTextBold}>Sign up</Text>
      </Text>

      <Image
        source={require('../../assets/images/signIn.png')}
        style={styles.image}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default SignInScreen;
