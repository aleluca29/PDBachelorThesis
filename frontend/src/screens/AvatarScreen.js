import React, { useState, useEffect, useContext } from 'react';
import {
  View, ScrollView, StyleSheet, Image, Text, TextInput,
  TouchableOpacity, Modal, Alert, ActivityIndicator, Platform, Dimensions
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../constants';

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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 100,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  inputSection: {
    width: '80%',
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    paddingVertical: 10,
  },
  input: {
    backgroundColor: colors.secondary,
    width: '100%',
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    color: colors.textDark,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    color: colors.textDark,
    marginRight: -50,
  },
  calendarIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginTop: 50,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
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

const AvatarScreen = () => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { avatarUri, setAvatarUri } = useContext(UserContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [initialProfile, setInitialProfile] = useState({ name: '', date_of_birth: null, profile_image: '' });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'We need camera roll permissions to make this work!');
        }
      }

      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail) {
        fetch(`${API_BASE_URL}/user/profile/${userEmail}`)
          .then(response => response.json())
          .then(data => {
            if (data) {
              setName(data.name);
              setDateOfBirth(data.date_of_birth ? new Date(data.date_of_birth) : null);
              setAvatarUri(data.profile_image);
              setInitialProfile({ name: data.name, date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null, profile_image: data.profile_image });
            }
          })
          .catch(error => console.error('Error fetching user data:', error));
      }
    })();
  }, []);

  const onDateChange = (date) => {
    const newDate = date ? new Date(date.toString()) : null;
    setDateOfBirth(newDate);
    setDisplayedDate(newDate || new Date());
  };

  const clearDate = () => {
    setDateOfBirth(null);
    setDisplayedDate(new Date());
  };

  const formatDate = (date) => {
    if (!date) return 'Select your birth date';
    const formattedDate = new Date(date);
    return `${('0' + formattedDate.getDate()).slice(-2)}/${('0' + (formattedDate.getMonth() + 1)).slice(-2)}/${formattedDate.getFullYear()}`;
  };

  const closeModal = () => {
    setIsCalendarVisible(false);
  };

  const openModal = () => {
    setIsCalendarVisible(true);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setAvatarUri(uri);
        await AsyncStorage.setItem('profileImage', uri);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image');
    }
  };

  const saveProfile = async () => {
    if (!name || !dateOfBirth) {
      Alert.alert('Error', 'Please complete all fields before saving.');
      return;
    }

    const userEmail = await AsyncStorage.getItem('userEmail');
    if (!userEmail) {
      Alert.alert('Error', 'User email not found');
      return;
    }

    if (name === initialProfile.name &&
        dateOfBirth?.toISOString() === initialProfile.date_of_birth?.toISOString() &&
        avatarUri === initialProfile.profile_image) {
      Alert.alert('No changes', 'No changes detected in the profile.');
      return;
    }

    setIsLoading(true);

    fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: userEmail,
        name: name,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : '',
        profile_image: avatarUri
      }),
    })
      .then(response => response.json())
      .then(async data => {
        setIsLoading(false);
        if (data.message) {
          setInitialProfile({ name, date_of_birth: dateOfBirth, profile_image: avatarUri });
          await AsyncStorage.setItem('userName', name);
          if (dateOfBirth) {
            await AsyncStorage.setItem('userDob', dateOfBirth.toISOString().split('T')[0]);
          }
          Alert.alert('Success', data.message);
        } else {
          Alert.alert('Error', data.error);
        }
      })
      .catch(error => {
        setIsLoading(false);
        Alert.alert('Error', 'An error occurred while saving the profile');
      });
  };

  const logOut = async () => {
    setIsLoading(true);

    const userEmail = await AsyncStorage.getItem('userEmail');
    if (!userEmail) {
      Alert.alert('Error', 'User email not found');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userName');
        await AsyncStorage.removeItem('userDob');
        await AsyncStorage.removeItem('profileImage');
        setName('');
        setDateOfBirth(null);
        setAvatarUri(null);
        setIsLoading(false);
        navigation.navigate('SignInPage');
      } else {
        Alert.alert('Error', data.error || 'Failed to log out. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out');
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.ellipsesContainer}>
        <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
        <Image source={require('../../assets/images/ellipse2.png')} style={[styles.ellipse, styles.secondEllipsePosition]} />
      </View>

      <Text style={styles.title}>Profile Page</Text>

      <View style={styles.avatarContainer}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')}
          style={[styles.avatar, { borderRadius: 50 }]}
          onError={() => setAvatarUri(null)}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Ionicons name="camera" size={30} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={colors.textDark}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.inputLabel}>Date of Birth</Text>
        <View style={styles.datePickerContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="Select your birth date"
            value={formatDate(dateOfBirth)}
            editable={false}
          />
          <TouchableOpacity onPress={openModal} style={styles.calendarIcon}>
            <Ionicons name="calendar" size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      {isCalendarVisible && (
        <Modal
          transparent={true}
          visible={isCalendarVisible}
          animationType="slide"
        >
          <View style={styles.modalView}>
            <CalendarPicker
              key={displayedDate.toISOString()}
              onDateChange={onDateChange}
              selectedStartDate={dateOfBirth}
              initialDate={displayedDate}
              todayBackgroundColor="transparent"
              selectedDayColor={colors.primary}
              selectedDayTextColor={colors.secondary}
              maxDate={new Date()}
              width={Dimensions.get('window').width - 60}
            />
            <TouchableOpacity style={styles.button} onPress={clearDate}>
              <Text style={styles.buttonText}>Clear Date</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={logOut}>
        <Text style={styles.saveButtonText}>Log out</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </ScrollView>
  );
};

export default AvatarScreen;
