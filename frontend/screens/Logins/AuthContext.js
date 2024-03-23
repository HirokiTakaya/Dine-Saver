import React, { createContext, useState, useContext } from 'react';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';

const auth = getAuth();


export const AuthContext = createContext({
  user: null,
  signIn: async (user) => {},
  signOut: async () => { 
    try {
      await firebaseSignOut(auth); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
});


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  const signIn = (user) => {
    setUser(user);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth); 
      setUser(null); 
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
