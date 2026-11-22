"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Trophy, Award, MapPin, Lock, Filter,
  ArrowLeftRight, ShieldAlert
} from 'lucide-react';
import { useLeague } from '../../../context/LeagueContext';
import { MatchDetailModal, PlayerModal } from '../../../components/LeagueModals';

function KompetisiContent() {
  const searchParams = useSearchParams();
  const {
    teams,
    players,
    matches,
    transfers,
    transferWindowOpen,
    standings,
    getPlayerLockStatus,
  } = useLeague();

  const [kompetisiSub, setKompetisiSub] = useState('JADWAL');
  const [weekFilter, setWeekFilter] = useState('SEMUA');
  const [venueFilter, setVenueFilter] = useState('SEMUA');
  const [selectedMatchModal, setSelectedMatchModal] = useState<any>(null);
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<any>(null);

  useEffect(() => {
    const sub = searchParams.get('sub')?.toUpperCase();
    if (sub && ['JADWAL', 'KLASEMEN', 'STATISTIK', 'TRANSFER'].includes(sub)) {
      setKompetisiSub(sub);
    }
  }, [searchParams]);

  return (
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
                kompetisiSub === sub.id
                  ? 'bg-[#14B866] text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

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
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${hTeam?.logoBg} text-white font-black text-xs flex items-center justify-center shrink-0`}
                        >
                          {hTeam?.shortName}
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-white">{hTeam?.name}</span>
                      </div>

                      <div className="text-center">
                        {m.status === 'SCHEDULED' ? (
                          <span className="px-3 py-1 rounded bg-slate-800 font-black text-xs text-slate-300">
                            VS
                          </span>
                        ) : (
                          <div className="text-2xl font-black text-white">
                            {m.homeScore} <span className="text-[#14B866]">-</span> {m.awayScore}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2.5 text-right">
                        <span className="font-bold text-xs sm:text-sm text-white">{aTeam?.name}</span>
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${aTeam?.logoBg} text-white font-black text-xs flex items-center justify-center shrink-0`}
                        >
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
                          idx < 2
                            ? 'bg-[#14B866] text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${row.logoBg} text-white text-xs font-black flex items-center justify-center shrink-0`}
                        >
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
                    <td className="py-3.5 px-2 text-center font-mono font-bold">
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.slice(-5).map((f, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded text-[10px] font-black flex items-center justify-center text-white ${
                              f === 'W'
                                ? 'bg-[#14B866]'
                                : f === 'D'
                                ? 'bg-slate-600'
                                : 'bg-rose-600'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right font-black text-base text-[#14B866]">
                      {row.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                        <span
                          className={`w-6 h-6 rounded text-xs font-black flex items-center justify-center ${
                            idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800'
                          }`}
                        >
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
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-xs">
                          {p.yellowCards}K
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-xs">
                          {p.redCards}M
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {kompetisiSub === 'TRANSFER' && (
        <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-black text-lg text-white">Bursa Transfer Resmi Liga</h2>
              <p className="text-xs text-slate-400">
                Periode Jendela Transfer Tengah Musim: 01 Nov – 25 Nov 2026.
              </p>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-black ${
                transferWindowOpen
                  ? 'bg-[#14B866]/20 text-[#14B866]'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {transferWindowOpen ? '● TRANSFER WINDOW BUKA' : '● TRANSFER WINDOW TUTUP'}
            </span>
          </div>
          <div className="space-y-3">
            {transfers.map((tr) => (
              <div
                key={tr.id}
                className="p-4 rounded-xl bg-[#0D151B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
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
                    tr.status === 'APPROVED'
                      ? 'bg-[#14B866]/20 text-[#14B866]'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {tr.status === 'APPROVED' ? '✓ SAH / RESMI' : '⏳ MENUNGGU VERIFIKASI'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <MatchDetailModal
        selectedMatch={selectedMatchModal}
        onClose={() => setSelectedMatchModal(null)}
      />
      <PlayerModal
        selectedPlayer={selectedPlayerModal}
        onClose={() => setSelectedPlayerModal(null)}
      />
    </div>
  );
}

export default function KompetisiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D151B]" />}>
      <KompetisiContent />
    </Suspense>
  );
}