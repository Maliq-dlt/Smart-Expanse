'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { openTransactionModal } = useModal();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[15vh] p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)} 
      />
      
      <Command 
        className="w-full max-w-xl bg-[var(--color-surface-lowest)] rounded-2xl shadow-2xl border border-[var(--color-surface-variant)] overflow-hidden relative z-10 flex flex-col"
        shouldFilter={false}
      >
        <div className="flex items-center border-b border-[var(--color-surface-variant)] px-4">
          <span className="material-symbols-outlined text-[var(--color-outline)] mr-2">search</span>
          <Command.Input 
            autoFocus 
            placeholder="Cari transaksi, halaman, atau ketik perintah..." 
            className="flex-1 bg-transparent py-5 outline-none text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-[var(--color-surface-low)] border border-[var(--color-surface-variant)] px-2 py-1 rounded text-xs text-[var(--color-outline)] font-mono">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="py-6 text-center text-[var(--color-outline)] text-sm">
            Tidak ada hasil yang ditemukan.
          </Command.Empty>

          <Command.Group heading="Aksi Cepat" className="text-xs font-semibold text-[var(--color-outline)] px-2 py-2">
            <Command.Item 
              onSelect={() => runCommand(() => openTransactionModal())}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--color-primary-container)]/20 aria-selected:text-[var(--color-primary)] text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span className="font-medium text-sm">Tambah Transaksi Baru</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Navigasi" className="text-xs font-semibold text-[var(--color-outline)] px-2 py-2 mt-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/home'))}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              <span className="font-medium text-sm">Dashboard Utama</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/transactions'))}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              <span className="font-medium text-sm">Riwayat Transaksi</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/budget'))}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              <span className="font-medium text-sm">Anggaran Bulanan</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/goals'))}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">flag</span>
              <span className="font-medium text-sm">Tujuan Tabungan</span>
            </Command.Item>
          </Command.Group>
          
          <Command.Group heading="Lainnya" className="text-xs font-semibold text-[var(--color-outline)] px-2 py-2 mt-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/settings'))}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer aria-selected:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
              <span className="font-medium text-sm">Pengaturan</span>
            </Command.Item>
          </Command.Group>

        </Command.List>
      </Command>
    </div>
  );
}
