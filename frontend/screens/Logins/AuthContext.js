import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const auth = getAuth();

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
      
        setUser(currentUser);
      } else {

        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
     
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
     
      console.log(userCredential.user); 
      
    } catch (error) {
      
      console.error(error);
      throw error; 
    }
  
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
