'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { openTransactionModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Command Palette on Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const commands = [
    {
      id: 'new-transaction',
      title: 'Catat Transaksi Baru',
      icon: 'add_circle',
      action: () => {
        setIsOpen(false);
        openTransactionModal();
      },
      type: 'action'
    },
    {
      id: 'nav-home',
      title: 'Pergi ke Beranda',
      icon: 'home',
      action: () => {
        setIsOpen(false);
        router.push('/home');
      },
      type: 'nav'
    },
    {
      id: 'nav-budget',
      title: 'Pergi ke Anggaran (Budget)',
      icon: 'account_balance_wallet',
      action: () => {
        setIsOpen(false);
        router.push('/budget');
      },
      type: 'nav'
    },
    {
      id: 'nav-goals',
      title: 'Pergi ke Tabungan (Goals)',
      icon: 'savings',
      action: () => {
        setIsOpen(false);
        router.push('/goals');
      },
      type: 'nav'
    },
    {
      id: 'nav-reports',
      title: 'Pergi ke Laporan',
      icon: 'monitoring',
      action: () => {
        setIsOpen(false);
        router.push('/reports');
      },
      type: 'nav'
    },
    {
      id: 'nav-settings',
      title: 'Pergi ke Pengaturan',
      icon: 'settings',
      action: () => {
        setIsOpen(false);
        router.push('/settings');
      },
      type: 'nav'
    }
  ];

  // Filter commands
  const filteredCommands = query === '' 
    ? commands 
    : commands.filter((cmd) => cmd.title.toLowerCase().includes(query.toLowerCase()));

  // Handle execution
  const executeCommand = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="bg-[var(--color-surface-lowest)]/80 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-[var(--color-surface-variant)]/50 overflow-hidden flex flex-col">
              
              {/* Search Input */}
              <div className="flex items-center px-4 border-b border-[var(--color-surface-variant)]/50">
                <span className="material-symbols-outlined text-[var(--color-outline)] text-2xl">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ketik perintah atau pencarian..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none p-4 text-lg text-[var(--color-on-surface)] placeholder:text-[var(--color-surface-variant)] focus:ring-0 outline-none"
                />
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--color-surface-variant)] px-2 py-1 bg-[var(--color-surface-container)] rounded-md border border-[var(--color-surface-variant)]/30">
                  <span>ESC</span>
                </div>
              </div>

              {/* Command List */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="p-6 text-center text-[var(--color-outline)]">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                    <p>Tidak ada perintah yang ditemukan.</p>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {filteredCommands.map((cmd) => (
                      <li key={cmd.id}>
                        <button
                          onClick={() => executeCommand(cmd.action)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-surface-container)] focus:bg-[var(--color-primary-container)]/20 focus:outline-none transition-colors text-left group"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            cmd.type === 'action' 
                              ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]' 
                              : 'bg-[var(--color-surface-variant)]/50 text-[var(--color-on-surface)]'
                          }`}>
                            <span className="material-symbols-outlined text-xl">{cmd.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-[var(--color-on-surface)]">{cmd.title}</h4>
                            <p className="text-[10px] uppercase tracking-widest text-[var(--color-outline)]">
                              {cmd.type === 'action' ? 'Aksi' : 'Navigasi'}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-[var(--color-outline)] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                            keyboard_return
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="bg-[var(--color-surface-low)]/50 border-t border-[var(--color-surface-variant)]/50 p-3 flex justify-between items-center text-xs text-[var(--color-outline)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded border border-[var(--color-surface-variant)]/50">↑</kbd>
                    <kbd className="font-mono bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded border border-[var(--color-surface-variant)]/50">↓</kbd>
                    navigasi
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-[var(--color-surface-container)] px-1.5 py-0.5 rounded border border-[var(--color-surface-variant)]/50">Enter</kbd>
                    pilih
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Smartexpense AI</span>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
