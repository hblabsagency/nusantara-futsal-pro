// @ts-nocheck
"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Download, LogOut, ExternalLink,
  Plus, RefreshCw, Newspaper, Image as ImageIcon,
  Lock, LogIn, CheckCircle2, Calendar, Upload, Trash2,
  Award, Crop, ZoomIn, ZoomOut, RotateCcw, Move, X, Check, Pencil
} from 'lucide-react';
import { useLeague } from '../../context/LeagueContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    teams,
    players,
    matches,
    transfers,
    pendingRegs,
    transferWindowOpen,
    standings,
    sponsors = [],
    currentUser,
    isHydrated,
    logout,
    resetAllData,
    recordMatchEvent,
    updateMatchPeriod,
    addNewMatch,
    approveTeamRegistration,
    toggleTransferWindow,
    approvePlayerTransfer,
    addNewsArticle,
    addGalleryItem,
    addSponsor,
    updateSponsor,
    removeSponsor,
  } = useLeague();

  const [adminSubTab, setAdminSubTab] = useState('MEJA_LAGA'); // 'MEJA_LAGA' | 'VERIFIKASI' | 'KONTEN' | 'AUTO_GRAPHICS'
  const [toastMessage, setToastMessage] = useState(null);

  // Meja Pertandingan State
  const [activeMatchId, setActiveMatchId] = useState('m5');
  const [selectedScorerId, setSelectedScorerId] = useState('');

  // Form Tambah Jadwal Baru
  const [newMatchForm, setNewMatchForm] = useState({
    week: 'Pekan 6',
    date: '21 Nov 2026',
    time: '19:30 WIB',
    venue: 'GOR Cendrawasih Jakarta',
    homeTeamId: 't1',
    awayTeamId: 't4',
  });

  // Form Berita & Galeri Baru
  const [newsForm, setNewsForm] = useState({ category: 'PENGUMUMAN LIGA', title: '', excerpt: '' });
  const [galleryForm, setGalleryForm] = useState({
    type: 'FOTO',
    category: 'DOKUMENTASI MATCHDAY',
    title: '',
    venue: 'GOR Cendrawasih Jakarta',
    caption: '',
  });

  // Form & State Cropper Logo Sponsor (Tambah & Edit)
  const [sponsorForm, setSponsorForm] = useState({ name: '', logoUrl: '' });
  const [editingSponsorId, setEditingSponsorId] = useState(null);
  const [rawSponsorImg, setRawSponsorImg] = useState(null); // { src, width, height }
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropBoxRef = useRef(null);
  const cropImgRef = useRef(null);

  // Auto-Graphics State
  const [graphicsMatchId, setGraphicsMatchId] = useState('m5');
  const [graphicsTemplate, setGraphicsTemplate] = useState('FULLTIME');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Buka Modal Crop saat file dipilih
  const handleSponsorFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const img = new window.Image();
      img.onload = () => {
        setRawSponsorImg({
          src: dataUrl,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setSponsorForm((prev) => ({
          ...prev,
          name:
            prev.name ||
            file.name
              .replace(/\.[^/.]+$/, '')
              .replace(/[-_]/g, ' ')
              .toUpperCase(),
        }));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Pointer Drag Handler untuk Area Crop
  const handleCropPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingCrop(true);
    setDragStart({
      x: e.clientX - cropOffset.x,
      y: e.clientY - cropOffset.y,
    });
  };

  const handleCropPointerMove = (e) => {
    if (!isDraggingCrop) return;
    setCropOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleCropPointerUp = (e) => {
    if (!isDraggingCrop) return;
    setIsDraggingCrop(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const fitSponsorToWidth = () => {
    setCropZoom(1);
    setCropOffset({ x: 0, y: 0 });
  };

  const fitSponsorToHeight = () => {
    if (!rawSponsorImg || !cropBoxRef.current) return;
    const boxRect = cropBoxRef.current.getBoundingClientRect();
    const imgAspect = rawSponsorImg.width / rawSponsorImg.height;
    const boxAspect = boxRect.width / boxRect.height;
    const fitZoom = Math.max(0.3, Math.min(3, imgAspect / boxAspect));
    setCropZoom(Number(fitZoom.toFixed(2)));
    setCropOffset({ x: 0, y: 0 });
  };

  // Render Hasil Crop ke Canvas (450x150, Rasio 3:1 Presisi)
  const applySponsorCrop = () => {
    if (!rawSponsorImg || !cropBoxRef.current || !cropImgRef.current) return;

    const OUT_W = 450;
    const OUT_H = 150;
    const boxRect = cropBoxRef.current.getBoundingClientRect();
    const ratio = OUT_W / boxRect.width;

    const baseW = boxRect.width;
    const baseH = boxRect.width * (rawSponsorImg.height / rawSponsorImg.width);

    const drawW = baseW * cropZoom * ratio;
    const drawH = baseH * cropZoom * ratio;
    const drawX = OUT_W / 2 - drawW / 2 + cropOffset.x * ratio;
    const drawY = OUT_H / 2 - drawH / 2 + cropOffset.y * ratio;

    const canvas = document.createElement('canvas');
    canvas.width = OUT_W;
    canvas.height = OUT_H;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, OUT_W, OUT_H);
      ctx.drawImage(cropImgRef.current, drawX, drawY, drawW, drawH);
      const croppedDataUrl = canvas.toDataURL('image/png');
      setSponsorForm((prev) => ({ ...prev, logoUrl: croppedDataUrl }));
    }

    setRawSponsorImg(null);
    triggerToast('Area crop logo sponsor berhasil diterapkan!');
  };

  const startEditSponsor = (sp) => {
    setEditingSponsorId(sp.id);
    setSponsorForm({ name: sp.name || '', logoUrl: sp.logoUrl || '' });
  };

  const cancelEditSponsor = () => {
    setEditingSponsorId(null);
    setSponsorForm({ name: '', logoUrl: '' });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0D151B] flex items-center justify-center text-sm text-slate-400">
        Memuat Panel Admin...
      </div>
    );
  }

  // Guard Autentikasi Client-Side
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#0D151B] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-[#131F28] border border-slate-800 p-7 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white">Akses Terbatas — Panel Admin</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Silakan login menggunakan akun <strong className="text-[#14B866]">Admin Liga</strong> terlebih dahulu untuk mengendalikan skor pertandingan, klasemen, dan konten publik.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Link
              href="/login"
              className="flex-1 py-3 px-4 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Ke Halaman Login</span>
            </Link>
            <Link
              href="/beranda"
              className="flex-1 py-3 px-4 rounded-xl bg-[#0D151B] border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center"
            >
              Halaman Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  const homeTeam = teams.find((t) => t.id === activeMatch.homeTeamId);
  const awayTeam = teams.find((t) => t.id === activeMatch.awayTeamId);

  return (
    <div className="min-h-screen bg-[#0D151B] text-slate-100 pb-12">
      {/* Header Admin */}
      <header className="sticky top-0 z-40 bg-[#131F28]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B866]/20 border border-[#14B866]/40 text-[#14B866] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#14B866]">
                {currentUser.title} • SINKRON KE HALAMAN USER
              </div>
              <h1 className="text-base sm:text-lg font-black text-white">Panel Admin &amp; Meja Pertandingan</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/beranda"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Hasil di Beranda</span>
            </Link>
            <button
              onClick={() => {
                resetAllData();
                triggerToast('Seluruh data liga di-reset ke kondisi awal!');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 font-bold text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-4 z-50 max-w-sm animate-bounce">
          <div className="bg-[#131F28] border border-[#14B866] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#14B866] shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL CROP INTERAKTIF LOGO SPONSOR (RASIO 3:1 BERANDA)
         ==================================================================== */}
      {rawSponsorImg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#131F28] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crop className="w-4 h-4 text-[#14B866]" />
                <h3 className="font-black text-sm text-white uppercase tracking-wide">
                  Atur Crop Logo Sponsor (Rasio 3:1)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRawSponsorImg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#14B866] shrink-0" />
                <span>Geser gambar di dalam bingkai hijau dan atur zoom agar pas dengan slot Beranda.</span>
              </p>

              <div className="p-4 rounded-xl bg-[#080E13] border border-slate-800 flex flex-col items-center justify-center">
                <div
                  ref={cropBoxRef}
                  onPointerDown={handleCropPointerDown}
                  onPointerMove={handleCropPointerMove}
                  onPointerUp={handleCropPointerUp}
                  onPointerCancel={handleCropPointerUp}
                  className="relative w-full max-w-[360px] aspect-[3/1] rounded-lg overflow-hidden border-2 border-[#14B866] shadow-[0_0_25px_rgba(20,184,102,0.25)] cursor-grab active:cursor-grabbing touch-none select-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #16222c 25%, transparent 25%), linear-gradient(-45deg, #16222c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #16222c 75%), linear-gradient(-45deg, transparent 75%, #16222c 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                  }}
                >
                  <img
                    ref={cropImgRef}
                    src={rawSponsorImg.src}
                    alt="Crop Preview"
                    draggable={false}
                    className="absolute left-1/2 top-1/2 w-full h-auto max-w-none pointer-events-none select-none"
                    style={{
                      transform: `translate(calc(-50% + ${cropOffset.x}px), calc(-50% + ${cropOffset.y}px)) scale(${cropZoom})`,
                      transformOrigin: 'center center',
                    }}
                  />

                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-35">
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2">
                  Ukuran Output: 450 × 150 px (Sesuai Slot Marquee Beranda)
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Zoom Gambar</span>
                  <span className="text-[#14B866] font-mono">{Math.round(cropZoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCropZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))))}
                    className="p-2 rounded-lg bg-[#0D151B] border border-slate-700 text-slate-300 hover:border-[#14B866]"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min={0.3}
                    max={3}
                    step={0.02}
                    value={cropZoom}
                    onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[#14B866] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setCropZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
                    className="p-2 rounded-lg bg-[#0D151B] border border-slate-700 text-slate-300 hover:border-[#14B866]"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={fitSponsorToWidth}
                  className="px-3 py-1.5 rounded-lg bg-[#0D151B] border border-slate-700 hover:border-[#14B866] text-[11px] font-bold text-slate-300"
                >
                  Pas Lebar
                </button>
                <button
                  type="button"
                  onClick={fitSponsorToHeight}
                  className="px-3 py-1.5 rounded-lg bg-[#0D151B] border border-slate-700 hover:border-[#14B866] text-[11px] font-bold text-slate-300"
                >
                  Pas Tinggi (Logo Kotak)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropZoom(1);
                    setCropOffset({ x: 0, y: 0 });
                  }}
                  className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0D151B] border border-slate-700 hover:border-amber-400 text-[11px] font-bold text-amber-400"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[#0D151B] border-t border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRawSponsorImg(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={applySponsorCrop}
                className="px-5 py-2 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan Crop</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 space-y-6">
        {/* Sub-Tabs */}
        <div className="flex p-1.5 rounded-2xl bg-[#131F28] border border-slate-800 text-xs font-bold overflow-x-auto gap-1">
          <button
            onClick={() => setAdminSubTab('MEJA_LAGA')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              adminSubTab === 'MEJA_LAGA' ? 'bg-[#14B866] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Meja Pertandingan &amp; Jadwal
          </button>
          <button
            onClick={() => setAdminSubTab('VERIFIKASI')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              adminSubTab === 'VERIFIKASI' ? 'bg-[#14B866] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✓ Verifikasi Tim &amp; Transfer ({pendingRegs.filter((r) => r.status === 'PENDING').length + transfers.filter((t) => t.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setAdminSubTab('KONTEN')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              adminSubTab === 'KONTEN' ? 'bg-[#14B866] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            📰 Berita, Galeri &amp; Logo Sponsor
          </button>
          <button
            onClick={() => setAdminSubTab('AUTO_GRAPHICS')}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              adminSubTab === 'AUTO_GRAPHICS' ? 'bg-[#14B866] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎨 Auto-Graphics Story
          </button>
        </div>

        {/* ================================================================
            TAB 1: MEJA PERTANDINGAN & TAMBAH JADWAL
           ================================================================ */}
        {adminSubTab === 'MEJA_LAGA' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Pilih Pertandingan Aktif (Ubah Skor di Halaman Utama):</label>
                <select
                  value={activeMatchId}
                  onChange={(e) => setActiveMatchId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm font-bold text-white outline-none"
                >
                  {matches.map((m) => {
                    const h = teams.find((t) => t.id === m.homeTeamId);
                    const a = teams.find((t) => t.id === m.awayTeamId);
                    return (
                      <option key={m.id} value={m.id}>
                        [{m.status}] {h?.name} vs {a?.name} ({m.week})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Kontrol Babak Pertandingan:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { st: 'LIVE', label: '1st Half', desc: '1st Half • 12:00' },
                    { st: 'HT', label: 'Half Time', desc: 'Half Time (HT)' },
                    { st: 'LIVE', label: '2nd Half', desc: '2nd Half • 34:12' },
                    { st: 'FT', label: 'Full Time', desc: 'Full Time (FT)' },
                  ].map((b, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        updateMatchPeriod(activeMatch.id, b.st, b.desc);
                        triggerToast(`Status laga diperbarui ke: ${b.desc}`);
                      }}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-black ${
                        activeMatch.period === b.desc
                          ? 'bg-[#14B866] text-slate-950 border-[#14B866]'
                          : 'bg-[#0D151B] border-slate-700 text-slate-300 hover:border-[#14B866]'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Tim Tuan Rumah */}
              <div className="rounded-2xl bg-[#131F28] border-2 border-[#14B866]/50 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${homeTeam?.logoBg} text-white font-black flex items-center justify-center`}>
                      {homeTeam?.shortName}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#14B866]">TIM TUAN RUMAH</span>
                      <h2 className="text-lg font-black text-white">{homeTeam?.name}</h2>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-[#14B866]">{activeMatch.homeScore}</div>
                </div>

                <select
                  value={selectedScorerId}
                  onChange={(e) => setSelectedScorerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs font-bold text-white outline-none mb-4"
                >
                  <option value="">-- Otomatis Pemain Aktif {homeTeam?.shortName} --</option>
                  {players
                    .filter((p) => p.teamId === homeTeam?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.number} {p.name} ({p.yellowCards}K / {p.redCards}M)
                      </option>
                    ))}
                </select>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const msg = recordMatchEvent(activeMatch.id, 'HOME', 'GOAL', selectedScorerId);
                      triggerToast(`Tersimpan ke Halaman User: ${msg}`);
                    }}
                    className="py-5 px-3 rounded-xl bg-[#14B866] hover:bg-[#10B981] active:scale-95 text-slate-950 font-black text-base shadow-lg flex flex-col items-center gap-1"
                  >
                    <span>⚽ +1 GOL</span>
                    <span className="text-[11px] font-bold">{homeTeam?.shortName}</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = recordMatchEvent(activeMatch.id, 'HOME', 'YELLOW', selectedScorerId);
                      triggerToast(`Tersimpan: ${msg}`);
                    }}
                    className="py-5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base shadow-lg flex flex-col items-center gap-1"
                  >
                    <span>🟨 KUNING</span>
                    <span className="text-[11px] font-bold">Peringatan</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = recordMatchEvent(activeMatch.id, 'HOME', 'RED', selectedScorerId);
                      triggerToast(`Tersimpan: ${msg}`);
                    }}
                    className="py-5 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-base shadow-lg flex flex-col items-center gap-1"
                  >
                    <span>🟥 MERAH</span>
                    <span className="text-[11px] font-bold">Auto-Lock</span>
                  </button>
                </div>
              </div>

              {/* Tim Tamu */}
              <div className="rounded-2xl bg-[#131F28] border-2 border-amber-500/40 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${awayTeam?.logoBg} text-white font-black flex items-center justify-center`}>
                      {awayTeam?.shortName}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400">TIM TAMU</span>
                      <h2 className="text-lg font-black text-white">{awayTeam?.name}</h2>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-amber-400">{activeMatch.awayScore}</div>
                </div>

                <select
                  value={selectedScorerId}
                  onChange={(e) => setSelectedScorerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs font-bold text-white outline-none mb-4"
                >
                  <option value="">-- Otomatis Pemain Aktif {awayTeam?.shortName} --</option>
                  {players
                    .filter((p) => p.teamId === awayTeam?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        #{p.number} {p.name} ({p.yellowCards}K / {p.redCards}M)
                      </option>
                    ))}
                </select>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const msg = recordMatchEvent(activeMatch.id, 'AWAY', 'GOAL', selectedScorerId);
                      triggerToast(`Tersimpan ke Halaman User: ${msg}`);
                    }}
                    className="py-5 px-3 rounded-xl bg-[#14B866] hover:bg-[#10B981] active:scale-95 text-slate-950 font-black text-base shadow-lg flex flex-col items-center gap-1"
                  >
                    <span>⚽ +1 GOL</span>
                    <span className="text-[11px] font-bold">{awayTeam?.shortName}</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = recordMatchEvent(activeMatch.id, 'AWAY', 'YELLOW', selectedScorerId);
                      triggerToast(`Tersimpan: ${msg}`);
                    }}
                    className="py-5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base shadow-lg flex flex-col items-center gap-1"
                  >
                    <span>🟨 KUNING</span>
                    <span className="text-[11px] font-bold">Peringatan</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = recordMatchEvent(activeMatch.id, 'AWAY', 'RED', selectedScorerId);
                      triggerToast(`Tersimpan: ${msg}`);
                    }}
                    className="py-5 px-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-base shadow-lg flex flex-col items-center gap-1"
                  >
                    <span>🟥 MERAH</span>
                    <span className="text-[11px] font-bold">Auto-Lock</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Buat Jadwal Pertandingan Baru */}
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6">
              <h3 className="font-black text-base text-white flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[#14B866]" />
                <span>Tambah Jadwal Pertandingan Baru (Tampil di Menu Jadwal Publik)</span>
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newMatchForm.homeTeamId === newMatchForm.awayTeamId) {
                    triggerToast('Tim tuan rumah dan tamu tidak boleh sama!');
                    return;
                  }
                  addNewMatch(newMatchForm);
                  triggerToast('Jadwal pertandingan baru berhasil ditambahkan ke halaman publik!');
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
              >
                <input
                  type="text"
                  value={newMatchForm.week}
                  onChange={(e) => setNewMatchForm({ ...newMatchForm, week: e.target.value })}
                  placeholder="Pekan 6"
                  className="px-3 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                />
                <input
                  type="text"
                  value={newMatchForm.date}
                  onChange={(e) => setNewMatchForm({ ...newMatchForm, date: e.target.value })}
                  placeholder="21 Nov 2026"
                  className="px-3 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                />
                <select
                  value={newMatchForm.homeTeamId}
                  onChange={(e) => setNewMatchForm({ ...newMatchForm, homeTeamId: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      Home: {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={newMatchForm.awayTeamId}
                  onChange={(e) => setNewMatchForm({ ...newMatchForm, awayTeamId: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      Away: {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={newMatchForm.venue}
                  onChange={(e) => setNewMatchForm({ ...newMatchForm, venue: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                >
                  <option>GOR Cendrawasih Jakarta</option>
                  <option>GOR Soemantri Brodjonegoro</option>
                </select>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Jadwal</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 2: VERIFIKASI TIM BARU & TRANSFER
           ================================================================ */}
        {adminSubTab === 'VERIFIKASI' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
              <h2 className="font-black text-lg text-white mb-1">Antrean Verifikasi Tim Baru</h2>
              <p className="text-xs text-slate-400 mb-4">
                Mengesahkan tim akan otomatis menambahkan klub ke Klasemen &amp; Direktori Tim Publik.
              </p>
              <div className="space-y-3">
                {pendingRegs.map((reg) => (
                  <div key={reg.id} className="p-4 rounded-xl bg-[#0D151B] border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-black text-base text-white">{reg.teamName}</h3>
                        <p className="text-xs text-slate-400">
                          Manajer: {reg.manager} • {reg.category}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          reg.status === 'VERIFIED' ? 'bg-[#14B866]/20 text-[#14B866]' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                    {reg.status === 'PENDING' && (
                      <button
                        onClick={() => {
                          approveTeamRegistration(reg.id);
                          triggerToast(`Tim ${reg.teamName} resmi disahkan & tampil di Halaman Publik!`);
                        }}
                        className="w-full py-2.5 mt-2 rounded-lg bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs"
                      >
                        ✓ Sahkan Tim &amp; Masukkan ke Liga
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-lg text-white">Pengesahan Transfer Pemain</h2>
                <button
                  onClick={() => {
                    toggleTransferWindow();
                    triggerToast(`Transfer Window diubah menjadi: ${!transferWindowOpen ? 'BUKA' : 'TUTUP'}`);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black ${
                    transferWindowOpen ? 'bg-[#14B866] text-slate-950' : 'bg-rose-600 text-white'
                  }`}
                >
                  {transferWindowOpen ? 'Window: BUKA' : 'Window: TUTUP'}
                </button>
              </div>
              <div className="space-y-3">
                {transfers.map((tr) => (
                  <div key={tr.id} className="p-4 rounded-xl bg-[#0D151B] border border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-white">{tr.playerName}</div>
                      <div className="text-xs text-slate-400">
                        {tr.fromTeam} → <strong className="text-[#14B866]">{tr.toTeam}</strong>
                      </div>
                    </div>
                    {tr.status === 'PENDING' ? (
                      <button
                        onClick={() => {
                          approvePlayerTransfer(tr.id);
                          triggerToast(`Transfer ${tr.playerName} resmi disahkan!`);
                        }}
                        className="px-3 py-2 rounded-lg bg-[#14B866] text-slate-950 font-black text-xs"
                      >
                        ✓ Sahkan
                      </button>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#14B866]/20 text-[#14B866]">✓ SAH</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 3: KELOLA BERITA, GALERI & LOGO SPONSOR BERANDA
           ================================================================ */}
        {adminSubTab === 'KONTEN' && (
          <div className="space-y-6">
            {/* Kelola Logo Sponsor Dinamis */}
            <div className="rounded-2xl bg-[#131F28] border border-[#14B866]/40 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-black text-lg text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#14B866]" />
                    <span>Kelola Logo Sponsor </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload, crop, ubah, atau hapus logo sponsor. Seluruh logo di bawah langsung tayang berjalan di <strong className="text-emerald-400">/beranda</strong>.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#14B866]/15 text-[#14B866] text-xs font-black">
                  {sponsors.length} Sponsor Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Upload / Edit + Crop */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!sponsorForm.logoUrl) {
                      triggerToast('Silakan pilih & crop gambar logo sponsor terlebih dahulu!');
                      return;
                    }
                    if (editingSponsorId) {
                      updateSponsor?.(editingSponsorId, sponsorForm);
                      triggerToast(`Sponsor "${sponsorForm.name}" berhasil diperbarui!`);
                      cancelEditSponsor();
                    } else {
                      addSponsor?.(sponsorForm);
                      setSponsorForm({ name: '', logoUrl: '' });
                      triggerToast('Logo sponsor berhasil dipasang ke marquee Beranda!');
                    }
                  }}
                  className="lg:col-span-5 space-y-3"
                >
                  {editingSponsorId && (
                    <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">Mode Edit Sponsor</span>
                      <button
                        type="button"
                        onClick={cancelEditSponsor}
                        className="text-slate-300 hover:text-white underline font-bold"
                      >
                        Batal Edit
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Nama Brand / Sponsor (Label Admin) *
                    </label>
                    <input
                      type="text"
                      required
                      value={sponsorForm.name}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                      placeholder="Contoh: ORTUSEIGHT FUTSAL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white outline-none focus:border-[#14B866]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Upload &amp; Crop Logo Sponsor (3:1) *
                    </label>
                    <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#0D151B] border-2 border-dashed border-slate-700 hover:border-[#14B866] cursor-pointer transition-colors">
                      {sponsorForm.logoUrl ? (
                        <div className="w-36 h-12 rounded-lg overflow-hidden border border-[#14B866]/60 bg-slate-900">
                          <img
                            src={sponsorForm.logoUrl}
                            alt="Preview Logo"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      ) : (
                        <Upload className="w-6 h-6 text-[#14B866]" />
                      )}
                      <span className="text-[11px] font-bold text-slate-300">
                        {sponsorForm.logoUrl
                          ? 'Klik untuk ganti / upload ulang gambar'
                          : 'Pilih gambar sponsor untuk diatur crop-nya'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSponsorFileSelect}
                        className="hidden"
                      />
                    </label>

                    {sponsorForm.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const img = new window.Image();
                          img.onload = () => {
                            setRawSponsorImg({
                              src: sponsorForm.logoUrl,
                              width: img.naturalWidth || 450,
                              height: img.naturalHeight || 150,
                            });
                            setCropZoom(1);
                            setCropOffset({ x: 0, y: 0 });
                          };
                          img.src = sponsorForm.logoUrl;
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:underline"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Sesuaikan Ulang Area Crop</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    {editingSponsorId ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Simpan Perubahan Sponsor</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Pasang Gambar Sponsor ke Beranda</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Daftar Sponsor Aktif (Bisa Edit & Hapus) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="text-xs font-bold text-slate-400">
                    Daftar Sponsor Aktif di Beranda ({sponsors.length}):
                  </div>

                  {sponsors.length === 0 ? (
                    <div className="p-6 rounded-xl bg-[#0D151B] border border-dashed border-slate-700 text-center text-xs text-slate-400">
                      Belum ada logo sponsor yang dipasang. Unggah logo sponsor di formulir sebelah kiri untuk menampilkannya di Beranda.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sponsors.map((sp) => (
                        <div
                          key={sp.id}
                          className={`p-3.5 rounded-xl bg-[#0D151B] border flex items-center justify-between gap-3 ${
                            editingSponsorId === sp.id ? 'border-amber-400' : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-24 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                              <img
                                src={sp.logoUrl}
                                alt={sp.name}
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                            <span className="font-black text-xs text-white truncate">{sp.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditSponsor(sp)}
                              title="Edit / Crop Ulang Sponsor"
                              className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (editingSponsorId === sp.id) cancelEditSponsor();
                                removeSponsor?.(sp.id);
                                triggerToast(`Sponsor "${sp.name}" dihapus dari Beranda.`);
                              }}
                              title="Hapus Sponsor"
                              className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Berita & Galeri */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tambah Berita */}
              <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-4">
                <h2 className="font-black text-lg text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#14B866]" />
                  <span>Terbitkan Berita &amp; Pengumuman Baru</span>
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newsForm.title) return;
                    addNewsArticle(newsForm);
                    setNewsForm({ category: 'PENGUMUMAN LIGA', title: '', excerpt: '' });
                    triggerToast('Berita baru berhasil diterbitkan ke menu Media Publik!');
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    placeholder="Kategori (contoh: LAPORAN LAGA)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    placeholder="Judul Berita Utama *"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                  />
                  <textarea
                    rows={3}
                    required
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                    placeholder="Ringkasan isi berita *"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs"
                  >
                    Publikasikan Berita ke Halaman User
                  </button>
                </form>
              </div>

              {/* Tambah Galeri */}
              <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-4">
                <h2 className="font-black text-lg text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <span>Tambah Foto / Video Highlight Galeri</span>
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!galleryForm.title) return;
                    addGalleryItem(galleryForm);
                    setGalleryForm({
                      type: 'FOTO',
                      category: 'DOKUMENTASI MATCHDAY',
                      title: '',
                      venue: 'GOR Cendrawasih Jakarta',
                      caption: '',
                    });
                    triggerToast('Media galeri baru tampil di Beranda & Menu Media Publik!');
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={galleryForm.type}
                      onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                    >
                      <option value="FOTO">FOTO LAGA</option>
                      <option value="VIDEO">VIDEO HIGHLIGHT</option>
                    </select>
                    <input
                      type="text"
                      value={galleryForm.venue}
                      onChange={(e) => setGalleryForm({ ...galleryForm, venue: e.target.value })}
                      placeholder="Lokasi GOR"
                      className="px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    placeholder="Judul Foto / Highlight Video *"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    required
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                    placeholder="Keterangan singkat dokumentasi *"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs"
                  >
                    Unggah ke Galeri Beranda &amp; Media
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 4: AUTO-GRAPHICS STORY
           ================================================================ */}
        {adminSubTab === 'AUTO_GRAPHICS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-4">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-[#14B866]/20 text-[#14B866]">
                AUTO-GRAPHICS GENERATOR
              </span>
              <h2 className="text-lg font-black text-white">Poster Instagram Story Siap Unggah</h2>
              <p className="text-xs text-slate-400">Otomatis mencetak skor akhir atau klasemen lengkap dengan watermark liga &amp; sponsor.</p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'FULLTIME', label: 'Skor Pertandingan' },
                  { id: 'STANDINGS', label: 'Klasemen Grup A' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setGraphicsTemplate(tpl.id)}
                    className={`py-2.5 rounded-xl border text-xs font-black ${
                      graphicsTemplate === tpl.id
                        ? 'bg-[#14B866] text-slate-950 border-[#14B866]'
                        : 'bg-[#0D151B] border-slate-700 text-slate-300'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>

              <select
                value={graphicsMatchId}
                onChange={(e) => setGraphicsMatchId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs font-bold text-white outline-none"
              >
                {matches.map((m) => {
                  const h = teams.find((t) => t.id === m.homeTeamId);
                  const a = teams.find((t) => t.id === m.awayTeamId);
                  return (
                    <option key={m.id} value={m.id}>
                      {h?.shortName} vs {a?.shortName} ({m.homeScore}-{m.awayScore})
                    </option>
                  );
                })}
              </select>

              <button
                onClick={() => triggerToast('Poster Instagram Story (1080×1920 PNG) berhasil diunduh!')}
                className="w-full py-3.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Poster Siap Unggah</span>
              </button>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              {(() => {
                const gMatch = matches.find((m) => m.id === graphicsMatchId) || matches[0];
                const gHome = teams.find((t) => t.id === gMatch.homeTeamId);
                const gAway = teams.find((t) => t.id === gMatch.awayTeamId);
                return (
                  <div className="w-full max-w-[330px] aspect-[9/16] rounded-[2rem] bg-gradient-to-b from-[#0D151B] via-[#132520] to-[#080D11] text-white p-6 border-4 border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="text-center">
                      <span className="px-3 py-1 rounded-full bg-[#14B866] text-slate-950 font-black text-[10px] tracking-widest uppercase">
                        {graphicsTemplate === 'FULLTIME' ? 'MATCH RESULT' : 'KLASEMEN GRUP A'}
                      </span>
                      <h3 className="font-black text-lg mt-2">NUSANTARA FUTSAL 2026</h3>
                      <p className="text-[11px] text-slate-400">
                        {gMatch.week} • {gMatch.venue}
                      </p>
                    </div>

                    {graphicsTemplate === 'STANDINGS' ? (
                      <div className="space-y-2 my-auto">
                        {standings.map((s, idx) => (
                          <div key={s.id} className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between text-xs">
                            <span className="font-black">
                              #{idx + 1} {s.name}
                            </span>
                            <span className="font-black text-[#14B866]">{s.pts} PTS</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="my-auto space-y-5">
                        <div className="grid grid-cols-3 items-center text-center gap-2">
                          <div>
                            <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${gHome?.logoBg} flex items-center justify-center font-black text-lg`}>
                              {gHome?.shortName}
                            </div>
                            <div className="font-bold text-xs mt-2">{gHome?.name}</div>
                          </div>
                          <div className="text-4xl font-black text-[#14B866]">
                            {gMatch.homeScore}:{gMatch.awayScore}
                          </div>
                          <div>
                            <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${gAway?.logoBg} flex items-center justify-center font-black text-lg`}>
                              {gAway?.shortName}
                            </div>
                            <div className="font-bold text-xs mt-2">{gAway?.name}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px]">
                      <div>
                        <div className="text-slate-400">SPONSOR</div>
                        <div className="font-black text-amber-400">
                          {sponsors.length > 0
                            ? sponsors.slice(0, 2).map((s) => s.name).join(' • ')
                            : 'OFFICIAL PARTNER'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400">TECH PARTNER</div>
                        <div className="font-black text-[#14B866]">H&amp;B TECHLABS</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}