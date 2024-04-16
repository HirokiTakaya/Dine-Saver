import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState(''); 


  const isValidDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  // Function to save the profile to the backend
  const saveProfile = async () => {
   
    if (!isValidDate(dateOfBirth)) {
      Alert.alert('Error', 'Date of Birth must be in YYYY-MM-DD format.');
      return;
    }

   
    if (!password) {
      Alert.alert('Error', 'Password is required.');
      return;
    }

    const profileData = {
      username,
      email,
      gender,
      dateOfBirth,
      password, 
    };

    try {
      const response = await fetch('https://dine-saver.com/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to save profile: ${errorResponse}`);
      }

      const result = await response.json();
      Alert.alert('Success', 'Profile saved successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
     
      
      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Save" onPress={saveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    padding: 10,
  },
});

export default ProfileScreen;
