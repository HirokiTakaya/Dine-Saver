
import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './screens/Logins/firebaseConfig';
import { NavigationProvider } from './screens/Main/NavigationContext'; 


import AuthScreen from './screens/Logins/AuthScreen';
import LoginScreen from './screens/Logins/LoginScreen';
import SignUp from './screens/Logins/SignUp';
import HomeScreen from './screens/Main/HomeScreen';
import SearchScreen from './screens/Main/SearchScreen';
import RestaurantDetailScreen from './screens/Main/RestaurantDetailScreen';
import BottomTabNavigator from './screens/Main/BottomTabNavigator';

import { AuthProvider, useAuth } from './screens/Logins/AuthContext';

const Stack = createNativeStackNavigator();

function AppInner() {
  const { user, signIn } = useAuth();
  const navigationRef = useRef(null);

  
  useEffect(() => {
    const initGoogleSignIn = async () => {
      
      const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '94462638950-90qg3jbhher2bbgmlm5ea3ca80r93bku.apps.googleusercontent.com',
      });

      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const result = await signInWithCredential(auth, credential);
          signIn(result.user);
        } catch (error) {
          console.error(error);
        }
      }
    };

    initGoogleSignIn();
  }, [signIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Authentication' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Signup' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>

      <AppInner />
  
  </AuthProvider>
  );
}
