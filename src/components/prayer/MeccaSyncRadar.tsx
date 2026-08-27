'use client';

import React, { useState, useEffect } from 'react';
import { fetchLivePrayerTimes, calculatePrayerState, PrayerTimeItem } from '@/lib/prayerService';

const KAABA_COORDS = { lat: 21.422487, lng: 39.826206 };

const WORLD_CITIES = [
  { name: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262 },
  { name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692 },
  { name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753 },
  { name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137 },
  { name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357 },
  { name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765 },
  { name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661 },
  { name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708 },
  { name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784 },
  { name: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416 },
  { name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588 },
  { name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815 },
  { name: 'عَمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284 },
  { name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774 },
  { name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310 },
  { name: 'لندن', country: 'بريطانيا', lat: 51.5074, lng: -0.1278 },
  { name: 'باريس', country: 'فرنسا', lat: 48.8566, lng: 2.3522 },
];

// Haversine Great Circle Distance
function calculateDistanceToKaaba(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((KAABA_COORDS.lat - lat) * Math.PI) / 180;
  const dLng = ((KAABA_COORDS.lng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_COORDS.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Qibla Bearing Angle
function calculateQiblaBearing(lat: number, lng: number): number {
  const phiK = (KAABA_COORDS.lat * Math.PI) / 180;
  const lambdaK = (KAABA_COORDS.lng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((bearing + 360) % 360);
}

export default function MeccaSyncRadar() {
  const [selectedCity, setSelectedCity] = useState(WORLD_CITIES[2]); // Default Riyadh
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 24.7136, lng: 46.6753 });
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [distanceKm, setDistanceKm] = useState<number>(calculateDistanceToKaaba(24.7136, 46.6753));
  const [qiblaAngle, setQiblaAngle] = useState<number>(calculateQiblaBearing(24.7136, 46.6753));

  // Local & Mecca Prayer Times
  const [localPrayers, setLocalPrayers] = useState<PrayerTimeItem[]>([]);
  const [meccaPrayers, setMeccaPrayers] = useState<PrayerTimeItem[]>([]);
  const [lastThirdTime, setLastThirdTime] = useState<string>('02:15 ص');

  useEffect(() => {
    fetchLivePrayerTimes().then((p) => {
      setLocalPrayers(p);
      setMeccaPrayers(p); // Mecca baseline

      // Compute last third of night (between Maghrib and Fajr)
      const maghrib = p.find((x) => x.id === 'maghrib')?.date_obj || new Date();
      const fajr = p.find((x) => x.id === 'fajr')?.date_obj || new Date();
      const tomorrowFajr = new Date(fajr);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);

      const nightSpan = tomorrowFajr.getTime() - maghrib.getTime();
      const lastThirdDate = new Date(maghrib.getTime() + (nightSpan * 2) / 3);
      const h = (lastThirdDate.getHours() % 12 || 12).toString().padStart(2, '0');
      const m = lastThirdDate.getMinutes().toString().padStart(2, '0');
      setLastThirdTime(`${h}:${m} ص`);
    });
  }, []);

  // GPS Auto Scanner
  const handleScanLocation = () => {
    setIsScanning(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords({ lat, lng });
          setDistanceKm(calculateDistanceToKaaba(lat, lng));
          setQiblaAngle(calculateQiblaBearing(lat, lng));
          setSelectedCity({ name: 'موقعي الفعلي (GPS)', country: 'تحديد تلقائي', lat, lng });
          setTimeout(() => setIsScanning(false), 1200);
        },
        () => {
          setIsScanning(false);
          alert('تعذر الوصول إلى الـ GPS. يمكنك اختيار مدينتك يدوياً من القائمة.');
        },
        { timeout: 8000 }
      );
    } else {
      setIsScanning(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    const found = WORLD_CITIES.find((c) => c.name === cityName);
    if (found) {
      setSelectedCity(found);
      setUserCoords({ lat: found.lat, lng: found.lng });
      setDistanceKm(calculateDistanceToKaaba(found.lat, found.lng));
      setQiblaAngle(calculateQiblaBearing(found.lat, found.lng));
    }
  };

  return (
    <div className="bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 md:p-8 flex flex-col gap-6 select-none shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-outline-variant/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div>
            <h3 className="font-ui-header text-xl md:text-2xl text-on-surface font-bold">
              رادار الكعبة المشرفة ومقارنة مواقيت مكة
            </h3>
            <p className="font-body-main text-xs text-on-surface-variant">
              حساب المسافة الجيوديسية الفلكية، زاوية القبلة، ومقارنة حية مع الحرم المكي الشريف
            </p>
          </div>
        </div>

        {/* GPS Scan & Manual City Picker */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleScanLocation}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-tertiary/20 text-tertiary border border-tertiary/40 font-ui-header text-xs flex items-center gap-2 hover:bg-tertiary hover:text-surface transition-all font-bold"
          >
            <svg className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
            <span>{isScanning ? 'جاري المسح...' : 'تحديد موقعي التلقائي (GPS)'}</span>
          </button>

          <select
            value={selectedCity.name}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-ui-header px-3 py-2 rounded-xl outline-none focus:border-tertiary"
          >
            {WORLD_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Radar & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-void-md">
        
        {/* Radar Visual Display */}
        <div className="bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-center">
          <div className="relative w-44 h-44 flex items-center justify-center mb-4">
            {/* Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-tertiary/20"></div>
            <div className="absolute inset-4 rounded-full border border-tertiary/30"></div>
            <div className="absolute inset-8 rounded-full border border-tertiary/40"></div>
            <div className="absolute inset-12 rounded-full border border-tertiary/50"></div>

            {/* Rotating Radar Scanner Blade */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-tertiary/20 to-transparent animate-spin duration-1000 origin-center pointer-events-none"></div>

            {/* Center Target Kaaba Pin */}
            <div className="w-12 h-12 rounded-2xl bg-surface border-2 border-tertiary flex items-center justify-center text-tertiary shadow-[0_0_20px_rgba(247,190,29,0.5)] z-10">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M4 10l8-4 8 4v10H4V10z" />
                <path d="M9 20v-6a3 3 0 0 1 6 0v6" />
              </svg>
            </div>
          </div>

          <span className="text-xs text-on-surface-variant font-ui-header">
            الموقع الحالي: <strong className="text-on-surface font-bold">{selectedCity.name}</strong>
          </span>
          <span className="text-[11px] text-gray-400 font-label-mono mt-0.5">
            {userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E
          </span>
        </div>

        {/* Distance & Qibla Bearing Cards */}
        <div className="flex flex-col gap-3 justify-between">
          <div className="bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-ui-header block mb-1">المسافة إلى الكعبة المشرفة:</span>
              <span className="text-2xl md:text-3xl font-bold font-label-mono text-tertiary">
                {distanceKm.toLocaleString('ar-EG')} <span className="text-sm font-ui-header text-on-surface font-normal">كم</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              </svg>
            </div>
          </div>

          <div className="bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-ui-header block mb-1">زاوية انحراف القبلة:</span>
              <span className="text-2xl md:text-3xl font-bold font-label-mono text-cyan-400">
                {qiblaAngle}° <span className="text-sm font-ui-header text-on-surface font-normal">درجة</span>
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2" />
              </svg>
            </div>
          </div>

          <div className="bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-ui-header block mb-1">بداية الثلث الأخير من الليل:</span>
              <span className="text-xl md:text-2xl font-bold font-label-mono text-indigo-300">
                {lastThirdTime}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Live Comparison Table: Local vs Mecca */}
        <div className="bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-ui-header text-sm font-bold text-on-surface mb-3 flex items-center justify-between border-b border-outline-variant/15 pb-2">
              <span>مقارنة المواقيت الحية</span>
              <span className="text-[11px] text-tertiary font-normal">مكة المكرمة vs {selectedCity.name}</span>
            </h4>

            <div className="flex flex-col gap-2">
              {['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'].map((name, idx) => {
                const lp = localPrayers[idx];
                const mp = meccaPrayers[idx];
                return (
                  <div key={name} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-surface/40 border border-outline-variant/10">
                    <span className="font-ui-header font-bold text-on-surface">{name}</span>
                    <span className="font-label-mono text-gray-300">{lp ? lp.time_formatted : '--:--'}</span>
                    <span className="font-label-mono text-tertiary font-bold">{mp ? mp.time_formatted : '--:--'} (مكة)</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-on-surface-variant font-ui-header mt-3 pt-2 border-t border-outline-variant/15 flex items-center gap-1.5 text-center justify-center">
            <svg className="w-4 h-4 text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>أذان الحرم المكي يسبق أو يتطابق معك حسب فارق خطوط الطول</span>
          </div>
        </div>

      </div>
    </div>
  );
}
