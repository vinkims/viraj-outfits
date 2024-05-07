import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(!!localStorage.getItem('token'));
  const [ isTokenExpired, setIsTokenExpired ] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = new Date();
        const tokenExp = new Date(decodedToken.exp * 1000);

        if (tokenExp < currentTime) {
          setIsTokenExpired(true);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        } else {
          setIsTokenExpired(false);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  const userContextValue = useMemo(() => (
    { isAuthenticated, isTokenExpired, login, logout }
  ), [isAuthenticated, isTokenExpired]);

  return (
    <AuthContext.Provider value={userContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);