import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse stored user session', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const authData = res.data;
    setToken(authData.token);
    setUser({
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      providerId: authData.providerId,
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      providerId: authData.providerId,
    }));
    return authData;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const authData = res.data;
    setToken(authData.token);
    setUser({
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      providerId: authData.providerId,
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      id: authData.id,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      providerId: authData.providerId,
    }));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
