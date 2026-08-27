'use client';

import React, { useState, useEffect } from 'react';
import { sadaqahProofs, HadithProof } from '@/data/sadaqahProofs';

export type Beneficiary = {
  _id: string;
  name: string;
  relationship: string;
  intention: 'deceased' | 'healing' | 'blessing' | 'parents' | 'general';
  intentionText: string;
  totalQuranPages: number;
  totalDhikr: number;
  totalTrees: number;
  createdAt: string;
};

export default function SadaqahHub({
  onSelectBeneficiaryForWird,
}: {
  onSelectBeneficiaryForWird?: (beneficiary: Beneficiary) => void;
}) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showShareCard, setShowShareCard] = useState<Beneficiary | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('الوالد');
  const [intention, setIntention] = useState<'deceased' | 'healing' | 'blessing' | 'parents' | 'general'>('deceased');
  const [intentionText, setIntentionText] = useState('طلب الرحمة والمغفرة ونور القبر');

  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch('/api/beneficiaries');
      const json = await res.json();
      if (json.success) {
        setBeneficiaries(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch('/api/beneficiaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          intention,
          intentionText
        })
      });
      const json = await res.json();
      if (json.success) {
        setBeneficiaries([json.data, ...beneficiaries]);
        setShowAddModal(false);
        setName('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
    try {
      const res = await fetch(`/api/beneficiaries?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setBeneficiaries(beneficiaries.filter((b) => b._id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIntentionBadge = (int: string) => {
    switch (int) {
      case 'deceased':
        return { label: 'متوفى (رحمة ومغفرة)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'healing':
        return { label: 'مريض (طلب الشفاء)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'parents':
        return { label: 'بر بالوالدين', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'blessing':
        return { label: 'تيسير وبركة', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      default:
        return { label: 'إهداء عام', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="w-full flex flex-col gap-void-lg select-none">
      {/* Header with CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-container-low/60 backdrop-blur-xl border border-outline-variant/20 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-xs font-label-mono text-tertiary mb-2">
            <span className="material-symbols-outlined text-sm">volunteer_activism</span>
            <span>الصدقة الجارية وإهداء الثواب</span>
          </div>
          <h3 className="font-ui-header text-2xl text-on-surface">سجل الصدقات والإهداءات الروحانية</h3>
          <p className="font-body-main text-sm text-on-surface-variant max-w-2xl mt-1">
            خصّص وردك القرآني وتسبيحاتك لمن تحب من الأحياء والأموات؛ تُوثق كل صفحة وتسبيحة في ميزانهم وتغرس شجرة باسمهم في واحتك الروحانية.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-tertiary text-surface font-bold font-ui-header flex items-center gap-2 hover:bg-tertiary-fixed transition-all shadow-[0_0_20px_rgba(247,190,29,0.25)] whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-xl">person_add</span>
          <span>إضافة شخص للإهداء</span>
        </button>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-void-md">
        {loading ? (
          <div className="col-span-full text-center py-12 text-on-surface-variant font-ui-header">
            جاري جلب سجلات الصدقات...
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-surface-container-low/30 rounded-3xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-2">folder_open</span>
            <p className="font-ui-header text-on-surface-variant">لم تقم بإضافة أي شخص حتى الآن. أضف والديك أو من تحب لتبدأ بإهداء ثواب قراءتك لهم!</p>
          </div>
        ) : (
          beneficiaries.map((b) => {
            const badge = getIntentionBadge(b.intention);
            return (
              <div
                key={b._id}
                className="bg-surface-container-low/70 backdrop-blur-lg border border-outline-variant/30 hover:border-tertiary/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full blur-2xl pointer-events-none"></div>

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className={`text-[11px] font-ui-header px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <h4 className="font-ui-header text-xl text-on-surface font-bold mt-1.5 flex items-center gap-1.5">
                        <span>{b.name}</span>
                        <span className="text-xs text-on-surface-variant font-normal">({b.relationship})</span>
                      </h4>
                    </div>

                    {b._id !== 'self' && (
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="text-on-surface-variant hover:text-red-400 p-1 transition-colors"
                        title="حذف السجل"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant italic mb-4">
                    «{b.intentionText}»
                  </p>

                  {/* Portfolio Stats */}
                  <div className="grid grid-cols-3 gap-2 bg-surface/50 rounded-xl p-3 border border-outline-variant/10 text-center mb-4">
                    <div>
                      <span className="text-lg font-bold text-emerald-400 font-label-mono">{b.totalQuranPages || 0}</span>
                      <span className="block text-[10px] text-on-surface-variant font-ui-header">صفحة قرآن</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-amber-400 font-label-mono">{b.totalDhikr || 0}</span>
                      <span className="block text-[10px] text-on-surface-variant font-ui-header">تسبيحة</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-cyan-400 font-label-mono">{b.totalTrees || 0}</span>
                      <span className="block text-[10px] text-on-surface-variant font-ui-header">شجرة بالغابة</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/15">
                  <button
                    onClick={() => setShowShareCard(b)}
                    className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-on-surface text-xs font-ui-header flex items-center justify-center gap-1.5 border border-outline-variant/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm text-tertiary">share</span>
                    <span>بطاقة إهداء</span>
                  </button>
                  {onSelectBeneficiaryForWird && (
                    <button
                      onClick={() => onSelectBeneficiaryForWird(b)}
                      className="py-2 px-3 rounded-xl bg-tertiary/15 hover:bg-tertiary text-tertiary hover:text-surface text-xs font-ui-header font-bold transition-all border border-tertiary/30"
                    >
                      بدء ورد له
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Islamic Proofs & Hadiths Section with Clickable Dorar.net Links */}
      <div className="bg-surface-container-low/40 backdrop-blur-xl border border-primary/15 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-outline-variant/15 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/30">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <h4 className="font-ui-header text-xl text-on-surface font-bold">الأدلة والتأصيل الشرعي لإهداء الثواب والصدقة</h4>
            <p className="font-body-main text-xs text-on-surface-variant">
              أحاديث نبوية صحيحة موثقة ومربوطة مباشرة بـ <strong className="text-tertiary">موسوعة الدرر السنية للحديث الشريف</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-void-md">
          {sadaqahProofs.map((proof: HadithProof) => (
            <div
              key={proof.id}
              className="bg-surface-container-high/40 rounded-2xl p-5 border border-outline-variant/20 flex flex-col justify-between gap-3 hover:border-tertiary/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-ui-header font-bold text-tertiary">
                    {proof.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-label-mono">
                    {proof.grade}
                  </span>
                </div>

                <div className="bg-tertiary/5 rounded-xl p-3 border-r-2 border-tertiary mb-2">
                  <p className="text-sm font-verse-display text-yellow-200/95 leading-relaxed" dir="rtl">
                    {proof.hadith_text}
                  </p>
                  <span className="block text-left text-[11px] text-tertiary/60 mt-1 font-label-mono">
                    {proof.source} • الراوي: {proof.narrator}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed font-body-main" dir="rtl">
                  {proof.explanation}
                </p>
              </div>

              {/* Clickable Dorar.net URL */}
              <div className="pt-2 border-t border-outline-variant/10 flex justify-end">
                <a
                  href={proof.dorar_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-tertiary font-ui-header transition-colors group"
                >
                  <span>تخريج الحديث في موسوعة الدرر السنية</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:-translate-x-0.5 transition-transform">open_in_new</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fade-in text-right">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-4">
              <h4 className="font-ui-header text-xl font-bold text-on-surface">إضافة شخص لإهداء الثواب</h4>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddBeneficiary} className="flex flex-col gap-4">
              <div>
                <label className="block font-ui-header text-xs text-on-surface-variant mb-1">الاسم الكريم:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أبي الحبيب / فلان بن فلان"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface outline-none focus:border-tertiary text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-ui-header text-xs text-on-surface-variant mb-1">صلة القرابة:</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface outline-none focus:border-tertiary text-sm"
                  >
                    <option value="الوالد">الوالد</option>
                    <option value="الوالدة">الوالدة</option>
                    <option value="جد / جدة">جد / جدة</option>
                    <option value="ابن / ابنة">ابن / ابنة</option>
                    <option value="أخ / أخت">أخ / أخت</option>
                    <option value="صديق">صديق</option>
                    <option value="عالم / معلم">عالم / معلم</option>
                    <option value="عامة المسلمين">عامة المسلمين</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui-header text-xs text-on-surface-variant mb-1">النية والهدف:</label>
                  <select
                    value={intention}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setIntention(val);
                      if (val === 'deceased') setIntentionText('طلب الرحمة والمغفرة ونور القبر');
                      else if (val === 'healing') setIntentionText('طلب الشفاء العاجل ورفع البلاء');
                      else if (val === 'parents') setIntentionText('بر وإحسان وشكر للوالدين');
                      else setIntentionText('طلب التوفيق والبركة والقبول');
                    }}
                    className="w-full p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface outline-none focus:border-tertiary text-sm"
                  >
                    <option value="deceased">متوفى (رحمة ومغفرة)</option>
                    <option value="healing">مريض (طلب الشفاء)</option>
                    <option value="parents">بر بالوالدين (أحياء)</option>
                    <option value="blessing">تيسير وبركة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-ui-header text-xs text-on-surface-variant mb-1">الدعاء والنية المصاحبة:</label>
                <input
                  type="text"
                  value={intentionText}
                  onChange={(e) => setIntentionText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-highest border border-outline-variant/30 text-on-surface outline-none focus:border-tertiary text-sm"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-tertiary text-surface font-bold rounded-xl font-ui-header hover:bg-tertiary-fixed transition-colors"
                >
                  حفظ في السجل
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl bg-surface-variant text-on-surface-variant font-ui-header"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shareable Dua Card Modal */}
      {showShareCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1320] border-2 border-tertiary/40 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(247,190,29,0.25)] text-center relative animate-scale-in">
            <button
              onClick={() => setShowShareCard(null)}
              className="absolute top-4 left-4 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Visual Dedication Card */}
            <div className="w-16 h-16 rounded-full bg-tertiary/10 border-2 border-tertiary flex items-center justify-center text-tertiary mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
            </div>

            <span className="text-xs font-label-mono text-tertiary uppercase tracking-widest block mb-1">
              إهداء ثواب وعمل صالح
            </span>
            <h3 className="text-2xl font-bold font-ui-header text-white mb-2">
              إلى: {showShareCard.name}
            </h3>
            <p className="text-xs text-gray-300 italic mb-6">
              «{showShareCard.intentionText}»
            </p>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-right mb-6">
              <p className="text-sm font-verse-display text-yellow-300 leading-relaxed text-center mb-3">
                «اللهم تقبل ما قرأنا وما سبحنا واجعله نوراً وضياءً ورفعةً في ميزان حسنات {showShareCard.name}»
              </p>
              <div className="flex justify-around text-center pt-2 border-t border-white/10 text-xs text-gray-300 font-label-mono">
                <div className="flex items-center gap-1 justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  <span>{showShareCard.totalQuranPages || 0} صفحة</span>
                </div>
                <div className="flex items-center gap-1 justify-center">
                  <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/></svg>
                  <span>{showShareCard.totalDhikr || 0} تسبيحة</span>
                </div>
                <div className="flex items-center gap-1 justify-center">
                  <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-9"/><path d="M12 13a5 5 0 0 0 5-5c0-4-5-6-5-6s-5 2-5 6a5 5 0 0 0 5 5z"/></svg>
                  <span>{showShareCard.totalTrees || 0} شجرة</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const text = `إهداء عمل صالح ودعاء إلى: ${showShareCard.name}\n«${showShareCard.intentionText}»\nتم إهداء ${showShareCard.totalQuranPages || 0} صفحة قرآن و ${showShareCard.totalDhikr || 0} تسبيحة.\nتقبل الله منا ومنكم صالح الأعمال.`;
                navigator.clipboard.writeText(text);
                alert('تم نسخ نص بطاقة الإهداء إلى الحافظة بنجاح! يمكنك الآن إرسالها لمن تحب.');
              }}
              className="w-full py-3 bg-tertiary text-surface font-bold rounded-xl font-ui-header hover:bg-tertiary-fixed transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">content_copy</span>
              <span>نسخ بطاقة الإهداء للمشاركة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
