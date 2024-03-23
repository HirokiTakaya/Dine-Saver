import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../Logins/firebaseConfig';
import { signOut } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
       
        navigation.replace('Login'); 
      })
      .catch(error => {
        console.error('Logout Error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{auth.currentUser?.email}Welcome</Text>
      <Button title="Logout" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;

