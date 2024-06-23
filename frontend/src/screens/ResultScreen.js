import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
    marginTop: -50,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },
  doctorImage: {
    marginTop: 20,
    width: '80%',
    height: 200,
    resizeMode: 'contain',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  resultContent: {
    fontSize: 16,
    color: colors.textDark,
    marginTop: 10,
  },
  resultsButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  resultsButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
});

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { predictionResult } = route.params;
  const { avatarUri } = useContext(UserContext);

  const getResultMessage = () => {
    if (predictionResult.overall_prediction === '0') {
      return "Great news! You are healthy. Keep up the good work maintaining your health.";
    } else {
      return "Our analysis indicates a potential presence of Parkinson's disease. Please book an appointment with our specialists for a thorough investigation.";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.ellipsesContainer}>
        <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
        <Image source={require('../../assets/images/ellipse2.png')} style={[styles.ellipse, styles.secondEllipsePosition]} />
      </View>
      <TouchableOpacity style={styles.avatarTouchable} onPress={() => navigation.navigate('AvatarPage')}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.header}>Result Screen</Text>
      <Text style={styles.subtitle}>Here are your analysis results:</Text>
      <Image source={require('../../assets/images/results.png')} style={styles.doctorImage} />
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>Result:</Text>
        <Text style={styles.resultContent}>{getResultMessage()}</Text>
      </View>
      {predictionResult.overall_prediction !== '0' && (
        <TouchableOpacity style={styles.resultsButton} onPress={() => navigation.navigate('ContactPage')}>
          <Text style={styles.resultsButtonText}>Book an Appointment</Text>
        </TouchableOpacity>
      )}
      <View style={styles.bottomBar}></View>
    </ScrollView>
  );
};

export default ResultScreen;
