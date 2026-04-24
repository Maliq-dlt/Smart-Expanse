'use client';

import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, Variants, useInView, animate } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import Lenis from 'lenis';

// --- Shared Animations ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const heroStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 2.0 }, // Wait for preloader
  },
};

// --- Mock Data for Marquee (Elegan) ---
const marqueeItems = [
  { icon: 'local_cafe', label: 'Ngopi', amount: '- Rp 35.000', type: 'expense' },
  { icon: 'payments', label: 'Gaji Bulanan', amount: '+ Rp 8.500.000', type: 'income' },
  { icon: 'shopping_bag', label: 'Belanja', amount: '- Rp 1.200.000', type: 'expense' },
  { icon: 'movie', label: 'Nonton Bioskop', amount: '- Rp 150.000', type: 'expense' },
  { icon: 'home', label: 'Cicilan Rumah', amount: '- Rp 3.000.000', type: 'expense' },
  { icon: 'flight', label: 'Tiket Liburan', amount: '- Rp 2.500.000', type: 'expense' },
  { icon: 'restaurant', label: 'Makan Malam', amount: '- Rp 120.000', type: 'expense' },
];

// --- Helper Components ---
function MagneticButton({ children, className, ...props }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`w-max ${className || ''}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function CountUpNumber({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(val) {
        if (ref.current) {
          const formatted = prefix === "Rp " ? 
             Math.floor(val).toLocaleString('id-ID') : 
             Number.isInteger(value) ? Math.floor(val).toString() : val.toFixed(1);
          ref.current.textContent = `${prefix}${formatted}${suffix}`;
        }
      }
    });
    return () => controls.stop();
  }, [value, isInView, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function SpotlightCard({ children, className = "", ...props }: any) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-[var(--color-surface-variant)]/50 ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`, // Using a subtle emerald glow
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 50%"]
  });

  const words = text.split(" ");
  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-4xl mx-auto px-6 py-32">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        // We use React.createElement to avoid issues with hook inside map if any, but mapping over array is fine if array length is constant.
        // Even better, just call useTransform directly since words length is static.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        return (
          <motion.span key={i} style={{ opacity }} className="text-4xl md:text-6xl font-serif text-[var(--color-on-background)] text-center leading-tight">
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

function ScaleRevealComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["48px", "0px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="py-24 px-4 md:px-8 bg-[var(--color-background)] overflow-hidden">
      <motion.div 
        style={{ scale, borderRadius, opacity }}
        className="w-full aspect-video md:aspect-[21/9] bg-[var(--color-surface-lowest)] border border-[var(--color-surface-variant)]/50 shadow-2xl relative overflow-hidden mx-auto max-w-[1400px] flex items-center justify-center group"
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-surface-variant)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-surface-variant)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/10 via-transparent to-[var(--color-tertiary)]/10" />
        
        {/* Floating mini-UI elements */}
        <motion.div
          className="absolute top-8 left-8 bg-[var(--color-surface-low)] backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-surface-variant)]/50 shadow-lg hidden md:flex items-center gap-3"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-sm">trending_up</span>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-outline)] uppercase tracking-wider">Pemasukan</div>
            <div className="text-sm font-mono font-bold text-emerald-500">+12.5%</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-8 bg-[var(--color-surface-low)] backdrop-blur-md px-4 py-2 rounded-xl border border-[var(--color-surface-variant)]/50 shadow-lg hidden md:flex items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-container)]/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">savings</span>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-outline)] uppercase tracking-wider">Tabungan</div>
            <div className="text-sm font-mono font-bold text-[var(--color-primary)]">Rp 24.5M</div>
          </div>
        </motion.div>

        <div className="text-center z-10 p-8 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-6xl font-serif text-[var(--color-on-background)] mb-6 tracking-tight">Ketenangan Pikiran.</h2>
            <p className="text-[var(--color-on-surface-variant)] text-xl">Dibungkus dalam desain yang mulus, sistem kami bekerja tanpa lelah menjaga arus kas Anda tetap sehat.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function HorizontalTestimonials() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  const testimonials = [
    { text: "SmartExpense merubah cara saya melihat uang. UI-nya sangat memanjakan mata.", author: "Budi S.", role: "Freelancer" },
    { text: "Satu-satunya aplikasi keuangan yang membuat saya rutin mencatat setiap hari.", author: "Siti M.", role: "Mahasiswa" },
    { text: "Desainnya sekelas aplikasi internasional. Bangga ada karya sekeren ini.", author: "Reza A.", role: "Desainer UI/UX" },
    { text: "Tidak ada lagi pusing akhir bulan. Semua terlihat jelas dalam satu dashboard.", author: "Diana P.", role: "Ibu Rumah Tangga" },
    { text: "Transisinya sangat smooth. Menggunakan aplikasi ini rasanya seperti bermain game.", author: "Kevin W.", role: "Software Engineer" },
  ];

  return (
    <section ref={targetRef} className="relative h-[250vh] bg-[var(--color-surface-lowest)]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute top-24 md:top-32 left-6 md:left-[10%] z-10 pointer-events-none md:w-1/3">
          <h2 className="text-4xl md:text-6xl font-serif text-[var(--color-on-surface)] drop-shadow-2xl">Apa Kata Mereka.</h2>
          <p className="text-[var(--color-outline)] mt-4 text-lg">Kisah sukses dari pengguna setia kami.</p>
        </div>
        <motion.div style={{ x }} className="flex gap-6 md:gap-8 pl-[10vw] md:pl-[45vw] pr-[5vw] mt-24 md:mt-0">
          {testimonials.map((t, i) => (
            <div key={i} className="w-[350px] md:w-[450px] h-[300px] shrink-0 bg-[var(--color-surface-low)] border border-[var(--color-surface-variant)] p-8 rounded-3xl flex flex-col justify-between shadow-2xl hover:-translate-y-2 transition-transform duration-500">
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
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  // --- Hero Parallax State ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-500, 500], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-5, 5]), springConfig);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to center of screen
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- Feature Tabs State ---
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Lacak Tanpa Ribet", subtitle: "Semua transaksi tercatat rapi.", icon: "receipt_long" },
    { title: "Anggaran Disiplin", subtitle: "Peringatan sebelum kantong jebol.", icon: "account_balance_wallet" },
    { title: "Wujudkan Mimpi", subtitle: "Visualisasi tabungan masa depan.", icon: "flight_takeoff" }
  ];

  // --- Theme Preview & FAQ State ---
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Apakah data finansial saya aman?", a: "Ya, kami tidak menyimpan kredensial bank Anda. Semua data diamankan dengan enkripsi standar industri." },
    { q: "Apakah aplikasi ini gratis?", a: "Fitur dasar pencatatan selamanya gratis. Kami tidak akan pernah mengunci data Anda." },
    { q: "Apakah bisa disambungkan ke rekening bank?", a: "Saat ini SmartExpense fokus pada pencatatan manual untuk memberikan Anda kontrol dan kesadaran penuh atas setiap sen yang keluar." }
  ];

  // --- Preloader State ---
  const [isLoading, setIsLoading] = useState(true);

  // --- Lenis Smooth Scroll ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // --- Scroll Progress ---
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const scaleX = useSpring(pageScrollProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // --- Preloader timer ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* --- PAGE PRELOADER --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-white/90 tracking-tight">SmartExpense.</h1>
              <motion.div 
                className="mt-8 mx-auto h-[2px] bg-white/20 w-48 rounded-full overflow-hidden"
              >
                <motion.div 
                  className="h-full bg-white/80 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SCROLL PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-primary)] z-[60] origin-left"
        style={{ scaleX }}
      />

    <div className="bg-[var(--color-background)] text-[var(--color-on-background)] min-h-screen overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/30">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href={isMounted && isAuthenticated ? "/home" : "/"} className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)] font-serif italic">
            SmartExpense.
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#bento" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Visualisasi</a>
            <a href="#tabs" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">Cara Kerja</a>
          </div>
          <div className="flex space-x-4 items-center">
            <Link
              href="/login"
              className="group relative px-6 py-2 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-semibold text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 1. HERO PARALLAX SECTION --- */}
      <section className="relative pt-18 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex items-center">
        {/* Background Decorative Blobs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[var(--color-primary-container)]/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[var(--color-tertiary-container)]/10 rounded-full blur-3xl -z-10" />

        {/* Floating 3D Geometric Shapes */}
        <motion.div
          className="absolute top-[15%] left-[8%] w-16 h-16 border-2 border-[var(--color-primary-container)]/30 rounded-xl -z-[5] hidden lg:block"
          animate={{ rotate: 360, y: [0, -20, 0] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          style={{ rotateX, rotateY }}
        />
        <motion.div
          className="absolute top-[30%] right-[12%] w-10 h-10 border-2 border-[var(--color-tertiary-container)]/40 rounded-full -z-[5] hidden lg:block"
          animate={{ scale: [1, 1.3, 1], y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[15%] w-6 h-6 bg-[var(--color-primary-container)]/20 rounded-md -z-[5] hidden lg:block"
          animate={{ rotate: -360, x: [0, 10, 0] }}
          transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, x: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.div
          className="absolute top-[60%] right-[5%] w-3 h-3 bg-[var(--color-tertiary)]/30 rounded-full -z-[5] hidden lg:block"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[10%] right-[35%] w-20 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary-container)]/30 to-transparent -z-[5] hidden lg:block"
          animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: Text Content */}
          <motion.div className="space-y-8 z-10" initial="hidden" animate="show" variants={heroStagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-low)] border border-[var(--color-surface-variant)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-outline)]">Versi 2.0 Telah Hadir</span>
            </motion.div>
            
            <motion.h1 variants={heroStagger} initial="hidden" animate="show" className="text-[64px] lg:text-[80px] leading-[1.05] text-[var(--color-on-background)] font-serif tracking-tight flex flex-col">
              <div className="overflow-hidden">
                <motion.span variants={fadeUp} className="inline-block">Uangmu</motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span variants={fadeUp} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] italic pr-4">
                  Kemana?
                </motion.span>
              </div>
            </motion.h1>
            
            <motion.p variants={heroStagger} initial="hidden" animate="show" className="text-xl text-[var(--color-on-surface-variant)] max-w-md leading-relaxed flex flex-wrap">
              {"Lupakan pencatatan manual yang membosankan. Mulai kelola keuangan dengan antarmuka yang indah, cepat, dan interaktif.".split(' ').map((word, i) => (
                <span key={i} className="overflow-hidden inline-block mr-1.5 mb-1">
                  <motion.span variants={fadeUp} className="inline-block">{word}</motion.span>
                </span>
              ))}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4">
              <MagneticButton>
                <Link href={isMounted && isAuthenticated ? "/home" : "/signup"} className="group shimmer-btn bg-[var(--color-on-surface)] text-[var(--color-surface)] px-8 py-4 rounded-full font-medium transition-all flex items-center gap-2 hover:shadow-xl hover:shadow-[var(--color-on-surface)]/20">
                  Mulai Sekarang
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right: Parallax Interactive Mockup */}
          <motion.div 
            className="relative lg:h-[600px] flex items-center justify-center perspective-[1200px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full max-w-md bg-[var(--color-surface-lowest)] rounded-3xl p-6 shadow-2xl border border-[var(--color-surface-variant)]/50 relative"
            >
              {/* Glass Header */}
              <div className="flex justify-between items-center mb-8 border-b border-[var(--color-surface-variant)]/50 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="w-24 h-4 bg-[var(--color-surface-variant)] rounded-full" />
              </div>

              {/* Floating Element 1 (Balance) */}
              <motion.div 
                style={{ translateZ: 50 }}
                className="bg-[var(--color-primary-container)]/10 p-6 rounded-2xl mb-6 shadow-lg border border-[var(--color-primary-container)]/20 backdrop-blur-md"
              >
                <div className="w-16 h-4 bg-[var(--color-primary)]/40 rounded-full mb-3" />
                <div className="w-48 h-8 bg-[var(--color-primary)]/80 rounded-lg mb-4" />
                <div className="w-full h-2 bg-[var(--color-primary-container)]/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--color-primary)]" 
                    initial={{ width: 0 }} 
                    animate={{ width: '68%' }} 
                    transition={{ duration: 1.5, delay: 0.5 }} 
                  />
                </div>
              </motion.div>

              {/* Floating Element 2 (Chart) */}
              <motion.div 
                style={{ translateZ: 30 }}
                className="flex items-end gap-3 h-32 mb-6 px-2"
              >
                {[40, 70, 45, 90, 65, 80].map((height, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 bg-[var(--color-tertiary-container)]/40 rounded-t-lg relative group"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                  >
                    <div className="absolute -top-2 left-0 w-full h-full bg-[var(--color-tertiary)]/80 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Floating Element 3 (Floating Card) */}
              <motion.div 
                style={{ translateZ: 80 }}
                className="absolute -right-12 bottom-12 bg-[var(--color-surface-lowest)] p-4 rounded-2xl shadow-xl border border-[var(--color-surface-variant)] flex items-center gap-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <div className="w-20 h-3 bg-[var(--color-surface-variant)] rounded-full mb-2" />
                  <div className="text-sm font-mono font-bold text-emerald-600">+ Rp 6.5M</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. ELEGANT MARQUEE TICKER --- */}
      <section className="py-6 border-y border-[var(--color-surface-variant)]/40 overflow-hidden flex whitespace-nowrap bg-[var(--color-background)]">
        <motion.div
          className="flex gap-4 px-2 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {/* Double array for seamless loop */}
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-[var(--color-surface-lowest)]/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[var(--color-outline-variant)]/30 cursor-default hover:border-[var(--color-outline-variant)]/60 transition-colors">
              <span className={`material-symbols-outlined text-sm ${item.type === 'income' ? 'text-emerald-500' : 'text-[var(--color-outline)]'}`}>{item.icon}</span>
              <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">{item.label}</span>
              <span className={`text-sm font-mono ${item.type === 'income' ? 'text-emerald-500 font-semibold' : 'text-[var(--color-on-surface)]'}`}>{item.amount}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* --- STATS COUNTER BAR --- */}
      <section className="py-20 px-6 bg-[var(--color-surface-lowest)] border-y border-[var(--color-surface-variant)]/30">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {[
            { value: 12000, suffix: "+", label: "Pengguna Aktif", icon: "group" },
            { value: 500, suffix: "K+", label: "Transaksi Tercatat", icon: "receipt_long" },
            { value: 99, suffix: "%", label: "Uptime Server", icon: "cloud_done" },
            { value: 4.9, suffix: "/5", label: "Rating Pengguna", icon: "star" },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--color-primary-container)]/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[var(--color-primary)]">{stat.icon}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-on-surface)] mb-1">
                <CountUpNumber value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-sm text-[var(--color-outline)]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- AWWWARDS: SCROLL REVEAL TEXT --- */}
      <section className="bg-[var(--color-background)] border-b border-[var(--color-surface-variant)]/30">
        <ScrollRevealText text="Kebebasan finansial dimulai dari satu langkah kecil. Lacak, kelola, dan raih impian Anda." />
      </section>

      {/* --- 3. VISUAL BENTO BOX --- */}
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

      {/* --- AWWWARDS: SCALE REVEAL SECTION --- */}
      <ScaleRevealComponent />

      {/* --- 4. INTERACTIVE FEATURE TABS --- */}
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

      {/* --- TRUSTED BY SECTION --- */}
      <section className="py-16 border-y border-[var(--color-surface-variant)]/30 bg-[var(--color-surface-lowest)] overflow-hidden">
        <p className="text-center text-sm font-semibold tracking-wider text-[var(--color-outline)] uppercase mb-8">Dipercaya oleh pengguna dan diliput oleh</p>
        <div className="flex gap-16 md:gap-32 px-6 items-center justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold font-serif tracking-tight">TechInAsia</div>
          <div className="text-2xl font-bold font-serif tracking-tight">DailySocial</div>
          <div className="text-2xl font-bold font-serif tracking-tight">Kompas</div>
          <div className="text-2xl font-bold font-serif tracking-tight hidden md:block">Forbes</div>
        </div>
      </section>

      {/* --- HORIZONTAL SCROLL TESTIMONIALS --- */}
      <HorizontalTestimonials />

      {/* --- 4.5. THEME & FAQ SECTION --- */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        
        {/* Interactive Theme Preview */}
        <div className="mb-40">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-on-background)] mb-4 tracking-tight">Terang atau Gelap.</h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg">Dirancang untuk beradaptasi dengan kenyamanan mata Anda.</p>
          </motion.div>

          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-surface-variant)] cursor-pointer group" onClick={() => setPreviewTheme(prev => prev === 'dark' ? 'light' : 'dark')}>
            {/* Dark Mode Mockup (Base) */}
            <div className="absolute inset-0 bg-[#121212] p-8 flex flex-col items-center justify-center transition-all">
              <div className="w-full max-w-sm space-y-4">
                <div className="w-full h-12 bg-[#1e1e1e] rounded-xl border border-white/5" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-[#1e1e1e] rounded-xl border border-white/5" />
                  <div className="h-24 bg-[#1e1e1e] rounded-xl border border-white/5" />
                </div>
              </div>
            </div>

            {/* Light Mode Mockup (Overlay with clip-path transition) */}
            <motion.div 
              className="absolute inset-0 bg-[#ffffff] p-8 flex flex-col items-center justify-center"
              initial={false}
              animate={{ clipPath: previewTheme === 'light' ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full max-w-sm space-y-4">
                <div className="w-full h-12 bg-[#f4f4f5] rounded-xl border border-black/5 shadow-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-[#f4f4f5] rounded-xl border border-black/5 shadow-sm" />
                  <div className="h-24 bg-[#f4f4f5] rounded-xl border border-black/5 shadow-sm" />
                </div>
              </div>
            </motion.div>

            {/* Floating Toggle Button */}
            <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-white/90 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-sm">{previewTheme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              <span className="text-xs font-medium">Ubah Tema</span>
            </div>
          </div>
        </div>

        {/* Minimalist FAQ Accordion */}
        <div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12">
            <h2 className="text-3xl font-serif text-[var(--color-on-background)] mb-2">Pertanyaan Umum</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm">Masih ragu? Kami punya jawabannya.</p>
          </motion.div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="border-b border-[var(--color-surface-variant)]/50"
              >
                <button 
                  onClick={() => setFaqOpenIndex(faqOpenIndex === index ? null : index)}
                  className="w-full py-6 flex justify-between items-center text-left group"
                >
                  <span className="text-lg font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{faq.q}</span>
                  <motion.span 
                    className="material-symbols-outlined text-[var(--color-outline)]"
                    animate={{ rotate: faqOpenIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    expand_more
                  </motion.span>
                </button>
                <AnimatePresence>
                  {faqOpenIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[var(--color-on-surface-variant)] leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. FINAL CTA --- */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-primary-container)]/20 -z-10" />
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        >
          <h2 className="text-[48px] md:text-[64px] font-serif text-[var(--color-on-background)] mb-6 leading-tight">
            Kendalikan Uangmu. <br/><span className="italic">Sekarang Juga.</span>
          </h2>
          <p className="text-xl text-[var(--color-on-surface-variant)] mb-10">
            Bergabung dengan antarmuka yang dirancang untuk kedamaian finansial Anda.
          </p>
          <div className="flex justify-center">
            <MagneticButton>
              <Link
                href={isMounted && isAuthenticated ? "/home" : "/login"}
                className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-[var(--color-on-surface)] text-[var(--color-surface)] text-lg font-semibold hover:scale-105 transition-transform shadow-2xl shadow-[var(--color-on-surface)]/20"
              >
                {isMounted && isAuthenticated ? "Masuk ke Dashboard" : "Mulai Gratis"}
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* --- 6. PREMIUM MEGAFOOTER --- */}
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
    </div>
    </>
  );
}
