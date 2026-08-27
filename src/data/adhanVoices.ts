export interface AdhanVoice {
  id: string;
  name_ar: string;
  muadhin: string;
  location: string;
  description: string;
  audio_url: string;
}

export const adhanVoices: AdhanVoice[] = [
  {
    id: "mecca-mulla",
    name_ar: "أذان المسجد الحرام",
    muadhin: "الشيخ علي بن أحمد ملا",
    location: "مكة المكرمة",
    description: "الأذان المكي الحجازي الخالد بصوت شيخ مؤذني الحرم المكي الشريف.",
    audio_url: "https://media.sd.ma/assabile/adhan/adhan_makkah_ali_mulla.mp3"
  },
  {
    id: "medina-suraihi",
    name_ar: "أذان المسجد النبوي",
    muadhin: "الشيخ عبد المجيد السريحي",
    location: "المدينة المنورة",
    description: "أذان مدينة رسول الله ﷺ بنبرة مدنية ندية تفيض بالسكينة والخشوع.",
    audio_url: "https://media.sd.ma/assabile/adhan/adhan_medine.mp3"
  },
  {
    id: "jerusalem-aqsa",
    name_ar: "أذان المسجد الأقصى",
    muadhin: "مؤذنو رحاب القدس الشريف",
    location: "المسجد الأقصى المبارك",
    description: "الأذان المقدسي الشجي من رحاب المسجد الأقصى المبارك وقبة الصخرة.",
    audio_url: "https://media.sd.ma/assabile/adhan/adhan_al_aqsa.mp3"
  },
  {
    id: "egypt-ismail",
    name_ar: "أذان مصر التاريخي",
    muadhin: "الشيخ مصطفى إسماعيل",
    location: "القاهرة",
    description: "أذان بمقام البيات الرصين من درر التلاوة والأذان المصري الأصيل.",
    audio_url: "https://media.sd.ma/assabile/adhan/adhan_egypt.mp3"
  },
  {
    id: "fajr-calm",
    name_ar: "أذان الفجر الخاشع (الصلاة خير من النوم)",
    muadhin: "نبرة فجرية هادئة",
    location: "أذان الفجر والأسحار",
    description: "أذان هادئ وعميق يتضمن عبارة «الصلاة خيرٌ من النوم» لإيقاظ القلوب قبل الأبدان.",
    audio_url: "https://media.sd.ma/assabile/adhan/adhan_fajr.mp3"
  }
];
