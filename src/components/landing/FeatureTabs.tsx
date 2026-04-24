'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUpNumber from '@/components/ui/CountUpNumber';

const tabs = [
  { title: "Lacak Tanpa Ribet", subtitle: "Semua transaksi tercatat rapi.", icon: "receipt_long" },
  { title: "Anggaran Disiplin", subtitle: "Peringatan sebelum kantong jebol.", icon: "account_balance_wallet" },
  { title: "Wujudkan Mimpi", subtitle: "Visualisasi tabungan masa depan.", icon: "flight_takeoff" }
];

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="tabs" className="py-24 px-6 bg-[var(--color-surface-lowest)] border-y border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-[var(--color-on-surface)] mb-4">Satu Aplikasi. Tiga Pilar.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Tab Buttons */}
          <div className="lg:col-span-5 space-y-4">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                      : 'border-transparent hover:bg-[var(--color-surface-low)]'
                  }`}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'
                    }`}>
                      <span className="material-symbols-outlined">{tab.icon}</span>
                    </div>
                    <div>
                      <h3 className={`text-xl font-medium mb-1 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>
                        {tab.title}
                      </h3>
                      <p className={`text-sm ${isActive ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-outline)]'}`}>
                        {tab.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Visualizer Display */}
          <div className="lg:col-span-7 h-[400px] md:h-[500px] bg-[var(--color-surface-low)] rounded-[40px] p-2 border border-[var(--color-surface-variant)] shadow-inner relative overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="w-full max-w-md bg-[var(--color-surface-lowest)] rounded-3xl p-6 shadow-2xl border border-[var(--color-surface-variant)]"
              >
                
                {/* Content varies based on active tab */}
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6 border-b border-[var(--color-surface-variant)] pb-4">
                      <span className="font-serif font-bold text-xl">Transaksi Baru</span>
                      <motion.span 
                        className="material-symbols-outlined text-emerald-500"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >check_circle</motion.span>
                    </div>
                    <div className="w-full h-16 bg-[var(--color-surface-low)] rounded-xl flex items-center px-4 justify-between">
                      <span className="text-[var(--color-outline)] text-2xl font-mono">Rp</span>
                      <span className="text-3xl font-mono text-[var(--color-on-surface)]">150.000</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-4">
                      {[
                        { icon: 'restaurant', label: 'Makan' },
                        { icon: 'directions_car', label: 'Transport' },
                        { icon: 'shopping_bag', label: 'Belanja' },
                        { icon: 'movie', label: 'Hiburan' },
                      ].map((cat, i) => (
                        <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 cursor-default transition-colors ${i === 0 ? 'bg-[var(--color-primary-container)]/30 border border-[var(--color-primary)]/30' : 'bg-[var(--color-surface-container)]'}`}>
                          <span className={`material-symbols-outlined text-lg ${i === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-outline)]'}`}>{cat.icon}</span>
                          <span className={`text-[10px] font-medium ${i === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-outline)]'}`}>{cat.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="w-full h-12 bg-[var(--color-primary-container)] rounded-xl mt-6 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--color-on-primary-container)]">Simpan Transaksi</span>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-serif font-bold text-xl">Anggaran</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-[var(--color-on-surface)]">Belanja Harian</span>
                        <span className="text-emerald-600 font-mono">40%</span>
                      </div>
                      <div className="w-full h-3 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '40%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-[var(--color-on-surface)]">Transportasi</span>
                        <span className="text-rose-600 font-mono">92%</span>
                      </div>
                      <div className="w-full h-3 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-rose-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-[var(--color-on-surface)]">Hiburan</span>
                        <span className="text-amber-600 font-mono">65%</span>
                      </div>
                      <div className="w-full h-3 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-amber-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="flex flex-col items-center py-8">
                    <div className="relative w-48 h-48 mb-6">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="45" fill="transparent" stroke="var(--color-surface-container)" strokeWidth="6" />
                        <motion.circle 
                          cx="50" cy="50" r="45" fill="transparent" stroke="var(--color-primary)" strokeWidth="6" 
                          strokeDasharray="282.6" strokeLinecap="round"
                          initial={{ strokeDashoffset: 282.6 }}
                          animate={{ strokeDashoffset: 56.5 }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-[var(--color-primary)] mb-1">flight</span>
                        <span className="font-bold text-xl font-mono text-[var(--color-on-surface)]">80%</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-medium">Liburan Jepang</h3>
                    <p className="text-sm text-[var(--color-outline)]">Terkumpul: <CountUpNumber value={16000000} prefix="Rp " /></p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
