import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem('userEmail') || ''
  );

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userEmail', userEmail);
  }, [isLoggedIn, userEmail]);

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};