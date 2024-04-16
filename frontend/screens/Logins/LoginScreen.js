import React, { useEffect, useState } from 'react';
import { Button, Text, View, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useAuth } from './AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '94462638950-90qg3jbhher2bbgmlm5ea3ca80r93bku.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          fetchJwtToken(email, password); 
        })
        .catch((error) => {
          Alert.alert('Google Sign-In Error', error.message);
        });
    }
  }, [response, email, password]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        signIn(userCredential.user);
        fetchJwtToken(email, password);
      })
      .catch((error) => {
        Alert.alert('Login Failed', error.message);
      });
  };

  const fetchJwtToken = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const response = await fetch('https://dine-saver.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Token received:', data.token);
          resolve(data.token);
        } else {
          throw new Error('Server responded with an error');
        }
      } catch (error) {
        console.error('Fetching JWT failed:', error);
        reject(error);
      }
    });
  };

  const handleLoginSuccess = async () => {
    try {
      const token = await fetchJwtToken();
      console.log('Token:', token);
      navigation.navigate('BottomTabNavigator');
    } catch (error) {
      Alert.alert('Error', 'Failed to get JWT token');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          promptAsync();
        }}
        disabled={!request}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: {height: 3, width: 0},
    width: '80%', 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});
