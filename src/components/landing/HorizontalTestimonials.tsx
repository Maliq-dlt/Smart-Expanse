'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    // Calculate scroll amount based on the track's total width minus the visible container's width
    const getScrollAmount = () => track.scrollWidth - container.offsetWidth;

    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      animation: tween,
      scrub: 1, // Smooth scrubbing
      invalidateOnRefresh: true, // Recalculate on resize
    });
  }, { scope: sectionRef });

  const testimonials = [
    { text: "SmartExpense merubah cara saya melihat uang. UI-nya sangat memanjakan mata.", author: "Budi S.", role: "Freelancer" },
    { text: "Satu-satunya aplikasi keuangan yang membuat saya rutin mencatat setiap hari.", author: "Siti M.", role: "Mahasiswa" },
    { text: "Desainnya sekelas aplikasi internasional. Bangga ada karya sekeren ini.", author: "Reza A.", role: "Desainer UI/UX" },
    { text: "Tidak ada lagi pusing akhir bulan. Semua terlihat jelas dalam satu dashboard.", author: "Diana P.", role: "Ibu Rumah Tangga" },
    { text: "Transisinya sangat smooth. Menggunakan aplikasi ini rasanya seperti bermain game.", author: "Kevin W.", role: "Software Engineer" },
  ];

  return (
    <section ref={sectionRef} className="h-screen bg-[var(--color-surface-lowest)] border-y border-[var(--color-surface-variant)]/30 flex flex-col md:flex-row items-center overflow-hidden">
      
      {/* Title Section (Static Left Side) */}
      <div className="w-full md:w-[35%] px-6 md:pl-[10%] shrink-0 z-20 py-12 md:py-0 relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-on-surface)] leading-tight drop-shadow-lg">Apa Kata Mereka.</h2>
        <p className="text-[var(--color-outline)] mt-4 text-lg">Kisah sukses dari pengguna setia kami.</p>
      </div>

      {/* Scrolling Track (Right Side) */}
      <div ref={containerRef} className="w-full md:w-[65%] h-full flex items-center overflow-hidden relative">
        {/* Gradient Mask to fade cards before they hit the text */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-surface-lowest)] to-transparent z-10 hidden md:block" />
        
        <div 
          ref={trackRef}
          className="flex gap-6 md:gap-8 w-max px-6 md:px-0 md:pl-[50vw] md:pr-[10vw]"
        >
          {testimonials.map((t, i) => (
            <div key={i} className="w-[350px] md:w-[450px] h-[300px] shrink-0 bg-[var(--color-surface-low)] border border-[var(--color-surface-variant)] p-8 rounded-3xl flex flex-col justify-between shadow-xl hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-[var(--color-primary-container)] text-5xl mb-4 opacity-50">format_quote</span>
              <p className="text-xl md:text-2xl font-serif text-[var(--color-on-surface)] leading-snug">"{t.text}"</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-tertiary)] flex items-center justify-center text-white font-bold text-lg shadow-inner">{t.author.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-[var(--color-on-surface)]">{t.author}</div>
                  <div className="text-xs text-[var(--color-outline)] uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
