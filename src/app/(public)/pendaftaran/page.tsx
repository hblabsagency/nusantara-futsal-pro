"use client";

import React, { useState } from 'react';
import { useLeague } from '../../../context/LeagueContext';

export default function PendaftaranPage() {
  const { submitTeamRegistration } = useLeague();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({
    teamName: '',
    category: 'Putra Umum',
    manager: '',
    phone: '',
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-10">
      {toastMessage && (
        <div className="fixed bottom-5 right-4 z-50 max-w-sm animate-bounce">
          <div className="bg-[#131F28] border border-[#14B866] text-white px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(20,184,102,0.3)] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14B866] animate-ping shrink-0" />
            <span className="text-xs font-bold leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 sm:p-8">
        <span className="px-3 py-1 rounded-full text-xs font-black bg-[#14B866]/15 text-[#14B866]">
          REGISTRASI TIM ONLINE
        </span>
        <h2 className="text-2xl font-black text-white mt-2 mb-1">
          Pendaftaran Peserta Liga 2026
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Formulir terhubung langsung dengan antrean verifikasi di halaman{' '}
          <strong className="text-emerald-400">/admin</strong>. Setelah disahkan Admin, tim otomatis masuk ke daftar Klub &amp; Klasemen.
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
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Nama Klub / Tim Futsal *
            </label>
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Kategori Usia
              </label>
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nama Manajer Tim *
              </label>
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
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Nomor WhatsApp Aktif *
            </label>
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
  );
}