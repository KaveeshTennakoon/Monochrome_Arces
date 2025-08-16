// utils/auth.js - Updated version with API integration
export const AUTH_STORAGE_KEY = 'adminUser';
export const TOKEN_STORAGE_KEY = 'adminToken';

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = localStorage.getItem(AUTH_STORAGE_KEY);
  
  if (!token || !user) return false;
  
  try {
    // Parse user data to validate
    const userData = JSON.parse(user);
    
    // Check if token is expired (if expiry is stored)
    if (userData.tokenExpiry && new Date() > new Date(userData.tokenExpiry)) {
      logout();
      return false;
    }
    
    return !!(token && userData);
  } catch (error) {
    console.error('Error validating authentication:', error);
    logout();
    return false;
  }
};

// Get current user data
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get auth token
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

// Set authentication data
export const setAuthData = (user, token, expiresIn = null) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Add expiry time if provided
    if (expiresIn) {
      user.tokenExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();
    }
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Error setting auth data:', error);
  }
};

// Update user data (useful for profile updates)
export const updateUser = (updatedUserData) => {
  if (typeof window === 'undefined') return;
  
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};