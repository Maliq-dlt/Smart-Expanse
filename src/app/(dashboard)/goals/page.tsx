'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { useFinanceStore, Goal } from '@/store/useFinanceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatRupiah } from '@/utils/format';
import confetti from 'canvas-confetti';
import ProgressRing from '@/components/ui/ProgressRing';

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

export default function GoalsPage() {
  const { goals, addGoal, addFundsToGoal, deleteGoal, isPrivacyMode } = useFinanceStore();
  const userId = useAuthStore((s) => s.user?.userId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [fundModalGoalId, setFundModalGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');

  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showAddModal || !scrollWrapperRef.current || !scrollContentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, [showAddModal]);

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

    const goal = goals.find(g => g.id === fundModalGoalId);
    if (goal && (goal.current + amount) >= goal.target) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#ec4899', '#3b82f6']
      });
    }

    setFundModalGoalId(null);
    setFundAmount('');
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw) {
      const numValue = parseInt(raw, 10);
      if (numValue <= 9999999999) {
        setFormTarget(new Intl.NumberFormat('id-ID').format(numValue));
      }
    } else {
      setFormTarget('');
    }
  };

  const handleFundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw) {
      const numValue = parseInt(raw, 10);
      if (numValue <= 9999999999) {
        setFundAmount(new Intl.NumberFormat('id-ID').format(numValue));
      }
    } else {
      setFundAmount('');
    }
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
          <h1 className="text-[48px] leading-[1.2] tracking-[-0.02em] font-normal text-[var(--color-on-surface)] font-serif flex overflow-hidden flex-wrap">
            {"Tujuan Tabungan".split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="mr-3"
              >
                {word}
              </motion.span>
            ))}
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
                      <span className="font-mono font-medium text-[var(--color-primary)]">{formatRupiah(goal.current, isPrivacyMode)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--color-outline)]">Target</span>
                      <span className="font-mono text-[var(--color-on-surface)]">{formatRupiah(goal.target, isPrivacyMode)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-outline)]">Kurang</span>
                      <span className="font-mono text-[var(--color-tertiary)]">{formatRupiah(Math.max(0, remaining), isPrivacyMode)}</span>
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
                ref={scrollWrapperRef}
                data-lenis-prevent="true"
                className="bg-[var(--color-surface-lowest)] rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-[var(--color-surface-variant)]/40 pointer-events-auto max-h-[90vh] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div ref={scrollContentRef}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif text-[var(--color-on-surface)]">Tambah Tujuan</h2>
                  <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1 rounded-full hover:bg-[var(--color-surface-container)]">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors pb-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-1">Nama Tujuan</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-[var(--color-on-surface)] placeholder:text-[var(--color-surface-variant)]"
                      placeholder="Misal: Liburan Bali" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-3">Ikon</label>
                    <div className="grid grid-cols-4 gap-2">
                      {goalIconOptions.map((icon) => (
                        <button key={icon.id} type="button" onClick={() => setFormIcon(icon.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all gap-1 ${
                            formIcon === icon.id
                              ? 'bg-[var(--color-primary-container)]/20 border border-[var(--color-primary-container)] text-[var(--color-primary)] shadow-sm'
                              : 'bg-[var(--color-surface-low)] border border-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'
                          }`}>
                          <span className="material-symbols-outlined text-xl" style={formIcon === icon.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon.id}</span>
                          <span className="text-[10px] font-medium">{icon.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-3">Warna</label>
                    <div className="flex gap-3">
                      {colorOptions.map((c) => (
                        <button key={c.id} type="button" onClick={() => setFormColor(c.id)}
                          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            formColor === c.id
                              ? 'ring-2 ring-offset-2 ring-offset-[var(--color-surface-lowest)] ring-[var(--color-on-surface)] shadow-md'
                              : 'hover:scale-110'
                          } ${c.bg}`}>
                          {formColor === c.id && <span className="material-symbols-outlined text-white text-sm">check</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors pb-2 pt-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-1">Target (Rp)</label>
                    <div className="relative flex items-center">
                      <span className={`absolute left-0 font-mono text-[var(--color-on-surface-variant)] transition-all ${formTarget.length > 11 ? 'text-lg' : 'text-xl'}`}>Rp</span>
                      <input type="text" value={formTarget} onChange={handleTargetChange}
                        className={`w-full bg-transparent text-[var(--color-on-surface)] pl-10 pr-0 py-2 border-none focus:ring-0 outline-none transition-all text-left font-mono placeholder:text-[var(--color-surface-variant)] ${formTarget.length > 11 ? 'text-xl' : 'text-2xl'}`}
                        placeholder="0" />
                    </div>
                  </div>

                  <div className="border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors pb-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-1">Target Waktu</label>
                    <input type="text" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-[var(--color-on-surface)] placeholder:text-[var(--color-surface-variant)]"
                      placeholder="Misal: Des 2025" />
                  </div>

                  <div className="pt-6">
                    <button onClick={handleAddGoal}
                      className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold shadow-soft flex justify-center items-center gap-2 hover:-translate-y-0.5 hover:shadow-hover transition-all">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      Simpan Tujuan
                    </button>
                  </div>
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
                data-lenis-prevent="true"
                className="bg-[var(--color-surface-lowest)] rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-[var(--color-surface-variant)]/40 pointer-events-auto"
                initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-serif text-[var(--color-on-surface)]">Tambah Dana</h2>
                    <p className="text-sm text-[var(--color-primary)] font-medium mt-1">
                      {goals.find(g => g.id === fundModalGoalId)?.name}
                    </p>
                  </div>
                  <button onClick={() => setFundModalGoalId(null)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1 rounded-full hover:bg-[var(--color-surface-container)]">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center py-6 mb-4 border-b border-[var(--color-surface-variant)]/50 focus-within:border-[var(--color-primary)] transition-colors">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-outline)] mb-3">Nominal Tabungan</label>
                  <div className="flex items-center justify-center gap-2 w-full">
                    <span className={`font-light text-[var(--color-outline)] transition-all ${fundAmount.length > 11 ? 'text-xl' : fundAmount.length > 7 ? 'text-2xl' : 'text-3xl'}`}>Rp</span>
                    <input type="text" value={fundAmount} onChange={handleFundChange}
                      className={`bg-transparent font-light text-[var(--color-on-surface)] text-center outline-none w-full max-w-[280px] placeholder:text-[var(--color-surface-variant)] transition-all ${fundAmount.length > 11 ? 'text-3xl' : fundAmount.length > 7 ? 'text-4xl' : 'text-5xl'}`}
                      placeholder="0" autoFocus />
                  </div>
                </div>

                <button onClick={handleAddFunds}
                  className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold shadow-soft flex justify-center items-center gap-2 hover:-translate-y-0.5 hover:shadow-hover transition-all">
                  <span className="material-symbols-outlined text-xl">savings</span>
                  Tabung Sekarang
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
