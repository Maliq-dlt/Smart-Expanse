'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/home', label: 'Home', icon: 'home' },
  { href: '/transactions', label: 'Transactions', icon: 'receipt_long' },
  { href: '/budget', label: 'Budget', icon: 'account_balance_wallet' },
  { href: '/goals', label: 'Goals', icon: 'ads_click' },
  { href: '/reports', label: 'Reports', icon: 'bar_chart' },
  { href: '/accounts', label: 'Accounts', icon: 'account_balance' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { isPrivacyMode, togglePrivacyMode } = useFinanceStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r border-[var(--color-sidebar-border)] apple-glass py-8 px-6 shadow-soft fixed z-20 transition-colors duration-300">
      {/* Brand */}
      <div className="mb-12">
        <Link href={isMounted && isAuthenticated ? '/home' : '/'}>
          <h1 className="text-2xl font-[var(--font-serif-heading)] tracking-tight text-[var(--color-navy)] font-bold font-serif hover:text-[var(--color-primary)] transition-colors">
            SmartExpense
          </h1>
        </Link>
        <p className="font-[var(--font-label)] text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] mt-1">
          Financial Wellness
        </p>
      </div>

      {/* Navigation */}
      <motion.nav
        className="flex-1 space-y-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <LayoutGroup>
        {navItems.map((navItem) => {
          const isActive = pathname === navItem.href;
          return (
            <motion.div key={navItem.href} variants={item} className="relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[var(--color-primary-container)]/10 rounded-lg border-r-2 border-[var(--color-primary)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Link
                href={navItem.href}
                className={`relative z-10 flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 group ${
                  isActive
                    ? 'text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-navy)]/70 dark:text-[var(--color-on-surface-variant)] hover:bg-[var(--color-sidebar-border)] dark:hover:bg-[var(--color-surface-container)] hover:translate-x-1'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>
                  {navItem.icon}
                </span>
                <span>{navItem.label}</span>
              </Link>
            </motion.div>
          );
        })}
        </LayoutGroup>
      </motion.nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-4">
        <Link
          href="/settings"
          className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 ${
            pathname === '/settings'
              ? 'text-[var(--color-primary-container)] dark:text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-navy)]/70 dark:text-[var(--color-on-surface-variant)] hover:bg-[var(--color-sidebar-border)] dark:hover:bg-[var(--color-surface-container)]'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>

        {/* User Profile */}
        {isMounted && user && (
          <div className="flex items-center space-x-3 p-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)] font-bold text-sm uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-[var(--color-on-surface)] truncate max-w-[120px]">{user.name}</span>
              <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)]">
                Pro Plan
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
