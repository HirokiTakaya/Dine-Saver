import React from 'react';
import { Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { auth, GoogleAuthProvider } from './firebaseConfig';
import { signInWithCredential } from 'firebase/auth';
expo
export default function SignInWithGoogleButton() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '94462638950-90qg3jbhher2bbgmlm5ea3ca80r93bku.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((result) => {
        console.log(result);
        
      }).catch((error) => {
        console.error(error);
        
      });
    }
  }, [response]);

  return <Button disabled={!request} title="Login with Google" onPress={() => promptAsync()} />;
}
