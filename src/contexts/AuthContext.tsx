import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = any;

type AuthContextValue = {
  user: User | null;
  token: string | null;
  setUser: (u: User | null, token?: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem('token'); } catch (e) { return null; }
  });

  useEffect(() => {
    // keep localStorage in sync
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    } catch (e) {}
  }, [token]);

  const setUser = (u: User | null, t: string | null = null) => {
    setUserState(u);
    setToken(t);
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
  };

  const value = useMemo(() => ({ user, token, setUser, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
