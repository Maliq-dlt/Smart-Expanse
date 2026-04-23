'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">Konfigurasi</p>
        <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
          Pengaturan
        </h1>
      </motion.div>

      <motion.div className="space-y-6" initial="hidden" animate="show" variants={stagger}>
        {/* ─── Appearance Section ─── */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[var(--color-primary)]">palette</span>
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] font-serif">Tampilan</h2>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-[var(--color-surface-variant)]/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)]/20 flex items-center justify-center text-[var(--color-primary)]">
                <span className="material-symbols-outlined">
                  {isMounted && theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Tema Gelap</p>
                <p className="text-sm text-[var(--color-outline)]">
                  {isMounted && theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}
                </p>
              </div>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                isMounted && theme === 'dark'
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-outline-variant)]'
              }`}
              aria-label="Toggle dark mode"
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ x: isMounted && theme === 'dark' ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <span className="material-symbols-outlined text-sm text-[var(--color-on-surface)]" style={{ fontSize: '14px' }}>
                  {isMounted && theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </motion.div>
            </button>
          </div>

          {/* Theme Preview */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button
              onClick={() => isMounted && theme !== 'light' && toggleTheme()}
              className={`p-4 rounded-xl border-2 transition-all ${
                isMounted && theme === 'light'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-surface-variant)] hover:border-[var(--color-outline)]'
              }`}
            >
              <div className="bg-[#faf9f5] rounded-lg p-3 mb-3 border border-[#e3e3de]">
                <div className="w-full h-2 bg-[#8faf8a] rounded-full mb-2"></div>
                <div className="w-3/4 h-2 bg-[#e3e3de] rounded-full mb-2"></div>
                <div className="w-1/2 h-2 bg-[#ce98a8] rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-[var(--color-on-surface)]">Tema Terang</p>
              <p className="text-xs text-[var(--color-outline)]">Nyaman untuk siang hari</p>
            </button>
            <button
              onClick={() => isMounted && theme !== 'dark' && toggleTheme()}
              className={`p-4 rounded-xl border-2 transition-all ${
                isMounted && theme === 'dark'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-surface-variant)] hover:border-[var(--color-outline)]'
              }`}
            >
              <div className="bg-[#1a1c19] rounded-lg p-3 mb-3 border border-[#434841]">
                <div className="w-full h-2 bg-[#314d30] rounded-full mb-2"></div>
                <div className="w-3/4 h-2 bg-[#434841] rounded-full mb-2"></div>
                <div className="w-1/2 h-2 bg-[#643a48] rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-[var(--color-on-surface)]">Tema Gelap</p>
              <p className="text-xs text-[var(--color-outline)]">Nyaman untuk malam hari</p>
            </button>
          </div>
        </motion.div>

        {/* ─── Profile Section ─── */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[var(--color-primary)]">person</span>
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] font-serif">Profil</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)] text-2xl font-bold uppercase">
              {isMounted && user ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-medium text-[var(--color-on-surface)]">{isMounted && user ? user.name : 'User'}</h3>
              <p className="text-sm text-[var(--color-outline)]">{isMounted && user ? user.email : 'user@example.com'}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-primary-container)]/20 text-[var(--color-primary)] text-[10px] font-semibold tracking-[0.05em] uppercase mt-1">
                Pro Plan
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-surface-variant)]/50">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Nama Lengkap</p>
                <p className="text-sm text-[var(--color-outline)]">{isMounted && user ? user.name : '-'}</p>
              </div>
              <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Edit</button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-surface-variant)]/50">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Email</p>
                <p className="text-sm text-[var(--color-outline)]">{isMounted && user ? user.email : '-'}</p>
              </div>
              <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Edit</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Password</p>
                <p className="text-sm text-[var(--color-outline)]">••••••••</p>
              </div>
              <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ubah</button>
            </div>
          </div>
        </motion.div>

        {/* ─── Notifications Section ─── */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[var(--color-primary)]">notifications</span>
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] font-serif">Notifikasi</h2>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Peringatan Anggaran', desc: 'Notifikasi saat mendekati batas anggaran', default: true },
              { title: 'Transaksi Besar', desc: 'Notifikasi untuk transaksi di atas Rp 1.000.000', default: true },
              { title: 'Laporan Mingguan', desc: 'Ringkasan keuangan setiap minggu', default: false },
              { title: 'Tips Keuangan', desc: 'Saran dan tips pengelolaan keuangan', default: false },
            ].map((notif, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--color-surface-variant)]/50 last:border-0">
                <div>
                  <p className="font-medium text-[var(--color-on-surface)]">{notif.title}</p>
                  <p className="text-sm text-[var(--color-outline)]">{notif.desc}</p>
                </div>
                <button className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                  notif.default
                    ? 'bg-[var(--color-primary)]'
                    : 'bg-[var(--color-outline-variant)]'
                }`}>
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    notif.default ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Preferences Section ─── */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] font-serif">Preferensi</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-surface-variant)]/50">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Mata Uang</p>
                <p className="text-sm text-[var(--color-outline)]">Rupiah (IDR)</p>
              </div>
              <span className="material-symbols-outlined text-[var(--color-outline)]">chevron_right</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--color-surface-variant)]/50">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Bahasa</p>
                <p className="text-sm text-[var(--color-outline)]">Bahasa Indonesia</p>
              </div>
              <span className="material-symbols-outlined text-[var(--color-outline)]">chevron_right</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Format Tanggal</p>
                <p className="text-sm text-[var(--color-outline)]">DD/MM/YYYY</p>
              </div>
              <span className="material-symbols-outlined text-[var(--color-outline)]">chevron_right</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Data Management & Security ─── */}
        <motion.div variants={fadeUp} className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[var(--color-primary)]">database</span>
            <h2 className="text-xl font-normal text-[var(--color-on-surface)] font-serif">Data & Keamanan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-container)] transition-colors text-left border border-transparent hover:border-[var(--color-surface-variant)]">
              <span className="material-symbols-outlined text-[var(--color-primary)]">download</span>
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Export Data</p>
                <p className="text-xs text-[var(--color-outline)]">Download data CSV/Excel</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-container)] transition-colors text-left border border-transparent hover:border-[var(--color-surface-variant)]">
              <span className="material-symbols-outlined text-[var(--color-primary)]">upload</span>
              <div>
                <p className="font-medium text-[var(--color-on-surface)]">Import Data</p>
                <p className="text-xs text-[var(--color-outline)]">Upload data dari CSV</p>
              </div>
            </button>
          </div>

          <div className="pt-6 border-t border-[var(--color-surface-variant)]/50">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 font-medium transition-colors w-full md:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Log Out dari Perangkat Ini
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
