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

const goals = [
  { name: 'Dana Darurat', target: 30000000, current: 20400000, icon: 'shield', deadline: 'Des 2024', color: 'primary' },
  { name: 'Liburan Jepang', target: 25000000, current: 15000000, icon: 'flight', deadline: 'Mar 2025', color: 'tertiary' },
  { name: 'MacBook Pro', target: 35000000, current: 8750000, icon: 'laptop_mac', deadline: 'Jun 2025', color: 'secondary' },
  { name: 'Uang Muka Rumah', target: 100000000, current: 42000000, icon: 'home', deadline: 'Des 2026', color: 'primary' },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export default function GoalsPage() {
  return (
    <div className="p-6 md:p-10 xl:p-16 flex flex-col gap-10 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-primary)] mb-1">Target Keuangan</p>
          <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif">
            Tujuan Tabungan
          </h1>
        </div>
        <button className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-medium py-3 px-6 rounded-lg shadow-soft shimmer-btn flex items-center gap-2 w-fit hover:-translate-y-0.5 transition-all">
          <span className="material-symbols-outlined">add</span>
          Tambah Tujuan
        </button>
      </motion.div>

      {/* Goals Grid */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        {goals.map((goal, i) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          const remaining = goal.target - goal.current;

          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-[var(--color-surface-lowest)] rounded-xl p-6 shadow-soft border border-[var(--color-surface-variant)]/50 hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    goal.color === 'primary' ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]' :
                    goal.color === 'tertiary' ? 'bg-[var(--color-tertiary-container)]/20 text-[var(--color-tertiary)]' :
                    'bg-[var(--color-secondary-container)]/20 text-[var(--color-secondary)]'
                  }`}>
                    <span className="material-symbols-outlined">{goal.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--color-on-surface)]">{goal.name}</h3>
                    <p className="text-xs text-[var(--color-outline)]">Target: {goal.deadline}</p>
                  </div>
                </div>
                <button className="text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors p-1 rounded-full hover:bg-[var(--color-surface-container)]">
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>
              </div>

              {/* Progress Circle + Info */}
              <div className="flex items-center gap-6">
                {/* Circular Progress */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="42"
                      fill="transparent"
                      stroke="var(--color-surface-container)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      fill="transparent"
                      stroke={
                        goal.color === 'primary' ? 'var(--color-primary-container)' :
                        goal.color === 'tertiary' ? 'var(--color-tertiary-container)' :
                        'var(--color-secondary-container)'
                      }
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono text-[var(--color-on-surface)]">
                    {percentage}%
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--color-outline)]">Terkumpul</span>
                    <span className="font-mono font-medium text-[var(--color-primary)]">Rp {formatRupiah(goal.current)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--color-outline)]">Target</span>
                    <span className="font-mono text-[var(--color-on-surface)]">Rp {formatRupiah(goal.target)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-outline)]">Kurang</span>
                    <span className="font-mono text-[var(--color-tertiary)]">Rp {formatRupiah(remaining)}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button className="mt-6 w-full bg-[var(--color-surface-low)] text-[var(--color-primary)] font-medium py-2.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Tambah Dana
              </button>
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}
