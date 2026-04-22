import { create } from 'zustand';
import api from '@/api/client'; // Your axios instance
import { authService } from '@/api/auth.service';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  // Actions
  setAuth: (user: User|null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  status: 'idle',

  setAuth: (user) => set({ 
    user, 
    isAuthenticated: true, 
    status: 'authenticated' 
  }),

  checkAuth: async () => {
    set({ status: 'loading' });
    try {
      // Your backend should have an endpoint that validates the HttpOnly Cookie
      const { data } = await api.get('/auth/me'); 
      
      set({ 
        user: data.data, 
        isAuthenticated: true, 
        status: 'authenticated' 
      });
    } catch (error) {
      console.error(error)
      set({ 
        user: null, 
        isAuthenticated: false, 
        status: 'unauthenticated' 
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      // Always clear local state even if logout request fails
      set({ user: null, isAuthenticated: false, status: 'unauthenticated' });
    }
  },
}));