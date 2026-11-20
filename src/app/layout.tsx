import type { Metadata } from 'next';
import './globals.css';
import { LeagueProvider } from '../context/LeagueContext';

export const metadata: Metadata = {
  title: 'Nusantara Futsal Pro League 2026',
  description: 'Sistem Manajemen Kompetisi Futsal Real-Time — Powered by H&B TechLabs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#0D151B] text-slate-100 antialiased">
        <LeagueProvider>{children}</LeagueProvider>
      </body>
    </html>
  );
}