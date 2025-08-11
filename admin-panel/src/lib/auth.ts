import { User, LoginCredentials, AuthResponse } from '@/types/auth';
import { apiClient } from './api';
import { API_ENDPOINTS, ROLE_PERMISSIONS } from './constants';
import Cookies from 'js-cookie';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Store tokens securely
      Cookies.set('access_token', response.accessToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: 1, // 1 day
      });

      Cookies.set('refresh_token', response.refreshToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: 7, // 7 days
        httpOnly: false, // Set to true in production with proper backend setup
      });

      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('csrf_token');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = Cookies.get('access_token');
      if (!token) return null;

      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;
    
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  }

  static isAuthenticated(): boolean {
    return !!Cookies.get('access_token');
  }

  static getToken(): string | null {
    return Cookies.get('access_token') || null;
  }
}