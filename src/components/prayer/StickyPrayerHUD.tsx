'use client';

import React, { useState, useEffect } from 'react';
import { fetchLivePrayerTimes, calculatePrayerState, PrayerState, PrayerTimeItem } from '@/lib/prayerService';

// Reusable Pure SVG Icons (Strictly NO emojis)
const Icons = {
  Mosque: () => (
    <svg className="w-5 h-5 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M4 10l8-4 8 4v10H4V10z" />
      <path d="M9 20v-6a3 3 0 0 1 6 0v6" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Bell: ({ active }: { active: boolean }) => (
    <svg className={`w-4 h-4 ${active ? 'text-tertiary animate-pulse' : 'text-on-surface-variant'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Sunrise: () => (
    <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6M4.93 10.93l4.24-4.24M19.07 10.93l-4.24-4.24M2 18h20M7 18a5 5 0 0 1 10 0" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  Sunset: () => (
    <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10v6M4.93 10.93l4.24 4.24M19.07 10.93l-4.24 4.24M2 18h20M7 18a5 5 0 0 1 10 0" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  ChevronUp: () => (
    <svg className="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

export default function StickyPrayerHUD({
  onOpenPrayerSection,
}: {
  onOpenPrayerSection?: () => void;
}) {
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [notifiedForPrayer, setNotifiedForPrayer] = useState<string | null>(null);

  // Play gentle web audio chime
  const playGentleChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  // Request browser notification permission
  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('متصفحك لا يدعم الإشعارات المباشرة');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled);
      playGentleChime();
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        playGentleChime();
        new Notification('مقياس الأبدية • تنبيهات الصلاة', {
          body: 'تم تفعيل التنبيهات المباركة للصلوات الخمس بنجاح.',
          icon: '/images/earth.png'
        });
      }
    }
  };

  // Live Timer Tick every second
  useEffect(() => {
    let rawPrayers: PrayerTimeItem[] = [];

    fetchLivePrayerTimes().then((prayers) => {
      rawPrayers = prayers;
      setPrayerState(calculatePrayerState(prayers, new Date()));
    });

    const interval = setInterval(() => {
      if (rawPrayers.length > 0) {
        const state = calculatePrayerState(rawPrayers, new Date());
        setPrayerState(state);

        // Check if next prayer is within 15 minutes (900s) and notification not yet sent
        if (notificationsEnabled && state.nextPrayer && state.secondsRemaining <= 900 && notifiedForPrayer !== state.nextPrayer.id) {
          setNotifiedForPrayer(state.nextPrayer.id);
          playGentleChime();
          new Notification(`اقترب وقت ${state.nextPrayer.name_ar}`, {
            body: `تبقى 15 دقيقة على موعد ${state.nextPrayer.name_ar} (${state.nextPrayer.time_formatted}). استعد للوضوء واسترح بالصلاة.`,
            icon: '/images/sun.png'
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [notificationsEnabled, notifiedForPrayer]);

  if (!prayerState) return null;

  const getPrayerIcon = (id: string) => {
    switch (id) {
      case 'fajr': return <Icons.Sunrise />;
      case 'dhuhr': return <Icons.Sun />;
      case 'asr': return <Icons.Sun />;
      case 'maghrib': return <Icons.Sunset />;
      case 'isha': return <Icons.Moon />;
      default: return <Icons.Mosque />;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-3 py-2 pointer-events-none select-none transition-all duration-300">
      <div className="max-w-[1400px] mx-auto pointer-events-auto">
        <div className="bg-surface-container-lowest/85 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-right">
          
          {/* Main Info: Next Prayer & Countdown */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center">
                <Icons.Mosque />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-ui-header font-bold text-on-surface">
                    الصلاة القادمة: <strong className="text-tertiary">{prayerState.nextPrayer?.name_ar}</strong>
                  </span>
                  <span className="text-[11px] font-label-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant/20">
                    {prayerState.nextPrayer?.time_formatted}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-label-mono mt-0.5">
                  <Icons.Clock />
                  <span>متبقي: <strong className="text-tertiary font-bold tracking-wider">{prayerState.formattedCountdown}</strong></span>
                </div>
              </div>
            </div>

            {/* Mobile Toggle Controls */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-xl bg-surface-container-high border border-outline-variant/20 text-on-surface"
                title="تفعيل الإشعارات"
              >
                <Icons.Bell active={notificationsEnabled} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl bg-surface-container-high border border-outline-variant/20 text-on-surface"
              >
                {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
              </button>
            </div>
          </div>

          {/* Expanded 5 Prayers Strip */}
          {isExpanded && (
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-between md:justify-center py-1 scrollbar-hide border-t md:border-t-0 border-outline-variant/15 pt-2 md:pt-0">
              {prayerState.prayers.map((p) => {
                const isNext = p.isNext;
                const isCurrent = p.isCurrent;
                return (
                  <div
                    key={p.id}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-ui-header ${
                      isNext
                        ? 'bg-tertiary/20 text-tertiary border-tertiary font-bold shadow-[0_0_12px_rgba(247,190,29,0.3)]'
                        : isCurrent
                        ? 'bg-surface-container-high text-primary border-primary/40'
                        : 'bg-surface-container/40 text-on-surface-variant border-outline-variant/15'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {getPrayerIcon(p.id)}
                      <span>{p.name_ar}</span>
                    </div>
                    <span className="font-label-mono text-[11px] opacity-90">{p.time_formatted}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Desktop Right Controls: Hijri Date & Notification Button */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-on-surface-variant font-ui-header bg-surface-container-high/60 px-3 py-1.5 rounded-xl border border-outline-variant/20">
              {prayerState.hijriDate}
            </span>

            <button
              onClick={toggleNotifications}
              className={`px-3 py-1.5 rounded-xl border text-xs font-ui-header flex items-center gap-1.5 transition-all ${
                notificationsEnabled
                  ? 'bg-tertiary/20 text-tertiary border-tertiary shadow-[0_0_12px_rgba(247,190,29,0.25)] font-bold'
                  : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface border-outline-variant/30'
              }`}
            >
              <Icons.Bell active={notificationsEnabled} />
              <span>{notificationsEnabled ? 'الإشعارات مفعلة' : 'تفعيل إشعارات الأذان'}</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/20 hover:text-on-surface transition-colors"
              title={isExpanded ? 'طي الشريط' : 'توسيع الشريط'}
            >
              {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
