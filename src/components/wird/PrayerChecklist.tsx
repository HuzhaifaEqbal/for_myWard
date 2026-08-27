'use client';

import React, { useState, useEffect } from 'react';
import { Beneficiary } from '@/components/sadaqah/SadaqahHub';

const PRAYERS = [
  { id: 'fajr', name: 'صلاة الفجر', sunnah: 'ركعتا الفجر خير من الدنيا وما فيها' },
  { id: 'dhuhr', name: 'صلاة الظهر', sunnah: '4 ركعات قبل الظهر وركعتان بعدها' },
  { id: 'asr', name: 'صلاة العصر', sunnah: 'الصلاة الوسطى' },
  { id: 'maghrib', name: 'صلاة المغرب', sunnah: 'ركعتان بعد المغرب' },
  { id: 'isha', name: 'صلاة العشاء', sunnah: 'ركعتان بعد العشاء والوتر' },
];

export default function PrayerChecklist({
  activeBeneficiary,
}: {
  activeBeneficiary?: Beneficiary | null;
}) {
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>({});
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [dedicatedTo, setDedicatedTo] = useState<string>('self');
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load local prayer state for today
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`prayers_${today}`);
    if (saved) {
      try {
        setCompletedPrayers(JSON.parse(saved));
      } catch (e) {}
    }

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

  const handleTogglePrayer = async (prayerId: string, prayerName: string) => {
    if (completedPrayers[prayerId]) return; // Already completed for today

    const updated = { ...completedPrayers, [prayerId]: true };
    setCompletedPrayers(updated);

    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`prayers_${today}`, JSON.stringify(updated));

    const selectedPerson = beneficiaries.find((b) => b._id === dedicatedTo);
    const personName = selectedPerson ? selectedPerson.name : 'نفسك';

    try {
      await fetch('/api/tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deedType: 'prayer',
          treeType: 'olive',
          deedDetail: `أداء ${prayerName} في وقتها`,
          beneficiaryId: dedicatedTo,
          beneficiaryName: personName
        })
      });

      setRewardMsg(`تقبل الله! تم توثيق أداء ${prayerName} وغرس شجرة زيتون مباركة باسم (${personName}) 🫒`);
      setTimeout(() => setRewardMsg(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = Object.values(completedPrayers).filter(Boolean).length;

  return (
    <div className="bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 md:p-8 flex flex-col gap-5 select-none shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-outline-variant/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-lime-400 text-3xl">mosque</span>
          <div>
            <h3 className="font-ui-header text-xl text-on-surface font-bold">جدول الصلوات الخمس اليومي</h3>
            <span className="text-xs text-on-surface-variant">كل صلاة مؤداة تغرس شجرة زيتون مباركة في واحتك الروحانية</span>
          </div>
        </div>

        {/* Dedication Dropdown */}
        <div className="flex items-center gap-2 bg-surface/80 px-3 py-1.5 rounded-2xl border border-outline-variant/30 text-xs font-ui-header">
          <span className="text-on-surface-variant">إهداء إلى:</span>
          <select
            value={dedicatedTo}
            onChange={(e) => setDedicatedTo(e.target.value)}
            className="bg-transparent text-tertiary font-bold outline-none cursor-pointer"
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

      {/* Prayers List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {PRAYERS.map((p) => {
          const isDone = !!completedPrayers[p.id];
          return (
            <button
              key={p.id}
              onClick={() => handleTogglePrayer(p.id, p.name)}
              disabled={isDone}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-between text-center transition-all min-h-[110px] ${
                isDone
                  ? 'bg-lime-500/15 border-lime-500/50 text-lime-300 shadow-[0_0_15px_rgba(132,204,22,0.15)] cursor-default'
                  : 'bg-surface-container/60 border-outline-variant/20 hover:border-lime-400 hover:bg-surface-container-high/80 text-on-surface cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-ui-header text-sm font-bold">{p.name}</span>
                <span className={`material-symbols-outlined text-xl ${isDone ? 'text-lime-400' : 'text-on-surface-variant opacity-40'}`}>
                  {isDone ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>
              <span className="text-[10px] text-on-surface-variant leading-tight">{p.sunnah}</span>
              {isDone && <span className="text-[10px] text-lime-400 font-label-mono mt-1">غُرست شجرة 🫒</span>}
            </button>
          );
        })}
      </div>

      {/* Reward Notification */}
      {rewardMsg && (
        <div className="p-3.5 bg-lime-500/15 border border-lime-500/40 text-lime-300 rounded-2xl text-xs md:text-sm font-ui-header text-center animate-fade-in flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">nature</span>
          <span>{rewardMsg}</span>
        </div>
      )}
    </div>
  );
}
