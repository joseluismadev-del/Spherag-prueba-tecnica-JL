import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login as loginService} from '../services/authService';

const TOKEN_KEY = 'auth_token';
const AuthContext = createContext(null);

export function AuthProvider({children}) {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY)
      .then(stored => {
        if (stored) {
          setToken(stored);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await loginService(username, password);
    const accessToken = data.accessToken.token;
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
