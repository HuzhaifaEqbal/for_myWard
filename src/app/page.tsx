'use client';

import { useState } from 'react';
import LogarithmicUniverseEngine from '@/components/cosmic/LogarithmicUniverseEngine';
import CosmicScene from '@/components/cosmic/CosmicScene';
import SmartWird from '@/components/wird/SmartWird';
import SpiritualForest from '@/components/forest/SpiritualForest';

export default function Home() {
  const [viewMode, setViewMode] = useState<'logarithmic' | '3d'>('logarithmic');

  return (
    <main className="min-h-screen p-void-md md:p-void-xl flex flex-col gap-void-xl max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4 text-center md:text-right">
        <div className="inline-flex items-center gap-2 self-center md:self-start px-4 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-mono text-tertiary text-xs tracking-wider uppercase">
            AETHERIS • مقياس الأبدية والكون
          </span>
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface">
          لوحة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">الأبدية الروحانية</span>
        </h1>
        <p className="font-body-main text-on-surface-variant max-w-2xl text-base md:text-lg">
          مساحتك الخاصة للتأمل في عظمة خلق الله من أصغر الجسيمات دون الذرية حتى أطراف الكون، وتتبع وردك اليومي وبناء أثرك الروحي.
        </p>
      </header>

      {/* Cosmic Section */}
      <section className="flex flex-col gap-void-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-3xl">travel_explore</span>
            <div>
              <h2 className="font-ui-header text-2xl text-on-surface">مقياس الكون اللوغاريتمي والآيات</h2>
              <p className="text-xs text-on-surface-variant">استكشف أحجام المخلوقات بالصور الحقيقية مع الآيات القرآنية والتفاسير التأملية</p>
            </div>
          </div>

          {/* Toggle between Logarithmic Engine & 3D scene */}
          <div className="flex items-center bg-surface-container-high/60 p-1 rounded-2xl border border-outline-variant/30 backdrop-blur-md">
            <button
              onClick={() => setViewMode('logarithmic')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-2 ${
                viewMode === 'logarithmic'
                  ? 'bg-tertiary text-surface font-bold shadow-[0_0_15px_rgba(247,190,29,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">architecture</span>
              المقياس اللوغاريتمي (صور حقيقية)
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-ui-header transition-all flex items-center gap-2 ${
                viewMode === '3d'
                  ? 'bg-primary text-surface font-bold shadow-[0_0_15px_rgba(192,198,222,0.3)]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">3d_rotation</span>
              المجسم ثلاثي الأبعاد (3D)
            </button>
          </div>
        </div>

        {/* View Component */}
        {viewMode === 'logarithmic' ? (
          <LogarithmicUniverseEngine />
        ) : (
          <CosmicScene />
        )}
      </section>

      {/* Dr Iyad Qunaibi Calculation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-void-lg">
        {/* Hadith */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant/15 p-void-lg flex flex-col justify-center min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/80 to-transparent z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-void-md">
              <span className="material-symbols-outlined text-tertiary text-xl">history_edu</span>
              <h3 className="font-ui-header text-on-surface text-xl">حلقة في فلاة</h3>
            </div>
            <p className="font-body-main text-on-surface-variant leading-relaxed text-lg" dir="rtl">
              «ما السماوات السبع في الكرسي إلا كحلقة ملقاة بأرض فلاة، وفضل العرش على الكرسي كفضل تلك الفلاة على تلك الحلقة»
            </p>
            <div className="mt-void-md w-full h-1 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-l from-tertiary to-transparent w-full opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Math */}
        <div className="rounded-2xl bg-surface-container/40 backdrop-blur-lg border border-primary/10 p-void-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-void-sm">
              <span className="material-symbols-outlined text-primary text-xl">calculate</span>
              <h3 className="font-ui-header text-on-surface text-xl">حسبة د. إياد القنيبي (نسبية الزمن)</h3>
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

      {/* Smart Wird Section */}
      <section className="flex flex-col gap-void-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
          <h2 className="font-ui-header text-2xl text-on-surface">الورد القرآني الذكي</h2>
        </div>
        <p className="font-body-main text-on-surface-variant max-w-3xl mb-4">
          تتبع قراءتك، وكل صفحة تنهيها ستزيد من رصيدك وتقلل من طول انتظار يوم القيامة بناءً على المقياس أعلاه، بالإضافة إلى مساهمتها في زراعة غابتك الروحانية.
        </p>
        <div className="w-full">
          <SmartWird />
        </div>
      </section>

      {/* Forest Section */}
      <section className="flex flex-col gap-void-md pb-void-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-3xl">forest</span>
          <h2 className="font-ui-header text-2xl text-on-surface">الغابة الروحانية</h2>
        </div>
        <p className="font-body-main text-on-surface-variant max-w-3xl mb-4">
          عالمك الخاص الذي تبنيه بطاعاتك. هنا تُزرع الأشجار في قاعدة البيانات الخاصة بك مع كل ورد تنهيه، وكل تسبيحة أو صلاة تؤديها. شاهد أثرك ينمو يوماً بعد يوم.
        </p>
        <div className="w-full">
          <SpiritualForest />
        </div>
      </section>
    </main>
  );
}
