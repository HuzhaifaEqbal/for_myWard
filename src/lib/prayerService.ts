export interface PrayerTimeItem {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name_ar: string;
  time: string; // "04:55"
  time_formatted: string; // "04:55 ص"
  date_obj: Date;
  isNext: boolean;
  isCurrent: boolean;
}

export interface PrayerState {
  prayers: PrayerTimeItem[];
  currentPrayer: PrayerTimeItem | null;
  nextPrayer: PrayerTimeItem | null;
  secondsRemaining: number;
  progressPercent: number;
  formattedCountdown: string;
  cityName: string;
  hijriDate: string;
}

// Fallback prayer offsets relative to sunrise/noon for local day
function getFallbackPrayerDates(now: Date): PrayerTimeItem[] {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  // Typical default baseline hours
  const fajrDate = new Date(year, month, day, 4, 45, 0);
  const dhuhrDate = new Date(year, month, day, 12, 30, 0);
  const asrDate = new Date(year, month, day, 15, 55, 0);
  const maghribDate = new Date(year, month, day, 18, 35, 0);
  const ishaDate = new Date(year, month, day, 20, 0, 0);

  const formatArabicTime = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'م' : 'ص';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${displayHours}:${minutes} ${period}`;
  };

  return [
    { id: 'fajr', name_ar: 'الفجر', time: '04:45', time_formatted: formatArabicTime(fajrDate), date_obj: fajrDate, isNext: false, isCurrent: false },
    { id: 'dhuhr', name_ar: 'الظهر', time: '12:30', time_formatted: formatArabicTime(dhuhrDate), date_obj: dhuhrDate, isNext: false, isCurrent: false },
    { id: 'asr', name_ar: 'العصر', time: '15:55', time_formatted: formatArabicTime(asrDate), date_obj: asrDate, isNext: false, isCurrent: false },
    { id: 'maghrib', name_ar: 'المغرب', time: '18:35', time_formatted: formatArabicTime(maghribDate), date_obj: maghribDate, isNext: false, isCurrent: false },
    { id: 'isha', name_ar: 'العشاء', time: '20:00', time_formatted: formatArabicTime(ishaDate), date_obj: ishaDate, isNext: false, isCurrent: false },
  ];
}

export function calculatePrayerState(prayerList: PrayerTimeItem[], now: Date = new Date()): PrayerState {
  let nextPrayer: PrayerTimeItem | null = null;
  let currentPrayer: PrayerTimeItem | null = null;
  let secondsRemaining = 0;
  let progressPercent = 0;

  // Find next and current prayer
  for (let i = 0; i < prayerList.length; i++) {
    const p = prayerList[i];
    if (now < p.date_obj) {
      nextPrayer = p;
      currentPrayer = i > 0 ? prayerList[i - 1] : prayerList[prayerList.length - 1];
      break;
    }
  }

  // If all prayers today have passed, next is tomorrow's Fajr
  if (!nextPrayer) {
    currentPrayer = prayerList[prayerList.length - 1]; // Isha
    const tomorrowFajr = new Date(prayerList[0].date_obj);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    nextPrayer = {
      ...prayerList[0],
      date_obj: tomorrowFajr
    };
  }

  // Compute countdown
  const diffMs = nextPrayer.date_obj.getTime() - now.getTime();
  secondsRemaining = Math.max(0, Math.floor(diffMs / 1000));

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Progress percentage between current and next
  if (currentPrayer && nextPrayer) {
    const totalSpan = nextPrayer.date_obj.getTime() - currentPrayer.date_obj.getTime();
    const elapsed = now.getTime() - currentPrayer.date_obj.getTime();
    if (totalSpan > 0) {
      progressPercent = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
    }
  }

  // Mark flags on prayer items
  const mappedPrayers = prayerList.map((p) => ({
    ...p,
    isNext: nextPrayer?.id === p.id,
    isCurrent: currentPrayer?.id === p.id
  }));

  // Arabic Hijri Date format
  let hijriDate = 'اليوم المبارك';
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDate = formatter.format(now);
  } catch (e) {}

  return {
    prayers: mappedPrayers,
    currentPrayer,
    nextPrayer,
    secondsRemaining,
    progressPercent,
    formattedCountdown,
    cityName: 'مكة المكرمة (توقيت محلي)',
    hijriDate
  };
}

export async function fetchLivePrayerTimes(): Promise<PrayerTimeItem[]> {
  const now = new Date();
  try {
    // Attempt Aladhan API for current timezone / day
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=SaudiArabia&method=4`);
    const json = await res.json();
    if (json.code === 200 && json.data?.timings) {
      const t = json.data.timings;
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();

      const parseTime = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return new Date(year, month, day, h, m, 0);
      };

      const formatArabicTime = (d: Date) => {
        const hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'م' : 'ص';
        const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
        return `${displayHours}:${minutes} ${period}`;
      };

      const fDate = parseTime(t.Fajr);
      const dDate = parseTime(t.Dhuhr);
      const aDate = parseTime(t.Asr);
      const mDate = parseTime(t.Maghrib);
      const iDate = parseTime(t.Isha);

      return [
        { id: 'fajr', name_ar: 'الفجر', time: t.Fajr, time_formatted: formatArabicTime(fDate), date_obj: fDate, isNext: false, isCurrent: false },
        { id: 'dhuhr', name_ar: 'الظهر', time: t.Dhuhr, time_formatted: formatArabicTime(dDate), date_obj: dDate, isNext: false, isCurrent: false },
        { id: 'asr', name_ar: 'العصر', time: t.Asr, time_formatted: formatArabicTime(aDate), date_obj: aDate, isNext: false, isCurrent: false },
        { id: 'maghrib', name_ar: 'المغرب', time: t.Maghrib, time_formatted: formatArabicTime(mDate), date_obj: mDate, isNext: false, isCurrent: false },
        { id: 'isha', name_ar: 'العشاء', time: t.Isha, time_formatted: formatArabicTime(iDate), date_obj: iDate, isNext: false, isCurrent: false },
      ];
    }
  } catch (e) {
    console.warn('Using fallback prayer calculation');
  }

  return getFallbackPrayerDates(now);
}
