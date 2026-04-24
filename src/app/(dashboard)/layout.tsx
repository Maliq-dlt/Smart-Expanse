'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/useAuthStore';

const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: false });
const TopBar = dynamic(() => import('@/components/layout/TopBar'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/layout/MobileNav'), { ssr: false });
const TransactionModal = dynamic(() => import('@/components/modals/TransactionModal'), { ssr: false });
const CommandMenu = dynamic(() => import('@/components/ui/CommandMenu'), { ssr: false });
const DataLoader = dynamic(() => import('@/components/DataLoader'), { ssr: false });
import PageTransition from '@/components/providers/PageTransition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Only check auth status after Zustand has hydrated from localStorage
    if (isHydrated && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isHydrated, router]);

  // Prevent hydration mismatch and hide content before redirect
  if (!isMounted || !isHydrated || !isAuthenticated) {
    return <div className="min-h-screen bg-[var(--color-background)]" />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] transition-colors duration-300">
      <DataLoader />
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0 pb-24 md:pb-0 overflow-hidden relative flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>

      <MobileNav />
      <TransactionModal />
      <CommandMenu />
    </div>
  );
}
