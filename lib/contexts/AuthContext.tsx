import React, { createContext, useState, useContext } from 'react';
import { AuthData } from '../types';

interface AuthContextType {
  authData: AuthData | null;
  login: (authData: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx
};

export const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const login = (authData: AuthData) => {
    setAuthData({ ...authData });
  };

  const logout = () => {
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};