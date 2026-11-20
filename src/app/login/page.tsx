// @ts-nocheck
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy, Shield, Users, Lock, Mail, Eye, EyeOff,
  ArrowLeft, LogIn, CheckCircle2, KeyRound
} from 'lucide-react';
import { useLeague, DEMO_ACCOUNTS, HBTechLabsLogo } from '../../context/LeagueContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, loginAsAccount } = useLeague();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = loginWithCredentials(email, password);
    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }
    router.push(result.user.role === 'ADMIN' ? '/admin' : '/manager');
  };

  const handleQuickDemo = (account) => {
    const user = loginAsAccount(account);
    router.push(user.role === 'ADMIN' ? '/admin' : '/manager');
  };

  return (
    <div className="min-h-screen bg-[#0D151B] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,102,0.18),transparent_65%)] pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#131F28]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#14B866] to-[#0E8F4E] text-white font-black text-sm flex items-center gap-1.5 shadow-lg">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>
                FUTSAL<span className="text-slate-950 font-extrabold">PRO</span>
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-extrabold text-slate-300">NUSANTARA LEAGUE 2026</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D151B] hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#14B866]" />
            <span>Kembali ke Halaman Publik</span>
          </Link>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Kiri: Form Login Manual */}
        <div className="lg:col-span-6 rounded-2xl bg-[#131F28] border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14B866]/15 border border-[#14B866]/30 text-[#14B866] text-[11px] font-black mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>CLIENT-SIDE AUTH PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Masuk ke Ekosistem Liga</h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Gunakan akun <strong className="text-slate-200">Admin Liga</strong> atau <strong className="text-slate-200">Manajer Tim</strong> untuk mengelola pertandingan, klasemen, dan skuad secara real-time.
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@futsalpro.id atau rendra@kembangan.fc"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm text-white outline-none focus:border-[#14B866]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0D151B] border border-slate-700 text-sm text-white outline-none focus:border-[#14B866]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>
          </form>
        </div>

        {/* Kanan: 1-Klik Akun Demo */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-[#131F28]/90 border border-slate-800 p-6">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#14B866]" />
              <span>Akses Cepat 1-Klik (Akun Demo)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Pilih salah satu peran di bawah untuk langsung masuk ke dashboard dan menguji perubahan data ke halaman publik (<code className="text-emerald-400">/</code>).
            </p>

            <div className="space-y-3">
              {DEMO_ACCOUNTS.map((acc) => {
                const isAdmin = acc.role === 'ADMIN';
                return (
                  <div
                    key={acc.id}
                    className="p-4 rounded-xl bg-[#0D151B] border border-slate-800 hover:border-[#14B866] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isAdmin ? 'bg-[#14B866]/20 text-[#14B866]' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {isAdmin ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isAdmin ? 'bg-[#14B866]/20 text-[#14B866]' : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {acc.role}
                        </span>
                        <div className="font-black text-sm text-white mt-1">{acc.title}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {acc.email} • <span className="text-slate-300">{acc.password}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickDemo(acc)}
                      className="px-4 py-2.5 rounded-xl bg-[#14B866] hover:bg-[#10B981] text-slate-950 font-black text-xs shrink-0 transition-transform active:scale-95"
                    >
                      Masuk {isAdmin ? 'Admin' : 'Manajer'} →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span>Nusantara Futsal Pro League 2026</span>
        <span className="hidden sm:inline">•</span>
        <div className="text-slate-300">
          <HBTechLabsLogo className="h-5" />
        </div>
      </footer>
    </div>
  );
}