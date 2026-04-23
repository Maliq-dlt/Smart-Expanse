import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (email, name) =>
        set(() => ({
          isAuthenticated: true,
          user: { email, name },
        })),

      signup: (email, name) =>
        set(() => ({
          isAuthenticated: true,
          user: { email, name },
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
