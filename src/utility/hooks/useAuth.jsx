import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStoredToken, getStoredUser, setStoredAuth, clearStoredAuth, loginWithSdmsCredentials } from '../auth/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children, onRoleChange }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [currentUserRole, setCurrentUserRole] = useState(() => getStoredUser()?.role || 'ServiceAdvisor');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const login = async (credentials) => {
    const result = await loginWithSdmsCredentials(credentials);
    const newToken = getStoredToken();
    const newUser = getStoredUser();
    setToken(newToken);
    setCurrentUser(newUser);
    const role = newUser?.role || credentials?.role || 'ServiceAdvisor';
    setCurrentUserRole(role);
    if (onRoleChange) onRoleChange(role);
    return result;
  };

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setCurrentUser(null);
    setCurrentUserRole('ServiceAdvisor');
    setIsProfileDropdownOpen(false);
  }, []);

  const setRole = useCallback((role) => {
    setCurrentUserRole(role);
    const updatedUser = { ...(currentUser || {}), role };
    setCurrentUser(updatedUser);
    if (token) setStoredAuth(token, updatedUser);
    if (onRoleChange) onRoleChange(role);
  }, [currentUser, token, onRoleChange]);

  const handleQuickLogin = useCallback((role) => {
    const targetRole = role || 'ServiceAdvisor';
    setRole(targetRole);
    setToken('sdms-mock-jwt-token');
    setStoredAuth('sdms-mock-jwt-token', { role: targetRole, name: `${targetRole} User` });
  }, [setRole]);

  const value = {
    token,
    currentUser,
    currentUserRole,
    login,
    logout,
    handleLogout: logout,
    setRole,
    handleQuickLogin,
    isLoggedIn: !!token,
    isAuthenticated: !!token,
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
