'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const accounts = [
  {
    name: 'Bank BCA',
    type: 'Rekening Utama',
    balance: 3200000,
    icon: 'account_balance',
    color: 'primary',
    lastActivity: [
      { desc: 'Gaji Bulanan', amount: '+6.500.000', date: 'Kemarin' },
      { desc: 'Transfer ke E-Wallet', amount: '-500.000', date: '2 hari lalu' },
    ],
  },
  {
    name: 'Cash',
    type: 'Dompet',
    balance: 450000,
    icon: 'wallet',
    color: 'secondary',
    lastActivity: [
      { desc: 'Kopi Kenangan', amount: '-45.000', date: 'Hari ini' },
      { desc: 'Makan Siang', amount: '-35.000', date: 'Kemarin' },
    ],
  },
  {
    name: 'GoPay',
    type: 'E-Wallet',
    balance: 600000,
    icon: 'phone_android',
    color: 'tertiary',
    lastActivity: [
      { desc: 'Top Up dari BCA', amount: '+500.000', date: '2 hari lalu' },
      { desc: 'Grab Ride', amount: '-32.000', date: '3 hari lalu' },
    ],
  },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export default function AccountsPage() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">Multi-Akun</p>
          <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
            Akun Keuangan
          </h1>
        </div>
        <button className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-medium py-3 px-6 rounded-lg shadow-soft shimmer-btn flex items-center gap-2 w-fit hover:-translate-y-0.5 transition-all">
          <span className="material-symbols-outlined">add</span>
          Tambah Akun
        </button>
      </motion.div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--color-primary-container)]/10 dark:bg-[var(--color-primary-container)]/5 rounded-2xl p-8 border border-[var(--color-primary-container)]/30"
      >
        <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-2 block">Total Saldo Semua Akun</span>
        <h2 className="text-4xl font-medium font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(totalBalance)}</h2>
        <p className="text-sm text-[var(--color-outline)] mt-2">{accounts.length} akun terhubung</p>
      </motion.div>

      {/* Account Cards */}
      <motion.section className="grid grid-cols-1 md:grid-cols-3 gap-6" initial="hidden" animate="show" variants={stagger}>
        {accounts.map((account, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
          >
            {/* Account Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  account.color === 'primary' ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]' :
                  account.color === 'secondary' ? 'bg-[var(--color-secondary-container)]/20 text-[var(--color-secondary)]' :
                  'bg-[var(--color-tertiary-container)]/20 text-[var(--color-tertiary)]'
                }`}>
                  <span className="material-symbols-outlined">{account.icon}</span>
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-on-surface)]">{account.name}</h3>
                  <p className="text-xs text-[var(--color-outline)]">{account.type}</p>
                </div>
              </div>
              <button className="text-[var(--color-outline)] hover:text-[var(--color-on-surface)] p-1 rounded-full hover:bg-[var(--color-surface-container)] transition-colors">
                <span className="material-symbols-outlined text-xl">more_vert</span>
              </button>
            </div>

            {/* Balance */}
            <div className="mb-6">
              <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] block mb-1">Saldo</span>
              <h3 className="text-2xl font-medium font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(account.balance)}</h3>
            </div>

            {/* Recent Activity */}
            <div>
              <span className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-outline)] block mb-3">Aktivitas Terakhir</span>
              <div className="space-y-3">
                {account.lastActivity.map((activity, j) => (
                  <div key={j} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-[var(--color-on-surface)]">{activity.desc}</p>
                      <p className="text-xs text-[var(--color-outline)]">{activity.date}</p>
                    </div>
                    <span className={`font-mono text-sm ${
                      activity.amount.startsWith('+') ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'
                    }`}>
                      {activity.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
