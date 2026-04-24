'use client';

import React from 'react';

export default function MegaFooter() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400 mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </div>
            <h3 className="text-3xl font-serif mb-6 text-white/90">Siap mengubah cara Anda <br/>mengelola kekayaan?</h3>
            <p className="text-white/50 max-w-sm mb-8">
              SmartExpense adalah standar baru dalam manajemen finansial personal. Cepat, indah, dan dirancang untuk Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:pl-20">
            <div>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">Produk</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Keamanan</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Harga</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-6">Perusahaan</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Karir</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Kontak</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privasi</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-t border-white/10 pt-16 relative">
          <h1 className="text-[12vw] font-serif italic font-bold tracking-tighter text-white/5 select-none leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            SmartExpense.
          </h1>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-white/40 text-sm">
              © 2024 Financial Wellness Inc.
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
