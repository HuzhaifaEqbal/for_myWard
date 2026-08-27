'use client';

import React, { useState, useEffect } from 'react';
import { Beneficiary } from '@/components/sadaqah/SadaqahHub';

const DHIKR_PRESETS = [
  { id: 'subhanallah', text: 'سُبْحَانَ اللَّهِ', countTarget: 33 },
  { id: 'alhamdulillah', text: 'الْحَمْدُ لِلَّهِ', countTarget: 33 },
  { id: 'allahuakbar', text: 'اللَّهُ أَكْبَرُ', countTarget: 34 },
  { id: 'astaghfirullah', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', countTarget: 100 },
  { id: 'salawat', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', countTarget: 100 },
  { id: 'la_ilaha_illallah', text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', countTarget: 100 },
];

export default function TasbihTracker({
  activeBeneficiary,
}: {
  activeBeneficiary?: Beneficiary | null;
}) {
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_PRESETS[0]);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalSessionCount, setTotalSessionCount] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [dedicatedTo, setDedicatedTo] = useState<string>('self');
  const [isRecording, setIsRecording] = useState(false);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/beneficiaries')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBeneficiaries(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeBeneficiary) {
      setDedicatedTo(activeBeneficiary._id);
    }
  }, [activeBeneficiary]);

  const handleTasbihClick = async () => {
    // Optional mobile vibration
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }

    const nextCount = currentCount + 1;
    const nextTotal = totalSessionCount + 1;
    setCurrentCount(nextCount);
    setTotalSessionCount(nextTotal);

    // If target reached (e.g. 33 or 100)
    if (nextCount >= selectedDhikr.countTarget) {
      setIsRecording(true);
      const selectedPerson = beneficiaries.find((b) => b._id === dedicatedTo);
      const personName = selectedPerson ? selectedPerson.name : 'نفسك';

      try {
        await fetch('/api/dhikr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            count: nextCount,
            dhikrText: selectedDhikr.text,
            beneficiaryId: dedicatedTo,
            beneficiaryName: personName
          })
        });

        setRewardNotice(`تقبل الله! تم توثيق ${nextCount} تسبيحة وغرس زهرة مضيئة في واحتك مهداة إلى: ${personName} 🌸`);
        setTimeout(() => setRewardNotice(null), 5000);
      } catch (e) {
        console.error(e);
      } finally {
        setIsRecording(false);
        setCurrentCount(0); // Reset round
      }
    }
  };

  const selectedPersonObj = beneficiaries.find((b) => b._id === dedicatedTo);

  return (
    <div className="bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 md:p-8 flex flex-col items-center select-none shadow-2xl">
      {/* Header & Dedication Selector */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-outline-variant/15 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-3xl">fingerprint</span>
          <div>
            <h3 className="font-ui-header text-xl text-on-surface font-bold">السبحة الإلكترونية الموثقة</h3>
            <span className="text-xs text-on-surface-variant">كل 33 أو 100 تسبيحة حقيقية تغرس زهرة مضيئة في الغابة</span>
          </div>
        </div>

        {/* Dedication Selector */}
        <div className="flex items-center gap-2 bg-surface/80 px-3 py-1.5 rounded-2xl border border-outline-variant/30">
          <span className="text-xs text-on-surface-variant font-ui-header">إهداء إلى:</span>
          <select
            value={dedicatedTo}
            onChange={(e) => setDedicatedTo(e.target.value)}
            className="bg-transparent text-xs font-ui-header text-tertiary outline-none cursor-pointer"
          >
            <option value="self" className="bg-surface text-on-surface">نفسي</option>
            {beneficiaries.map((b) => (
              <option key={b._id} value={b._id} className="bg-surface text-on-surface">
                {b.name} ({b.relationship})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dhikr Preset Pills */}
      <div className="flex gap-2 overflow-x-auto w-full pb-3 mb-6 scrollbar-hide justify-start md:justify-center">
        {DHIKR_PRESETS.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDhikr(d);
              setCurrentCount(0);
            }}
            className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-ui-header whitespace-nowrap transition-all border ${
              selectedDhikr.id === d.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold'
                : 'bg-surface-container/60 text-on-surface-variant border-outline-variant/20 hover:border-primary/40'
            }`}
          >
            {d.text} ({d.countTarget})
          </button>
        ))}
      </div>

      {/* Main Interactive Tasbih Bead Button */}
      <div className="relative my-4 flex flex-col items-center">
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={handleTasbihClick}
          disabled={isRecording}
          className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-lowest border-4 border-amber-400/40 hover:border-amber-400 active:scale-95 transition-all duration-150 shadow-[0_0_40px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center p-4 relative group cursor-pointer"
        >
          <span className="text-sm md:text-base font-verse-display text-amber-200/90 text-center leading-relaxed px-2 mb-2">
            {selectedDhikr.text}
          </span>
          <span className="text-4xl md:text-5xl font-bold font-label-mono text-amber-400 group-hover:scale-110 transition-transform">
            {currentCount}
          </span>
          <span className="text-[11px] text-on-surface-variant font-label-mono mt-1">
            الهدف: {selectedDhikr.countTarget}
          </span>
        </button>

        <span className="text-xs text-on-surface-variant font-ui-header mt-4">
          اضغط في أي مكان داخل الدائرة للتسبيح
        </span>
      </div>

      {/* Reward Notice */}
      {rewardNotice && (
        <div className="mt-4 p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs md:text-sm font-ui-header text-center animate-fade-in flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">spa</span>
          <span>{rewardNotice}</span>
        </div>
      )}
    </div>
  );
}
