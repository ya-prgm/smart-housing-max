import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, clearAuthTokens } from '../api/client';
import { AuthUser } from '../../features/auth/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('current_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getAccessToken());
  });

  useEffect(() => {
    const raw = localStorage.getItem('current_user');
    const token = getAccessToken();
    setIsAuthenticated(Boolean(token));
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    localStorage.removeItem('current_user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/welcome');
  }, [navigate]);

  return {
    user,
    isAuthenticated,
    logout,
  };
};
