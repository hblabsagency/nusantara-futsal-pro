// @ts-nocheck
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// ============================================================================
// KOMPONEN LOGO RESMI H&B TECHLABS
// ============================================================================
export const HBTechLabsLogo = ({ className = "h-7" }) => (
  <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
    <svg viewBox="0 0 64 72" className="h-full w-auto shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4L58 19V30L46 23V21L32 13L18 21V42L27 36H43C45.7614 36 48 38.2386 48 41C48 43.7614 45.7614 46 43 46H30L14 56L6 51V19L32 4Z" fill="currentColor" />
      <path d="M58 43V53L32 68L17 59L25 54L32 58L46 50V47L58 43Z" fill="currentColor" />
      <circle cx="26" cy="25" r="4.5" fill="#10B981" />
      <circle cx="38" cy="51" r="4.5" fill="#10B981" />
      <circle cx="48" cy="36" r="6.5" fill="currentColor" />
    </svg>
    <div className="flex flex-col leading-none text-left">
      <span className="font-black tracking-tight text-sm sm:text-base">H&amp;B</span>
      <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.26em] text-emerald-400 mt-0.5">TECHLABS</span>
    </div>
  </div>
);

// ============================================================================
// AKUN DEMO CLIENT-SIDE LOGIN
// ============================================================================
export const DEMO_ACCOUNTS = [
  {
    id: 'u-admin',
    name: 'Panitia & Match Commissioner',
    email: 'admin@futsalpro.id',
    password: 'admin123',
    role: 'ADMIN',
    title: 'Super Admin Liga',
  },
  {
    id: 'u-mgr-t1',
    name: 'Coach Rendra Pratama',
    email: 'rendra@kembangan.fc',
    password: 'manager123',
    role: 'MANAGER',
    teamId: 't1',
    title: 'Manajer FC Kembangan United',
  },
  {
    id: 'u-mgr-t2',
    name: 'Coach Dimas Saputra',
    email: 'dimas@garuda.fc',
    password: 'manager123',
    role: 'MANAGER',
    teamId: 't2',
    title: 'Manajer Garuda Futsal Club',
  },
];

// ============================================================================
// DATA AWAL LIGA
// ============================================================================
export const INITIAL_TEAMS = [
  {
    id: 't1',
    name: 'FC Kembangan United',
    shortName: 'KMB',
    group: 'Grup A',
    city: 'Jakarta Barat',
    coach: 'Coach Rendra Pratama',
    logoBg: 'from-emerald-500 to-teal-700',
    verified: true,
    founded: 2019,
  },
  {
    id: 't2',
    name: 'Garuda Futsal Club',
    shortName: 'GRD',
    group: 'Grup A',
    city: 'Jakarta Selatan',
    coach: 'Coach Dimas Saputra',
    logoBg: 'from-amber-500 to-orange-600',
    verified: true,
    founded: 2018,
  },
  {
    id: 't3',
    name: 'Bintang Timur Batavia',
    shortName: 'BTB',
    group: 'Grup A',
    city: 'Jakarta Timur',
    coach: 'Coach Fajar Nugroho',
    logoBg: 'from-sky-500 to-blue-700',
    verified: true,
    founded: 2020,
  },
  {
    id: 't4',
    name: 'Rajawali Arena FC',
    shortName: 'RJW',
    group: 'Grup A',
    city: 'Tangerang',
    coach: 'Coach Arif Budiman',
    logoBg: 'from-rose-500 to-red-700',
    verified: true,
    founded: 2021,
  },
];

