import React, { createContext, useContext, useState } from 'react';

const TabBarContext = createContext();

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    // Return default values if used outside provider
    return { 
      isImageCaptured: false, 
      setImageCaptured: () => {},
      isFilterScrolling: false,
      setFilterScrolling: () => {},
      showMenuOptions: false,
      setShowMenuOptions: () => {}
    };
  }
  return context;
};

export const TabBarProvider = ({ children }) => {
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const [isFilterScrolling, setIsFilterScrolling] = useState(false);
  const [showMenuOptions, setShowMenuOptionsState] = useState(false);

  const setImageCaptured = (value) => {
    setIsImageCaptured(value);
  };

  const setFilterScrolling = (value) => {
    setIsFilterScrolling(value);
  };

  const setShowMenuOptions = (value) => {
    setShowMenuOptionsState(value);
  };

  return (
    <TabBarContext.Provider value={{ 
      isImageCaptured, 
      setImageCaptured,
      isFilterScrolling,
      setFilterScrolling,
      showMenuOptions,
      setShowMenuOptions
    }}>
      {children}
    </TabBarContext.Provider>
  );
};

