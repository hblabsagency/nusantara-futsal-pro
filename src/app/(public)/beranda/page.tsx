"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy, Calendar, Users, Clock, MapPin, Play, Lock,
  ChevronRight, UserPlus, FileCheck, Newspaper, Flame,
  ArrowLeftRight, Radio, Image as ImageIcon, Smartphone
} from 'lucide-react';
import { useLeague, HBTechLabsLogo } from '../../../context/LeagueContext';
import {
  MatchDetailModal,
  PlayerModal,
  GalleryModal,
} from '../../../components/LeagueModals';

// Fallback gambar SVG jika data sponsor lama di localStorage belum memiliki file gambar
const getFallbackSponsorImage = (name: string) => {
  const label = (name || 'SPONSOR').toUpperCase().slice(0, 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="110" viewBox="0 0 320 110">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0F1B24"/>
        <stop offset="100%" stop-color="#132A24"/>
      </linearGradient>
    </defs>
    <rect width="320" height="110" fill="url(#g)"/>
    <rect x="0" y="102" width="320" height="8" fill="#14B866"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#F8FAFC" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="22" letter-spacing="3">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export default function BerandaPage() {
  const router = useRouter();
  const {
    teams,
    players,
    matches,
    transferWindowOpen,
    gallery,
    sponsors = [],
  } = useLeague();

  const [selectedMatchModal, setSelectedMatchModal] = useState<any>(null);
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<any>(null);
  const [selectedGalleryModal, setSelectedGalleryModal] = useState<any>(null);

  const heroMatch = matches.find((m) => m.id === 'm5') || matches[0];

  const topScorerPlayer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const topAssistPlayer = [...players].sort((a, b) => b.assists - a.assists)[0];
  const mvpLeaderPlayer = [...players].sort((a, b) => b.mvp - a.mvp)[0];
  const bestKeeperPlayer =
    [...players]
      .filter((p) => p.position === 'GK')
      .sort((a, b) => b.cleanSheets - a.cleanSheets)[0] || players[0];

  const repeatCount =
    sponsors.length > 0 ? Math.max(2, Math.ceil(8 / sponsors.length)) : 0;

  return (
    <div>
      <section className="relative overflow-hidden bg-[#0A1116] border-b border-emerald-500/30 pt-6 sm:pt-8 pb-10 sm:pb-12">
        <img
          src="/bg-futsal-kosong.jpg"
          alt="GOR Futsal Indoor"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1518605368461-1ee7e543666d?auto=format&fit=crop&w=1800&q=85';
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-emerald-500/30 text-[10px] sm:text-[11px] font-bold text-emerald-400 mb-2">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>LIVE MATCHDAY • PEKAN KE-5 GRUP A</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
              <span className="text-[#14B866] drop-shadow-[0_0_20px_rgba(20,184,102,0.45)]">
                A LEGACY{' '}
              </span>
              <span className="text-white">OF GLORY</span>
            </h1>
            <p className="text-[11px] sm:text-sm font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-slate-300 mt-2">
              SETIAP PERTANDINGAN MENJADI{' '}
              <span className="text-[#14B866]">BAGIAN DARI SEJARAH</span>
            </p>
          </div>

          {/* Hero Match + Card Pemain Kiri & Kanan (Responsif HP & Desktop) */}
          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
            {/* Kartu Pertandingan Utama (Di HP urutan 1 full-width, di Desktop urutan 2 tengah) */}
            {heroMatch &&
              (() => {
                const hTeam = teams.find((t) => t.id === heroMatch.homeTeamId);
                const aTeam = teams.find((t) => t.id === heroMatch.awayTeamId);
                return (
                  <div className="col-span-2 order-1 md:order-2 w-full md:max-w-md mx-auto shrink-0">
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <span className="px-3 py-1 rounded bg-[#0A1116]/90 border border-slate-700 text-[11px] font-bold text-slate-200">
                        {heroMatch.date}
                      </span>
                      <span className="px-3 py-1 rounded bg-[#0A1116]/90 border border-emerald-500/40 text-[11px] font-bold text-[#14B866]">
                        {heroMatch.time}
                      </span>
                    </div>

                    <div className="relative bg-transparent backdrop-blur-md text-shadow-mist-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.75)] border-2 border-emerald-400/80 px-3 py-4 sm:px-6 sm:py-5">
                      <div className="grid grid-cols-3 items-center text-center gap-1.5 sm:gap-2">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${hTeam?.logoBg} text-white font-black text-base sm:text-lg flex items-center justify-center shadow-lg border-2 border-white mb-2`}
                          >
                            {hTeam?.shortName}
                          </div>
                          <span className="font-black text-[11px] sm:text-sm uppercase tracking-tight leading-tight text-shadow-mist-100">
                            {hTeam?.name}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] sm:text-[10px] font-black tracking-wider uppercase animate-pulse mb-1">
                            {heroMatch.status}
                          </span>
                          <div className="text-2xl sm:text-4xl font-black tracking-tighter text-shadow-mist-10 whitespace-nowrap">
                            {heroMatch.homeScore}{' '}
                            <span className="text-white text-base sm:text-xl">VS</span>{' '}
                            {heroMatch.awayScore}
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-bold text-white mt-1">
                            {heroMatch.period}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${aTeam?.logoBg} text-white font-black text-base sm:text-lg flex items-center justify-center shadow-lg border-2 border-white mb-2`}
                          >
                            {aTeam?.shortName}
                          </div>
                          <span className="font-black text-[11px] sm:text-sm uppercase tracking-tight leading-tight text-shadow-mist-10">
                            {aTeam?.name}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/30 text-center text-[10px] sm:text-[11px] font-bold text-white flex items-center justify-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#14B866] shrink-0" />
                        <span>{heroMatch.venue}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2.5 px-1 sm:px-2">
                      <button
                        onClick={() => setSelectedMatchModal(heroMatch)}
                        className="py-2 px-1.5 sm:px-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-[11px] sm:text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
                      >
                        LINE-UP
                      </button>
                      <button
                        onClick={() => router.push('/kompetisi?sub=KLASEMEN')}
                        className="py-2 px-1.5 sm:px-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-[11px] sm:text-xs tracking-wide shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
                      >
                        KLASEMEN
                      </button>
                      <button
                        onClick={() => router.push('/kompetisi?sub=STATISTIK')}
                        className="py-2 px-1.5 sm:px-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-[10px] sm:text-xs leading-tight tracking-wide shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
                      >
                        PEMAIN &amp; STATISTIK
                      </button>
                    </div>
                  </div>
                );
              })()}

            {/* Card Pemain Kiri (Di HP urutan 2 kolom kiri, di Desktop urutan 1 sisi kiri) */}
            <div className="order-2 md:order-1 w-full md:flex-1 md:max-w-[230px]">
              <div className="relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden border border-emerald-500/35 shadow-2xl group">
                <img
                  src="/pemainkiri.jpg"
                  alt="Bayu Permana"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-[#0D151B]/25 to-emerald-950/30" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#14B866] text-slate-950 font-black text-[9px] sm:text-[10px]">
                    #10 BAYU PERMANA
                  </span>
                  <div className="text-[11px] sm:text-xs font-extrabold text-white mt-1 leading-tight">
                    FC Kembangan United
                  </div>
                </div>
              </div>
            </div>

            {/* Card Pemain Kanan (Di HP urutan 3 kolom kanan, di Desktop urutan 3 sisi kanan) */}
            <div className="order-3 md:order-3 w-full md:flex-1 md:max-w-[230px]">
              <div className="relative h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden border border-amber-500/35 shadow-2xl group">
                <img
                  src="/pemainkanan.jpg"
                  alt="Aksi Pemain Garuda Futsal Club"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-[#0D151B]/25 to-amber-950/30" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px]">
                    #9 HENDRA WIJAYA
                  </span>
                  <div className="text-[11px] sm:text-xs font-extrabold text-white mt-1 leading-tight">
                    Garuda Futsal Club
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
            {[
              {
                big: `${teams.length}`,
                title: 'TIM ELITE LIGA',
                action: () => router.push('/tim'),
              },
              {
                big: `${matches.length}`,
                title: 'JADWAL PERTANDINGAN',
                action: () => router.push('/kompetisi?sub=JADWAL'),
              },
              {
                big: `${players.length}`,
                title: 'TOTAL PEMAIN',
                action: () => router.push('/kompetisi?sub=STATISTIK'),
              },
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
              </div>
            ))}
          </div>

          <div
            onClick={() => router.push('/kompetisi?sub=TRANSFER')}
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
              { label: 'Jadwal', icon: Calendar, target: () => router.push('/kompetisi?sub=JADWAL') },
              { label: 'Klasemen', icon: Trophy, target: () => router.push('/kompetisi?sub=KLASEMEN') },
              { label: 'Top Skor', icon: Flame, target: () => router.push('/kompetisi?sub=STATISTIK') },
              { label: 'Transfer', icon: ArrowLeftRight, target: () => router.push('/kompetisi?sub=TRANSFER') },
              { label: 'Tim', icon: Users, target: () => router.push('/tim') },
              { label: 'Berita', icon: Newspaper, target: () => router.push('/media?sub=BERITA') },
              { label: 'Galeri', icon: ImageIcon, target: () => router.push('/media?sub=GALERI') },
              { label: 'Daftar', icon: UserPlus, target: () => router.push('/pendaftaran') },
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
            onClick={() => router.push('/kompetisi?sub=KLASEMEN')}
            className="px-7 py-3 rounded-lg bg-[#18222B] hover:bg-[#0D151B] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all"
          >
            LIHAT KLASEMEN &amp; JADWAL LENGKAP
          </button>
        </div>
      </section>

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

      <section className="py-8 px-4 bg-[#0D151B] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-[#14B866]" />
              <span>GALERI FOTO &amp; VIDEO HIGHLIGHT LIGA</span>
            </h3>
            <button
              onClick={() => router.push('/media?sub=GALERI')}
              className="text-xs font-bold text-[#14B866] hover:underline"
            >
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
                    {tile.type === 'VIDEO' ? (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5" />
                    )}
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

      {/* Sponsor Gambar Berjalan Kanan ke Kiri (Auto-Crop sesuai ukuran div) + Logo H&B TechLabs Tetap */}
      {sponsors.length > 0 && (
        <section className="py-4 px-4 bg-[#080E13] border-b border-slate-800">
          <style>{`
            @keyframes sponsor-marquee {
              0% {
                transform: translate3d(0, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }
            .sponsor-marquee-track {
              display: flex;
              width: max-content;
              will-change: transform;
              animation: sponsor-marquee 35s linear infinite;
            }
            .sponsor-marquee-container:hover .sponsor-marquee-track {
              animation-play-state: paused;
            }
          `}</style>

          <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6">
            <div
              className="sponsor-marquee-container relative flex-1 overflow-hidden select-none"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              }}
            >
              <div className="sponsor-marquee-track items-center">
                {[0, 1].map((halfIdx) => (
                  <div
                    key={halfIdx}
                    aria-hidden={halfIdx === 1}
                    className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7 shrink-0"
                  >
                    {Array.from({ length: repeatCount }).map((_, repeatIdx) => (
                      <React.Fragment key={repeatIdx}>
                        {sponsors.map((sp: any) => (
                          <div
                            key={`${sp.id}-${repeatIdx}`}
                            title={sp.name}
                            className="w-28 h-11 sm:w-36 sm:h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-900/90 shrink-0 shadow-sm hover:border-[#14B866]/60 transition-colors"
                          >
                            <img
                              src={sp.logoUrl || getFallbackSponsorImage(sp.name)}
                              alt={sp.name || 'Sponsor Liga'}
                              className="w-full h-full object-cover object-center block"
                            />
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 pl-4 border-l border-slate-700 text-white bg-[#080E13] z-10">
              <HBTechLabsLogo className="h-7" />
            </div>
          </div>
        </section>
      )}

      <MatchDetailModal
        selectedMatch={selectedMatchModal}
        onClose={() => setSelectedMatchModal(null)}
      />
      <PlayerModal
        selectedPlayer={selectedPlayerModal}
        onClose={() => setSelectedPlayerModal(null)}
      />
      <GalleryModal
        selectedItem={selectedGalleryModal}
        onClose={() => setSelectedGalleryModal(null)}
      />
    </div>
  );
}