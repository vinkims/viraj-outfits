import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import Config from "react-native-config";
import jwt_decode from "jwt-decode";

import LoggerUtil from "../utils/LoggerUtil";
import ServerCommunicationUtil from "../utils/ServerCommunicationUtil";
import StorageUtil from "../utils/StorageUtil";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ isTokenValid, setIsTokenValid ] = useState(false);

  useEffect(() => {
    const checkStoredUser = async () => {
      try {
        const storedUser = await StorageUtil.getUsername();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        LoggerUtil.logError("error getting stored user", error);
      }
    };

    checkStoredUser();
  }, []);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setLoading(true);
      try {
        const token = await StorageUtil.getToken();
        if (token) {
          const dateNow = new Date();
          const decoded = jwt_decode(token);
          StorageUtil.storeUserId(decoded.userId);
          if (decoded.exp * 1000 > dateNow.getTime()) {
            setIsTokenValid(true);
          } else {
            setIsTokenValid(false)
            StorageUtil.removeKeys();
          }
        } else {
          setIsTokenValid(false);
          StorageUtil.removeKeys();
        }
      } catch(error) {
        LoggerUtil.logError('Error checking token validity', error);
        setIsTokenValid(false);
        StorageUtil.removeKeys();
      } finally {
        setLoading(false);
      }
    }

    checkTokenValidity();
  }, []);

  const login = async (userData) => {
    setLoading(true);
    LoggerUtil.logDebug("Login info", userData);
    await ServerCommunicationUtil.postNoAuth(`${Config.API_URL}/auth`, userData)
    .then(resp => {
      if (resp.status === 200) {
        LoggerUtil.logInfo("Login successful");
        StorageUtil.storeToken(resp.content.token);
        let decodedToken = jwt_decode(resp.content.token);
        StorageUtil.storeUserId(decodedToken.userId);
        setUser(userData.username);
        StorageUtil.storeUsername(userData.username);
        setLoading(false);
      } else if (resp.validationError.errors) {
        setLoading(false);
        Alert.alert('Error', 'Invalid credentials provided');
      }
    }).catch(error => {
      setLoading(false);
      LoggerUtil.logError('Login', error);
      if (error.toString().includes('Network request failed')) {
        Alert.alert('Error', 'Please check your internet connection');
      }
    })
  };

  const logout = async (logoutData) => {
    setLoading(true);
    await ServerCommunicationUtil.post(`${Config.API_URL}/auth/signout`, logoutData)
    .then(resp => {
      if (resp.status === 200) {
        LoggerUtil.logInfo("Signout successful");
        StorageUtil.removeKeys();
        setUser(null);
        setLoading(false);
      } else {
        setLoading(false);
        setUser(null);
        StorageUtil.removeKeys();
      }
    }).catch(error => {
      LoggerUtil.logError('Logout', error);
      setUser(null);
      StorageUtil.removeKeys();
      setLoading(false);
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}