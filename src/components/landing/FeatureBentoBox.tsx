'use client';

import React from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpotlightCard from '@/components/ui/SpotlightCard';
import CountUpNumber from '@/components/ui/CountUpNumber';

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function FeatureBentoBox() {
  // GSAP Parallax for Bento Box
  useGSAP(() => {
    gsap.utils.toArray('[data-speed]').forEach((el: any) => {
      const speed = parseFloat(el.getAttribute('data-speed') || '1');
      gsap.to(el, {
        y: () => -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });
  }, []);

  return (
    <section id="bento" className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div className="text-center mb-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
        <h2 className="text-4xl font-serif text-[var(--color-on-surface)] mb-4">Visual. Bukan Teks Panjang.</h2>
        <p className="text-[var(--color-on-surface-variant)]">Lihat kesehatan finansial Anda dalam sekilas.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        
        {/* Bento 1: Donut Chart with Category Labels */}
        <SpotlightCard 
          className="md:col-span-2 bg-[var(--color-surface-lowest)] p-8 shadow-soft group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-medium text-[var(--color-on-surface)] absolute z-10">Analisis Kategori</h3>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-64 h-64 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-primary-container)" strokeWidth="20" strokeDasharray="180 251.2" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-tertiary-container)" strokeWidth="20" strokeDasharray="50 251.2" strokeDashoffset="-190" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-secondary-container)" strokeWidth="20" strokeDasharray="15 251.2" strokeDashoffset="-245" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-[var(--color-outline)] uppercase tracking-wider font-semibold">Total</span>
                <span className="text-2xl font-mono font-bold text-[var(--color-on-surface)] block mb-3"><CountUpNumber value={6500000} prefix="Rp " /></span>
              </div>
              <div className="absolute -right-6 top-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary-container)]" />
                <span className="text-xs font-medium text-[var(--color-on-surface)] whitespace-nowrap">Makan 45%</span>
              </div>
              <div className="absolute -left-8 bottom-12 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 -translate-x-2 group-hover:translate-x-0">
                <div className="w-3 h-3 rounded-full bg-[var(--color-tertiary-container)]" />
                <span className="text-xs font-medium text-[var(--color-on-surface)] whitespace-nowrap">Transport 20%</span>
              </div>
              <div className="absolute -right-2 bottom-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 translate-x-2 group-hover:translate-x-0">
                <div className="w-3 h-3 rounded-full bg-[var(--color-secondary-container)]" />
                <span className="text-xs font-medium text-[var(--color-on-surface)] whitespace-nowrap">Hiburan 6%</span>
              </div>
            </motion.div>
          </div>
        </SpotlightCard>

        {/* Bento 2: Budget Alert - single slot animation */}
        <SpotlightCard 
          className="bg-[var(--color-surface-lowest)] p-8 shadow-soft flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-medium text-[var(--color-on-surface)] mb-6">Peringatan Pintar</h3>
          <div className="flex-1 flex items-center">
            <div className="w-full relative h-24 overflow-hidden">
              <motion.div
                className="absolute inset-x-0"
                animate={{ y: [0, 0, -96, -96] }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.45, 0.5, 1], ease: "easeInOut" }}
              >
                {/* Alert 1 */}
                <div className="h-24 flex items-center">
                  <div className="w-full bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
                    <div className="flex gap-3 items-start">
                      <span className="material-symbols-outlined text-rose-500 text-lg">warning</span>
                      <div>
                        <div className="text-sm font-bold text-rose-400">Anggaran Menipis!</div>
                        <div className="text-xs text-rose-300/70 mt-0.5">Sisa budget &quot;Hiburan&quot; Rp 50.000</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Alert 2 */}
                <div className="h-24 flex items-center">
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                    <div className="flex gap-3 items-start">
                      <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                      <div>
                        <div className="text-sm font-bold text-emerald-400">Target Tercapai! 🎉</div>
                        <div className="text-xs text-emerald-300/70 mt-0.5">Tabungan &quot;Liburan&quot; sudah 100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </SpotlightCard>

        {/* Bento 3: Riwayat Otomatis - text on left col, list on right 2 cols */}
        <SpotlightCard 
          className="bg-[var(--color-surface-lowest)] p-8 shadow-soft flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-medium text-[var(--color-on-surface)] mb-4">Riwayat Otomatis</h3>
          <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
            Tap, simpan, dan biarkan kami mengatur sisanya. Daftar transaksi yang selalu rapi.
          </p>
        </SpotlightCard>

        <SpotlightCard 
          className="md:col-span-2 bg-[var(--color-surface-lowest)] p-6 shadow-soft"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full h-full flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 w-full h-10 bg-gradient-to-b from-[var(--color-surface-lowest)] to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-[var(--color-surface-lowest)] to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              className="flex flex-col gap-3"
              animate={{ y: [0, -380] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {[
                { icon: 'restaurant', name: 'Ngopi Pagi', cat: 'Makan', amount: '- Rp 35.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
                { icon: 'directions_car', name: 'Grab ke Kantor', cat: 'Transport', amount: '- Rp 28.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
                { icon: 'payments', name: 'Gaji Bulanan', cat: 'Pemasukan', amount: '+ Rp 8.500.000', color: 'text-emerald-500', iconColor: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { icon: 'shopping_bag', name: 'Belanja Mingguan', cat: 'Belanja', amount: '- Rp 450.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
                { icon: 'movie', name: 'Nonton Film', cat: 'Hiburan', amount: '- Rp 150.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
                { icon: 'bolt', name: 'Listrik', cat: 'Tagihan', amount: '- Rp 320.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
                { icon: 'restaurant', name: 'Ngopi Pagi', cat: 'Makan', amount: '- Rp 35.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
                { icon: 'directions_car', name: 'Grab ke Kantor', cat: 'Transport', amount: '- Rp 28.000', color: 'text-[var(--color-on-surface)]', iconColor: 'text-[var(--color-outline)]', bg: 'bg-[var(--color-surface-container)]' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between bg-[var(--color-surface-low)] p-4 rounded-2xl border border-[var(--color-surface-variant)]/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${tx.bg} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${tx.iconColor} text-lg`}>{tx.icon}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[var(--color-on-surface)] block">{tx.name}</span>
                      <span className="text-[11px] text-[var(--color-outline)]">{tx.cat}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-bold ${tx.color}`}>{tx.amount}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}
