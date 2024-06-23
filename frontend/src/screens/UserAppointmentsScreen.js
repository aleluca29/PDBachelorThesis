import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants';
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
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingVertical: 150,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  appointmentContainer: {
    flex: 1,
    marginTop: 10,
  },
  appointmentScrollView: {
    maxHeight: '100%',
  },
  appointment: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderColor: colors.primary,
  },
  appointmentText: {
    fontSize: 16,
    color: colors.textDark,
  },
  loadingText: {
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 20,
  },
  noAppointmentsText: {
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 20,
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
});

const UserAppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { avatarUri } = useContext(UserContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        const response = await fetch(`${API_BASE_URL}/user/appointments/${email}`);
        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            Alert.alert('No Appointments', 'You do not have any appointments.');
            navigation.goBack();
          } else {
            setAppointments(data);
          }
        } else {
          console.error('Failed to fetch appointments:', data.detail);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, styles.contentContainer]}>
      <View style={styles.ellipsesContainer}>
        <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
        <Image source={require('../../assets/images/ellipse2.png')} style={[styles.ellipse, styles.secondEllipsePosition]} />
      </View>
      <TouchableOpacity style={styles.avatarTouchable} onPress={() => navigation.navigate('AvatarPage')}>
        <Image source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')} style={styles.avatar} />
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>My Appointments</Text>
          <View style={styles.appointmentContainer}>
            <ScrollView style={styles.appointmentScrollView}>
              {appointments.map((appointment, index) => (
                <View key={index} style={styles.appointment}>
                  <Text style={styles.appointmentText}>Hospital: {appointment.hospital_name}</Text>
                  <Text style={styles.appointmentText}>Address: {appointment.hospital_address}</Text>
                  <Text style={styles.appointmentText}>Date: {appointment.date}</Text>
                  <Text style={styles.appointmentText}>Time: {appointment.time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
      <View style={styles.bottomBar}></View>
    </ScrollView>
  );
};

export default UserAppointmentsScreen;
