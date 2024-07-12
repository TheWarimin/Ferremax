import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail') || '');
  const [isEmployee, setIsEmployee] = useState(() => localStorage.getItem('is_employee') === 'true');
  const [employeeRole, setEmployeeRole] = useState(() => localStorage.getItem('employee_role') || '');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('is_employee', isEmployee);
    localStorage.setItem('employee_role', employeeRole);
  }, [isLoggedIn, userEmail, isEmployee, employeeRole]);

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setIsEmployee(false);
    setEmployeeRole('');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('is_employee');
    localStorage.removeItem('employee_role');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userEmail, setUserEmail, isEmployee, setIsEmployee, employeeRole, setEmployeeRole }}>
      {children}
    </AuthContext.Provider>
  );
};
