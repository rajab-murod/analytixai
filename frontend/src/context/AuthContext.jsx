import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('analytix_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('analytix_token') || null);
  const [activeProject, setActiveProject] = useState({ id: 1, name: "Asosiy Sotuvlar Bazasi" });

  const login = async (email, password) => {
    try {
      const resp = await authAPI.login({ email, password });
      const { access_token, user: userData } = resp.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('analytix_token', access_token);
      localStorage.setItem('analytix_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || "Tizimga kirishda xatolik" };
    }
  };

  const register = async (companyName, fullName, email, password) => {
    try {
      const resp = await authAPI.register({
        company_name: companyName,
        full_name: fullName,
        email,
        password
      });
      const { access_token, user: userData } = resp.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('analytix_token', access_token);
      localStorage.setItem('analytix_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || "Ro'yxatdan o'tishda xatolik" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('analytix_token');
    localStorage.removeItem('analytix_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, activeProject, setActiveProject, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
