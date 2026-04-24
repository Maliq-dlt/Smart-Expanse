'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore, Goal } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const goalIconOptions = [
  { id: 'shield', label: 'Dana Darurat' },
  { id: 'flight', label: 'Liburan' },
  { id: 'laptop_mac', label: 'Gadget' },
  { id: 'home', label: 'Rumah' },
  { id: 'school', label: 'Pendidikan' },
  { id: 'directions_car', label: 'Kendaraan' },
  { id: 'diamond', label: 'Investasi' },
  { id: 'celebration', label: 'Acara' },
];

const colorOptions: { id: Goal['color']; label: string; bg: string }[] = [
  { id: 'primary', label: 'Hijau', bg: 'bg-[var(--color-primary-container)]' },
  { id: 'tertiary', label: 'Pink', bg: 'bg-[var(--color-tertiary-container)]' },
  { id: 'secondary', label: 'Kuning', bg: 'bg-[var(--color-secondary-container)]' },
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export default function GoalsPage() {
  const { goals, addGoal, addFundsToGoal, deleteGoal } = useFinanceStore();
  const userId = useAuthStore((s) => s.user?.userId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [fundModalGoalId, setFundModalGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');

  // Add goal form
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('shield');
  const [formTarget, setFormTarget] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formColor, setFormColor] = useState<Goal['color']>('primary');

  const resetForm = () => {
    setFormName('');
    setFormIcon('shield');
    setFormTarget('');
    setFormDeadline('');
    setFormColor('primary');
  };

  const handleAddGoal = () => {
    const target = parseInt(formTarget.replace(/\D/g, ''), 10);
    if (!formName || !target || !formDeadline || !userId) return;

    addGoal({
      name: formName,
      icon: formIcon,
      target,
      current: 0,
      deadline: formDeadline,
      color: formColor,
    }, userId);
    setShowAddModal(false);
    resetForm();
  };

  const handleAddFunds = () => {
    const amount = parseInt(fundAmount.replace(/\D/g, ''), 10);
    if (!fundModalGoalId || !amount) return;
    addFundsToGoal(fundModalGoalId, amount);
    setFundModalGoalId(null);
    setFundAmount('');
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setFormTarget(raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw, 10)) : '');
  };

  const handleFundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setFundAmount(raw ? new Intl.NumberFormat('id-ID').format(parseInt(raw, 10)) : '');
  };

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
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-medium py-3 px-6 rounded-lg shadow-soft shimmer-btn flex items-center gap-2 w-fit hover:-translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Tujuan
        </button>
      </motion.div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--color-surface-lowest)] rounded-xl p-12 shadow-soft border border-[var(--color-surface-variant)]/50 text-center"
        >
          <span className="material-symbols-outlined text-5xl text-[var(--color-outline)] mb-4 block">flag</span>
          <p className="text-[var(--color-outline)] mb-4">Belum ada tujuan tabungan.</p>
          <button onClick={() => setShowAddModal(true)} className="text-[var(--color-primary)] font-medium hover:underline">
            + Tambah Tujuan Pertama
          </button>
        </motion.div>
      ) : (
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          {goals.map((goal, i) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const remaining = goal.target - goal.current;
            const isComplete = goal.current >= goal.target;

            return (
              <motion.div
                key={goal.id}
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
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors p-1 rounded-full hover:bg-[var(--color-surface-container)]"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>

                {/* Progress Circle + Info */}
                <div className="flex items-center gap-6">
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
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - Math.min(percentage, 100) / 100) }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono text-[var(--color-on-surface)]">
                      {isComplete ? '✓' : `${percentage}%`}
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
                      <span className="font-mono text-[var(--color-tertiary)]">Rp {formatRupiah(Math.max(0, remaining))}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                {isComplete ? (
                  <div className="mt-6 w-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Target Tercapai! 🎉
                  </div>
                ) : (
                  <button
                    onClick={() => { setFundModalGoalId(goal.id); setFundAmount(''); }}
                    className="mt-6 w-full bg-[var(--color-surface-low)] text-[var(--color-primary)] font-medium py-2.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Tambah Dana
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.section>
      )}

      {/* ─── Add Goal Modal ─── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); resetForm(); }}
            />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[var(--color-surface-lowest)] rounded-2xl w-full max-w-md p-8 shadow-2xl border border-[var(--color-surface-variant)] pointer-events-auto max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-serif text-[var(--color-on-surface)] mb-6">Tambah Tujuan Baru</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Nama Tujuan</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-all"
                      placeholder="Misal: Liburan Bali" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Ikon</label>
                    <div className="grid grid-cols-4 gap-2">
                      {goalIconOptions.map((icon) => (
                        <button key={icon.id} type="button" onClick={() => setFormIcon(icon.id)}
                          className={`flex flex-col items-center p-2 rounded-xl text-xs gap-1 transition-all ${
                            formIcon === icon.id
                              ? 'bg-[var(--color-primary-container)]/20 border border-[var(--color-primary-container)] text-[var(--color-primary)]'
                              : 'bg-[var(--color-surface-low)] text-[var(--color-outline)] hover:bg-[var(--color-surface-variant)]'
                          }`}>
                          <span className="material-symbols-outlined text-lg">{icon.id}</span>
                          <span>{icon.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Warna</label>
                    <div className="flex gap-3">
                      {colorOptions.map((c) => (
                        <button key={c.id} type="button" onClick={() => setFormColor(c.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                            formColor === c.id
                              ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-surface-low)]'
                              : 'bg-[var(--color-surface-low)] hover:bg-[var(--color-surface-variant)]'
                          }`}>
                          <div className={`w-4 h-4 rounded-full ${c.bg}`} />
                          <span className="text-[var(--color-on-surface)]">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Target (Rp)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-lg font-mono text-[var(--color-outline)]">Rp</span>
                      <input type="text" value={formTarget} onChange={handleTargetChange}
                        className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] pl-12 pr-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-all text-right font-mono text-lg"
                        placeholder="0" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-[0.05em] uppercase text-[var(--color-on-surface-variant)] mb-2">Target Waktu</label>
                    <input type="text" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] px-4 py-3 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-all"
                      placeholder="Misal: Des 2025" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setShowAddModal(false); resetForm(); }}
                      className="flex-1 py-3 rounded-xl bg-[var(--color-surface-low)] text-[var(--color-on-surface)] font-medium hover:bg-[var(--color-surface-container)] transition-colors">
                      Batal
                    </button>
                    <button onClick={handleAddGoal}
                      className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all">
                      Tambah
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Add Funds Modal ─── */}
      <AnimatePresence>
        {fundModalGoalId && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFundModalGoalId(null)}
            />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[var(--color-surface-lowest)] rounded-2xl w-full max-w-sm p-8 shadow-2xl border border-[var(--color-surface-variant)] pointer-events-auto"
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-serif text-[var(--color-on-surface)] mb-2">Tambah Dana</h2>
                <p className="text-sm text-[var(--color-outline)] mb-6">
                  {goals.find(g => g.id === fundModalGoalId)?.name}
                </p>

                <div className="relative flex items-center mb-6">
                  <span className="absolute left-4 text-xl font-mono text-[var(--color-outline)]">Rp</span>
                  <input type="text" value={fundAmount} onChange={handleFundChange}
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] pl-14 pr-4 py-4 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-all text-right font-mono text-2xl"
                    placeholder="0" autoFocus />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setFundModalGoalId(null)}
                    className="flex-1 py-3 rounded-xl bg-[var(--color-surface-low)] text-[var(--color-on-surface)] font-medium hover:bg-[var(--color-surface-container)] transition-colors">
                    Batal
                  </button>
                  <button onClick={handleAddFunds}
                    className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">savings</span>
                    Tabung
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
