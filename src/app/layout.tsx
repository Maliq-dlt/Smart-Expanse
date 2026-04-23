import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans, Space_Grotesk, Work_Sans } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ModalProvider } from "@/contexts/ModalContext";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif-heading",
  display: "swap",
  weight: ["400", "500", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono-number",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SmartExpense — Financial Wellness",
  description:
    "Kelola keuangan pribadi dengan cerdas tanpa ribet. SmartExpense membantu Anda melacak pengeluaran, mengatur anggaran, dan mencapai tujuan keuangan.",
  keywords: ["finance", "expense tracker", "budgeting", "financial wellness", "money management"],
};

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${notoSerif.variable} ${plusJakartaSans.variable} ${spaceGrotesk.variable} ${workSans.variable}`}
    >
      <head>
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* Prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('smartexpense-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <SmoothScrollProvider>
          <ThemeProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
