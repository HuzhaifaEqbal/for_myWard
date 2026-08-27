'use client';

import React, { useState } from 'react';
import { prayerMotivations, PrayerMotivation } from '@/data/prayerMotivations';

// Pure SVG Icons for Motivations
const SVGs = {
  Sparkles: () => (
    <svg className="w-5 h-5 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Sunrise: () => (
    <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6M4.93 10.93l4.24-4.24M19.07 10.93l-4.24-4.24M2 18h20M7 18a5 5 0 0 1 10 0" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  AfternoonSun: () => (
    <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    </svg>
  ),
  Sunset: () => (
    <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10v6M4.93 10.93l4.24 4.24M19.07 10.93l-4.24 4.24M2 18h20M7 18a5 5 0 0 1 10 0" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-4 h-4 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
};

export default function PrayerMotivatorCards() {
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerMotivation>(prayerMotivations[0]);

  const getPrayerIcon = (id: string) => {
    switch (id) {
      case 'fajr': return <SVGs.Sunrise />;
      case 'dhuhr': return <SVGs.Sun />;
      case 'asr': return <SVGs.AfternoonSun />;
      case 'maghrib': return <SVGs.Sunset />;
      case 'isha': return <SVGs.Moon />;
      default: return <SVGs.Sparkles />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/15 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center">
          <SVGs.Sparkles />
        </div>
        <div>
          <h3 className="font-ui-header text-xl md:text-2xl text-on-surface font-bold">
            زاد المؤمن • فضائل وأسرار الصلوات الخمس
          </h3>
          <p className="font-body-main text-xs text-on-surface-variant">
            تأملات إيمانية، أحاديث صحيحة، وسنن مؤكدة ترتقي بصلاتك من مجرد أداء إلى راحة وسكينة
          </p>
        </div>
      </div>

      {/* 5 Prayers Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {prayerMotivations.map((p) => {
          const isSelected = selectedPrayer.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPrayer(p)}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-between text-center gap-2 ${
                isSelected
                  ? 'bg-surface-container-high border-tertiary shadow-[0_0_20px_rgba(247,190,29,0.25)] scale-102'
                  : 'bg-surface-container-low/60 border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container'
              }`}
            >
              <div className="p-2 rounded-xl bg-surface/80 border border-outline-variant/20">
                {getPrayerIcon(p.id)}
              </div>
              <div>
                <span className={`font-ui-header text-sm font-bold block ${isSelected ? 'text-tertiary' : 'text-on-surface'}`}>
                  {p.name_ar}
                </span>
                <span className="text-[10px] text-on-surface-variant font-label-mono">{p.name_en}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Prayer Details Card */}
      <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden text-right animate-fade-in">
        <div className="absolute top-0 right-0 w-36 h-36 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-outline-variant/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/30 shadow-inner">
              {getPrayerIcon(selectedPrayer.id)}
            </div>
            <div>
              <h4 className="font-ui-header text-2xl font-bold text-on-surface">
                {selectedPrayer.name_ar} • {selectedPrayer.virtue_title}
              </h4>
              <span className="text-xs text-on-surface-variant font-body-main">
                {selectedPrayer.time_description}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface/60 px-3.5 py-1.5 rounded-full border border-outline-variant/20 text-xs font-label-mono text-tertiary">
            <SVGs.BookOpen />
            <span>السنة الراتبة: {selectedPrayer.sunnah_description}</span>
          </div>
        </div>

        {/* Hadith Block */}
        <div className="bg-tertiary/5 border-r-4 border-tertiary rounded-2xl p-5 shadow-inner">
          <span className="text-xs font-ui-header font-bold text-tertiary mb-2 block flex items-center gap-1.5">
            <SVGs.Sparkles />
            <span>الحديث النبوي الشريف في فضلها:</span>
          </span>
          <p className="font-verse-display text-lg md:text-xl text-yellow-200/95 leading-relaxed" dir="rtl">
            {selectedPrayer.hadith_text}
          </p>
          <span className="block text-left text-xs text-tertiary/70 mt-2 font-label-mono">
            {selectedPrayer.hadith_source}
          </span>
        </div>

        {/* Spiritual Reflection Tip */}
        <div className="bg-surface/50 rounded-2xl p-4 border border-outline-variant/15 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-0.5">
            <SVGs.Heart />
          </div>
          <div>
            <span className="text-xs font-ui-header font-bold text-emerald-400 block mb-1">
              إضاءة وتدبر قلبي:
            </span>
            <p className="font-body-main text-sm text-on-surface-variant leading-relaxed">
              {selectedPrayer.spiritual_tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
