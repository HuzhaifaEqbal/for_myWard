'use client';

import { useState, useEffect, useRef } from 'react';
import { Beneficiary } from '@/components/sadaqah/SadaqahHub';

type WirdSession = {
  _id: string;
  goalPages: number;
  startPage: number;
  currentPage: number;
  status: 'in-progress' | 'completed';
  pagesReadToday: number;
};

type Ayah = {
  number: number;
  text: string;
  surah: { name: string };
};

// Realistic minimum reading time per page in seconds (e.g. 25s)
const MIN_PAGE_READ_SECONDS = 25;

export default function SmartWird({
  activeBeneficiary,
}: {
  activeBeneficiary?: Beneficiary | null;
}) {
  const [session, setSession] = useState<WirdSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<Ayah[] | null>(null);
  const [setupGoal, setSetupGoal] = useState(10);
  const [setupStartPage, setSetupStartPage] = useState(1);

  // Beneficiaries & Dedication
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [dedicatedTo, setDedicatedTo] = useState<string>('self');

  // Reading Timer Verification
  const [secondsRemaining, setSecondsRemaining] = useState<number>(MIN_PAGE_READ_SECONDS);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);

  useEffect(() => {
    fetchSession();
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

  // Page reading timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsRemaining === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/wird');
      const json = await res.json();
      if (json.success && json.data) {
        setSession(json.data);
        fetchPageContent(json.data.currentPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async (pageNumber: number) => {
    setPageData(null);
    setSecondsRemaining(MIN_PAGE_READ_SECONDS);
    setTimerActive(false);

    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
      const json = await res.json();
      if (json.code === 200) {
        setPageData(json.data.ayahs);
        setTimerActive(true); // Start reading timer
      }
    } catch (e) {
      console.error('Failed to fetch Quran page', e);
    }
  };

  const startNewSession = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wird');
      const json = await res.json();
      const newSession = {
        ...json.data,
        goalPages: setupGoal,
        startPage: setupStartPage,
        currentPage: setupStartPage,
        pagesReadToday: 0,
        status: 'in-progress' as const
      };
      setSession(newSession);
      fetchPageContent(setupStartPage);
    } finally {
      setLoading(false);
    }
  };

  const completePage = async () => {
    if (!session || secondsRemaining > 0) return;

    const nextPage = session.currentPage + 1;
    const isGoalReached = session.pagesReadToday + 1 >= session.goalPages;

    const selectedPerson = beneficiaries.find((b) => b._id === dedicatedTo);
    const personName = selectedPerson ? selectedPerson.name : 'نفسك';

    try {
      const res = await fetch('/api/wird', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_progress',
          pagesRead: 1,
          currentPage: nextPage,
          pageNum: session.currentPage,
          beneficiaryId: dedicatedTo,
          beneficiaryName: personName
        })
      });
      const json = await res.json();

      if (json.success) {
        setRewardBanner(`تقبل الله! تم توثيق قراءة صفحة ${session.currentPage} وغرس نخلة مباركة باسم (${personName}) في واحتك الروحانية`);
        setTimeout(() => setRewardBanner(null), 6000);

        if (isGoalReached) {
          const wantMore = window.confirm('لقد أتممت هدف وردك اليومي بنجاح! هل تريد قراءة صفحة إضافية ومتابعة الغرس؟');
          if (wantMore) {
            setSession(json.data);
            fetchPageContent(nextPage);
          } else {
            await fetch('/api/wird', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'finish_wird' })
            });
            alert('تم حفظ وردك وموقعك بنجاح. تقبل الله طاعتك وبارك في سعيك!');
            setSession({ ...json.data, status: 'completed' });
          }
        } else {
          setSession(json.data);
          fetchPageContent(nextPage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-void-lg text-center text-primary font-ui-header">جاري تحميل الورد...</div>;

  if (session?.status === 'completed') {
    return (
      <div className="rounded-3xl bg-surface-container-low/80 backdrop-blur-xl border border-primary/20 p-8 md:p-12 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-tertiary/10 border-2 border-tertiary flex items-center justify-center text-tertiary mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">task_alt</span>
        </div>
        <h2 className="font-display-lg text-3xl text-on-surface mb-2">تقبل الله طاعتك وسعيك</h2>
        <p className="font-body-main text-on-surface-variant max-w-md mx-auto mb-6">
          لقد أتممت وردك لهذا اليوم وغرست أشجاراً في ميزانك وميزان من أهديت لهم.
        </p>
        <button
          onClick={() => setSession({ ...session, status: 'in-progress' })}
          className="px-8 py-3.5 bg-tertiary text-surface font-bold rounded-2xl font-ui-header hover:bg-tertiary-fixed transition-all shadow-[0_0_20px_rgba(247,190,29,0.3)]"
        >
          مواصلة القراءة وزيادة الغرس
        </button>
      </div>
    );
  }

  if (!session || (session.pagesReadToday === 0 && session.currentPage === 1 && !pageData)) {
    return (
      <div className="rounded-3xl bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 p-8 md:p-10 text-center flex flex-col items-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-tertiary mb-4">
          <span className="material-symbols-outlined text-3xl">menu_book</span>
        </div>
        <h2 className="font-display-lg text-2xl text-on-surface mb-2">إعداد الورد القرآني الموثق</h2>
        <p className="font-body-main text-xs text-on-surface-variant max-w-md mb-6">
          كل صفحة تقرؤها بتمهل ستوثق في ميزانك وتغرس نخلة حقيقية في واحتك الروحانية.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm mb-6 text-right">
          <div>
            <label className="text-on-surface-variant font-ui-header mb-1 text-xs block">الهدف اليومي (عدد الصفحات):</label>
            <input
              type="number"
              value={setupGoal}
              onChange={(e) => setSetupGoal(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface text-center outline-none focus:border-tertiary font-label-mono text-base"
            />
          </div>

          <div>
            <label className="text-on-surface-variant font-ui-header mb-1 text-xs block">البدء من صفحة رقم (المصحف من 1 إلى 604):</label>
            <input
              type="number"
              value={setupStartPage}
              onChange={(e) => setSetupStartPage(Math.min(604, Math.max(1, Number(e.target.value))))}
              className="w-full p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface text-center outline-none focus:border-tertiary font-label-mono text-base"
            />
          </div>
        </div>

        <button
          onClick={startNewSession}
          className="px-10 py-3.5 bg-tertiary text-surface font-bold hover:bg-tertiary-fixed transition-all rounded-2xl font-ui-header w-full max-w-sm shadow-[0_0_20px_rgba(247,190,29,0.3)]"
        >
          ابدأ الورد والقراءة
        </button>
      </div>
    );
  }

  const progressPct = ((MIN_PAGE_READ_SECONDS - secondsRemaining) / MIN_PAGE_READ_SECONDS) * 100;

  return (
    <div className="rounded-3xl bg-[#fdfbf7] text-[#2d2a26] overflow-hidden shadow-2xl relative border-2 border-[#e5dfd3] flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-[#f0e8d9] p-4 md:p-5 flex flex-wrap justify-between items-center gap-3 border-b border-[#e5dfd3]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#786b59]">auto_stories</span>
          <span className="font-ui-header text-sm md:text-base font-bold text-[#443c31]">
            سورة {pageData && pageData[0] ? pageData[0].surah.name : '...'}
          </span>
        </div>

        {/* Dedication Selector */}
        <div className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-xl border border-[#d6cbba] text-xs font-ui-header text-[#443c31]">
          <span>إهداء ثواب الصفحة إلى:</span>
          <select
            value={dedicatedTo}
            onChange={(e) => setDedicatedTo(e.target.value)}
            className="bg-transparent font-bold text-[#8a5b18] outline-none cursor-pointer"
          >
            <option value="self">نفسي</option>
            {beneficiaries.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.relationship})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-ui-header text-xs bg-[#e2d6c1] px-3 py-1 rounded-full font-bold text-[#544837]">
            صفحة {session.currentPage} / 604
          </div>
          <div className="font-label-mono text-xs text-[#786b59]">
            الإنجاز: {session.pagesReadToday} / {session.goalPages}
          </div>
        </div>
      </div>

      {/* Reward Banner */}
      {rewardBanner && (
        <div className="bg-emerald-700 text-white px-4 py-2.5 text-xs md:text-sm font-ui-header text-center animate-fade-in flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">park</span>
          <span>{rewardBanner}</span>
        </div>
      )}

      {/* Quran Page Ayat Canvas/View */}
      <div className="p-8 md:p-14 min-h-[460px] flex flex-col justify-center relative bg-[#faf7f0]">
        {!pageData ? (
          <div className="text-center text-[#8a7f6c] animate-pulse font-ui-header">
            جاري جلب الآيات الكريمة بالتشكيل العثماني...
          </div>
        ) : (
          <div
            className="text-center leading-[2.6] md:leading-[2.8] text-2xl md:text-3xl font-display-lg text-[#1f1d19]"
            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
          >
            {pageData.map((ayah, idx) => (
              <span key={idx}>
                {ayah.text}{' '}
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#c2b49b] text-sm text-[#8a5b18] mx-1.5 bg-[#f4ebe0] font-label-mono font-bold">
                  {ayah.number.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Verification & Navigation Bar */}
      <div className="bg-[#f0e8d9] p-5 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#e5dfd3]">
        {/* Reading Timer Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center relative border border-[#d6cbba] shadow-inner font-label-mono text-xs font-bold text-[#8a5b18]">
            {secondsRemaining > 0 ? secondsRemaining : '✓'}
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-ui-header font-bold text-[#443c31]">
              {secondsRemaining > 0 ? 'مؤقت التدبر والقراءة' : 'اكتملت مدة القراءة والتدبر'}
            </span>
            <span className="text-[11px] text-[#786b59]">
              {secondsRemaining > 0 ? `يرجى تمهل القراءة (${secondsRemaining} ثانية متبقية)` : 'يمكنك الآن تأكيد إنهاء الصفحة وغرس النخلة'}
            </span>
          </div>
        </div>

        {/* Complete Page Button */}
        <button
          onClick={completePage}
          disabled={!pageData || secondsRemaining > 0}
          className={`px-8 py-3.5 rounded-2xl font-ui-header transition-all flex items-center justify-center gap-2 shadow-lg ${
            secondsRemaining === 0 && pageData
              ? 'bg-[#2d5a3f] hover:bg-[#1f422d] text-white cursor-pointer shadow-[0_0_20px_rgba(45,90,63,0.3)] font-bold scale-105'
              : 'bg-[#cfc3ae] text-[#786b59] cursor-not-allowed opacity-70'
          }`}
        >
          <span className="material-symbols-outlined">park</span>
          <span>
            {secondsRemaining > 0 ? `انتظر ${secondsRemaining}ث لتوثيق الصفحة` : 'أنهيت هذه الصفحة واغرس نخلة'}
          </span>
        </button>
      </div>
    </div>
  );
}
