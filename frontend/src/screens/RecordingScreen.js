import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 20,
  },
  icon: {
    resizeMode: 'contain',
    marginTop: 15,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  recordButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
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
  bottomImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginTop: 30,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
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
  disabledButton: {
    backgroundColor: '#b3b3b3',
  },
  recordingInfo: {
    fontSize: 14,
    color: colors.textDark,
    marginTop: 20,
  },
});

const RecordingScreen = () => {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(null);
  const [recordUri, setRecordUri] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const { avatarUri } = useContext(UserContext);

  useEffect(() => {
    async function getPermissions() {
      const response = await Audio.getPermissionsAsync();
      if (response.status !== 'granted') {
        await requestPermission();
      }
    }
    getPermissions();
  }, []);

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );

      setRecording(newRecording);
      setIsRecording(true);
      setAnalysisDone(false);
      console.log('Recording started');

      setTimeout(async () => {
        await stopRecording(newRecording);
      }, 30000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording(currentRecording) {
    console.log('Stopping recording..');
    if (!currentRecording) {
      return;
    }
    await currentRecording.stopAndUnloadAsync();
    const uri = currentRecording.getURI();
    setRecordUri(uri);

    console.log('Recording stopped and stored at', uri);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    setRecording(null);
    setIsRecording(false);
    uploadFileToBackend(uri);
  }

  async function uploadRecordingFromDevice() {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      console.log('File selected:', file);

      if (!file.canceled && file.assets && file.assets.length > 0) {
        const fileUri = file.assets[0].uri;
        console.log('File URI:', fileUri);
        setAnalysisDone(false);
        await uploadFileToBackend(fileUri);
      } else {
        console.log('File selection was not successful');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', `Error selecting file: ${error.message}`);
    }
  }

  async function uploadFileToBackend(uri) {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: 'recording.wav',
        type: 'audio/wav'
      });

      console.log('FormData prepared:', formData);

      const response = await fetch(`${API_BASE_URL}/pd/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);
      setPredictionResult(result);
      setAnalysisDone(true);
    } catch (error) {
      console.error('Failed to upload file:', error);
      Alert.alert('Error', `Failed to upload file: ${error.message}`);
    }
  }

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
      <Text style={styles.title}>Let’s have a quick chat!</Text>
      <Text style={styles.subtitle}>Press the button below to record for 30 seconds or upload a vocal recording.</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.disabledButton]}
          onPress={!isRecording ? startRecording : null}
          disabled={isRecording}
        >
          <Text style={styles.recordButtonText}>{isRecording ? 'Recording...' : 'Start Recording'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={uploadRecordingFromDevice} disabled={isRecording}>
          <Text style={styles.uploadButtonText}>Upload a record</Text>
        </TouchableOpacity>
      </View>
      {isRecording && <Text style={styles.recordingInfo}>Recording in progress... Please wait for 30 seconds.</Text>}
      {analysisDone && (
        <TouchableOpacity style={styles.resultsButton} onPress={() => navigation.navigate('ResultPage', { predictionResult })}>
          <Text style={styles.resultsButtonText}>See results!</Text>
        </TouchableOpacity>
      )}
      <Image source={require('../../assets/images/detection1.png')} style={styles.bottomImage} />
      <View style={styles.bottomBar}></View>
    </ScrollView>
  );
};

export default RecordingScreen;
