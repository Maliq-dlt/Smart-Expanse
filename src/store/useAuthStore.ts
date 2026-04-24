import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  userId: string; // Database UUID
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name: string, userId: string) => void;
  signup: (email: string, name: string, userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (email, name, userId) =>
        set(() => ({
          isAuthenticated: true,
          user: { email, name, userId },
        })),

      signup: (email, name, userId) =>
        set(() => ({
          isAuthenticated: true,
          user: { email, name, userId },
        })),

      logout: () =>
        set(() => ({
          isAuthenticated: false,
          user: null,
        })),
    }),
    {
      name: 'smartexpense-auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
