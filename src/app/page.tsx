'use client';

import { useState, useEffect } from 'react';
import LogarithmicUniverseEngine from '@/components/cosmic/LogarithmicUniverseEngine';
import CosmicScene from '@/components/cosmic/CosmicScene';
import SmartWird from '@/components/wird/SmartWird';
import TasbihTracker from '@/components/wird/TasbihTracker';
import PrayerChecklist from '@/components/wird/PrayerChecklist';
import PrayerMotivatorCards from '@/components/prayer/PrayerMotivatorCards';
import StickyPrayerHUD from '@/components/prayer/StickyPrayerHUD';
import SadaqahHub, { Beneficiary } from '@/components/sadaqah/SadaqahHub';
import SpiritualForest from '@/components/forest/SpiritualForest';

// Clean SVG Icons for Main Page Navigation & Headers (Zero Emojis)
const TabSVGs = {
  Quran: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Tasbih: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24" />
    </svg>
  ),
  Mosque: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M4 10l8-4 8 4v10H4V10z" />
      <path d="M9 20v-6a3 3 0 0 1 6 0v6" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cosmicMode, setCosmicMode] = useState<'logarithmic' | '3d'>('logarithmic');
  const [worshipTab, setWorshipTab] = useState<'quran' | 'tasbih' | 'prayers' | 'virtues'>('quran');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartWirdForBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setWorshipTab('quran');
    const el = document.getElementById('worship-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-ui-header">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-tertiary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-primary">جاري تحميل لوحة الأبدية الروحانية...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-void-md md:p-void-xl pt-20 md:pt-24 flex flex-col gap-void-xl max-w-[1440px] mx-auto select-none" suppressHydrationWarning>
      
      {/* 0. Sticky Floating Prayer HUD with Live Countdown and Notifications */}
      <StickyPrayerHUD onOpenPrayerSection={() => {
        setWorshipTab('prayers');
        const el = document.getElementById('worship-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* App Header */}
      <header className="flex flex-col gap-4 text-center md:text-right">
        <div className="inline-flex items-center gap-2 self-center md:self-start px-4 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-mono text-tertiary text-xs tracking-wider uppercase">
            AETHERIS • مقياس الأبدية ومنظومة الصدقة الجارية
          </span>
        </div>

        <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface">
          لوحة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">الأبدية الروحانية</span>
        </h1>
        <p className="font-body-main text-on-surface-variant max-w-3xl text-base md:text-lg">
          منظومتك الشاملة للتأمل في عظمة الخالق من أدق الذرات إلى أطراف الكون، توثيق وردك اليومي، إهداء ثواب الطاعات لمن تحب، ومتابعة مواقيت الصلاة الحية.
        </p>
      </header>

      {/* 1. Cosmic Scale Section */}
      <section className="flex flex-col gap-void-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <h2 className="font-ui-header text-2xl text-on-surface font-bold">مقياس الكون اللوغاريتمي والآيات</h2>
              <p className="text-xs text-on-surface-variant">استكشف أحجام المخلوقات بالصور الحقيقية مع الآيات القرآنية والتفاسير التأملية</p>
            </div>
          </div>

          {/* Toggle between Logarithmic & 3D */}
          <div className="flex items-center bg-surface-container-high/60 p-1 rounded-2xl border border-outline-variant/30 backdrop-blur-md">
            <button
              onClick={() => setCosmicMode('logarithmic')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-2 ${
                cosmicMode === 'logarithmic'
                  ? 'bg-tertiary text-surface font-bold shadow-[0_0_15px_rgba(247,190,29,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20v18H2z"/><path d="m7 3 5 5 5-5"/></svg>
              المقياس اللوغاريتمي (صور حقيقية)
            </button>
            <button
              onClick={() => setCosmicMode('3d')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-2 ${
                cosmicMode === '3d'
                  ? 'bg-primary text-surface font-bold shadow-[0_0_15px_rgba(192,198,222,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              المجسم الفضائي (3D View)
            </button>
          </div>
        </div>

        {cosmicMode === 'logarithmic' ? <LogarithmicUniverseEngine /> : <CosmicScene />}
      </section>

      {/* 2. Dr. Iyad Qunaibi Relativity Calculation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-void-lg">
        {/* Hadith */}
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-low border border-outline-variant/15 p-void-lg flex flex-col justify-center min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-void-md">
              <div className="p-2 rounded-xl bg-tertiary/10 border border-tertiary/30 text-tertiary">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
              </div>
              <h3 className="font-ui-header text-on-surface text-xl font-bold">حلقة في فلاة</h3>
            </div>
            <p className="font-body-main text-on-surface-variant leading-relaxed text-lg" dir="rtl">
              «ما السماوات السبع في الكرسي إلا كحلقة ملقاة بأرض فلاة، وفضل العرش على الكرسي كفضل تلك الفلاة على تلك الحلقة»
            </p>
            <div className="mt-void-md w-full h-1 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-l from-tertiary to-transparent w-full opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div className="rounded-3xl bg-surface-container/40 backdrop-blur-lg border border-primary/10 p-void-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-void-sm">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/></svg>
              </div>
              <h3 className="font-ui-header text-on-surface text-xl font-bold">حسبة د. إياد القنيبي (نسبية الزمن)</h3>
            </div>
            <p className="font-body-main text-on-surface-variant text-base mt-4 leading-relaxed" dir="rtl">
              عمر الإنسان (120 سنة) = <strong>63 مليون</strong> دقيقة.<br/>
              يوم القيامة (50 ألف سنة) = <strong>26 مليار و298 مليون</strong> دقيقة.<br/>
              لو قسمنا 50 ألف سنة على 120 سنة: <br/>
              <span className="text-tertiary font-bold mt-2 block text-lg">
                كل دقيقة واحدة من حياتك = 417 دقيقة (حوالي 7 ساعات) من يوم القيامة!
              </span>
            </p>
          </div>
          <div className="space-y-void-md mt-void-lg">
            <div>
              <div className="flex justify-between text-xs font-label-mono mb-2">
                <span className="text-on-surface-variant">عمر الإنسان (120 سنة)</span>
                <span className="text-primary">0.0024%</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden relative">
                <div className="absolute right-0 top-0 h-full w-[2%] bg-primary shadow-[0_0_10px_rgba(192,198,222,0.8)]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-label-mono mb-2">
                <span className="text-on-surface-variant">يوم القيامة (50,000 سنة)</span>
                <span className="text-tertiary">100%</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden relative">
                <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-l from-tertiary via-tertiary/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sadaqah Jariyah & Dedication Hub */}
      <section className="flex flex-col gap-void-md">
        <SadaqahHub onSelectBeneficiaryForWird={handleStartWirdForBeneficiary} />
      </section>

      {/* 4. Smart Worship Hub (Quran, Tasbih, Prayers, Motivations) */}
      <section id="worship-section" className="flex flex-col gap-void-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <TabSVGs.Quran />
            </div>
            <div>
              <h2 className="font-ui-header text-2xl text-on-surface font-bold">منظومة العبادات والأوراد الموثقة</h2>
              <p className="text-xs text-on-surface-variant">أعمالك الموثقة تُخصم من يوم القيامة وتغرس نباتات حقيقية في واحتك</p>
            </div>
          </div>

          {/* Worship Tabs */}
          <div className="flex items-center bg-surface-container-high/60 p-1 rounded-2xl border border-outline-variant/30 backdrop-blur-md overflow-x-auto max-w-full">
            <button
              onClick={() => setWorshipTab('quran')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-1.5 whitespace-nowrap ${
                worshipTab === 'quran'
                  ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <TabSVGs.Quran />
              الورد القرآني (غرس نخيل)
            </button>
            <button
              onClick={() => setWorshipTab('tasbih')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-1.5 whitespace-nowrap ${
                worshipTab === 'tasbih'
                  ? 'bg-amber-500 text-surface font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <TabSVGs.Tasbih />
              السبحة الإلكترونية (زهور مضيئة)
            </button>
            <button
              onClick={() => setWorshipTab('prayers')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-1.5 whitespace-nowrap ${
                worshipTab === 'prayers'
                  ? 'bg-lime-500 text-surface font-bold shadow-[0_0_15px_rgba(132,204,22,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <TabSVGs.Mosque />
              الصلوات الخمس (شجر زيتون)
            </button>
            <button
              onClick={() => setWorshipTab('virtues')}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-1.5 whitespace-nowrap ${
                worshipTab === 'virtues'
                  ? 'bg-sky-500 text-surface font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <TabSVGs.Sparkles />
              زاد المؤمن (فضائل الصلوات)
            </button>
          </div>
        </div>

        <div className="w-full">
          {worshipTab === 'quran' && <SmartWird activeBeneficiary={selectedBeneficiary} />}
          {worshipTab === 'tasbih' && <TasbihTracker activeBeneficiary={selectedBeneficiary} />}
          {worshipTab === 'prayers' && <PrayerChecklist activeBeneficiary={selectedBeneficiary} />}
          {worshipTab === 'virtues' && <PrayerMotivatorCards />}
        </div>
      </section>

      {/* 5. 3D Spiritual Oasis & Forest */}
      <section className="flex flex-col gap-void-md pb-void-xl">
        <SpiritualForest />
      </section>
    </main>
  );
}
