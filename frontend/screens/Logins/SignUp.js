import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
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
        .then((userCredential) => {
          
          console.log('Signed up with Google:', userCredential.user);
        })
        .catch((error) => {
         
          Alert.alert("Google Sign Up Failed", error.message);
        });
    }
  }, [response]);

  const handleSignUpWithEmail = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        console.log('Signed up with email:', userCredential.user);
      })
      .catch((error) => {
        
        Alert.alert("Sign Up Failed", error.message);
      });
  };

  
  const handleSignUpWithGoogle = () => {
    promptAsync();
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
      <Button title="Sign Up with Email" onPress={handleSignUpWithEmail} />
      <Button title="Sign Up with Google" onPress={handleSignUpWithGoogle} disabled={!request} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});
