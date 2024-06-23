import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CalendarPicker from 'react-native-calendar-picker';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    justifyContent: 'center',
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
  avatarTouchable: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    zIndex: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    resizeMode: 'cover',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: -120,
    marginBottom: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-start',
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    flexShrink: 1,
    color: colors.textDark,
  },
  modalDescription: {
    marginBottom: 15,
    color: colors.textDark,
  },
  textStyle: {
    color: colors.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  calendarContainer: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    width: Dimensions.get('window').width - 70,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hourButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 5,
    flexWrap: 'wrap',
  },
  hourButton: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    padding: 8,
    margin: 3,
  },
  selectedHourButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hourButtonText: {
    color: colors.textDark,
  },
  selectedHourButtonText: {
    color: colors.textLight,
  },
  clearButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    width: 80,
    marginTop: 10,
  },
  selectionContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: -20,
  },
  viewAppointmentsButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
  },
  viewAppointmentsButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

const ContactScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [appointmentMessage, setAppointmentMessage] = useState('Please select the date and hour for the appointment');
  const [hospitals, setHospitals] = useState([]);

  const navigation = useNavigation();
  const { avatarUri } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      fetchNearbyHospitals(currentLocation);
    })();
  }, []);

  const fetchNearbyHospitals = async (location) => {
    const apiKey = 'AIzaSyAiEdetr4trUuKA--LDVdkm7cr7swLMtC0';
    const radius = '10000';
    const type = 'hospital';
    const keywords = ['neurology', 'neurologist', 'neurological'];

    try {
      const keywordQuery = keywords.map((kw) => `keyword=${encodeURIComponent(kw)}`).join('&');
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=${radius}&type=${type}&${keywordQuery}&key=${apiKey}`;
      const response = await axios.get(url);
      console.log('API Response:', response.data);

      setHospitals(response.data.results);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedHospital(null);
    setModalVisible(false);
    clearSelection();
  };

  const handleMakeAppointment = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    const userProfileResponse = await fetch(`${API_BASE_URL}/user/profile/${email}`);
    const userProfile = await userProfileResponse.json();

    if (!userProfile.name || !userProfile.date_of_birth) {
      Alert.alert('Incomplete Profile', 'Please complete your profile with name and date of birth before making an appointment.');
      return;
    }

    if (!selectedDate || !selectedHour || !selectedHospital) {
      Alert.alert('Incomplete Selection', 'You must choose a hospital, date, and time for your appointment.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          hospital_name: selectedHospital.name,
          hospital_address: selectedHospital.vicinity,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedHour,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Appointment Confirmed', `Your appointment is set for ${format(selectedDate, 'dd/MM/yyyy')} at ${selectedHour}.`);
        setShowDatePicker(false);
        handleCloseModal();
      } else {
        Alert.alert('Appointment Failed', data.detail || 'Could not book the appointment. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('An error occurred', 'Please try again later.');
    }
  };

  const onChangeDate = (date) => {
    const newDate = date ? new Date(date.toString()) : null;
    setSelectedDate(newDate);
    setAppointmentMessage(`Selected Date: ${newDate ? format(newDate, 'dd/MM/yyyy') : 'Not selected yet'}\nSelected Hour: ${selectedHour || 'Not selected yet'}`);
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    setAppointmentMessage(`Selected Date: ${selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Not selected yet'}\nSelected Hour: ${hour}`);
  };

  const clearSelection = () => {
    setSelectedDate(null);
    setSelectedHour(null);
    setAppointmentMessage('Please select the date and hour for the appointment');
  };

  const openModal = () => {
    setShowDatePicker(true);
  };

  const closeModal = () => {
    setShowDatePicker(false);
    clearSelection();
  };

  const handleViewAppointments = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    const response = await fetch(`${API_BASE_URL}/user/appointments/${email}`);
    const data = await response.json();

    if (response.ok && data.length > 0) {
      navigation.navigate('UserAppointments');
    } else {
      Alert.alert('No Appointments', 'You do not have any appointments.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.ellipsesContainer}>
        <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
        <Image source={require('../../assets/images/ellipse2.png')} style={[styles.ellipse, styles.secondEllipsePosition]} />
      </View>
      <TouchableOpacity style={styles.avatarTouchable} onPress={() => navigation.navigate('AvatarPage')}>
        <Image source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={styles.header}>Contact Us</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.coords.latitude : 37.78825,
          longitude: location ? location.coords.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: hospital.geometry.location.lat,
              longitude: hospital.geometry.location.lng,
            }}
            title={hospital.name}
            onPress={() => handleHospitalSelect(hospital)}
          />
        ))}
      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedHospital && (
              <>
                <View style={styles.modalHeader}>
                  <Image
                    source={require('../../assets/images/map.png')}
                    style={styles.iconStyle}
                  />
                  <Text style={styles.modalText}>{selectedHospital.name}</Text>
                </View>
                <Text style={styles.modalDescription}>{selectedHospital.vicinity}</Text>
                <View style={styles.selectionContainer}>
                  <Text style={styles.selectedDateTime}>{appointmentMessage}</Text>
                  {(selectedDate || selectedHour) && showDatePicker && (
                    <TouchableOpacity
                      style={[styles.clearButton, { alignSelf: 'center' }]}
                      onPress={clearSelection}
                    >
                      <Text style={styles.closeButtonText}>Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {showDatePicker && (
                  <>
                    <CalendarPicker
                      onDateChange={onChangeDate}
                      selectedStartDate={selectedDate}
                      minDate={new Date()}
                      todayBackgroundColor="transparent"
                      todayTextStyle={colors.primary}
                      textStyle={colors.black}
                      selectedDayColor={colors.primary}
                      selectedDayTextColor={colors.secondary}
                      width={Dimensions.get('window').width - 60}
                    />
                    <View style={styles.hourButtonContainer}>
                      {Array.from({ length: 9 }, (_, index) => {
                        const hour = index + 8;
                        const hourLabel = `${hour < 10 ? '0' + hour : hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
                        return (
                          <TouchableOpacity
                            key={hourLabel}
                            onPress={() => handleHourSelect(hourLabel)}
                            style={[styles.hourButton, selectedHour === hourLabel && styles.selectedHourButton]}
                          >
                            <Text style={[styles.hourButtonText, selectedHour === hourLabel && styles.selectedHourButtonText]}>
                              {hourLabel}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View style={styles.buttonContainer}>
                      {(selectedDate || selectedHour) && (
                        <TouchableOpacity
                          style={styles.confirmButton}
                          onPress={handleMakeAppointment}
                        >
                          <Text style={styles.textStyle}>Make the Appointment</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {!showDatePicker && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={openModal}
                    >
                      <Text style={styles.textStyle}>Choose Date and Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.closeButton, { marginTop: 10 }]}
                      onPress={handleCloseModal}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {!selectedHospital && (
              <Text style={styles.modalText}>No hospital selected</Text>
            )}
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.viewAppointmentsButton} onPress={handleViewAppointments}>
        <Text style={styles.viewAppointmentsButtonText}>View Your Appointments</Text>
      </TouchableOpacity>
      <View style={styles.bottomBar}></View>
    </ScrollView>
  );
};

export default ContactScreen;
