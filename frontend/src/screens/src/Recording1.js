import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker'; // Import the document picker

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recordUri, setRecordUri] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    async function getPermissions() {
      // Ensure the permissions are granted before starting the app
      const response = await Audio.getPermissionsAsync();
      if (response.status !== 'granted') {
        await requestPermission();
      }
    }
    getPermissions();
  }, []);

  async function startRecording() {
    try {
      // Check for permissions before starting
      if (permissionResponse.status !== 'granted') {
        await requestPermission();
      }

      // Configure the audio session for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Prepare the recorder
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if (!recording) {
      return;
    }
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordUri(uri);

    console.log('Recording stopped and stored at', uri);

    // Reset the audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
  }

  // Function to upload a recording from device storage
  async function uploadRecordingFromDevice() {
    const file = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (file.type === 'success') {
      uploadFileToBackend(file.uri);
    }
  }

  // Function to handle the actual upload to the backend
  async function uploadFileToBankend(uri) {
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/m4a', // Adjust the mime type as per your file format
      name: 'uploadedfile.m4a' // Optional: customize the file name
    });

    try {
      const response = await fetch('https://your-backend-url.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseData = await response.json();
      console.log('File uploaded successfully:', responseData);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {recordUri && <Text>Recorded File: {recordUri}</Text>}
      {/* Add a new button to upload a recording from the device */}
      <Button
        title="Upload a Recording"
        onPress={uploadRecordingFromDevice}
        color="#f194ff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
});
