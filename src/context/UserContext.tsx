import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; 
import { AxiosError } from 'axios';
interface UserProviderProps { 
  children: React.ReactNode;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'developer';
  isApproved: boolean;
  shift?: '1st' | '2nd' | 'night';
  phone?: string;
  managerId?: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>; 
  loading: boolean; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
  try {
    await api.delete('/logout'); 
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    setUser(null);
    sessionStorage.removeItem('token');
    console.log('✅ User logged out');
  }
};

  useEffect(() => {
    let isMounted = true; 
    const token = sessionStorage.getItem('token');

    if (token && !user) {
      api.get('/protected')
        .then((res) => {
        if (isMounted) {
            setUser(res.data as User);
        }
        })
        .catch((err: AxiosError<{ message?: string }>) => {
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          } else {
            console.error('Unexpected error loading user:', err);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
        } else {
        setLoading(false);
        }

        return () => {
        isMounted = false;
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};