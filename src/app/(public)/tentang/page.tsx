"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MapPin, PhoneCall, Mail, ShieldAlert, BookOpen, Handshake
} from 'lucide-react';

function TentangContent() {
  const searchParams = useSearchParams();
  const [tentangSub, setTentangSub] = useState('PROFIL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const sub = searchParams.get('sub')?.toUpperCase();
    if (sub && ['PROFIL', 'SPONSOR', 'KONTAK'].includes(sub)) {
      setTentangSub(sub);
    }
  }, [searchParams]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
      {toastMessage && (
        <div className="fixed bottom-5 right-4 z-50 max-w-sm animate-bounce">
          <div className="bg-[#131F28] border border-[#14B866] text-white px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(20,184,102,0.3)] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14B866] animate-ping shrink-0" />
            <span className="text-xs font-bold leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">
            INFORMASI RESMI PENYELENGGARA
          </span>
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
                tentangSub === sub.id
                  ? 'bg-[#14B866] text-slate-950'
                  : 'text-slate-300 hover:text-white'
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
            <h2 className="text-lg font-black text-white">
              Visi, Misi &amp; Struktur Organisasi
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nusantara Futsal Pro League hadir untuk memodernisasi tata kelola kompetisi futsal di Indonesia dengan transparansi data real-time, verifikasi e-ID pemain, dan eksposur digital profesional.
            </p>
          </div>
          <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-white">
              Regulasi Poin &amp; Akumulasi Kartu
            </h2>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li>Kemenangan = 3 Poin, Seri = 1 Poin, Kalah = 0 Poin.</li>
              <li>
                Akumulasi 2 Kartu Kuning atau 1 Kartu Merah otomatis mengunci line-up pemain pada laga berikutnya.
              </li>
            </ul>
          </div>
        </div>
      )}

      {tentangSub === 'SPONSOR' && (
        <div className="rounded-2xl bg-[#131F28] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Handshake className="w-6 h-6 text-[#14B866]" />
            <h2 className="text-lg font-black text-white">
              Paket Kemitraan &amp; Mitra Sponsor Resmi
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Seluruh mitra sponsor mendapatkan laporan analitik tayangan (impressions) dan klik banner digital secara transparan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              'PLATINUM TITLE SPONSOR',
              'GOLD MATCHDAY PARTNER',
              'OFFICIAL APPAREL & TECH',
            ].map((pkg, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0D151B] border border-slate-800">
                <span className="text-[10px] font-black text-[#14B866]">{pkg}</span>
                <div className="font-black text-sm text-white mt-1">
                  Slot Banner Utama &amp; Story Watermark
                </div>
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
  );
}

export default function TentangPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D151B]" />}>
      <TentangContent />
    </Suspense>
  );
}