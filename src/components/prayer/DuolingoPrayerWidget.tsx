'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchLivePrayerTimes, calculatePrayerState, PrayerState } from '@/lib/prayerService';
import { adhanVoices } from '@/data/adhanVoices';

export default function DuolingoPrayerWidget({
  onOpenFullSchedule,
}: {
  onOpenFullSchedule?: () => void;
}) {
  const [prayerState, setPrayerState] = useState<PrayerState | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('حافظ على صلاتك لتكون في ذمة الله ورعايته');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Motivational speech phrases depending on minutes remaining
  const getMotivationalMessage = (state: PrayerState) => {
    const mins = Math.floor(state.secondsRemaining / 60);
    const pName = state.nextPrayer?.name_ar || 'الصلاة';

    if (mins <= 15) {
      return `اقترب وقت ${pName}! استعد بالوضوء وأفرغ قلبك من شواغل الدنيا 🌟`;
    } else if (mins <= 45) {
      return `متبقي ${mins} دقيقة على ${pName} • صلاة الجماعة تزيد على صلاة الفذ بـ 27 درجة!`;
    } else {
      return `«أحب الأعمال إلى الله الصلاة على وقتها» • جعلنا الله وإياك من المحافظين عليها.`;
    }
  };

  useEffect(() => {
    fetchLivePrayerTimes().then((p) => {
      const state = calculatePrayerState(p, new Date());
      setPrayerState(state);
      setSpeechBubbleText(getMotivationalMessage(state));
    });

    const interval = setInterval(() => {
      fetchLivePrayerTimes().then((p) => {
        const state = calculatePrayerState(p, new Date());
        setPrayerState(state);
        setSpeechBubbleText(getMotivationalMessage(state));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayAdhanPreview = () => {
    if (isPlayingAdhan) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    } else {
      const activeVoiceId = localStorage.getItem('active_adhan_voice') || 'mecca-mulla';
      const voice = adhanVoices.find((v) => v.id === activeVoiceId) || adhanVoices[0];

      const audio = new Audio(voice.audio_url);
      audioRef.current = audio;
      audio.play().catch(() => {});
      setIsPlayingAdhan(true);

      audio.onended = () => {
        setIsPlayingAdhan(false);
      };
    }
  };

  if (!prayerState) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none animate-fade-in pointer-events-auto">
      {isMinimized ? (
        /* Minimized Floating Duolingo-style Orb */
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-3xl bg-surface-container-high/90 border-2 border-tertiary shadow-[0_0_25px_rgba(247,190,29,0.4)] flex items-center justify-center text-tertiary hover:scale-110 active:scale-95 transition-all backdrop-blur-xl group"
          title="عرض بطاقة الصلاة التفاعلية"
        >
          <svg className="w-7 h-7 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M4 10l8-4 8 4v10H4V10z" />
            <path d="M9 20v-6a3 3 0 0 1 6 0v6" />
            <circle cx="12" cy="7" r="1" fill="currentColor" />
          </svg>
        </button>
      ) : (
        /* Full Duolingo-Style Interactive Card */
        <div className="w-[320px] md:w-[350px] bg-[#0b1626]/95 backdrop-blur-2xl border-2 border-tertiary/40 rounded-3xl p-5 shadow-[0_15px_45px_rgba(0,0,0,0.6)] flex flex-col gap-3 text-right relative">
          
          {/* Card Top Actions: Minimize & Sound */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-label-mono text-tertiary font-bold tracking-wide uppercase">
                تنبيه الصلاة التفاعلي
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePlayAdhanPreview}
                className={`p-1.5 rounded-xl border text-xs transition-all ${
                  isPlayingAdhan
                    ? 'bg-tertiary text-surface border-tertiary shadow-[0_0_10px_rgba(247,190,29,0.5)]'
                    : 'bg-surface/80 text-on-surface-variant hover:text-tertiary border-outline-variant/30'
                }`}
                title={isPlayingAdhan ? 'إيقاف الأذان' : 'سماع الأذان المعتمد'}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-xl bg-surface/80 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                title="تصغير البطاقة"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Duolingo Character Speech Bubble */}
          <div className="bg-gradient-to-r from-tertiary/15 to-transparent border-r-4 border-tertiary rounded-2xl p-3.5 flex items-start gap-3 shadow-inner">
            <div className="w-10 h-10 rounded-2xl bg-surface border border-tertiary/40 flex items-center justify-center text-tertiary shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <p className="text-xs text-yellow-200/95 font-body-main leading-relaxed" dir="rtl">
              {speechBubbleText}
            </p>
          </div>

          {/* Next Prayer Big Timer Block */}
          <div className="bg-surface/60 rounded-2xl p-4 border border-outline-variant/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-on-surface-variant font-ui-header block">
                الصلاة القادمة:
              </span>
              <h4 className="text-xl font-bold text-tertiary font-ui-header">
                {prayerState.nextPrayer?.name_ar}
              </h4>
              <span className="text-xs text-gray-300 font-label-mono">
                {prayerState.nextPrayer?.time_formatted}
              </span>
            </div>

            {/* Circular Countdown Ring */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold font-label-mono text-white tracking-widest">
                {prayerState.formattedCountdown}
              </span>
              <span className="text-[10px] text-on-surface-variant font-ui-header">
                الوقت المتبقي
              </span>
            </div>
          </div>

          {/* Duolingo Streak / Consistency Badge */}
          <div className="flex items-center justify-between text-xs py-2 px-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/15 font-ui-header">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              <span>سلسلة الالتزام بالصلوات</span>
            </div>
            <span className="font-label-mono text-tertiary font-bold">5 صلوات اليوم</span>
          </div>

          {/* Open Full Schedule Button */}
          {onOpenFullSchedule && (
            <button
              onClick={onOpenFullSchedule}
              className="w-full py-2.5 bg-surface-container-high hover:bg-tertiary hover:text-surface text-on-surface text-xs font-ui-header font-bold rounded-xl border border-outline-variant/20 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>عرض جدول الصلوات ورادار مكة</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

        </div>
      )}
    </div>
  );
}
