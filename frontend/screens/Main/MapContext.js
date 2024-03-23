// MapContext.js
import React, { createContext, useState, useContext } from 'react';

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [region, setRegion] = useState(null); 

  return (
    <MapContext.Provider value={{ region, setRegion }}>
      {children}
    </MapContext.Provider>
  );
};
