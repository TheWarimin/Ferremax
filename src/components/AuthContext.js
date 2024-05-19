import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

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
    localStorage.removeItem('token')
    //localStorage.setItem('cart', JSON.stringify([]));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};