export const INITIAL_PLAYERS = [
  // FC Kembangan United (t1)
  { id: 'p1', teamId: 't1', name: 'Rizky Ramadhan', number: 1, position: 'GK', goals: 0, assists: 2, mvp: 1, cleanSheets: 3, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80' },
  { id: 'p2', teamId: 't1', name: 'Andi Saputra', number: 7, position: 'Anchor', goals: 4, assists: 5, mvp: 2, cleanSheets: 0, yellowCards: 1, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' },
  { id: 'p3', teamId: 't1', name: 'Bayu Permana', number: 10, position: 'Flank', goals: 8, assists: 4, mvp: 3, cleanSheets: 0, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80' },
  { id: 'p4', teamId: 't1', name: 'Reza Pahlevi', number: 9, position: 'Pivot', goals: 6, assists: 2, mvp: 1, cleanSheets: 0, yellowCards: 2, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1518605368461-1ee7e543666d?auto=format&fit=crop&w=600&q=80' },
  { id: 'p5', teamId: 't1', name: 'Ilham Kurniawan', number: 11, position: 'Flank', goals: 3, assists: 3, mvp: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, injured: true, docVerified: true, photo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80' },
  { id: 'p6', teamId: 't1', name: 'Daffa Alfarizi', number: 4, position: 'Anchor', goals: 1, assists: 1, mvp: 0, cleanSheets: 0, yellowCards: 0, redCards: 1, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80' },
  { id: 'p7', teamId: 't1', name: 'Fikri Haikal', number: 14, position: 'Flank', goals: 2, assists: 4, mvp: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80' },
  { id: 'p8', teamId: 't1', name: 'Galih Pratama', number: 20, position: 'GK', goals: 0, assists: 0, mvp: 0, cleanSheets: 1, yellowCards: 0, redCards: 0, injured: false, docVerified: false, photo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80' },

  // Garuda Futsal Club (t2)
  { id: 'p9', teamId: 't2', name: 'Evan Dimas Putra', number: 8, position: 'Flank', goals: 7, assists: 7, mvp: 2, cleanSheets: 0, yellowCards: 1, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' },
  { id: 'p10', teamId: 't2', name: 'Hendra Wijaya', number: 9, position: 'Pivot', goals: 10, assists: 1, mvp: 3, cleanSheets: 0, yellowCards: 1, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'p11', teamId: 't2', name: 'Syahroni', number: 1, position: 'GK', goals: 0, assists: 1, mvp: 1, cleanSheets: 2, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80' },
  { id: 'p12', teamId: 't2', name: 'Taufik Hidayat', number: 5, position: 'Anchor', goals: 2, assists: 3, mvp: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80' },

  // Bintang Timur Batavia (t3)
  { id: 'p13', teamId: 't3', name: 'Ardiansyah Runtuboy', number: 12, position: 'Flank', goals: 6, assists: 8, mvp: 4, cleanSheets: 0, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80' },
  { id: 'p14', teamId: 't3', name: 'Samuel Eko', number: 10, position: 'Pivot', goals: 5, assists: 2, mvp: 1, cleanSheets: 0, yellowCards: 1, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80' },

  // Rajawali Arena FC (t4)
  { id: 'p15', teamId: 't4', name: 'Bagus Kahfi', number: 17, position: 'Pivot', goals: 4, assists: 2, mvp: 1, cleanSheets: 0, yellowCards: 0, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80' },
  { id: 'p16', teamId: 't4', name: 'Nadeo Argawinata', number: 1, position: 'GK', goals: 0, assists: 0, mvp: 0, cleanSheets: 1, yellowCards: 1, redCards: 0, injured: false, docVerified: true, photo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80' },
];

export const INITIAL_MATCHES = [
  {
    id: 'm1',
    week: 'Pekan 1',
    group: 'Grup A',
    date: '10 Nov 2026',
    time: '19:00 WIB',
    venue: 'GOR Cendrawasih Jakarta',
    homeTeamId: 't1',
    awayTeamId: 't3',
    homeScore: 4,
    awayScore: 2,
    status: 'FT',
    period: 'Full Time',
    events: [
      { id: 'e1', minute: "4'", teamId: 't1', playerName: 'Bayu Permana', type: 'GOAL' },
      { id: 'e2', minute: "11'", teamId: 't3', playerName: 'Ardiansyah Runtuboy', type: 'GOAL' },
      { id: 'e3', minute: "18'", teamId: 't1', playerName: 'Andi Saputra', type: 'GOAL' },
      { id: 'e4', minute: "24'", teamId: 't1', playerName: 'Reza Pahlevi', type: 'YELLOW' },
      { id: 'e5', minute: "29'", teamId: 't3', playerName: 'Samuel Eko', type: 'GOAL' },
      { id: 'e6', minute: "34'", teamId: 't1', playerName: 'Bayu Permana', type: 'GOAL' },
      { id: 'e7', minute: "38'", teamId: 't1', playerName: 'Fikri Haikal', type: 'GOAL' },
    ],
  },
  {
    id: 'm2',
    week: 'Pekan 1',
    group: 'Grup A',
    date: '10 Nov 2026',
    time: '20:30 WIB',
    venue: 'GOR Cendrawasih Jakarta',
    homeTeamId: 't2',
    awayTeamId: 't4',
    homeScore: 5,
    awayScore: 1,
    status: 'FT',
    period: 'Full Time',
    events: [
      { id: 'e8', minute: "3'", teamId: 't2', playerName: 'Hendra Wijaya', type: 'GOAL' },
      { id: 'e9', minute: "9'", teamId: 't2', playerName: 'Evan Dimas Putra', type: 'GOAL' },
      { id: 'e10', minute: "15'", teamId: 't4', playerName: 'Bagus Kahfi', type: 'GOAL' },
      { id: 'e11', minute: "27'", teamId: 't2', playerName: 'Hendra Wijaya', type: 'GOAL' },
      { id: 'e12', minute: "33'", teamId: 't2', playerName: 'Hendra Wijaya', type: 'GOAL' },
      { id: 'e13', minute: "39'", teamId: 't2', playerName: 'Taufik Hidayat', type: 'GOAL' },
    ],
  },
  {
    id: 'm3',
    week: 'Pekan 2',
    group: 'Grup A',
    date: '14 Nov 2026',
    time: '19:00 WIB',
    venue: 'GOR Soemantri Brodjonegoro',
    homeTeamId: 't3',
    awayTeamId: 't2',
    homeScore: 3,
    awayScore: 3,
    status: 'FT',
    period: 'Full Time',
    events: [
      { id: 'e14', minute: "6'", teamId: 't3', playerName: 'Samuel Eko', type: 'GOAL' },
      { id: 'e15', minute: "14'", teamId: 't2', playerName: 'Evan Dimas Putra', type: 'GOAL' },
      { id: 'e16', minute: "22'", teamId: 't3', playerName: 'Ardiansyah Runtuboy', type: 'GOAL' },
      { id: 'e17', minute: "31'", teamId: 't2', playerName: 'Hendra Wijaya', type: 'GOAL' },
      { id: 'e18', minute: "36'", teamId: 't3', playerName: 'Ardiansyah Runtuboy', type: 'GOAL' },
      { id: 'e19', minute: "39'", teamId: 't2', playerName: 'Evan Dimas Putra', type: 'GOAL' },
    ],
  },
  {
    id: 'm4',
    week: 'Pekan 2',
    group: 'Grup A',
    date: '14 Nov 2026',
    time: '20:30 WIB',
    venue: 'GOR Soemantri Brodjonegoro',
    homeTeamId: 't4',
    awayTeamId: 't1',
    homeScore: 1,
    awayScore: 3,
    status: 'FT',
    period: 'Full Time',
    events: [
      { id: 'e20', minute: "7'", teamId: 't1', playerName: 'Bayu Permana', type: 'GOAL' },
      { id: 'e21', minute: "19'", teamId: 't1', playerName: 'Reza Pahlevi', type: 'YELLOW' },
      { id: 'e22', minute: "25'", teamId: 't4', playerName: 'Bagus Kahfi', type: 'GOAL' },
      { id: 'e23', minute: "30'", teamId: 't1', playerName: 'Daffa Alfarizi', type: 'RED' },
      { id: 'e24', minute: "35'", teamId: 't1', playerName: 'Andi Saputra', type: 'GOAL' },
      { id: 'e25', minute: "38'", teamId: 't1', playerName: 'Bayu Permana', type: 'GOAL' },
    ],
  },
  {
    id: 'm5',
    week: 'Pekan 5',
    group: 'Grup A',
    date: '17 Nov 2026',
    time: '19:30 WIB',
    venue: 'GOR Cendrawasih Jakarta',
    homeTeamId: 't1',
    awayTeamId: 't2',
    homeScore: 2,
    awayScore: 2,
    status: 'LIVE',
    period: '2nd Half • 34:12',
    events: [
      { id: 'e26', minute: "5'", teamId: 't1', playerName: 'Bayu Permana', type: 'GOAL' },
      { id: 'e27', minute: "12'", teamId: 't2', playerName: 'Hendra Wijaya', type: 'GOAL' },
      { id: 'e28', minute: "23'", teamId: 't2', playerName: 'Evan Dimas Putra', type: 'GOAL' },
      { id: 'e29', minute: "31'", teamId: 't1', playerName: 'Andi Saputra', type: 'GOAL' },
    ],
  },
  {
    id: 'm6',
    week: 'Pekan 5',
    group: 'Grup A',
    date: '17 Nov 2026',
    time: '21:00 WIB',
    venue: 'GOR Cendrawasih Jakarta',
    homeTeamId: 't3',
    awayTeamId: 't4',
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    period: 'Kick-off 21:00',
    events: [],
  },
];

export const INITIAL_TRANSFERS = [
  { id: 'tr1', playerName: 'Fikri Haikal', fromTeam: 'Rajawali Arena FC', toTeam: 'FC Kembangan United', date: '05 Nov 2026', fee: 'Bebas Transfer', status: 'APPROVED' },
  { id: 'tr2', playerName: 'Taufik Hidayat', fromTeam: 'Bintang Timur Batavia', toTeam: 'Garuda Futsal Club', date: '06 Nov 2026', fee: 'Transfer Resmi', status: 'APPROVED' },
  { id: 'tr3', playerName: 'Raka Aditya', fromTeam: 'Free Agent', toTeam: 'FC Kembangan United', date: '17 Nov 2026', fee: 'Registrasi Tengah Musim', status: 'PENDING' },
];

export const INITIAL_PENDING_REGISTRATIONS = [
  { id: 'reg1', teamName: 'Kebayoran Futsal Academy', category: 'Putra U-21', manager: 'Budi Santoso', phone: '0812-8899-1122', playersCount: 14, date: '17 Nov 2026', status: 'PENDING' },
  { id: 'reg2', teamName: 'Cengkareng Putra FC', category: 'Putra Umum', manager: 'Heri Kurniawan', phone: '0857-1122-3344', playersCount: 15, date: '16 Nov 2026', status: 'PENDING' },
];

export const INITIAL_NEWS = [
  {
    id: 'n1',
    category: 'LAPORAN LAGA',
    title: 'Super Derby Pekan 5: FC Kembangan United & Garuda Futsal Berbagi Angka dalam Duel Sengit',
    date: '17 Nov 2026',
    readTime: '3 mnt baca',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Pertarungan papan atas Grup A berlangsung dramatis di GOR Cendrawasih dengan tensi tinggi sejak peluit babak pertama.',
  },
  {
    id: 'n2',
    category: 'KOMISI DISIPLIN',
    title: 'Daftar Resmi Pemain Terkena Akumulasi Kartu & Auto-Lock Skorsing Pekan Ini',
    date: '16 Nov 2026',
    readTime: '2 mnt baca',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Sistem otomatis mengunci akses line-up bagi pemain dengan 2 kartu kuning atau kartu merah langsung sesuai regulasi liga.',
  },
  {
    id: 'n3',
    category: 'BURSA TRANSFER',
    title: 'Jendela Transfer Tengah Musim Resmi Dibuka Hingga 25 November 2026',
    date: '15 Nov 2026',
    readTime: '2 mnt baca',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80',
    excerpt: 'Manajer tim dapat mengajukan mutasi pemain masuk/keluar langsung melalui Portal Manajer dengan verifikasi e-ID.',
  },
];

export const INITIAL_GALLERY = [
  {
    id: 'g1',
    type: 'VIDEO',
    category: 'HIGHLIGHT LAGA',
    title: 'Official Highlight Pekan 5: FC Kembangan United vs Garuda Futsal (2-2)',
    date: '17 Nov 2026',
    duration: '04:18',
    venue: 'GOR Cendrawasih Jakarta',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    caption: 'Cuplikan seluruh gol, penyelamatan krusial, dan atmosfer panas tribun GOR Cendrawasih.',
  },
  {
    id: 'g2',
    type: 'FOTO',
    category: 'DOKUMENTASI MATCHDAY',
    title: 'Atmosfer Suporter & Koreografi Pembukaan Nusantara Futsal Pro League',
    date: '17 Nov 2026',
    duration: '24 Foto',
    venue: 'GOR Cendrawasih Jakarta',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80',
    caption: 'Ribuan suporter memadati tribun utama untuk mendukung klub kebanggaan masing-masing.',
  },
  {
    id: 'g3',
    type: 'VIDEO',
    category: 'TOP GOALS',
    title: 'Kompilasi 5 Gol Terbaik Pekan 1 & 2 Nusantara Futsal Pro League 2026',
    date: '15 Nov 2026',
    duration: '03:45',
    venue: 'GOR Soemantri Brodjonegoro',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1000&q=80',
    caption: 'Tendangan voli Bayu Permana dan solo run Hendra Wijaya masuk nominasi gol terbaik bulan ini.',
  },
  {
    id: 'g4',
    type: 'FOTO',
    category: 'AKSI LAPANGAN',
    title: 'Duel Ketat Lini Tengah: Bintang Timur Batavia vs Rajawali Arena FC',
    date: '14 Nov 2026',
    duration: '18 Foto',
    venue: 'GOR Soemantri Brodjonegoro',
    image: 'https://images.unsplash.com/photo-1518605368461-1ee7e543666d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pertarungan taktik transisi cepat yang berakhir dengan kemenangan penting di pekan kedua.',
  },
  {
    id: 'g5',
    type: 'FOTO',
    category: 'AKSI LAPANGAN',
    title: 'Momen Selebrasi Gol Penentu Kemenangan FC Kembangan United',
    date: '10 Nov 2026',
    duration: '16 Foto',
    venue: 'GOR Cendrawasih Jakarta',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1000&q=80',
    caption: 'Skuad FC Kembangan United merayakan kemenangan perdana pada laga pembuka musim 2026.',
  },
  {
    id: 'g6',
    type: 'VIDEO',
    category: 'HIGHLIGHT LAGA',
    title: 'Drama 6 Gol: Bintang Timur Batavia vs Garuda Futsal Club (3-3)',
    date: '14 Nov 2026',
    duration: '05:02',
    venue: 'GOR Soemantri Brodjonegoro',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    caption: 'Gol penyeimbang di menit ke-39 memaksa kedua tim berbagi satu poin di papan klasemen.',
  },
];

export const INITIAL_SPONSORS = [
  { id: 'sp1', name: 'SPECS FUTSAL', logoUrl: '', accent: 'emerald' },
  { id: 'sp2', name: 'BANK DKI', logoUrl: '', accent: 'amber' },
  { id: 'sp3', name: 'MILLS SPORT', logoUrl: '', accent: 'none' },
  { id: 'sp4', name: 'POCARI SWEAT', logoUrl: '', accent: 'none' },
];

const STORAGE_KEY = 'nfpl_league_data_v1';
const AUTH_KEY = 'nfpl_auth_user_v1';

const getDefaultLeagueState = () => ({
  teams: INITIAL_TEAMS,
  players: INITIAL_PLAYERS,
  matches: INITIAL_MATCHES,
  transfers: INITIAL_TRANSFERS,
  pendingRegs: INITIAL_PENDING_REGISTRATIONS,
  transferWindowOpen: true,
  news: INITIAL_NEWS,
  gallery: INITIAL_GALLERY,
  sponsors: INITIAL_SPONSORS,
  lineups: {
    t1: ['p1', 'p2', 'p3', 'p7'],
    t2: ['p9', 'p10', 'p11', 'p12'],
    t3: ['p13', 'p14'],
    t4: ['p15', 'p16'],
  },
  sponsorStats: { impressions: 18450, clicks: 1284 },
});

const LeagueContext = createContext(null);

export function LeagueProvider({ children }) {
  const [leagueState, setLeagueState] = useState(getDefaultLeagueState);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load dari localStorage saat pertama mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setLeagueState((prev) => ({
          ...prev,
          ...parsed,
          sponsors: Array.isArray(parsed.sponsors) ? parsed.sponsors : prev.sponsors,
        }));
      }
      const savedUser = localStorage.getItem(AUTH_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Gagal membaca state lokal:', err);
    }
    setIsHydrated(true);
  }, []);

  // Sinkronisasi Real-Time antar Tab Browser (misal Tab 1: Halaman User, Tab 2: Admin/Manager)
  useEffect(() => {
    const handleStorageSync = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setLeagueState((prev) => ({
            ...prev,
            ...parsed,
            sponsors: Array.isArray(parsed.sponsors) ? parsed.sponsors : prev.sponsors,
          }));
        } catch {}
      }
      if (e.key === AUTH_KEY) {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  // Helper update state sekaligus simpan ke localStorage
  const updateLeague = (updater) => {
    setLeagueState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Auth Actions
  const loginWithCredentials = (email, password) => {
    const found = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );
    if (!found) {
      return { success: false, message: 'Email atau kata sandi tidak sesuai.' };
    }
    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      teamId: found.teamId || null,
      title: found.title,
    };
    setCurrentUser(sessionUser);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
    } catch {}
    return { success: true, user: sessionUser };
  };

  const loginAsAccount = (account) => {
    const sessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      teamId: account.teamId || null,
      title: account.title,
    };
    setCurrentUser(sessionUser);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
    } catch {}
    return sessionUser;
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  };

  const resetAllData = () => {
    const fresh = getDefaultLeagueState();
    setLeagueState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {}
  };

  // Auto-Lock Status Helper
  const getPlayerLockStatus = (player) => {
    if (player.redCards >= 1) {
      return { locked: true, reason: 'SKORSING KARTU MERAH', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40' };
    }
    if (player.yellowCards >= 2) {
      return { locked: true, reason: 'AKUMULASI 2 KUNING', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
    if (player.injured) {
      return { locked: true, reason: 'CEDERA (MEDIS)', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
    }
    if (!player.docVerified) {
      return { locked: true, reason: 'BERKAS BELUM SAH', badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
    return { locked: false, reason: 'SIAP BERMAIN', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  };

  // Klasemen Otomatis Real-Time
  const standings = useMemo(() => {
    const table = {};
    leagueState.teams.forEach((t) => {
      table[t.id] = { ...t, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] };
    });

    leagueState.matches.forEach((m) => {
      if (m.status === 'FT' || m.status === 'LIVE' || m.status === 'HT') {
        const home = table[m.homeTeamId];
        const away = table[m.awayTeamId];
        if (!home || !away) return;

        home.mp += 1;
        away.mp += 1;
        home.gf += m.homeScore;
        home.ga += m.awayScore;
        away.gf += m.awayScore;
        away.ga += m.homeScore;

        if (m.homeScore > m.awayScore) {
          home.w += 1;
          home.pts += 3;
          home.form.push('W');
          away.l += 1;
          away.form.push('L');
        } else if (m.homeScore < m.awayScore) {
          away.w += 1;
          away.pts += 3;
          away.form.push('W');
          home.l += 1;
          home.form.push('L');
        } else {
          home.d += 1;
          home.pts += 1;
          home.form.push('D');
          away.d += 1;
          away.pts += 1;
          away.form.push('D');
        }
      }
    });

    return Object.values(table)
      .map((row) => ({ ...row, gd: row.gf - row.ga }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }, [leagueState.teams, leagueState.matches]);

  // ============================================================================
  // MUTASI DATA DARI ADMIN & MANAGER YANG MENGUBAH HALAMAN USER
  // ============================================================================
  const recordMatchEvent = (matchId, teamSide, eventType, specificPlayerId = '') => {
    let feedback = '';
    updateLeague((prev) => {
      const targetMatch = prev.matches.find((m) => m.id === matchId);
      if (!targetMatch) return prev;
      const targetTeamId = teamSide === 'HOME' ? targetMatch.homeTeamId : targetMatch.awayTeamId;
      const targetTeam = prev.teams.find((t) => t.id === targetTeamId);
      const teamPlayers = prev.players.filter((p) => p.teamId === targetTeamId);
      const chosenPlayer =
        teamPlayers.find((p) => p.id === specificPlayerId) ||
        teamPlayers.find((p) => !getPlayerLockStatus(p).locked) ||
        teamPlayers[0];

      const minuteMark = `${Math.floor(Math.random() * 19) + 21}'`;

      const updatedMatches = prev.matches.map((m) => {
        if (m.id !== matchId) return m;
        const newHomeScore = teamSide === 'HOME' && eventType === 'GOAL' ? m.homeScore + 1 : m.homeScore;
        const newAwayScore = teamSide === 'AWAY' && eventType === 'GOAL' ? m.awayScore + 1 : m.awayScore;
        const newEvent = {
          id: `ev-${Date.now()}`,
          minute: minuteMark,
          teamId: targetTeamId,
          playerName: chosenPlayer ? chosenPlayer.name : `Pemain ${targetTeam?.shortName}`,
          type: eventType,
        };
        return {
          ...m,
          status: m.status === 'SCHEDULED' ? 'LIVE' : m.status,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          events: [...m.events, newEvent],
        };
      });

      const updatedPlayers = prev.players.map((p) => {
        if (!chosenPlayer || p.id !== chosenPlayer.id) return p;
        if (eventType === 'GOAL') return { ...p, goals: p.goals + 1 };
        if (eventType === 'YELLOW') return { ...p, yellowCards: p.yellowCards + 1 };
        if (eventType === 'RED') return { ...p, redCards: p.redCards + 1 };
        return p;
      });

      const updatedLineups = { ...prev.lineups };
      if (
        chosenPlayer &&
        (eventType === 'RED' || (eventType === 'YELLOW' && chosenPlayer.yellowCards + 1 >= 2))
      ) {
        updatedLineups[targetTeamId] = (updatedLineups[targetTeamId] || []).filter(
          (id) => id !== chosenPlayer.id
        );
      }

      const labelMap = {
        GOAL: `GOL! ${targetTeam?.shortName} (${chosenPlayer?.name || 'Pemain'})`,
        YELLOW: `KARTU KUNING: ${chosenPlayer?.name || targetTeam?.shortName}`,
        RED: `KARTU MERAH & AUTO-LOCK: ${chosenPlayer?.name || targetTeam?.shortName}`,
      };
      feedback = labelMap[eventType];

      return {
        ...prev,
        matches: updatedMatches,
        players: updatedPlayers,
        lineups: updatedLineups,
      };
    });
    return feedback;
  };

  const updateMatchPeriod = (matchId, newStatus, newPeriodLabel) => {
    updateLeague((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId ? { ...m, status: newStatus, period: newPeriodLabel } : m
      ),
    }));
  };

  const addNewMatch = ({ week, date, time, venue, homeTeamId, awayTeamId }) => {
    updateLeague((prev) => ({
      ...prev,
      matches: [
        ...prev.matches,
        {
          id: `m-${Date.now()}`,
          week,
          group: 'Grup A',
          date,
          time,
          venue,
          homeTeamId,
          awayTeamId,
          homeScore: 0,
          awayScore: 0,
          status: 'SCHEDULED',
          period: `Kick-off ${time}`,
          events: [],
        },
      ],
    }));
  };

  const submitTeamRegistration = (regData) => {
    updateLeague((prev) => ({
      ...prev,
      pendingRegs: [
        {
          id: `reg-${Date.now()}`,
          teamName: regData.teamName,
          category: regData.category,
          manager: regData.manager,
          phone: regData.phone || '0812-0000-0000',
          playersCount: 12,
          date: '17 Nov 2026',
          status: 'PENDING',
        },
        ...prev.pendingRegs,
      ],
    }));
  };

  const approveTeamRegistration = (regId) => {
    updateLeague((prev) => {
      const targetReg = prev.pendingRegs.find((r) => r.id === regId);
      if (!targetReg || targetReg.status === 'VERIFIED') return prev;

      const shortCode = targetReg.teamName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);

      const newTeamId = `t-${Date.now()}`;
      const newTeam = {
        id: newTeamId,
        name: targetReg.teamName,
        shortName: shortCode || 'NEW',
        group: 'Grup A',
        city: 'Jakarta',
        coach: targetReg.manager,
        logoBg: 'from-purple-500 to-indigo-700',
        verified: true,
        founded: 2026,
      };

      const defaultPlayer = {
        id: `p-${Date.now()}`,
        teamId: newTeamId,
        name: `Kapten ${shortCode}`,
        number: 10,
        position: 'Flank',
        goals: 0,
        assists: 0,
        mvp: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        injured: false,
        docVerified: true,
        photo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80',
      };

      return {
        ...prev,
        pendingRegs: prev.pendingRegs.map((r) => (r.id === regId ? { ...r, status: 'VERIFIED' } : r)),
        teams: [...prev.teams, newTeam],
        players: [...prev.players, defaultPlayer],
      };
    });
  };

  const toggleTransferWindow = () => {
    updateLeague((prev) => ({
      ...prev,
      transferWindowOpen: !prev.transferWindowOpen,
    }));
  };

  const requestPlayerTransfer = ({ playerName, fromTeam, toTeam, fee }) => {
    updateLeague((prev) => ({
      ...prev,
      transfers: [
        {
          id: `tr-${Date.now()}`,
          playerName,
          fromTeam: fromTeam || 'Free Agent',
          toTeam,
          date: '17 Nov 2026',
          fee: fee || 'Transfer Resmi',
          status: 'PENDING',
        },
        ...prev.transfers,
      ],
    }));
  };

  const approvePlayerTransfer = (trId) => {
    updateLeague((prev) => ({
      ...prev,
      transfers: prev.transfers.map((t) => (t.id === trId ? { ...t, status: 'APPROVED' } : t)),
    }));
  };

  const saveTeamLineup = (teamId, playerIds) => {
    updateLeague((prev) => ({
      ...prev,
      lineups: {
        ...prev.lineups,
        [teamId]: playerIds,
      },
    }));
  };

  const togglePlayerInjury = (playerId) => {
    updateLeague((prev) => {
      const target = prev.players.find((p) => p.id === playerId);
      if (!target) return prev;
      const nextInjured = !target.injured;
      const updatedLineups = { ...prev.lineups };
      if (nextInjured && updatedLineups[target.teamId]) {
        updatedLineups[target.teamId] = updatedLineups[target.teamId].filter((id) => id !== playerId);
      }
      return {
        ...prev,
        players: prev.players.map((p) => (p.id === playerId ? { ...p, injured: nextInjured } : p)),
        lineups: updatedLineups,
      };
    });
  };

  const verifyPlayerDoc = (playerId) => {
    updateLeague((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === playerId ? { ...p, docVerified: true } : p)),
    }));
  };

  const addPlayerToSquad = ({ teamId, name, number, position }) => {
    updateLeague((prev) => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: `p-${Date.now()}`,
          teamId,
          name,
          number: Number(number) || 99,
          position: position || 'Flank',
          goals: 0,
          assists: 0,
          mvp: 0,
          cleanSheets: 0,
          yellowCards: 0,
          redCards: 0,
          injured: false,
          docVerified: true,
          photo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
        },
      ],
    }));
  };

  const addNewsArticle = ({ category, title, excerpt }) => {
    updateLeague((prev) => ({
      ...prev,
      news: [
        {
          id: `n-${Date.now()}`,
          category: category || 'PENGUMUMAN LIGA',
          title,
          date: '17 Nov 2026',
          readTime: '2 mnt baca',
          image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80',
          excerpt,
        },
        ...prev.news,
      ],
    }));
  };

  const addGalleryItem = ({ type, category, title, venue, caption }) => {
    updateLeague((prev) => ({
      ...prev,
      gallery: [
        {
          id: `g-${Date.now()}`,
          type: type || 'FOTO',
          category: category || 'DOKUMENTASI MATCHDAY',
          title,
          date: '17 Nov 2026',
          duration: type === 'VIDEO' ? '03:20' : '15 Foto',
          venue: venue || 'GOR Cendrawasih Jakarta',
          image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
          caption,
        },
        ...prev.gallery,
      ],
    }));
  };

  // Kelola Sponsor Beranda (Upload & Hapus Logo)
  const addSponsor = ({ name, logoUrl }) => {
    updateLeague((prev) => ({
      ...prev,
      sponsors: [
        ...(prev.sponsors || []),
        {
          id: `sp-${Date.now()}`,
          name: (name || '').trim().toUpperCase(),
          logoUrl: logoUrl || '',
          accent: 'none',
        },
      ],
    }));
  };

  const removeSponsor = (id) => {
    updateLeague((prev) => ({
      ...prev,
      sponsors: (prev.sponsors || []).filter((s) => s.id !== id),
    }));
  };

  const incrementSponsorImpression = () => {
    updateLeague((prev) => ({
      ...prev,
      sponsorStats: { ...prev.sponsorStats, impressions: prev.sponsorStats.impressions + 1 },
    }));
  };

  const incrementSponsorClick = () => {
    updateLeague((prev) => ({
      ...prev,
      sponsorStats: { ...prev.sponsorStats, clicks: prev.sponsorStats.clicks + 1 },
    }));
  };

  return (
    <LeagueContext.Provider
      value={{
        ...leagueState,
        standings,
        currentUser,
        isHydrated,
        loginWithCredentials,
        loginAsAccount,
        logout,
        resetAllData,
        getPlayerLockStatus,
        recordMatchEvent,
        updateMatchPeriod,
        addNewMatch,
        submitTeamRegistration,
        approveTeamRegistration,
        toggleTransferWindow,
        requestPlayerTransfer,
        approvePlayerTransfer,
        saveTeamLineup,
        togglePlayerInjury,
        verifyPlayerDoc,
        addPlayerToSquad,
        addNewsArticle,
        addGalleryItem,
        addSponsor,
        removeSponsor,
        incrementSponsorImpression,
        incrementSponsorClick,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (!ctx) {
    throw new Error('useLeague harus digunakan di dalam <LeagueProvider>');
  }
  return ctx;
}