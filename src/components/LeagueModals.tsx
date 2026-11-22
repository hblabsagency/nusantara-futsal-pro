"use client";

import React from 'react';
import { X, Play } from 'lucide-react';
import { useLeague } from '../context/LeagueContext';

export function MatchDetailModal({
  selectedMatch,
  onClose,
}: {
  selectedMatch: any;
  onClose: () => void;
}) {
  const { teams, players, matches, lineups } = useLeague();
  if (!selectedMatch) return null;

  const activeModalMatch =
    matches.find((m) => m.id === selectedMatch.id) || selectedMatch;
  const mHome = teams.find((t) => t.id === activeModalMatch.homeTeamId);
  const mAway = teams.find((t) => t.id === activeModalMatch.awayTeamId);
  const homeLineupPlayers = players.filter((p) =>
    (lineups[activeModalMatch.homeTeamId] || []).includes(p.id)
  );
  const awayLineupPlayers = players.filter((p) =>
    (lineups[activeModalMatch.awayTeamId] || []).includes(p.id)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#131F28] border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black text-[#14B866] uppercase">
            {activeModalMatch.week} • {activeModalMatch.group}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

          <div>
            <h4 className="font-black text-xs uppercase tracking-wider text-[#14B866] mb-2">
              Daftar Line-Up Resmi (Sinkron Portal Manajer)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#0D151B] border border-slate-800">
                <div className="text-[11px] font-black text-white mb-2">
                  {mHome?.shortName} Line-Up
                </div>
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
                <div className="text-[11px] font-black text-white mb-2">
                  {mAway?.shortName} Line-Up
                </div>
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
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-300 mb-2">
              Rincian Kejadian &amp; Kartu
            </h4>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {activeModalMatch.events.length === 0 ? (
                <p className="text-xs text-slate-500">Pertandingan belum dimulai.</p>
              ) : (
                activeModalMatch.events.map((ev: any) => (
                  <div
                    key={ev.id}
                    className="px-3 py-2 rounded-lg bg-[#0D151B] border border-slate-800 flex justify-between text-xs"
                  >
                    <span>
                      {ev.type === 'GOAL'
                        ? '⚽ Gol'
                        : ev.type === 'YELLOW'
                        ? '🟨 Kartu Kuning'
                        : '🟥 Kartu Merah'}{' '}
                      — <strong className="text-white">{ev.playerName}</strong>
                    </span>
                    <span className="font-mono font-bold text-[#14B866]">{ev.minute}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlayerModal({
  selectedPlayer,
  onClose,
}: {
  selectedPlayer: any;
  onClose: () => void;
}) {
  const { teams, players, getPlayerLockStatus } = useLeague();
  if (!selectedPlayer) return null;

  const livePlayer =
    players.find((p) => p.id === selectedPlayer.id) || selectedPlayer;
  const pTeam = teams.find((t) => t.id === livePlayer.teamId);
  const lockStatus = getPlayerLockStatus(livePlayer);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#131F28] border border-slate-700 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#14B866]/20 text-[#14B866]">
            ✓ OFFICIAL PLAYER e-ID CARD
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
            <span className={`px-2.5 py-1 rounded font-black border ${lockStatus.badgeColor}`}>
              {lockStatus.reason}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryModal({
  selectedItem,
  onClose,
}: {
  selectedItem: any;
  onClose: () => void;
}) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#131F28] border border-slate-700 overflow-hidden shadow-2xl">
        <div className="relative h-64 sm:h-80 bg-black">
          <img
            src={selectedItem.image}
            alt={selectedItem.title}
            className="w-full h-full object-cover opacity-90"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white"
          >
            <X className="w-5 h-5" />
          </button>
          {selectedItem.type === 'VIDEO' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <div className="w-16 h-16 rounded-full bg-[#14B866] text-slate-950 flex items-center justify-center shadow-2xl animate-pulse">
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </div>
              <span className="mt-2 px-3 py-1 rounded-full bg-black/75 text-white text-xs font-bold">
                Official Highlight Player ({selectedItem.duration})
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="px-2.5 py-0.5 rounded bg-[#14B866]/20 text-[#14B866] font-black">
              {selectedItem.type} • {selectedItem.category}
            </span>
            <span className="text-slate-400">
              {selectedItem.date} • {selectedItem.venue}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">{selectedItem.title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {selectedItem.caption}
          </p>
        </div>
      </div>
    </div>
  );
}