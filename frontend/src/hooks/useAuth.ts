import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { login as loginRequest, logout as logoutRequest, refresh as refreshRequest, register as registerRequest, type AuthUser } from '../api/auth';
import { clearAuthTokens, setAccessToken } from '../api/client';

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    refreshRequest()
      .then(result => {
        if (!active || !result) return;
        setAccessToken(result.accessToken);
        setUser(result.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        clearAuthTokens();
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const response = await loginRequest(email, password);
    setUser(response.user);
    setIsAuthenticated(true);
    setIsReady(true);
  }

  async function register(name: string, email: string, password: string) {
    const response = await registerRequest(name, email, password);
    setUser(response.user);
    setIsAuthenticated(true);
    setIsReady(true);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
    setIsReady(true);
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isReady
  }), [isAuthenticated, isReady, user]);

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
