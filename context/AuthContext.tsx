import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isUserReady: boolean;
  login: (user: User) => void;
  continueAsGuest: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isUserReady: false,
  login: () => {},
  continueAsGuest: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isUserReady, setIsUserReady] = useState(false);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsGuest(false);
    setIsUserReady(true);
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    setIsUserReady(true);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    setIsUserReady(false);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isGuest, isUserReady, login, continueAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

