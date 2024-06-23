import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    const loadAvatar = async () => {
      const storedAvatarUri = await AsyncStorage.getItem('profileImage');
      if (storedAvatarUri) {
        setAvatarUri(storedAvatarUri);
      }
    };
    loadAvatar();
  }, []);

  const updateAvatarUri = async (uri) => {
    setAvatarUri(uri);
    await AsyncStorage.setItem('profileImage', uri);
  };

  return (
    <UserContext.Provider value={{ avatarUri, setAvatarUri: updateAvatarUri }}>
      {children}
    </UserContext.Provider>
  );
};
