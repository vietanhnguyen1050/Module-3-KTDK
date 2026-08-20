import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UserRole } from '../types';
import { api, setAuthToken, removeAuthToken, setDemoUserId } from '../services/api';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRoleDemo: (role: 'guest' | UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Default demo to customer if no token set initially
    if (!localStorage.getItem('edupress_token') && !localStorage.getItem('edupress_demo_user_id')) {
      setDemoUserId('user_customer_1');
    }
    fetchCurrentUser();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const res = await api.login({ email, password: pass });
    if (res.success && res.data) {
      setAuthToken(res.data.token);
      setDemoUserId(res.data.user.id);
      setUser(res.data.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('edupress_demo_user_id');
    setUser(null);
  };

  const switchRoleDemo = async (role: 'guest' | UserRole) => {
    setLoading(true);
    if (role === 'guest') {
      logout();
      setLoading(false);
      return;
    }

    let targetId = 'user_customer_1';
    if (role === 'provider') targetId = 'user_provider_1';
    if (role === 'admin') targetId = 'user_admin';

    setDemoUserId(targetId);
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      switchRoleDemo,
      refreshUser: fetchCurrentUser
    }}>
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
