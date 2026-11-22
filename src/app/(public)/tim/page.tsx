"use client";

import React, { useState } from 'react';
import { useLeague } from '../../../context/LeagueContext';
import { PlayerModal } from '../../../components/LeagueModals';

export default function TimPage() {
  const { teams, players } = useLeague();
  const [selectedTeamDetail, setSelectedTeamDetail] = useState('t1');
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<any>(null);

  const activeTeamObj =
    teams.find((t) => t.id === selectedTeamDetail) || teams[0];
  const squad = activeTeamObj
    ? players.filter((p) => p.teamId === activeTeamObj.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">
          DIREKTORI KLUB PESERTA
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
          Profil Tim &amp; Daftar Skuad Resmi
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamDetail(t.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedTeamDetail === t.id
                ? 'border-[#14B866] bg-[#14B866]/10'
                : 'bg-[#131F28] border-slate-800 hover:border-slate-600'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.logoBg} text-white font-black text-sm flex items-center justify-center mb-3`}
            >
              {t.shortName}
            </div>
            <div className="font-extrabold text-sm text-white">{t.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{t.city}</div>
          </button>
        ))}
      </div>

      {activeTeamObj && (
        <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6">
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-800">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeTeamObj.logoBg} text-white font-black text-xl flex items-center justify-center`}
            >
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
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-2xl font-black text-[#14B866]">
                    #{p.number}
                  </span>
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
      )}

      <PlayerModal
        selectedPlayer={selectedPlayerModal}
        onClose={() => setSelectedPlayerModal(null)}
      />
    </div>
  );
}