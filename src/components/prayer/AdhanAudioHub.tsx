'use client';

import React, { useState, useEffect, useRef } from 'react';
import { adhanVoices, AdhanVoice } from '@/data/adhanVoices';

export default function AdhanAudioHub() {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('mecca-mulla');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('active_adhan_voice');
    if (saved) setSelectedVoiceId(saved);
  }, []);

  const handleTogglePlay = (voice: AdhanVoice) => {
    if (playingVoiceId === voice.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingVoiceId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(voice.audio_url);
      audioRef.current = audio;
      audio.play().catch(() => {});
      setPlayingVoiceId(voice.id);

      audio.onended = () => {
        setPlayingVoiceId(null);
      };
    }
  };

  const handleSelectAsDefault = (voice: AdhanVoice) => {
    setSelectedVoiceId(voice.id);
    localStorage.setItem('active_adhan_voice', voice.id);
  };

  return (
    <div className="bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 md:p-8 flex flex-col gap-6 select-none shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/15 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </div>
        <div>
          <h3 className="font-ui-header text-xl md:text-2xl text-on-surface font-bold">
            مكتبة أصوات الأذان لكبار المؤذنين
          </h3>
          <p className="font-body-main text-xs text-on-surface-variant">
            استمع واختر صوت الأذان المفضل من رحاب الحرمين الشريفين والمسجد الأقصى
          </p>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-void-md">
        {adhanVoices.map((voice) => {
          const isPlaying = playingVoiceId === voice.id;
          const isSelected = selectedVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-surface-container-high border-tertiary shadow-[0_0_20px_rgba(247,190,29,0.25)]'
                  : 'bg-surface-container-high/40 border-outline-variant/20 hover:border-primary/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-label-mono text-tertiary bg-tertiary/10 px-2.5 py-0.5 rounded-full border border-tertiary/20">
                      {voice.location}
                    </span>
                    <h4 className="font-ui-header text-lg font-bold text-on-surface mt-2">
                      {voice.name_ar}
                    </h4>
                    <span className="text-xs text-primary font-ui-header block">
                      {voice.muadhin}
                    </span>
                  </div>

                  {/* Play / Stop Button */}
                  <button
                    onClick={() => handleTogglePlay(voice)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                      isPlaying
                        ? 'bg-tertiary text-surface scale-105 shadow-[0_0_15px_rgba(247,190,29,0.5)]'
                        : 'bg-surface text-on-surface hover:text-tertiary border border-outline-variant/30'
                    }`}
                    title={isPlaying ? 'إيقاف' : 'استماع للأذان'}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                </div>

                <p className="text-xs text-on-surface-variant font-body-main leading-relaxed mt-2 mb-4">
                  {voice.description}
                </p>
              </div>

              {/* Set Default Button */}
              <button
                onClick={() => handleSelectAsDefault(voice)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-ui-header font-bold transition-all flex items-center justify-center gap-2 border ${
                  isSelected
                    ? 'bg-tertiary text-surface border-tertiary'
                    : 'bg-surface/60 hover:bg-surface text-on-surface-variant hover:text-on-surface border-outline-variant/20'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{isSelected ? 'الأذان المعتمد للتنبيهات' : 'تعيين كأذان معتمد'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
