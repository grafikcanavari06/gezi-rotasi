// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "rotaankara",
  description: "Ankara için kişiye özel gezi rotası",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 antialiased">
        {/* Üst bar */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/swipe" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center text-sm font-bold">
                rA
              </span>
              <div>
                <div className="text-sm font-semibold leading-none">rotaankara</div>
                <div className="text-[10px] text-slate-400 leading-none mt-1">
                  Ankara gezi asistanı
                </div>
              </div>
            </a>
            <nav className="flex items-center gap-3 text-sm">
              <a
                href="/swipe"
                className="px-3 py-1 rounded-lg hover:bg-slate-800 transition"
              >
                Swipe
              </a>
              <a
                href="/profile"
                className="px-3 py-1 rounded-lg hover:bg-slate-800 transition"
              >
                Profil
              </a>
              <a
                href="/admin/places"
                className="hidden sm:inline px-3 py-1 rounded-lg bg-slate-100 text-slate-950 text-xs font-semibold hover:bg-white transition"
              >
                Admin
              </a>
            </nav>
          </div>
        </header>

        {/* İçerik alanı */}
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
