// utils/superAdminAuth.js
export const SUPER_AUTH_STORAGE_KEY = 'superAdminUser';
export const SUPER_TOKEN_STORAGE_KEY = 'superAdminToken';

// Super Admin Credentials (in production, this should be in environment variables)
export const SUPER_ADMIN_CREDENTIALS = {
  username: 'superadmin',
  password: 'SuperAdmin@2025'
};

// Check if we're on client side
const isClient = () => typeof window !== 'undefined';

// Check if super admin is authenticated
export const isSuperAdminAuthenticated = () => {
  if (!isClient()) return false;
  
  try {
    const token = localStorage.getItem(SUPER_TOKEN_STORAGE_KEY);
    const user = localStorage.getItem(SUPER_AUTH_STORAGE_KEY);
    
    if (!token || !user) return false;
    
    // Parse user data to validate
    const userData = JSON.parse(user);
    return !!(userData && userData.role === 'superadmin');
  } catch (error) {
    console.error('Error checking super admin auth:', error);
    return false;
  }
};

// Get current super admin data
export const getCurrentSuperAdmin = () => {
  if (!isClient()) return null;
  
  try {
    const userStr = localStorage.getItem(SUPER_AUTH_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing super admin data:', error);
    return null;
  }
};

// Get super admin token
export const getSuperAdminToken = () => {
  if (!isClient()) return null;
  return localStorage.getItem(SUPER_TOKEN_STORAGE_KEY);
};

// Login super admin
export const superAdminLogin = (credentials) => {
  if (!isClient()) return false;
  
  const { username, password } = credentials;
  
  // Validate credentials
  if (username === SUPER_ADMIN_CREDENTIALS.username && 
      password === SUPER_ADMIN_CREDENTIALS.password) {
    
    // Create user session
    const userData = {
      id: 'superadmin',
      name: 'Super Administrator',
      role: 'superadmin',
      username: username,
      loginTime: new Date().toISOString(),
      permissions: ['all']
    };
    
    const token = 'super-admin-token-' + Date.now();
    
    // Store in localStorage
    localStorage.setItem(SUPER_AUTH_STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(SUPER_TOKEN_STORAGE_KEY, token);
    
    return true;
  }
  
  return false;
};

// Logout super admin
export const superAdminLogout = () => {
  if (!isClient()) return;
  
  localStorage.removeItem(SUPER_AUTH_STORAGE_KEY);
  localStorage.removeItem(SUPER_TOKEN_STORAGE_KEY);
  
  // Redirect to login
  window.location.href = '/superadmin/login';
};

// Check if user has super admin privileges
export const hasSuperAdminPrivileges = () => {
  const user = getCurrentSuperAdmin();
  return user && user.role === 'superadmin';
};