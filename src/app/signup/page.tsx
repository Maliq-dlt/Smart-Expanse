'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { syncUser } from '@/actions/finance';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create user in database
      const dbUser = await syncUser(email, name);
      
      signup(email, dbUser.name, dbUser.id);
      router.push('/home');
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1 text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Kembali
      </Link>

      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[var(--color-primary-container)] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[var(--color-secondary-container)] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="bg-[var(--color-surface-lowest)] rounded-3xl p-8 sm:p-10 shadow-soft border border-[var(--color-surface-variant)]/50 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-container)] text-[var(--color-primary)] flex items-center justify-center transform group-hover:-rotate-12 transition-all">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
              <span className="text-xl font-bold font-serif text-[var(--color-on-surface)] tracking-tight">SmartExpense</span>
            </Link>
            <h1 className="text-3xl font-serif text-[var(--color-on-surface)] mb-2">Buat Akun Baru</h1>
            <p className="text-sm text-[var(--color-outline)]">Mulai atur keuangan Anda hari ini.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-lowest)] outline-none transition-all placeholder:text-[var(--color-outline)]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-lowest)] outline-none transition-all placeholder:text-[var(--color-outline)]"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-lowest)] outline-none transition-all placeholder:text-[var(--color-outline)]"
                placeholder="Minimal 8 karakter"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium py-3 px-6 rounded-xl shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--color-on-primary)] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--color-outline)]">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
