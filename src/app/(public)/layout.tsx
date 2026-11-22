"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Trophy, Calendar, Users, Newspaper, UserPlus, Info,
  MapPin, LogOut, LogIn, LayoutDashboard, Menu, X
} from 'lucide-react';
import { useLeague, HBTechLabsLogo } from '../../context/LeagueContext';

const Instagram = (props: any) => <span {...props}>IG</span>;
const Youtube = (props: any) => <span {...props}>YT</span>;
const Facebook = (props: any) => <span {...props}>FB</span>;
const Twitter = (props: any) => <span {...props}>X</span>;

const MAIN_SITEMAP_NAV = [
  { id: 'beranda', label: 'BERANDA', href: '/beranda', icon: Trophy },
  { id: 'kompetisi', label: 'KOMPETISI', href: '/kompetisi', icon: Calendar },
  { id: 'tim', label: 'TIM', href: '/tim', icon: Users },
  { id: 'media', label: 'MEDIA', href: '/media', icon: Newspaper },
  { id: 'pendaftaran', label: 'PENDAFTARAN', href: '/pendaftaran', icon: UserPlus },
  { id: 'tentang', label: 'TENTANG LIGA', href: '/tentang', icon: Info },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [waktuWIB, setWaktuWIB] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { currentUser, logout, incrementSponsorImpression } = useLeague();

  useEffect(() => {
    const updateWaktu = () => {
      const now = new Date();
      const tanggal = now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      });
      const jam = now
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        })
        .replace(/\./g, ":");

      setWaktuWIB(`${tanggal} ${jam} WIB`);
    };

    updateWaktu();
    const interval = setInterval(updateWaktu, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    incrementSponsorImpression();
    setMobileMenuOpen(false);
  }, [pathname]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D151B] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <header className="sticky top-0 z-50 shadow-2xl">
        <div className="bg-[#131F28] border-b border-slate-800/90">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
            {/* Logo Brand */}
            <Link
              href="/beranda"
              className="py-2.5 flex items-center gap-2.5 shrink-0 group text-left"
            >
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#14B866] to-[#0E8F4E] text-white font-black text-sm sm:text-base tracking-tight shadow-lg shadow-emerald-500/25 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>
                  FUTSAL<span className="text-slate-950 font-extrabold">PRO</span>
                </span>
              </div>
              <div className="hidden xl:block leading-tight">
                <div className="text-[11px] font-black tracking-wider text-white">NUSANTARA LEAGUE</div>
                <div className="text-[9px] font-bold text-emerald-400">SEASON 2026 • JAKARTA</div>
              </div>
            </Link>

            {/* Navigasi Desktop (Tersembunyi di HP) */}
            <div className="hidden md:flex items-center gap-3">
              <nav className="flex items-center">
                {MAIN_SITEMAP_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`relative px-3 lg:px-4 py-3 flex flex-col items-center justify-center gap-1 transition-all whitespace-nowrap group ${
                        isActive ? 'text-white bg-white/[0.03]' : 'text-slate-400 hover:text-emerald-400'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#14B866]' : ''}`} />
                      <span className="text-[10px] lg:text-[11px] font-extrabold tracking-wide">{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-t-full bg-[#14B866] shadow-[0_0_10px_#14B866]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-6 w-[1px] bg-slate-800 shrink-0" />

              {currentUser ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={currentUser.role === 'ADMIN' ? '/admin' : '/manager'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-[11px] transition-all shadow-md"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{currentUser.role === 'ADMIN' ? 'Admin' : 'Manajer'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      triggerToast('Anda telah keluar dari sesi portal.');
                    }}
                    title="Keluar"
                    className="inline-flex items-center justify-center p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs tracking-wide transition-all shadow-md shadow-emerald-500/20"
                >
                  <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Tombol Garis Tiga (Hamburger Menu - Khusus HP) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle Menu Navigasi"
                aria-expanded={mobileMenuOpen}
                className="p-2 rounded-xl bg-[#0D151B] border border-slate-700 hover:border-[#14B866] text-slate-200 hover:text-[#14B866] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Drawer Dropdown Menu HP */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#0F1921] border-t border-slate-800 px-3 pt-2.5 pb-4 space-y-2 shadow-2xl">
              <nav className="grid grid-cols-1 gap-1">
                {MAIN_SITEMAP_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-xs font-extrabold tracking-wide transition-all ${
                        isActive
                          ? 'bg-[#14B866]/15 text-[#14B866] border border-[#14B866]/40'
                          : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#14B866]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-slate-800/90">
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href={currentUser.role === 'ADMIN' ? '/admin' : '/manager'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs shadow-md"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Panel {currentUser.role === 'ADMIN' ? 'Admin' : 'Manajer'}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        triggerToast('Anda telah keluar dari sesi portal.');
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 font-bold text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs tracking-wide shadow-md shadow-emerald-500/20"
                  >
                    <LogIn className="w-4 h-4 stroke-[2.5]" />
                    <span>Login Portal Liga</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0A1015]/95 backdrop-blur-md border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14B866] animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-400">
                Live update at{" "}
                <strong className="text-emerald-400">
                  {waktuWIB || "..."}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {toastMessage && (
        <div className="fixed bottom-5 right-4 z-50 max-w-sm animate-bounce">
          <div className="bg-[#131F28] border border-[#14B866] text-white px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(20,184,102,0.3)] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14B866] animate-ping shrink-0" />
            <span className="text-xs font-bold leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-[#080E13] text-slate-400 pt-10 pb-8 px-4 border-t border-slate-800/90">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pb-8 border-b border-slate-800/80 text-xs">
          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">TENTANG LIGA</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang?sub=PROFIL" className="hover:text-[#14B866]">
                  Profil &amp; Regulasi
                </Link>
              </li>
              <li>
                <Link href="/tentang?sub=SPONSOR" className="hover:text-[#14B866]">
                  Sponsor &amp; Mitra
                </Link>
              </li>
              <li>
                <Link href="/tentang?sub=KONTAK" className="hover:text-[#14B866]">
                  Kontak Sekretariat
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-[#14B866]">
                  Pendaftaran Tim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">KOMPETISI</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/kompetisi?sub=JADWAL" className="hover:text-[#14B866]">
                  Jadwal &amp; Hasil
                </Link>
              </li>
              <li>
                <Link href="/kompetisi?sub=KLASEMEN" className="hover:text-[#14B866]">
                  Klasemen Otomatis
                </Link>
              </li>
              <li>
                <Link href="/kompetisi?sub=STATISTIK" className="hover:text-[#14B866]">
                  Pemain &amp; Statistik
                </Link>
              </li>
              <li>
                <Link href="/kompetisi?sub=TRANSFER" className="hover:text-[#14B866]">
                  Transfer Pemain
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">PORTAL &amp; RUTE</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-[#14B866]">
                  Halaman Login (/login)
                </Link>
              </li>
              <li>
                <Link href="/manager" className="hover:text-[#14B866]">
                  Portal Manajer Tim (/manager)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#14B866]">
                  Panel Admin Liga (/admin)
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-black text-white uppercase tracking-wider mb-3">TECHNOLOGY PARTNER</h4>
            <div className="p-3 rounded-xl bg-[#111A22] border border-slate-800 text-white inline-block">
              <HBTechLabsLogo className="h-7" />
            </div>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">LOKASI VENUE</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#14B866]" /> GOR Cendrawasih Jakarta
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#14B866]" /> GOR Soemantri Kuningan
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">IKUTI KAMI</h4>
            <div className="flex items-center gap-2">
              {[Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-lg bg-[#131F28] border border-slate-700 hover:border-[#14B866] hover:text-[#14B866] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Copyright © 2026 Nusantara Futsal Pro League. All rights reserved.</span>
          <span>
            Powered by <strong className="text-[#14B866]">H&amp;B TechLabs</strong> • Official Technology Partner
          </span>
        </div>
      </footer>
    </div>
  );
}