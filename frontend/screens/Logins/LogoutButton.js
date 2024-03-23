import React from 'react';
import { Button } from 'react-native';
import { useAuth } from './AuthContext'; 

const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <Button title="Logout" onPress={signOut} />
  );
};

export default LogoutButton;
