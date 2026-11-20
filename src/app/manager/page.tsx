// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Lock, LogIn, LogOut, ExternalLink,
  Check, CheckCircle2, HeartPulse, Upload, UserPlus
} from 'lucide-react';
import { useLeague } from '../../context/LeagueContext';

export default function ManagerPortalPage() {
  const router = useRouter();
  const {
    teams,
    players,
    lineups,
    transferWindowOpen,
    currentUser,
    isHydrated,
    logout,
    getPlayerLockStatus,
    saveTeamLineup,
    togglePlayerInjury,
    verifyPlayerDoc,
    addPlayerToSquad,
    requestPlayerTransfer,
  } = useLeague();

  const managedTeamId = currentUser?.teamId || 't1';
  const managedTeam = teams.find((t) => t.id === managedTeamId) || teams[0];

  const [selectedLineupIds, setSelectedLineupIds] = useState([]);
  const [lineupSubmitted, setLineupSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form Tambah Pemain Baru ke Skuad
  const [newPlayerForm, setNewPlayerForm] = useState({ name: '', number: '', position: 'Flank' });

  // Form Ajukan Transfer Masuk
  const [transferForm, setTransferForm] = useState({ playerName: '', fromTeam: '', fee: 'Transfer Resmi' });

  useEffect(() => {
    if (lineups && lineups[managedTeamId]) {
      setSelectedLineupIds(lineups[managedTeamId]);
    }
  }, [lineups, managedTeamId]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-[#0D151B] flex items-center justify-center text-sm text-slate-400">Memuat Portal Manajer...</div>;
  }

  // Guard Autentikasi Client-Side
  if (!currentUser || currentUser.role !== 'MANAGER') {
    return (
      <div className="min-h-screen bg-[#0D151B] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-[#131F28] border border-slate-800 p-7 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white">Akses Terbatas — Portal Manajer Tim</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Silakan login menggunakan akun <strong className="text-amber-400">Manajer Tim</strong> untuk mengelola skuad, mengajukan line-up pertandingan, dan mendaftarkan pemain baru.
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
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-[#0D151B] border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center"
            >
              Halaman Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teamPlayers = players.filter((p) => p.teamId === managedTeamId);

  return (
    <div className="min-h-screen bg-[#0D151B] text-slate-100 pb-12">
      {/* Header Portal Manajer */}
      <header className="sticky top-0 z-40 bg-[#131F28]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${managedTeam?.logoBg} text-white font-black text-sm flex items-center justify-center shadow-lg`}>
              {managedTeam?.shortName}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                <Shield className="w-3 h-3" />
                <span>PORTAL MANAJER TIM • ROW-LEVEL ISOLATION</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white">{managedTeam?.name}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Perubahan di Halaman User (/)</span>
            </Link>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Pengajuan Line-Up + Auto-Lock */}
          <div className="lg:col-span-7 rounded-2xl bg-[#131F28] border border-slate-800 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h2 className="font-black text-lg text-white flex items-center gap-2">
                <span>Pengajuan Line-Up Pertandingan</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#14B866]/20 text-[#14B866]">AUTO-LOCK SYSTEM</span>
              </h2>
              <span className="text-xs font-black text-[#14B866]">{selectedLineupIds.length} / 12 Pemain</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Pemain terkena akumulasi 2 kartu kuning, kartu merah, atau cedera otomatis terkunci. Line-up yang disimpan langsung muncul pada Detail Pertandingan di <strong className="text-slate-200">Halaman User</strong>.
            </p>

            <div className="space-y-2.5 mb-5">
              {teamPlayers.map((player) => {
                const lockInfo = getPlayerLockStatus(player);
                const isSelected = selectedLineupIds.includes(player.id);

                return (
                  <div
                    key={player.id}
                    onClick={() => {
                      if (lockInfo.locked) {
                        triggerToast(`Terkunci Otomatis: ${player.name} (${lockInfo.reason})`);
                        return;
                      }
                      setLineupSubmitted(false);
                      setSelectedLineupIds((prev) =>
                        prev.includes(player.id) ? prev.filter((id) => id !== player.id) : [...prev, player.id]
                      );
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      lockInfo.locked
                        ? 'opacity-65 cursor-not-allowed bg-rose-950/20 border-rose-500/40'
                        : isSelected
                        ? 'cursor-pointer border-[#14B866] bg-[#14B866]/10'
                        : 'cursor-pointer bg-[#0D151B] border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                          lockInfo.locked
                            ? 'bg-rose-500/20 text-rose-400'
                            : isSelected
                            ? 'bg-[#14B866] text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {lockInfo.locked ? <Lock className="w-4 h-4" /> : `#${player.number}`}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{player.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                            {player.position}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${lockInfo.badgeColor}`}>
                            {lockInfo.reason}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {player.yellowCards}K • {player.redCards}M
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayerInjury(player.id);
                          triggerToast(`Status medis ${player.name} diperbarui!`);
                        }}
                        title="Toggle Status Cedera"
                        className={`p-2 rounded-lg border text-xs font-bold ${
                          player.injured ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <HeartPulse className="w-4 h-4" />
                      </button>

                      {!lockInfo.locked && (
                        <div
                          className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-[#14B866] border-[#14B866] text-slate-950' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                saveTeamLineup(managedTeamId, selectedLineupIds);
                setLineupSubmitted(true);
                triggerToast('Line-Up resmi tersimpan & tampil di Modal Pertandingan Halaman User!');
              }}
              className="w-full py-3.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-sm shadow-lg"
            >
              {lineupSubmitted ? '✓ Line-Up Resmi Tersimpan ke Halaman User' : 'Simpan & Ajukan Line-Up Resmi'}
            </button>
          </div>

          {/* Kolom Kanan: Tambah Pemain Baru, Verifikasi e-ID, & Transfer */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tambah Pemain Baru ke Skuad */}
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
              <h3 className="font-black text-base text-white flex items-center gap-2 mb-1">
                <UserPlus className="w-4 h-4 text-[#14B866]" />
                <span>Daftarkan Pemain Baru ke Skuad</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Pemain baru langsung masuk ke daftar skuad klub pada menu <strong className="text-slate-200">Tim</strong> di Halaman User.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPlayerForm.name || !newPlayerForm.number) return;
                  addPlayerToSquad({
                    teamId: managedTeamId,
                    name: newPlayerForm.name,
                    number: newPlayerForm.number,
                    position: newPlayerForm.position,
                  });
                  setNewPlayerForm({ name: '', number: '', position: 'Flank' });
                  triggerToast(`${newPlayerForm.name} ditambahkan ke skuad ${managedTeam?.name}!`);
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Pemain *"
                  value={newPlayerForm.name}
                  onChange={(e) => setNewPlayerForm({ ...newPlayerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    placeholder="No. Punggung *"
                    value={newPlayerForm.number}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white outline-none"
                  />
                  <select
                    value={newPlayerForm.position}
                    onChange={(e) => setNewPlayerForm({ ...newPlayerForm, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white outline-none"
                  >
                    <option value="GK">GK (Kiper)</option>
                    <option value="Anchor">Anchor</option>
                    <option value="Flank">Flank</option>
                    <option value="Pivot">Pivot</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs"
                >
                  + Tambahkan ke Skuad Resmi
                </button>
              </form>
            </div>

            {/* Verifikasi Berkas & e-ID */}
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
              <h3 className="font-black text-base text-white mb-1">Verifikasi Berkas &amp; e-ID Pemain</h3>
              <p className="text-xs text-slate-400 mb-4">Unggah KTP/Kartu Pelajar untuk mengaktifkan e-ID pemain.</p>

              <div className="space-y-2.5">
                {teamPlayers
                  .filter((p) => !p.docVerified)
                  .map((unverified) => (
                    <div
                      key={unverified.id}
                      className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-sm text-white">
                          {unverified.name} (#{unverified.number})
                        </div>
                        <div className="text-[11px] text-amber-400 font-semibold">Berkas Identitas Belum Diunggah</div>
                      </div>
                      <button
                        onClick={() => {
                          verifyPlayerDoc(unverified.id);
                          triggerToast(`e-ID Card ${unverified.name} berhasil diverifikasi!`);
                        }}
                        className="px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah</span>
                      </button>
                    </div>
                  ))}
                {teamPlayers.filter((p) => !p.docVerified).length === 0 && (
                  <div className="p-3.5 rounded-xl bg-[#14B866]/10 border border-[#14B866]/30 text-[#14B866] text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Seluruh pemain skuad telah terverifikasi e-ID Card!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ajukan Transfer Masuk */}
            <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-5">
              <h3 className="font-black text-base text-white mb-1">Ajukan Transfer Pemain Masuk</h3>
              <p className="text-xs text-slate-400 mb-4">
                Jendela Transfer: <strong className="text-[#14B866]">{transferWindowOpen ? 'BUKA' : 'TUTUP'}</strong>
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!transferForm.playerName) return;
                  requestPlayerTransfer({
                    playerName: transferForm.playerName,
                    fromTeam: transferForm.fromTeam,
                    toTeam: managedTeam?.name,
                    fee: transferForm.fee,
                  });
                  setTransferForm({ playerName: '', fromTeam: '', fee: 'Transfer Resmi' });
                  triggerToast('Permohonan transfer dikirim ke /admin & tampil di Bursa Transfer Publik!');
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Pemain"
                  value={transferForm.playerName}
                  onChange={(e) => setTransferForm({ ...transferForm, playerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Klub Asal (atau Free Agent)"
                  value={transferForm.fromTeam}
                  onChange={(e) => setTransferForm({ ...transferForm, fromTeam: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D151B] border border-slate-700 text-xs text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={!transferWindowOpen}
                  className="w-full py-3 rounded-xl bg-[#14B866] hover:bg-[#10B981] disabled:opacity-50 text-slate-950 font-black text-xs"
                >
                  Ajukan Mutasi ke Admin Liga
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}