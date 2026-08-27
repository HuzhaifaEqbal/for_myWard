export interface PrayerMotivation {
  id: string;
  name_ar: string;
  name_en: string;
  time_description: string;
  virtue_title: string;
  hadith_text: string;
  hadith_source: string;
  spiritual_tip: string;
  sunnah_description: string;
  accent_color: string;
}

export const prayerMotivations: PrayerMotivation[] = [
  {
    id: "fajr",
    name_ar: "صلاة الفجر",
    name_en: "Fajr",
    time_description: "من طلوع الفجر الصادق إلى شروق الشمس",
    virtue_title: "النور التام وبراءة من النفاق",
    hadith_text: "«بَشِّرِ الْمَشَّائِينَ فِي الظُّلَمِ إِلَى الْمَسَاجِدِ بِالنُّورِ التَّامِّ يَوْمَ الْقِيَامَةِ»",
    hadith_source: "سنن أبي داود والترمذي (صحيح)",
    spiritual_tip: "استيقاظك في هذا الوقت شهادة حية على صدق إيمانك وإيثارك لمحبة الله على لذة النوم والراحة.",
    sunnah_description: "ركعتا الفجر القبلية: «ركعتا الفجر خير من الدنيا وما فيها».",
    accent_color: "#38bdf8"
  },
  {
    id: "dhuhr",
    name_ar: "صلاة الظهر",
    name_en: "Dhuhr",
    time_description: "من زوال الشمس عن وسط السماء إلى أن يصير ظل الشيء مثله",
    virtue_title: "انفتاح أبواب السماء واستراحة القلب",
    hadith_text: "«إِنَّهَا سَاعَةٌ تُفْتَحُ فِيهَا أَبْوَابُ السَّمَاءِ، فَأُحِبُّ أَنْ يَصْعَدَ لِي فِيهَا عَمَلٌ صَالِحٌ»",
    hadith_source: "سنن الترمذي (صحيح)",
    spiritual_tip: "محطة سكينة في منتصف زحام العمل اليومي؛ تقطع حبال الانشغال بالدنيا لتربط قلبك بالخالق.",
    sunnah_description: "4 ركعات قبل الظهر وركعتان بعدها من السنن الرواتب.",
    accent_color: "#facc15"
  },
  {
    id: "asr",
    name_ar: "صلاة العصر",
    name_en: "Asr",
    time_description: "من زيادة ظل الشيء عن مثله إلى غروب الشمس (الصلاة الوسطى)",
    virtue_title: "شهود الملائكة وحفظ العمل من الحبوط",
    hadith_text: "«يَتَعَاقَبُونَ فِيكُمْ مَلَائِكَةٌ بِاللَّيْلِ وَمَلَائِكَةٌ بِالنَّهَارِ، وَيَجْتَمِعُونَ فِي صَلَاةِ الْفَجْرِ وَصَلَاةِ الْعَصْرِ»",
    hadith_source: "صحيح البخاري ومسلم",
    spiritual_tip: "الصلاة الوسطى التي خصها الله بالذكر؛ الحفاظ عليها برهان على يقظة القلب في أوقات تعب البدن.",
    sunnah_description: "يستحب صلاة 4 ركعات قبلها لقوله ﷺ: «رحم الله امرأً صلى قبل العصر أربعاً».",
    accent_color: "#fb923c"
  },
  {
    id: "maghrib",
    name_ar: "صلاة المغرب",
    name_en: "Maghrib",
    time_description: "من مغيب كامل قرص الشمس إلى مغيب الشفق الأحمر",
    virtue_title: "وقت الإجابة وتمام النعمة بانتهاء النهار",
    hadith_text: "«لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا لَمْ يُؤَخِّرُوا الْمَغْرِبَ حَتَّى تَشْتَبِكَ النُّجُومُ»",
    hadith_source: "سنن أبي داود (صحيح)",
    spiritual_tip: "إقبال الليل وإدبار النهار تذكير بانقضاء آجال الدنيا وقرب الوقوف بين يدي الله تعالى.",
    sunnah_description: "ركعتان مؤكدتان بعدها يقرأ فيهما بالكافرون والإخلاص.",
    accent_color: "#f43f5e"
  },
  {
    id: "isha",
    name_ar: "صلاة العشاء",
    name_en: "Isha",
    time_description: "من مغيب الشفق الأحمر إلى نصف الليل",
    virtue_title: "أجر قيام نصف الليل والسكينة التامة",
    hadith_text: "«مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ»",
    hadith_source: "صحيح مسلم",
    spiritual_tip: "ختام يومك بالسجود والدعاء يمنحك نوماً هنيئاً وراحة نفسية ويبعد عنك وساوس الليل.",
    sunnah_description: "ركعتان راتبة بعد العشاء ثم صلاة الوتر لختام الصلاة بالليل.",
    accent_color: "#818cf8"
  }
];
