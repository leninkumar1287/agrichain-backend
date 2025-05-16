import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const requestOtpRegister = async (formData) => {
    try {
      await axios.post('/api/auth/request-otp', { ...formData, isRegistration: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to request OTP' };
    }
  };

  const verifyOtpRegister = async (formData) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { ...formData, isRegistration: true });
      const { user, token } = res.data;
      setUser(user);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to verify OTP' };
    }
  };

  const requestOtpLogin = async (loginData) => {
    try {
      await axios.post('/api/auth/request-otp', { ...loginData, isRegistration: false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to request OTP' };
    }
  };

  const verifyOtpLogin = async (loginData) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { ...loginData, isRegistration: false });
      const { user, token } = res.data;
      setUser(user);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to verify OTP' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    requestOtpRegister,
    verifyOtpRegister,
    requestOtpLogin,
    verifyOtpLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 