import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePageScreen from './src/screens/HomePageScreen';
import AvatarScreen from './src/screens/AvatarScreen';
import RecordingScreen from './src/screens/RecordingScreen';
import InformationScreen from './src/screens/InformationScreen';
import ResultScreen from './src/screens/ResultScreen';
import ContactScreen from './src/screens/ContactScreen';
import Recording1 from './src/screens/src/Recording1';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import TopicDetailScreen from './src/screens/TopicDetailScreen';
import { UserProvider } from './src/contexts/UserContext';
import UserAppointmentsScreen from './src/screens/UserAppointmentsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignUpPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomePage" component={HomePageScreen} />
          <Stack.Screen name="AvatarPage" component={AvatarScreen} />
          <Stack.Screen name="RecordingPage" component={RecordingScreen} />
          <Stack.Screen name="InformationPage" component={InformationScreen} />
          <Stack.Screen name="ResultPage" component={ResultScreen} />
          <Stack.Screen name="ContactPage" component={ContactScreen} />
          <Stack.Screen name="Recording1Page" component={Recording1} />
          <Stack.Screen name="SignInPage" component={SignInScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="SignUpPage" component={SignUpScreen} />
          <Stack.Screen name="TopicDetailPage" component={TopicDetailScreen} />
          <Stack.Screen name="UserAppointments" component={UserAppointmentsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
