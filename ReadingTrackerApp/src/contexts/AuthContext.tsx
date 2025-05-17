import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Alert } from 'react-native';
import * as Crypto from 'expo-crypto';

export interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  authProvider?: 'email' | 'google' | 'apple' | 'guest';
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    type: 'guest' | 'user';
    email?: string;
    name?: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => { isValid: boolean; message: string };
  loginAttempts: number;
  resetLoginAttempts: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Fetch user info with the access token
      fetchGoogleUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchGoogleUserInfo = async (accessToken: string | undefined) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const userInfo = await response.json();
      const user: User = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        photoUrl: userInfo.picture,
        authProvider: 'google',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      Alert.alert('로그인 오류', '구글 로그인 중 오류가 발생했습니다.');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would validate against a backend
    // This is a simplified example
    try {
      if (loginAttempts >= 5) {
        Alert.alert('로그인 제한', '너무 많은 시도로 인해 로그인이 제한되었습니다. 잠시 후 다시 시도해주세요.');
        return false;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - replace with actual API call
      if (email === 'test@example.com' && password === 'password123') {
        const user: User = {
          id: '1',
          email,
          name: '테스트 사용자',
          authProvider: 'email',
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setLoginAttempts(0);
        return true;
      } else {
        setLoginAttempts(prev => prev + 1);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await promptAsync();
      return result.type === 'success';
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const loginWithApple = async (): Promise<boolean> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      // Create user from Apple credential
      const user: User = {
        id: credential.user,
        email: credential.email || `apple_${credential.user}@example.com`,
        name: credential.fullName?.givenName,
        authProvider: 'apple',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      console.error('Apple login error:', error);
      return false;
    }
  };

  const loginAsGuest = async (): Promise<boolean> => {
    try {
      // 16바이트 랜덤값을 생성하고 hex string으로 변환
      const randomBytes = await Crypto.getRandomBytesAsync(16);
      const guestId = Array.from(randomBytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

      const guestUser = {
        id: guestId,
        type: 'guest' as const,
        createdAt: new Date().toISOString()
      };

      await AsyncStorage.setItem('user', JSON.stringify(guestUser));
      setUser(guestUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Guest login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // In a real app, you would register with a backend
    // This is a simplified example
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        authProvider: 'email',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: '비밀번호는 최소 하나의 대문자를 포함해야 합니다.' };
    }
    
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: '비밀번호는 최소 하나의 숫자를 포함해야 합니다.' };
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      return { isValid: false, message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.' };
    }
    
    return { isValid: true, message: '유효한 비밀번호입니다.' };
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
  };

  return (
    <AuthContext.Provider value={{
      isLoading,
      isAuthenticated,
      user,
      login,
      loginWithGoogle,
      loginWithApple,
      loginAsGuest,
      logout,
      register,
      validateEmail,
      validatePassword,
      loginAttempts,
      resetLoginAttempts
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
