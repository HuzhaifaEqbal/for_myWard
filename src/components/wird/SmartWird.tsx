'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function SmartWird() {
  const [session, setSession] = useState<WirdSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<Ayah[] | null>(null);
  const [setupGoal, setSetupGoal] = useState(10);
  const [setupStartPage, setSetupStartPage] = useState(1);

  useEffect(() => {
    fetchSession();
  }, []);

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
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`);
      const json = await res.json();
      if (json.code === 200) {
        setPageData(json.data.ayahs);
      }
    } catch (e) {
      console.error('Failed to fetch Quran page', e);
    }
  };

  const startNewSession = async () => {
    setLoading(true);
    // In a real app we'd POST to create a new session, but since our API GET creates a default one if none exists,
    // we'll simulate updating it.
    try {
      // Mock update to the backend for the sake of starting
      const res = await fetch('/api/wird');
      const json = await res.json();
      const newSession = { ...json.data, goalPages: setupGoal, startPage: setupStartPage, currentPage: setupStartPage, pagesReadToday: 0, status: 'in-progress' };
      setSession(newSession);
      fetchPageContent(setupStartPage);
    } finally {
      setLoading(false);
    }
  };

  const completePage = async () => {
    if (!session) return;
    
    const nextPage = session.currentPage + 1;
    const isGoalReached = session.pagesReadToday + 1 >= session.goalPages;

    try {
      const res = await fetch('/api/wird', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_progress', pagesRead: 1, currentPage: nextPage })
      });
      const json = await res.json();
      
      if (json.success) {
        if (isGoalReached) {
          const wantMore = window.confirm('لقد أتممت وردك اليومي بنجاح! هل تريد قراءة صفحة إضافية؟');
          if (wantMore) {
            setSession(json.data);
            fetchPageContent(nextPage);
          } else {
            // Finish session
            await fetch('/api/wird', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'finish_wird' })
            });
            alert('تم حفظ وردك وموقعك. تقبل الله!');
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

  if (loading) return <div className="p-void-lg text-center text-primary">جاري تحميل الورد...</div>;

  if (session?.status === 'completed') {
    return (
      <div className="rounded-2xl bg-surface-container-low border border-primary/20 p-void-lg text-center">
        <span className="material-symbols-outlined text-tertiary text-5xl mb-4">task_alt</span>
        <h2 className="font-display-lg text-2xl text-on-surface mb-2">تقبل الله طاعتك</h2>
        <p className="font-body-main text-on-surface-variant">لقد أتممت وردك لهذا اليوم بنجاح وساهمت في تنمية غابتك الروحانية.</p>
        <button onClick={() => setSession({...session, status: 'in-progress'})} className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-ui-header">
          قراءة المزيد
        </button>
      </div>
    );
  }

  if (!session || (session.pagesReadToday === 0 && session.currentPage === 1 && !pageData)) {
    // Setup view
    return (
      <div className="rounded-2xl bg-surface-container/40 backdrop-blur-md border border-outline-variant/20 p-void-lg text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-primary text-4xl mb-4">menu_book</span>
        <h2 className="font-display-lg text-2xl text-on-surface mb-4">إعداد الورد اليومي</h2>
        
        <div className="flex flex-col gap-4 w-full max-w-sm mb-6">
          <div className="flex flex-col text-right">
            <label className="text-on-surface-variant font-ui-header mb-1 text-sm">الهدف (عدد الصفحات):</label>
            <input 
              type="number" 
              value={setupGoal} 
              onChange={(e) => setSetupGoal(Number(e.target.value))}
              className="p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface text-center outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col text-right">
            <label className="text-on-surface-variant font-ui-header mb-1 text-sm">تبدأ من صفحة رقم:</label>
            <input 
              type="number" 
              value={setupStartPage} 
              onChange={(e) => setSetupStartPage(Number(e.target.value))}
              className="p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface text-center outline-none focus:border-primary"
            />
          </div>
        </div>

        <button onClick={startNewSession} className="px-8 py-3 bg-primary text-on-primary hover:bg-primary-fixed transition-colors rounded-xl font-ui-header w-full max-w-sm">
          ابدأ الورد
        </button>
      </div>
    );
  }

  // Reading View
  return (
    <div className="rounded-2xl bg-[#fdfbf7] text-[#2d2a26] overflow-hidden shadow-2xl relative border border-[#e5dfd3]">
      <div className="bg-[#f0e8d9] p-4 flex justify-between items-center border-b border-[#e5dfd3]">
        <div className="font-ui-header text-sm">
          سورة {pageData && pageData[0] ? pageData[0].surah.name : '...'}
        </div>
        <div className="font-ui-header text-sm bg-white/50 px-3 py-1 rounded-full">
          صفحة {session.currentPage}
        </div>
        <div className="font-label-mono text-xs text-[#8a7f6c]">
          الإنجاز: {session.pagesReadToday} / {session.goalPages}
        </div>
      </div>

      <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative">
        {!pageData ? (
          <div className="text-center text-[#8a7f6c] animate-pulse">جاري جلب الآيات...</div>
        ) : (
          <div className="text-center leading-[2.5] text-2xl md:text-3xl font-display-lg" style={{ fontFamily: "'Uthmanic', 'Amiri', serif" }}>
            {pageData.map((ayah, idx) => (
              <span key={idx}>
                {ayah.text} <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#d4c8b0] text-sm text-[#8a7f6c] mx-1">
                  {ayah.number.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)])}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#f0e8d9] p-4 flex justify-center border-t border-[#e5dfd3]">
        <button 
          onClick={completePage}
          disabled={!pageData}
          className="px-8 py-3 bg-[#3f5f4b] hover:bg-[#2c4234] text-white rounded-xl font-ui-header transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">done_all</span>
          أنهيت هذه الصفحة
        </button>
      </div>
    </div>
  );
}
