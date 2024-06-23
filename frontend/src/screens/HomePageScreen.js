import React, { useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  ellipsesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
  },
  ellipse: {
    width: 100,
    height: 90,
    resizeMode: 'contain',
  },
  ellipse2: {
    position: 'absolute',
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
  titleContainer: {
    paddingTop: 50,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textDark,
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
  },
  imageTitle: {
    position: 'absolute',
    top: 140,
    right: 300,
    width: 50,
    height: 50,
    resizeMode: 'cover',
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
  redQuadrant: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    padding: 20,
    width: '90%',
    marginTop: 200,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  redQuadrantText: {
    fontSize: 18,
    color: colors.textDark,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    top: 5,
  },
  startButtonText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  leftIcon: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 15,
    left: 10,
  },
  rightIcon: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 20,
    right: 13,
  },
  textAndButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  secondQuadrant: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    padding: 30,
    width: '90%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  awareButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: '80%',
  },
  awareButtonText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageBelow: {
    width: '80%',
    height: 250,
    resizeMode: 'cover',
    marginTop: 20,
  },
});

const HomePageScreen = () => {
  const navigation = useNavigation();
  const { avatarUri } = useContext(UserContext);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.ellipsesContainer}>
        <Image source={require('../../assets/images/ellipse1.png')} style={styles.ellipse} />
        <Image source={require('../../assets/images/ellipse2.png')} style={styles.ellipse2} />
      </View>
      <TouchableOpacity style={styles.avatarTouchable} onPress={() => navigation.navigate('AvatarPage')}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Home Page</Text>
        <Image source={require('../../assets/images/homePage1.png')} style={styles.imageTitle} />
      </View>
      <View style={styles.redQuadrant}>
        <Image source={require('../../assets/images/mic.png')} style={styles.leftIcon} />
        <View style={styles.textAndButtonContainer}>
          <Text style={styles.redQuadrantText}>Parkinson's Disease Detection</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('RecordingPage')}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../../assets/images/sound.png')} style={styles.rightIcon} />
      </View>
      <View style={styles.secondQuadrant}>
        <TouchableOpacity style={styles.awareButton} onPress={() => navigation.navigate('InformationPage')}>
          <Text style={styles.awareButtonText}>Get aware about Parkinson’s Disease</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/images/homePage2.png')} style={styles.imageBelow} />
      <View style={styles.bottomBar}></View>
    </ScrollView>
  );
};

export default HomePageScreen;
