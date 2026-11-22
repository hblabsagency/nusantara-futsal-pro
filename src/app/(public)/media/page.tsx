"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Play, Image as ImageIcon } from 'lucide-react';
import { useLeague } from '../../../context/LeagueContext';
import { GalleryModal } from '../../../components/LeagueModals';

function MediaContent() {
  const searchParams = useSearchParams();
  const { news, gallery } = useLeague();

  const [mediaSub, setMediaSub] = useState('BERITA');
  const [galleryFilter, setGalleryFilter] = useState('SEMUA');
  const [selectedGalleryModal, setSelectedGalleryModal] = useState<any>(null);

  useEffect(() => {
    const sub = searchParams.get('sub')?.toUpperCase();
    if (sub && ['BERITA', 'GALERI'].includes(sub)) {
      setMediaSub(sub);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#14B866]">
            PUSAT PUBLIKASI &amp; DOKUMENTASI
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            {mediaSub === 'BERITA'
              ? 'Berita & Pengumuman Resmi'
              : 'Galeri Foto & Video Highlight'}
          </h1>
        </div>

        <div className="flex gap-1.5 bg-[#131F28] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setMediaSub('BERITA')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
              mediaSub === 'BERITA'
                ? 'bg-[#14B866] text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Berita &amp; Pengumuman
          </button>
          <button
            onClick={() => setMediaSub('GALERI')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
              mediaSub === 'GALERI'
                ? 'bg-[#14B866] text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Galeri Foto &amp; Video
          </button>
        </div>
      </div>

      {mediaSub === 'BERITA' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl bg-[#131F28] border border-slate-800 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img src={n.image} alt={n.title} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-[#14B866]/15 text-[#14B866] mb-3">
                    {n.category}
                  </span>
                  <h3 className="font-black text-base text-white mb-2">{n.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{n.excerpt}</p>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
                <span>{n.date}</span>
                <span className="text-[#14B866] font-bold">{n.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {mediaSub === 'GALERI' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#131F28] border border-slate-800">
            <p className="text-xs text-slate-300 font-medium">
              Dokumentasi foto pertandingan dan video highlight resmi yang dikelola Panel Admin.
            </p>
            <div className="flex items-center gap-2">
              {[
                { id: 'SEMUA', label: `Semua Media (${gallery.length})` },
                { id: 'FOTO', label: 'Foto Laga' },
                { id: 'VIDEO', label: 'Video Highlight' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGalleryFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    galleryFilter === tab.id
                      ? 'bg-[#14B866] text-slate-950'
                      : 'bg-[#0D151B] text-slate-300 border border-slate-700 hover:border-[#14B866]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gallery
              .filter((item) =>
                galleryFilter === 'SEMUA' ? true : item.type === galleryFilter
              )
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGalleryModal(item)}
                  className="cursor-pointer group rounded-2xl bg-[#131F28] border border-slate-800 hover:border-[#14B866] overflow-hidden shadow-lg flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D151B] via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#14B866] text-slate-950 font-black text-[10px]">
                        {item.type} • {item.duration}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/65 border border-white/40 flex items-center justify-center text-white group-hover:bg-[#14B866] group-hover:text-slate-950 transition-colors">
                          {item.type === 'VIDEO' ? (
                            <Play className="w-5 h-5 fill-current" />
                          ) : (
                            <ImageIcon className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-black tracking-wider text-[#14B866] uppercase">
                        {item.category}
                      </span>
                      <h3 className="font-black text-base text-white mt-1 leading-snug group-hover:text-[#14B866] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#14B866]" />
                      {item.venue}
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <GalleryModal
        selectedItem={selectedGalleryModal}
        onClose={() => setSelectedGalleryModal(null)}
      />
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D151B]" />}>
      <MediaContent />
    </Suspense>
  );
}