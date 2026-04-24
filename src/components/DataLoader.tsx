'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { fetchUserData } from '@/actions/finance';

export default function DataLoader() {
  const user = useAuthStore((s) => s.user);
  const isLoaded = useFinanceStore((s) => s.isLoaded);
  const setInitialData = useFinanceStore((s) => s.setInitialData);

  useEffect(() => {
    if (user?.userId && !isLoaded) {
      fetchUserData(user.userId).then((data) => {
        setInitialData(data);
      }).catch((err) => {
        console.error('Failed to load data from database:', err);
      });
    }
  }, [user?.userId, isLoaded, setInitialData]);

  return null; // Invisible component
}
