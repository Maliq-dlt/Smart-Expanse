<div align
="center">
  <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80" alt="SmartExpense Cover" width="100%" style="border-radius: 12px; margin-bottom: 20px;" />

  <h1>💎 SmartExpense</h1>
  
  <p><strong>Aplikasi Manajemen Keuangan Modern dengan UI/UX Premium (Awwwards Level)</strong></p>

  <p>
    <a href="https://smartexpense-eta.vercel.app" target="_blank">View Live Demo</a>
    ·
    <a href="https://github.com/Maliq-dlt/Smart-Expanse/issues">Report Bug</a>
    ·
    <a href="https://github.com/Maliq-dlt/Smart-Expanse/issues">Request Feature</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
    <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  </p>
</div>

<br />

> 💡 **SmartExpense** bukan sekadar aplikasi pencatatan keuangan biasa. Dibangun menggunakan teknologi web terkini, aplikasi ini mengutamakan estetika visual yang organik, animasi yang mulus (*smooth scrolling* & *micro-interactions*), dan performa kilat.

## ✨ Fitur Utama

- **🎨 UI/UX Premium & Estetik:** Tema *OLED Dark Mode*, efek *Glassmorphism*, dan komponen antarmuka berkualitas tinggi.
- **🚀 Smooth Animations:** Terintegrasi dengan **Lenis** untuk *smooth scrolling*, **Framer Motion** untuk transisi halaman & komponen, dan **GSAP** untuk efek paralaks pada *Landing Page*.
- **📊 Interactive Dashboard:** *Chart* finansial interaktif yang langsung menampilkan data keuangan dengan indah.
- **⌘ Command Menu Pintar (Cmd + K):** Fitur navigasi cepat ala macOS untuk melakukan pencarian transaksi atau navigasi halaman dengan seketika.
- **💾 Local Persistence & Database:** 
  - Dukungan **Zustand** untuk *state management* agar aplikasi bisa berfungsi super cepat (*Offline First Support*).
  - Integrasi backend terstruktur dengan **Drizzle ORM** dan **Neon PostgreSQL** untuk penyimpanan yang persisten dan aman di *cloud*.
- **🔒 Secure Authentication:** Halaman pendaftaran dan masuk (Login & Signup) yang dinamis dengan validasi *client-side*.

## 📸 Tampilan Aplikasi

| Landing Page (Hero) | Fitur Dashboard |
| :---: | :---: |
| <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" alt="Landing Page" style="border-radius: 8px;" /> | <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Dashboard" style="border-radius: 8px;" /> |

*(Ganti gambar di atas dengan screenshot asli dari proyek Anda dengan cara mengedit URL gambar di dalam `README.md`)*

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
| --- | --- | --- |
| **Framework** | Next.js 14 (App Router) | *React framework* yang sangat cepat dan mendukung *Server Components*. |
| **Styling** | Tailwind CSS | *Utility-first CSS framework* untuk desain yang responsif dan kustom. |
| **Animasi** | Framer Motion & GSAP | Animasi kompleks, interaksi, transisi halaman, dan *scroll trigger*. |
| **State Management**| Zustand | Ringan, cepat, dan terintegrasi dengan Local Storage. |
| **Database & ORM** | Neon (PostgreSQL) + Drizzle | Skema database yang aman dari segi tipe (Type-safe) dan sangat cepat. |
| **Icons & UI** | Lucide React & Recharts | Ikon minimalis dan pustaka grafik data (Chart) yang interaktif. |

## 🚀 Memulai Pengembangan (Quick Start)

Ikuti langkah-langkah di bawah ini untuk menjalankan SmartExpense di mesin lokal Anda:

### 1. Kloning Repositori
```bash
git clone https://github.com/Maliq-dlt/Smart-Expanse.git
cd Smart-Expanse
```

### 2. Instalasi Dependensi
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Konfigurasi Environment (Database)
Buat file `.env.local` di root proyek dan tambahkan kunci Database URL Anda (Contoh untuk Neon DB):
```env
DATABASE_URL="postgresql://username:password@ep-your-db.region.aws.neon.tech/smartexpense?sslmode=require"
```

### 4. Menjalankan Drizzle Migrations
```bash
npm run db:push
# atau
npm run db:migrate
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## 📂 Struktur Direktori Utama

```text
📦 Smart-Expanse
 ┣ 📂 drizzle           # Konfigurasi dan histori migrasi skema Database
 ┣ 📂 public            # Aset gambar statis, SVG, dan font
 ┣ 📂 src
 ┃ ┣ 📂 actions         # Server Actions (Next.js) untuk memanipulasi database
 ┃ ┣ 📂 app             # Routing Next.js (Dashboard, Login, Landing Page)
 ┃ ┣ 📂 components      # Komponen UI (Landing, Layout, Modal, UI Umum)
 ┃ ┣ 📂 contexts        # React Context (ThemeContext, ModalContext)
 ┃ ┣ 📂 db              # Koneksi Drizzle dan definisi skema
 ┃ ┗ 📂 store           # Global State (Zustand untuk Auth dan Finance)
 ┗ 📜 package.json      # Konfigurasi dependensi project
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda punya ide atau perbaikan untuk UI/UX atau logika, silakan lakukan langkah berikut:
1. *Fork* proyek ini
2. Buat *Branch* fitur Anda (`git checkout -b feature/FiturKeren`)
3. *Commit* perubahan Anda (`git commit -m 'Menambahkan fitur keren'`)
4. *Push* ke Branch tersebut (`git push origin feature/FiturKeren`)
5. Buka *Pull Request*

## 📜 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---
<p align="center">
  Dibuat dengan ❤️ oleh <a href="https://github.com/Maliq-dlt">Maliq</a>
</p>
