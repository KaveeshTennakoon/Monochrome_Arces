export const AUTH_STORAGE_KEY = 'adminUser';
export const TOKEN_STORAGE_KEY = 'adminToken';

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = localStorage.getItem(AUTH_STORAGE_KEY);
  
  return !!(token && user);
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

// Logout user
export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  
  // Redirect to login
  window.location.href = '/admin/login';
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  
  return user.permissions.includes(permission);
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.role === role;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};