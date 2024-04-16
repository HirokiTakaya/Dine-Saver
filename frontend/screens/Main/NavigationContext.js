// NavigationContext.js
import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useAppNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Login');

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};
