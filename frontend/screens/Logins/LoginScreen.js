import React, { useEffect, useState } from 'react';
import { Button, View, TextInput, StyleSheet, Alert } from 'react-native';
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
        
        signIn(result.user);
      
      })
      .catch((error) => {
        Alert.alert("Google Sign-In Error", error.message);
      });
  }
}, [response, signIn]); 


const handleLogin = () => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
     
      signIn(userCredential.user);
    
    })
    .catch((error) => {
      Alert.alert("Login Failed", error.message);
    });
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
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Login with Google"
        onPress={() => {
          promptAsync();
        }}
        disabled={!request}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
