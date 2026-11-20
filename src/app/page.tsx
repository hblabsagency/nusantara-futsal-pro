// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy, Calendar, Users, Shield, Award,
  CheckCircle2, Clock, MapPin, Play, Lock,
  Filter, ChevronRight, X, UserPlus,
  FileCheck, Newspaper, PhoneCall, Mail, Flame,
  ArrowLeftRight, LogOut, LogIn, Info,
  ShieldAlert, Radio, Image as ImageIcon,
  BookOpen, Handshake, Smartphone, LayoutDashboard
} from 'lucide-react';
import { useLeague, HBTechLabsLogo } from '../context/LeagueContext';

const Instagram = (props: any) => <span {...props}>IG</span>;
const Youtube = (props: any) => <span {...props}>YT</span>;
const Facebook = (props: any) => <span {...props}>FB</span>;
const Twitter = (props: any) => <span {...props}>X</span>;

export default function PublicHomePage() {
  const {
    teams,
    players,
    matches,
    transfers,
    transferWindowOpen,
    news,
    gallery,
    lineups,
    sponsorStats,
    standings,
    currentUser,
    logout,
    getPlayerLockStatus,
    submitTeamRegistration,
    incrementSponsorImpression,
    incrementSponsorClick,
  } = useLeague();

  // Navigasi Sitemap Publik
  const [publicMenu, setPublicMenu] = useState('BERANDA'); // 'BERANDA' | 'KOMPETISI' | 'TIM' | 'MEDIA' | 'PENDAFTARAN' | 'TENTANG'
  const [kompetisiSub, setKompetisiSub] = useState('JADWAL'); // 'JADWAL' | 'KLASEMEN' | 'STATISTIK' | 'TRANSFER'
  const [mediaSub, setMediaSub] = useState('BERITA'); // 'BERITA' | 'GALERI'
  const [tentangSub, setTentangSub] = useState('PROFIL'); // 'PROFIL' | 'SPONSOR' | 'KONTAK'

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Filter Publik & Modal
  const [weekFilter, setWeekFilter] = useState('SEMUA');
  const [venueFilter, setVenueFilter] = useState('SEMUA');
  const [galleryFilter, setGalleryFilter] = useState('SEMUA');
  const [selectedMatchModal, setSelectedMatchModal] = useState(null);
  const [selectedPlayerModal, setSelectedPlayerModal] = useState(null);
  const [selectedGalleryModal, setSelectedGalleryModal] = useState(null);
  const [selectedTeamDetail, setSelectedTeamDetail] = useState('t1');

  // Form Pendaftaran Tim Baru
  const [regForm, setRegForm] = useState({ teamName: '', category: 'Putra Umum', manager: '', phone: '' });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    incrementSponsorImpression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicMenu, kompetisiSub, mediaSub, tentangSub]);

  // Sinkronkan modal pertandingan jika ada update live dari /admin
  const activeModalMatch = selectedMatchModal
    ? matches.find((m) => m.id === selectedMatchModal.id) || selectedMatchModal
    : null;

  // Helper Navigasi Cepat Sitemap
  const goToKompetisi = (sub) => {
    setPublicMenu('KOMPETISI');
    setKompetisiSub(sub);
  };
  const goToMedia = (sub) => {
    setPublicMenu('MEDIA');
    setMediaSub(sub);
  };
  const goToTentang = (sub) => {
    setPublicMenu('TENTANG');
    setTentangSub(sub);
  };

  const heroMatch = matches.find((m) => m.id === 'm5') || matches[0];

  // Spotlight Players untuk 4 Lingkaran Emerald
  const topScorerPlayer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const topAssistPlayer = [...players].sort((a, b) => b.assists - a.assists)[0];
  const mvpLeaderPlayer = [...players].sort((a, b) => b.mvp - a.mvp)[0];
  const bestKeeperPlayer =
    [...players].filter((p) => p.position === 'GK').sort((a, b) => b.cleanSheets - a.cleanSheets)[0] || players[0];

  const MAIN_SITEMAP_NAV = [
    { id: 'BERANDA', label: 'BERANDA', icon: Trophy },
    { id: 'KOMPETISI', label: 'KOMPETISI', icon: Calendar },
    { id: 'TIM', label: 'TIM', icon: Users },
    { id: 'MEDIA', label: 'MEDIA', icon: Newspaper },
    { id: 'PENDAFTARAN', label: 'PENDAFTARAN', icon: UserPlus },
    { id: 'TENTANG', label: 'TENTANG LIGA', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D151B] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* ====================================================================
          1. TOP HEADER 2-BARIS (SITEMAP PUBLIK + AKSES PORTAL LOGIN/ADMIN/MANAGER)
         ==================================================================== */}
      <header className="sticky top-0 z-50 shadow-2xl">
        {/* BARIS 1: LOGO LIGA + 6 MENU UTAMA SITEMAP */}
        <div className="bg-[#131F28] border-b border-slate-800/90">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
            <button
              onClick={() => setPublicMenu('BERANDA')}
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
            </button>

            <nav className="flex items-center overflow-x-auto no-scrollbar">
              {MAIN_SITEMAP_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = publicMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPublicMenu(item.id)}
                    className={`relative px-3.5 sm:px-5 py-3 flex flex-col items-center justify-center gap-1 transition-all whitespace-nowrap group ${
                      isActive ? 'text-white bg-white/[0.03]' : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#14B866]' : ''}`} />
                    <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide">{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-t-full bg-[#14B866] shadow-[0_0_10px_#14B866]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* BARIS 2: SUB-BAR REALTIME & TOMBOL LOGIN / DASHBOARD ROLE */}
        <div className="bg-[#0A1015]/95 backdrop-blur-md border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14B866] animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-400">
                Sinkronisasi Real-Time dari <strong className="text-emerald-400">Meja GOR &amp; Portal Manajer</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] font-bold text-slate-200">
                    <Shield className="w-3.5 h-3.5 text-[#14B866]" />
                    {currentUser.title}
                  </span>
                  <Link
                    href={currentUser.role === 'ADMIN' ? '/admin' : '/manager'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-[11px] transition-all shadow-md"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{currentUser.role === 'ADMIN' ? 'Panel Admin' : 'Portal Manajer'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      triggerToast('Anda telah keluar dari sesi portal.');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 font-bold text-[11px]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-[11px] transition-all shadow-md shadow-emerald-500/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login Admin / Manajer Tim</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-4 z-50 max-w-sm animate-bounce">
          <div className="bg-[#131F28] border border-[#14B866] text-white px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(20,184,102,0.3)] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14B866] animate-ping shrink-0" />
            <span className="text-xs font-bold leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ====================================================================
          KONTEN HALAMAN PUBLIK
         ==================================================================== */}
      <div className="flex-1">
        {/* ================================================================
            1. MENU UTAMA: BERANDA
           ================================================================ */}
        {publicMenu === 'BERANDA' && (
          <div>
            {/* SECTION A: HERO STADIUM & "SUPER DERBY" MATCHUP CARD */}
            <section className="relative overflow-hidden bg-[#0A1116] border-b border-emerald-500/30 pt-8 pb-12">
              <img
                src="/bg-futsal-kosong.jpg"
                alt="GOR Futsal Indoor"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1518605368461-1ee7e543666d?auto=format&fit=crop&w=1800&q=85';
                }}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-35 pointer-events-none"
              />
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(20,184,102,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,184,102,0.18) 1px, transparent 1px)',
                  backgroundSize: '44px 44px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D151B]/65 via-[#0D151B]/45 to-[#0D151B]/95 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,102,0.38),transparent_65%)] pointer-events-none" />

              <div className="max-w-6xl mx-auto px-3 sm:px-6 relative z-10">
                <div className="text-center mb-5 sm:mb-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 mb-2">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>LIVE MATCHDAY • PEKAN KE-5 GRUP A</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
                    <span className="text-[#14B866] drop-shadow-[0_0_20px_rgba(20,184,102,0.45)]">SUPER</span>
                    <span className="text-white">DERBY</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-slate-300 mt-2">
                    PEMBARUAN SKOR <span className="text-[#14B866]">REAL-TIME</span> &amp; STATISTIK <span className="text-[#14B866]">RESMI LIGA</span>
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6">
                  {/* Foto Aksi Pemain Kiri */}
                  <div className="hidden md:block flex-1 max-w-[230px]">
                    <div className="relative h-64 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl group">
                      <img
                        src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=700&q=80"
                        alt="Aksi Pemain FC Kembangan United"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-transparent to-emerald-950/30" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="px-2 py-0.5 rounded bg-[#14B866] text-slate-950 font-black text-[10px]">
                          #10 BAYU PERMANA
                        </span>
                        <div className="text-xs font-extrabold text-white mt-1">FC Kembangan United</div>
                      </div>
                    </div>
                  </div>

                  {/* MATCHUP CARD TENGAH (SINKRON DENGAN /admin) */}
                  {(() => {
                    const hTeam = teams.find((t) => t.id === heroMatch.homeTeamId);
                    const aTeam = teams.find((t) => t.id === heroMatch.awayTeamId);
                    return (
                      <div className="w-full max-w-md shrink-0">
                        <div className="flex items-center justify-center gap-1.5 mb-1.5">
                          <span className="px-3 py-1 rounded bg-[#0A1116]/90 border border-slate-700 text-[11px] font-bold text-slate-200">
                            {heroMatch.date}
                          </span>
                          <span className="px-3 py-1 rounded bg-[#0A1116]/90 border border-emerald-500/40 text-[11px] font-bold text-[#14B866]">
                            {heroMatch.time}
                          </span>
                        </div>

                        <div className="relative bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.75)] border-2 border-emerald-400/80 px-4 py-5 sm:px-6">
                          <div className="grid grid-cols-3 items-center text-center gap-2">
                            <div className="flex flex-col items-center">
                              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${hTeam?.logoBg} text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white mb-2`}>
                                {hTeam?.shortName}
                              </div>
                              <span className="font-black text-xs sm:text-sm uppercase tracking-tight leading-tight text-slate-900">
                                {hTeam?.name}
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black tracking-wider uppercase animate-pulse mb-1">
                                {heroMatch.status}
                              </span>
                              <div className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-950">
                                {heroMatch.homeScore} <span className="text-slate-400 text-xl">VS</span> {heroMatch.awayScore}
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 mt-1">
                                {heroMatch.period}
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${aTeam?.logoBg} text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white mb-2`}>
                                {aTeam?.shortName}
                              </div>
                              <span className="font-black text-xs sm:text-sm uppercase tracking-tight leading-tight text-slate-900">
                                {aTeam?.name}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-200 text-center text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#14B866]" />
                            <span>{heroMatch.venue}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-2.5 px-2">
                          <button
                            onClick={() => setSelectedMatchModal(heroMatch)}
                            className="py-2 px-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
                          >
                            LINE-UP
                          </button>
                          <button
                            onClick={() => goToKompetisi('KLASEMEN')}
                            className="py-2 px-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
                          >
                            KLASEMEN
                          </button>
                          <Link
                            href={currentUser?.role === 'ADMIN' ? '/admin' : '/login'}
                            className="py-2 px-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 text-center"
                          >
                            INPUT SKOR
                          </Link>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Foto Aksi Pemain Kanan */}
                  <div className="hidden md:block flex-1 max-w-[230px]">
                    <div className="relative h-64 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
                      <img
                        src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=700&q=80"
                        alt="Aksi Pemain Garuda Futsal Club"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-transparent to-amber-950/30" />
                      <div className="absolute bottom-3 left-3 right-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                          #9 HENDRA WIJAYA
                        </span>
                        <div className="text-xs font-extrabold text-white mt-1">Garuda Futsal Club</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION B: 3 KARTU STATISTIK LIGA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
                  {[
                    { big: `${teams.length} KLUB`, title: 'KLUB PESERTA AKTIF', sub: 'TERVERIFIKASI e-ID', action: () => setPublicMenu('TIM') },
                    { big: `${matches.length} LAGA`, title: 'JADWAL PERTANDINGAN', sub: 'SISTEM LIGA & GUGUR', action: () => goToKompetisi('JADWAL') },
                    { big: 'Rp 75 Jt', title: 'TOTAL HADIAH', sub: 'TROFI & PENGHARGAAN', action: () => goToKompetisi('STATISTIK') },
                  ].map((card, i) => (
                    <div
                      key={i}
                      onClick={card.action}
                      className="cursor-pointer group relative overflow-hidden rounded-xl bg-[#0B1218]/90 border border-slate-700/80 hover:border-[#14B866] p-4 sm:p-5 text-center transition-all shadow-lg"
                    >
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#14B866] to-transparent opacity-60 group-hover:opacity-100" />
                      <div className="text-2xl sm:text-4xl font-black text-[#14B866] tracking-tight group-hover:scale-105 transition-transform">
                        {card.big}
                      </div>
                      <div className="text-xs sm:text-sm font-black text-white mt-1.5 tracking-wide">
                        {card.title}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {card.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SECTION C: BANNER STRIP BURSA TRANSFER */}
                <div
                  onClick={() => goToKompetisi('TRANSFER')}
                  className="mt-4 cursor-pointer group rounded-xl bg-gradient-to-r from-[#0A1117] via-[#13222D] to-[#0A1117] border border-slate-700/90 hover:border-[#14B866]/70 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <span className="hidden sm:inline-flex w-9 h-9 rounded-lg bg-[#14B866]/15 border border-[#14B866]/40 items-center justify-center text-[#14B866]">
                      <ArrowLeftRight className="w-5 h-5" />
                    </span>
                    <div className="text-lg sm:text-2xl font-black tracking-tight uppercase">
                      <span className="text-[#14B866]">BURSA TRANSFER</span>{' '}
                      <span className="text-white">&amp; REGISTRASI</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-wider text-center sm:text-right">
                      {transferWindowOpen
                        ? 'JENDELA TRANSFER TENGAH MUSIM DIBUKA • CEK STATUS MUTASI PEMAIN'
                        : 'JENDELA TRANSFER SAAT INI DITUTUP OLEH ADMIN LIGA'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#14B866] group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION D: BAND FULL-WIDTH HIJAU EMERALD */}
            <section className="relative overflow-hidden bg-gradient-to-r from-[#0E9F57] via-[#14B866] to-[#0D9451] text-white py-10 sm:py-12 px-4 border-y border-emerald-300/30 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1800&q=85"
                alt="Tekstur Lapangan Futsal"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-multiply scale-105 pointer-events-none"
              />
              <div className="relative z-10 max-w-5xl mx-auto text-center">
                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-wide drop-shadow-sm">
                  EKOSISTEM KOMPETISI FUTSAL TERINTEGRASI
                </h2>
                <p className="text-xs sm:text-sm text-emerald-50/95 max-w-2xl mx-auto mt-2 leading-relaxed font-medium">
                  Akses seluruh modul manajemen liga mulai dari jadwal per pekan, tabel klasemen otomatis, papan top skor, akumulasi kartu, hingga e-ID card pemain dalam satu platform cepat.
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 my-7 max-w-4xl mx-auto">
                  {[
                    { label: 'Jadwal', icon: Calendar, target: () => goToKompetisi('JADWAL') },
                    { label: 'Klasemen', icon: Trophy, target: () => goToKompetisi('KLASEMEN') },
                    { label: 'Top Skor', icon: Flame, target: () => goToKompetisi('STATISTIK') },
                    { label: 'Transfer', icon: ArrowLeftRight, target: () => goToKompetisi('TRANSFER') },
                    { label: 'Tim', icon: Users, target: () => setPublicMenu('TIM') },
                    { label: 'Berita', icon: Newspaper, target: () => goToMedia('BERITA') },
                    { label: 'Galeri', icon: ImageIcon, target: () => goToMedia('GALERI') },
                    { label: 'Daftar', icon: UserPlus, target: () => setPublicMenu('PENDAFTARAN') },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={item.target}
                        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-black/15 transition-all"
                      >
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/20 border border-white/30 group-hover:bg-[#0D151B] group-hover:border-white flex items-center justify-center transition-all shadow-md">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[11px] font-extrabold tracking-wide">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToKompetisi('KLASEMEN')}
                  className="px-7 py-3 rounded-lg bg-[#18222B] hover:bg-[#0D151B] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all"
                >
                  LIHAT KLASEMEN &amp; JADWAL LENGKAP
                </button>
              </div>
            </section>

            {/* SECTION E: 4 KARTU LINGKARAN SPOTLIGHT PEMAIN BINTANG */}
            <section className="relative overflow-hidden py-12 px-4 bg-[#0B1319] border-b border-slate-800/80">
              <div className="relative z-10 max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">
                    LEADERBOARD INDIVIDU REAL-TIME
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1">
                    SPOTLIGHT PEMAIN BINTANG LIGA
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { title: 'TOP SKOR', stat: `${topScorerPlayer?.goals || 0} GOL`, player: topScorerPlayer },
                    { title: 'TOP ASSIST', stat: `${topAssistPlayer?.assists || 0} ASSIST`, player: topAssistPlayer },
                    { title: 'MVP LEADER', stat: `${mvpLeaderPlayer?.mvp || 0}x MVP`, player: mvpLeaderPlayer },
                    { title: 'BEST KEEPER', stat: `${bestKeeperPlayer?.cleanSheets || 0} CLEAN SHEET`, player: bestKeeperPlayer },
                  ].map((spot, idx) => {
                    const pTeam = teams.find((t) => t.id === spot.player?.teamId);
                    return (
                      <div
                        key={idx}
                        onClick={() => spot.player && setSelectedPlayerModal(spot.player)}
                        className="cursor-pointer group rounded-2xl bg-[#131F28]/90 border border-slate-800 hover:border-[#14B866] p-5 text-center transition-all shadow-xl flex flex-col items-center"
                      >
                        <span className="px-2.5 py-0.5 rounded-full bg-[#14B866]/15 text-[#14B866] text-[10px] font-black tracking-wider mb-3">
                          {spot.title}
                        </span>
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#14B866] to-amber-400 mb-3 shadow-lg group-hover:scale-105 transition-transform">
                          <img
                            src={spot.player?.photo}
                            alt={spot.player?.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                spot.player?.name || 'Player'
                              )}&background=0D151B&color=14B866&bold=true&size=256`;
                            }}
                            className="w-full h-full object-cover rounded-full bg-slate-900"
                          />
                        </div>
                        <div className="font-black text-sm text-white group-hover:text-[#14B866] transition-colors">
                          {spot.player?.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {pTeam?.shortName} • #{spot.player?.number}
                        </div>
                        <div className="mt-2.5 px-3 py-1 rounded-lg bg-[#0D151B] border border-slate-700 text-xs font-black text-amber-400">
                          {spot.stat}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION F: STRIP GALERI FOTO & VIDEO HIGHLIGHT */}
            <section className="py-8 px-4 bg-[#0D151B] border-b border-slate-800/80">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-[#14B866]" />
                    <span>GALERI FOTO &amp; VIDEO HIGHLIGHT LIGA</span>
                  </h3>
                  <button onClick={() => goToMedia('GALERI')} className="text-xs font-bold text-[#14B866] hover:underline">
                    Buka Semua Galeri →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {gallery.slice(0, 4).map((tile) => (
                    <div
                      key={tile.id}
                      onClick={() => setSelectedGalleryModal(tile)}
                      className="cursor-pointer group relative rounded-xl overflow-hidden border border-slate-700/80 hover:border-[#14B866] h-44 transition-all shadow-md bg-slate-900"
                    >
                      <img
                        src={tile.image}
                        alt={tile.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080E13] via-[#080E13]/45 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-[#14B866] text-slate-950 font-black text-[10px]">
                          {tile.type} • {tile.duration}
                        </span>
                        <span className="w-7 h-7 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white group-hover:bg-[#14B866] group-hover:text-slate-950 transition-colors">
                          {tile.type === 'VIDEO' ? <Play className="w-3.5 h-3.5 fill-current" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="font-black text-xs text-white leading-snug line-clamp-2 group-hover:text-[#14B866] transition-colors">
                          {tile.title}
                        </div>
                        <div className="text-[10px] text-slate-300 mt-1">{tile.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION G: 4 KEUNGGULAN PLATFORM */}
            <section className="relative py-12 px-4 border-b border-slate-800/80 bg-[#0B1217]">
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {[
                  {
                    icon: Clock,
                    title: 'LIVE SCORE REAL-TIME',
                    desc: 'Pembaruan skor, pencetak gol, dan kartu langsung dari meja panitia GOR tanpa jeda.',
                  },
                  {
                    icon: Smartphone,
                    title: 'MOBILE-FIRST SUPORTER',
                    desc: 'Antarmuka ringan dan nyaman diakses satu tangan dari tribun lapangan maupun ponsel.',
                  },
                  {
                    icon: Lock,
                    title: 'KLASEMEN & AUTO-LOCK',
                    desc: 'Perhitungan poin otomatis serta penguncian pemain terkena akumulasi kartu atau cedera.',
                  },
                  {
                    icon: FileCheck,
                    title: 'e-ID CARD TERVERIFIKASI',
                    desc: 'Validasi identitas pemain digital terenkripsi untuk menjamin kompetisi fair-play.',
                  },
                ].map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full border-2 border-[#14B866] bg-[#14B866]/10 flex items-center justify-center text-[#14B866] mb-4 shadow-[0_0_25px_rgba(20,184,102,0.2)]">
                        <Icon className="w-9 h-9 stroke-[1.75]" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#14B866] mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION H: STRIP LOGO SPONSOR & MITRA RESMI */}
            <section className="py-5 px-4 bg-[#080E13] border-b border-slate-800">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                <button
                  onClick={() => {
                    incrementSponsorClick();
                    triggerToast('Klik Sponsor Utama tercatat di Laporan ROI!');
                  }}
                  className="text-slate-400 hover:text-white transition-colors font-black tracking-widest text-sm sm:text-base flex items-center gap-1.5"
                >
                  <span className="text-[#14B866]">●</span> SPECS FUTSAL
                </button>
                <button
                  onClick={() => {
                    incrementSponsorClick();
                    triggerToast('Klik Sponsor Bank DKI tercatat!');
                  }}
                  className="text-slate-400 hover:text-white transition-colors font-black tracking-wider text-sm sm:text-base"
                >
                  BANK <span className="text-amber-400">DKI</span>
                </button>
                <button
                  onClick={() => {
                    incrementSponsorClick();
                    triggerToast('Klik Sponsor Mills Sport tercatat!');
                  }}
                  className="text-slate-400 hover:text-white transition-colors font-extrabold tracking-widest text-sm sm:text-base"
                >
                  MILLS SPORT
                </button>
                <button
                  onClick={() => {
                    incrementSponsorClick();
                    triggerToast('Klik Sponsor Pocari Sweat tercatat!');
                  }}
                  className="text-slate-400 hover:text-white transition-colors font-extrabold tracking-wider text-sm sm:text-base"
                >
                  POCARI SWEAT
                </button>
                <div className="pl-3 border-l border-slate-700 text-white">
                  <HBTechLabsLogo className="h-7" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
                  Sponsor ROI: {sponsorStats.impressions.toLocaleString()} views • {sponsorStats.clicks} clicks
                </span>
              </div>
            </section>
          </div>
        )}

        {/* ================================================================
            2. MENU UTAMA: KOMPETISI
           ================================================================ */}
        {publicMenu === 'KOMPETISI' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">
                  MODUL KOMPETISI LIGA
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {kompetisiSub === 'JADWAL' && 'Jadwal & Hasil Pertandingan'}
                  {kompetisiSub === 'KLASEMEN' && 'Tabel Klasemen Otomatis'}
                  {kompetisiSub === 'STATISTIK' && 'Pemain & Statistik Kompetisi'}
                  {kompetisiSub === 'TRANSFER' && 'Bursa Transfer Pemain'}
                </h1>
              </div>

              <div className="flex flex-wrap gap-1.5 bg-[#131F28] p-1.5 rounded-xl border border-slate-800">
                {[
                  { id: 'JADWAL', label: 'Jadwal & Hasil' },
                  { id: 'KLASEMEN', label: 'Klasemen' },
                  { id: 'STATISTIK', label: 'Pemain & Statistik' },
                  { id: 'TRANSFER', label: 'Transfer Pemain' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setKompetisiSub(sub.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                      kompetisiSub === sub.id ? 'bg-[#14B866] text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUB: JADWAL & HASIL */}
            {kompetisiSub === 'JADWAL' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/20 border border-slate-800 flex flex-wrap items-center gap-3">
                  <Filter className="w-4 h-4 text-[#14B866]" />
                  <select
                    value={weekFilter}
                    onChange={(e) => setWeekFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#0D151B] border border-slate-700 text-xs font-bold text-white outline-none"
                  >
                    <option value="SEMUA">Semua Pekan</option>
                    {[...new Set(matches.map((m) => m.week))].map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <select
                    value={venueFilter}
                    onChange={(e) => setVenueFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#0D151B] border border-slate-700 text-xs font-bold text-white outline-none"
                  >
                    <option value="SEMUA">Semua Lokasi GOR</option>
                    <option value="GOR Cendrawasih Jakarta">GOR Cendrawasih Jakarta</option>
                    <option value="GOR Soemantri Brodjonegoro">GOR Soemantri Brodjonegoro</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches
                    .filter((m) => (weekFilter === 'SEMUA' ? true : m.week === weekFilter))
                    .filter((m) => (venueFilter === 'SEMUA' ? true : m.venue === venueFilter))
                    .map((m) => {
                      const hTeam = teams.find((t) => t.id === m.homeTeamId);
                      const aTeam = teams.find((t) => t.id === m.awayTeamId);
                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMatchModal(m)}
                          className="cursor-pointer rounded-xl bg-[#131F28] border border-slate-800 hover:border-[#14B866] p-5 transition-all"
                        >
                          <div className="flex items-center justify-between text-xs mb-3">
                            <span className="font-bold text-slate-400">
                              {m.week} • {m.date}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded font-black text-[11px] ${
                                m.status === 'LIVE'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                                  : m.status === 'FT'
                                  ? 'bg-emerald-500/20 text-[#14B866]'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {m.status === 'LIVE' ? `● LIVE (${m.period})` : m.period}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 items-center gap-2 my-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hTeam?.logoBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                                {hTeam?.shortName}
                              </div>
                              <span className="font-bold text-xs sm:text-sm text-white">{hTeam?.name}</span>
                            </div>

                            <div className="text-center">
                              {m.status === 'SCHEDULED' ? (
                                <span className="px-3 py-1 rounded bg-slate-800 font-black text-xs text-slate-300">VS</span>
                              ) : (
                                <div className="text-2xl font-black text-white">
                                  {m.homeScore} <span className="text-[#14B866]">-</span> {m.awayScore}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-end gap-2.5 text-right">
                              <span className="font-bold text-xs sm:text-sm text-white">{aTeam?.name}</span>
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${aTeam?.logoBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                                {aTeam?.shortName}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#14B866]" />
                              {m.venue}
                            </span>
                            <span className="font-bold text-[#14B866]">Line-Up &amp; Rincian Gol →</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* SUB: KLASEMEN OTOMATIS */}
            {kompetisiSub === 'KLASEMEN' && (
              <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <div>
                    <h2 className="font-black text-lg text-white">Klasemen Otomatis — Grup A</h2>
                    <p className="text-xs text-slate-400">
                      Terhubung real-time dengan meja pertandingan &amp; pengesahan tim baru dari Panel Admin.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#14B866]/15 text-[#14B866] border border-[#14B866]/30">
                    ● Zona Lolos Semifinal (Pos 1–2)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                        <th className="py-3 px-2">Pos</th>
                        <th className="py-3 px-2">Klub</th>
                        <th className="py-3 px-2 text-center">MP</th>
                        <th className="py-3 px-2 text-center">W</th>
                        <th className="py-3 px-2 text-center">D</th>
                        <th className="py-3 px-2 text-center">L</th>
                        <th className="py-3 px-2 text-center">GF</th>
                        <th className="py-3 px-2 text-center">GA</th>
                        <th className="py-3 px-2 text-center">GD</th>
                        <th className="py-3 px-2 text-center">Form</th>
                        <th className="py-3 px-2 text-right font-black">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {standings.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-2 font-black">
                            <span
                              className={`inline-flex w-6 h-6 items-center justify-center rounded-md text-xs ${
                                idx < 2 ? 'bg-[#14B866] text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 font-bold">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${row.logoBg} text-white text-xs font-black flex items-center justify-center shrink-0`}>
                                {row.shortName}
                              </div>
                              <div>
                                <div className="font-extrabold text-white">{row.name}</div>
                                <div className="text-[11px] text-slate-400">{row.city}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-center font-semibold">{row.mp}</td>
                          <td className="py-3.5 px-2 text-center text-[#14B866] font-bold">{row.w}</td>
                          <td className="py-3.5 px-2 text-center">{row.d}</td>
                          <td className="py-3.5 px-2 text-center text-rose-400">{row.l}</td>
                          <td className="py-3.5 px-2 text-center">{row.gf}</td>
                          <td className="py-3.5 px-2 text-center">{row.ga}</td>
                          <td className="py-3.5 px-2 text-center font-mono font-bold">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                          <td className="py-3.5 px-2">
                            <div className="flex items-center justify-center gap-1">
                              {row.form.slice(-5).map((f, i) => (
                                <span
                                  key={i}
                                  className={`w-5 h-5 rounded text-[10px] font-black flex items-center justify-center text-white ${
                                    f === 'W' ? 'bg-[#14B866]' : f === 'D' ? 'bg-slate-600' : 'bg-rose-600'
                                  }`}
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-right font-black text-base text-[#14B866]">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB: PEMAIN & STATISTIK */}
            {kompetisiSub === 'STATISTIK' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
                  <h3 className="font-black text-base text-[#14B866] mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> TOP SKOR (GOLDEN BOOT)
                  </h3>
                  <div className="space-y-2.5">
                    {[...players]
                      .sort((a, b) => b.goals - a.goals)
                      .slice(0, 6)
                      .map((p, idx) => {
                        const pTeam = teams.find((t) => t.id === p.teamId);
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlayerModal(p)}
                            className="p-3 rounded-xl bg-[#0D151B] border border-slate-800 hover:border-[#14B866] flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded text-xs font-black flex items-center justify-center ${idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'}`}>
                                {idx + 1}
                              </span>
                              <div>
                                <div className="font-bold text-sm text-white">{p.name}</div>
                                <div className="text-[11px] text-slate-400">
                                  {pTeam?.name} • #{p.number}
                                </div>
                              </div>
                            </div>
                            <span className="text-lg font-black text-[#14B866]">{p.goals} Gol</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
                  <h3 className="font-black text-base text-amber-400 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" /> TOP ASSIST &amp; MVP
                  </h3>
                  <div className="space-y-2.5">
                    {[...players]
                      .sort((a, b) => b.assists - a.assists)
                      .slice(0, 6)
                      .map((p, idx) => {
                        const pTeam = teams.find((t) => t.id === p.teamId);
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlayerModal(p)}
                            className="p-3 rounded-xl bg-[#0D151B] border border-slate-800 hover:border-amber-400 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded bg-slate-800 text-xs font-black flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="font-bold text-sm text-white">{p.name}</div>
                                <div className="text-[11px] text-slate-400">
                                  {pTeam?.shortName} • {p.mvp}x MVP
                                </div>
                              </div>
                            </div>
                            <span className="text-lg font-black text-amber-400">{p.assists} Ast</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
                  <h3 className="font-black text-base text-rose-400 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> AKUMULASI KARTU &amp; SKORSING
                  </h3>
                  <div className="space-y-2.5">
                    {players
                      .filter((p) => p.yellowCards > 0 || p.redCards > 0)
                      .map((p) => {
                        const lock = getPlayerLockStatus(p);
                        const pTeam = teams.find((t) => t.id === p.teamId);
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlayerModal(p)}
                            className="p-3 rounded-xl bg-[#0D151B] border border-slate-800 flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {lock.locked && <Lock className="w-3.5 h-3.5 text-rose-500" />}
                              </div>
                              <div className="text-[11px] text-slate-400">{pTeam?.name}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-xs">{p.yellowCards}K</span>
                              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-xs">{p.redCards}M</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* SUB: TRANSFER PEMAIN */}
            {kompetisiSub === 'TRANSFER' && (
              <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="font-black text-lg text-white">Bursa Transfer Resmi Liga</h2>
                    <p className="text-xs text-slate-400">Periode Jendela Transfer Tengah Musim: 01 Nov – 25 Nov 2026.</p>
                  </div>
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black ${
                      transferWindowOpen ? 'bg-[#14B866]/20 text-[#14B866]' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {transferWindowOpen ? '● TRANSFER WINDOW BUKA' : '● TRANSFER WINDOW TUTUP'}
                  </span>
                </div>
                <div className="space-y-3">
                  {transfers.map((tr) => (
                    <div key={tr.id} className="p-4 rounded-xl bg-[#0D151B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-black text-base text-white">{tr.playerName}</div>
                        <div className="flex items-center gap-2 text-xs mt-1 text-slate-400">
                          <span>{tr.fromTeam}</span>
                          <ArrowLeftRight className="w-3.5 h-3.5 text-[#14B866]" />
                          <span className="font-bold text-[#14B866]">{tr.toTeam}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          tr.status === 'APPROVED' ? 'bg-[#14B866]/20 text-[#14B866]' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {tr.status === 'APPROVED' ? '✓ SAH / RESMI' : '⏳ MENUNGGU VERIFIKASI'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================
            3. MENU UTAMA: TIM
           ================================================================ */}
        {publicMenu === 'TIM' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">DIREKTORI KLUB PESERTA</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">Profil Tim &amp; Daftar Skuad Resmi</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeamDetail(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedTeamDetail === t.id ? 'border-[#14B866] bg-[#14B866]/10' : 'bg-[#131F28] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.logoBg} text-white font-black text-sm flex items-center justify-center mb-3`}>
                    {t.shortName}
                  </div>
                  <div className="font-extrabold text-sm text-white">{t.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{t.city}</div>
                </button>
              ))}
            </div>

            {(() => {
              const activeTeamObj = teams.find((t) => t.id === selectedTeamDetail) || teams[0];
              const squad = players.filter((p) => p.teamId === activeTeamObj.id);
              return (
                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6">
                  <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-800">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeTeamObj.logoBg} text-white font-black text-xl flex items-center justify-center`}>
                      {activeTeamObj.shortName}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{activeTeamObj.name}</h2>
                      <p className="text-xs text-slate-400">
                        Pelatih: <strong className="text-[#14B866]">{activeTeamObj.coach}</strong> • Total Skuad: {squad.length} Pemain
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {squad.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlayerModal(p)}
                        className="rounded-xl bg-[#0D151B] border border-slate-800 hover:border-[#14B866] overflow-hidden cursor-pointer group"
                      >
                        <div className="h-36 overflow-hidden relative bg-slate-900">
                          <img
                            src={p.photo}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-transparent to-transparent" />
                          <span className="absolute bottom-2 left-3 text-2xl font-black text-[#14B866]">#{p.number}</span>
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-black/70 text-white">
                            {p.position}
                          </span>
                        </div>
                        <div className="p-3.5">
                          <div className="font-bold text-sm text-white">{p.name}</div>
                          <div className="text-xs text-slate-400 mt-1.5 flex justify-between">
                            <span>
                              {p.goals} Gol • {p.assists} Ast
                            </span>
                            <span className="text-[#14B866] font-bold">e-ID →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================
            4. MENU UTAMA: MEDIA
           ================================================================ */}
        {publicMenu === 'MEDIA' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">PUSAT PUBLIKASI &amp; DOKUMENTASI</span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {mediaSub === 'BERITA' ? 'Berita & Pengumuman Resmi' : 'Galeri Foto & Video Highlight'}
                </h1>
              </div>

              <div className="flex gap-1.5 bg-[#131F28] p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setMediaSub('BERITA')}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                    mediaSub === 'BERITA' ? 'bg-[#14B866] text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Berita &amp; Pengumuman
                </button>
                <button
                  onClick={() => setMediaSub('GALERI')}
                  className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                    mediaSub === 'GALERI' ? 'bg-[#14B866] text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Galeri Foto &amp; Video
                </button>
              </div>
            </div>

            {mediaSub === 'BERITA' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {news.map((n) => (
                  <div key={n.id} className="rounded-2xl bg-[#131F28] border border-slate-800 overflow-hidden flex flex-col justify-between">
                    <div>
                      <img src={n.image} alt={n.title} className="w-full h-44 object-cover" />
                      <div className="p-5">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-[#14B866]/15 text-[#14B866] mb-3">
                          {n.category}
                        </span>
                        <h3 className="font-black text-base text-white mb-2">{n.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{n.excerpt}</p>
                      </div>
                    </div>
                    <div className="px-5 py-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
                      <span>{n.date}</span>
                      <span className="text-[#14B866] font-bold">{n.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mediaSub === 'GALERI' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#131F28] border border-slate-800">
                  <p className="text-xs text-slate-300 font-medium">
                    Dokumentasi foto pertandingan dan video highlight resmi yang dikelola Panel Admin.
                  </p>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'SEMUA', label: `Semua Media (${gallery.length})` },
                      { id: 'FOTO', label: 'Foto Laga' },
                      { id: 'VIDEO', label: 'Video Highlight' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setGalleryFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          galleryFilter === tab.id
                            ? 'bg-[#14B866] text-slate-950'
                            : 'bg-[#0D151B] text-slate-300 border border-slate-700 hover:border-[#14B866]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {gallery
                    .filter((item) => (galleryFilter === 'SEMUA' ? true : item.type === galleryFilter))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGalleryModal(item)}
                        className="cursor-pointer group rounded-2xl bg-[#131F28] border border-slate-800 hover:border-[#14B866] overflow-hidden shadow-lg flex flex-col justify-between transition-all"
                      >
                        <div>
                          <div className="relative h-52 overflow-hidden bg-slate-900">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-transparent to-transparent" />
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#14B866] text-slate-950 font-black text-[10px]">
                              {item.type} • {item.duration}
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-black/65 border border-white/40 flex items-center justify-center text-white group-hover:bg-[#14B866] group-hover:text-slate-950 transition-colors">
                                {item.type === 'VIDEO' ? <Play className="w-5 h-5 fill-current" /> : <ImageIcon className="w-5 h-5" />}
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <span className="text-[10px] font-black tracking-wider text-[#14B866] uppercase">{item.category}</span>
                            <h3 className="font-black text-base text-white mt-1 leading-snug group-hover:text-[#14B866] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{item.caption}</p>
                          </div>
                        </div>
                        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#14B866]" />
                            {item.venue}
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================
            5. MENU UTAMA: PENDAFTARAN
           ================================================================ */}
        {publicMenu === 'PENDAFTARAN' && (
          <div className="max-w-2xl mx-auto px-3 sm:px-6 py-10">
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 sm:p-8">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#14B866]/15 text-[#14B866]">
                REGISTRASI TIM ONLINE
              </span>
              <h2 className="text-2xl font-black text-white mt-2 mb-1">Pendaftaran Peserta Liga 2026</h2>
              <p className="text-xs text-slate-400 mb-6">
                Formulir terhubung langsung dengan antrean verifikasi di halaman <strong className="text-emerald-400">/admin</strong>. Setelah disahkan Admin, tim otomatis masuk ke daftar Klub &amp; Klasemen.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!regForm.teamName || !regForm.manager) return;
                  submitTeamRegistration(regForm);
                  setRegForm({ teamName: '', category: 'Putra Umum', manager: '', phone: '' });
                  triggerToast('Pengajuan Tim Baru terkirim ke antrean verifikasi /admin!');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Nama Klub / Tim Futsal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: West Jakarta United FC"
                    value={regForm.teamName}
                    onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm text-white outline-none focus:border-[#14B866]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Kategori Usia</label>
                    <select
                      value={regForm.category}
                      onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm text-white outline-none"
                    >
                      <option>Putra Umum</option>
                      <option>Putra U-21</option>
                      <option>Putri Umum</option>
                      <option>Pelajar U-18</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Nama Manajer Tim *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama lengkap manajer"
                      value={regForm.manager}
                      onChange={(e) => setRegForm({ ...regForm, manager: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm text-white outline-none focus:border-[#14B866]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Nomor WhatsApp Aktif *</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm text-white outline-none focus:border-[#14B866]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-sm shadow-lg"
                >
                  Kirim Pendaftaran Tim
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================
            6. MENU UTAMA: TENTANG LIGA
           ================================================================ */}
        {publicMenu === 'TENTANG' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">INFORMASI RESMI PENYELENGGARA</span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {tentangSub === 'PROFIL' && 'Profil Penyelenggara & Regulasi'}
                  {tentangSub === 'SPONSOR' && 'Sponsor & Mitra Resmi Liga'}
                  {tentangSub === 'KONTAK' && 'Sekretariat & Kontak Panitia'}
                </h1>
              </div>

              <div className="flex gap-1.5 bg-[#131F28] p-1.5 rounded-xl border border-slate-800">
                {[
                  { id: 'PROFIL', label: 'Profil & Regulasi' },
                  { id: 'SPONSOR', label: 'Sponsor & Mitra' },
                  { id: 'KONTAK', label: 'Kontak' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setTentangSub(sub.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all ${
                      tentangSub === sub.id ? 'bg-[#14B866] text-slate-950' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {tentangSub === 'PROFIL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#14B866]/15 text-[#14B866] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-white">Visi, Misi &amp; Struktur Organisasi</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nusantara Futsal Pro League hadir untuk memodernisasi tata kelola kompetisi futsal di Indonesia dengan transparansi data real-time, verifikasi e-ID pemain, dan eksposur digital profesional.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-white">Regulasi Poin &amp; Akumulasi Kartu</h2>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Kemenangan = 3 Poin, Seri = 1 Poin, Kalah = 0 Poin.</li>
                    <li>Akumulasi 2 Kartu Kuning atau 1 Kartu Merah otomatis mengunci line-up pemain pada laga berikutnya.</li>
                  </ul>
                </div>
              </div>
            )}

            {tentangSub === 'SPONSOR' && (
              <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Handshake className="w-6 h-6 text-[#14B866]" />
                  <h2 className="text-lg font-black text-white">Paket Kemitraan &amp; Mitra Sponsor Resmi</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Seluruh mitra sponsor mendapatkan laporan analitik tayangan (impressions) dan klik banner digital secara transparan.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {['PLATINUM TITLE SPONSOR', 'GOLD MATCHDAY PARTNER', 'OFFICIAL APPAREL & TECH'].map((pkg, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0D151B] border border-slate-800">
                      <span className="text-[10px] font-black text-[#14B866]">{pkg}</span>
                      <div className="font-black text-sm text-white mt-1">Slot Banner Utama &amp; Story Watermark</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tentangSub === 'KONTAK' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-3 text-xs text-slate-300">
                  <h2 className="text-lg font-black text-white">Sekretariat Panitia Liga</h2>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#14B866]" /> GOR Cendrawasih, Cengkareng, Jakarta Barat
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-[#14B866]" /> +62 812-9000-2026 (WhatsApp Panitia)
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#14B866]" /> sekretariat@nusantarafutsal.id
                  </p>
                </div>
                <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6">
                  <h3 className="text-base font-black text-white mb-3">Kirim Pesan ke Panitia</h3>
                  <button
                    onClick={() => triggerToast('Pesan Anda telah diteruskan ke Sekretariat Liga!')}
                    className="w-full py-3 rounded-xl bg-[#14B866] text-slate-950 font-black text-xs"
                  >
                    Hubungi Sekretariat via WhatsApp Resmi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL LIGHTBOX GALERI
         ==================================================================== */}
      {selectedGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#131F28] border border-slate-700 overflow-hidden shadow-2xl">
            <div className="relative h-64 sm:h-80 bg-black">
              <img src={selectedGalleryModal.image} alt={selectedGalleryModal.title} className="w-full h-full object-cover opacity-90" />
              <button
                onClick={() => setSelectedGalleryModal(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white"
              >
                <X className="w-5 h-5" />
              </button>
              {selectedGalleryModal.type === 'VIDEO' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <div className="w-16 h-16 rounded-full bg-[#14B866] text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>
                  <span className="mt-2 px-3 py-1 rounded-full bg-black/75 text-white text-xs font-bold">
                    Official Highlight Player ({selectedGalleryModal.duration})
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-0.5 rounded bg-[#14B866]/20 text-[#14B866] font-black">
                  {selectedGalleryModal.type} • {selectedGalleryModal.category}
                </span>
                <span className="text-slate-400">
                  {selectedGalleryModal.date} • {selectedGalleryModal.venue}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">{selectedGalleryModal.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{selectedGalleryModal.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DETAIL PERTANDINGAN + LINE-UP RESMI DARI PORTAL MANAJER
         ==================================================================== */}
      {activeModalMatch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#131F28] border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-[#14B866] uppercase">
                {activeModalMatch.week} • {activeModalMatch.group}
              </span>
              <button onClick={() => setSelectedMatchModal(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {(() => {
              const mHome = teams.find((t) => t.id === activeModalMatch.homeTeamId);
              const mAway = teams.find((t) => t.id === activeModalMatch.awayTeamId);
              const homeLineupPlayers = players.filter((p) => (lineups[activeModalMatch.homeTeamId] || []).includes(p.id));
              const awayLineupPlayers = players.filter((p) => (lineups[activeModalMatch.awayTeamId] || []).includes(p.id));

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#0D151B] border border-slate-800 text-center">
                    <div className="grid grid-cols-3 items-center">
                      <div className="font-black text-sm text-white">{mHome?.name}</div>
                      <div className="text-3xl font-black text-[#14B866]">
                        {activeModalMatch.homeScore} - {activeModalMatch.awayScore}
                      </div>
                      <div className="font-black text-sm text-white">{mAway?.name}</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      {activeModalMatch.venue} • {activeModalMatch.period}
                    </div>
                  </div>

                  {/* Line-Up Resmi yang Diatur Manajer di /manager */}
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider text-[#14B866] mb-2">
                      Daftar Line-Up Resmi (Sinkron Portal Manajer)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800">
                        <div className="text-[11px] font-black text-white mb-2">{mHome?.shortName} Line-Up</div>
                        {homeLineupPlayers.length === 0 ? (
                          <p className="text-[11px] text-slate-500">Belum ada line-up aktif.</p>
                        ) : (
                          <ul className="space-y-1 text-xs text-slate-300">
                            {homeLineupPlayers.map((p) => (
                              <li key={p.id} className="flex justify-between">
                                <span>
                                  <strong className="text-[#14B866]">#{p.number}</strong> {p.name}
                                </span>
                                <span className="text-[10px] text-slate-500">{p.position}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800">
                        <div className="text-[11px] font-black text-white mb-2">{mAway?.shortName} Line-Up</div>
                        {awayLineupPlayers.length === 0 ? (
                          <p className="text-[11px] text-slate-500">Belum ada line-up aktif.</p>
                        ) : (
                          <ul className="space-y-1 text-xs text-slate-300">
                            {awayLineupPlayers.map((p) => (
                              <li key={p.id} className="flex justify-between">
                                <span>
                                  <strong className="text-amber-400">#{p.number}</strong> {p.name}
                                </span>
                                <span className="text-[10px] text-slate-500">{p.position}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider text-slate-300 mb-2">Rincian Kejadian &amp; Kartu</h4>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto">
                      {activeModalMatch.events.length === 0 ? (
                        <p className="text-xs text-slate-500">Pertandingan belum dimulai.</p>
                      ) : (
                        activeModalMatch.events.map((ev) => (
                          <div key={ev.id} className="px-3 py-2 rounded-lg bg-[#0D151B] border border-slate-800 flex justify-between text-xs">
                            <span>
                              {ev.type === 'GOAL' ? '⚽ Gol' : ev.type === 'YELLOW' ? '🟨 Kartu Kuning' : '🟥 Kartu Merah'} —{' '}
                              <strong className="text-white">{ev.playerName}</strong>
                            </span>
                            <span className="font-mono font-bold text-[#14B866]">{ev.minute}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL PROFIL INDIVIDU PEMAIN & E-ID CARD DIGITAL
         ==================================================================== */}
      {selectedPlayerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#131F28] border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#14B866]/20 text-[#14B866]">
                ✓ OFFICIAL PLAYER e-ID CARD
              </span>
              <button onClick={() => setSelectedPlayerModal(null)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {(() => {
              const livePlayer = players.find((p) => p.id === selectedPlayerModal.id) || selectedPlayerModal;
              const pTeam = teams.find((t) => t.id === livePlayer.teamId);
              const lockStatus = getPlayerLockStatus(livePlayer);
              return (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#0D151B] to-[#0E6E3F] text-white border border-[#14B866]/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-emerald-300 font-bold">{pTeam?.name}</div>
                        <h3 className="text-xl font-black mt-0.5">{livePlayer.name}</h3>
                        <div className="text-xs text-slate-300 mt-1">
                          Posisi: {livePlayer.position} • ID: NFPL-{livePlayer.id.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-4xl font-black text-amber-400">#{livePlayer.number}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800">
                      <div className="text-xl font-black text-[#14B866]">{livePlayer.goals}</div>
                      <div className="text-[11px] text-slate-400">Total Gol</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800">
                      <div className="text-xl font-black text-amber-400">{livePlayer.assists}</div>
                      <div className="text-[11px] text-slate-400">Assist</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800">
                      <div className="text-xl font-black text-sky-400">{livePlayer.mvp}</div>
                      <div className="text-[11px] text-slate-400">MVP</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Status Bermain:</span>
                    <span className={`px-2.5 py-1 rounded font-black border ${lockStatus.badgeColor}`}>{lockStatus.reason}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ====================================================================
          FOOTER MULTI-KOLOM DENGAN LINK KE /login, /manager, /admin
         ==================================================================== */}
      <footer className="bg-[#080E13] text-slate-400 pt-10 pb-8 px-4 border-t border-slate-800/90">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pb-8 border-b border-slate-800/80 text-xs">
          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">TENTANG LIGA</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => goToTentang('PROFIL')} className="hover:text-[#14B866]">
                  Profil &amp; Regulasi
                </button>
              </li>
              <li>
                <button onClick={() => goToTentang('SPONSOR')} className="hover:text-[#14B866]">
                  Sponsor &amp; Mitra
                </button>
              </li>
              <li>
                <button onClick={() => goToTentang('KONTAK')} className="hover:text-[#14B866]">
                  Kontak Sekretariat
                </button>
              </li>
              <li>
                <button onClick={() => setPublicMenu('PENDAFTARAN')} className="hover:text-[#14B866]">
                  Pendaftaran Tim
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3">KOMPETISI</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => goToKompetisi('JADWAL')} className="hover:text-[#14B866]">
                  Jadwal &amp; Hasil
                </button>
              </li>
              <li>
                <button onClick={() => goToKompetisi('KLASEMEN')} className="hover:text-[#14B866]">
                  Klasemen Otomatis
                </button>
              </li>
              <li>
                <button onClick={() => goToKompetisi('STATISTIK')} className="hover:text-[#14B866]">
                  Pemain &amp; Statistik
                </button>
              </li>
              <li>
                <button onClick={() => goToKompetisi('TRANSFER')} className="hover:text-[#14B866]">
                  Transfer Pemain
                </button>
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