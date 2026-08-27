export interface UniverseObject {
  id: string;
  scale: number; // in meters
  name_ar: string;
  name_en: string;
  scale_display: string;
  image_url: string;
  ayah: string;
  surah_ref: string;
  tafsir: string;
}

export const universeData: UniverseObject[] = [
  {
    id: "proton",
    scale: 1e-15,
    name_ar: "البروتون (جسيم دون ذري)",
    name_en: "Proton",
    scale_display: "10⁻¹⁵ متر (0.000000000000001 م)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Quark_structure_proton.svg/512px-Quark_structure_proton.svg.png",
    ayah: "وَمَا يَعْزُبُ عَن رَّبِّكَ مِن مِّثْقَالِ ذَرَّةٍۢ فِى ٱلْأَرْضِ وَلَا فِى ٱلسَّمَآءِ وَلَآ أَصْغَرَ مِن ذَٰلِكَ وَلَآ أَكْبَرَ إِلَّا فِى كِتَـٰبٍۢ مُّبِينٍ",
    surah_ref: "سورة يونس: 61",
    tafsir: "البروتون هو اللبنة الأساسية في نواة الذرة. دقة خلقه وتناسق شحناته وقواه النووية الشديدة شاهدة على علم الله الذي لا يغيب عنه أصغر من مثقال ذرة في هذا الوجود."
  },
  {
    id: "atom",
    scale: 1e-10,
    name_ar: "ذرة الهيدروجين",
    name_en: "Hydrogen Atom",
    scale_display: "10⁻¹⁰ متر (0.1 نانومتر)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hydrogen_atom.svg/512px-Hydrogen_atom.svg.png",
    ayah: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ",
    surah_ref: "سورة القمر: 49",
    tafsir: "أبسط وأكثر الذرات وفرة في الكون. دوران الإلكترون في مداراته بدقة ميكانيكية متناهية يُظهر أن كل لبنة في هذا الكون محسوبة بمقادير محكمة لا تختل."
  },
  {
    id: "dna",
    scale: 2.5e-8,
    name_ar: "الحمض النووي (DNA)",
    name_en: "DNA Helix",
    scale_display: "10⁻⁸ متر (2.5 نانومتر)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/DNA_Structure%2BKey%2BLabelled.pn_NoBB.png/512px-DNA_Structure%2BKey%2BLabelled.pn_NoBB.png",
    ayah: "وَفِىٓ أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ",
    surah_ref: "سورة الذاريات: 21",
    tafsir: "شريط الوراثة اللولبي يحمل شفرات ومعلومات تكوين الكائن الحي كاملاً في أجزاء من المليار من المتر. إعجاز رقمي وكيميائي مذهل داخل كل خلية حية."
  },
  {
    id: "cell",
    scale: 3e-5,
    name_ar: "الخلية الحية (خلية بشرية)",
    name_en: "Human Cell",
    scale_display: "10⁻⁵ متر (30 ميكرومتر)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Biological_cell_diagram.svg/512px-Biological_cell_diagram.svg.png",
    ayah: "خَلَقَ ٱلْإِنسَـٰنَ مِنْ عَلَقٍ",
    surah_ref: "سورة العلق: 2",
    tafsir: "مصنع بيولوجي حيوي يحتوي على آلاف العضيات والأنزيمات العاملة ليل نهار بتنسيق متكامل يعجز أكبر مصانع البشر عن مضاهاته."
  },
  {
    id: "human",
    scale: 1.7,
    name_ar: "الإنسان",
    name_en: "Human Being",
    scale_display: "1.7 متر (10⁰ م)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Leonardo_da_Vinci_-_Vitruvian_Man_-_transparent.png/480px-Leonardo_da_Vinci_-_Vitruvian_Man_-_transparent.png",
    ayah: "لَقَدْ خَلَقْنَا ٱلْإِنسَـٰنَ فِىٓ أَحْسَنِ تَقْوِيمٍ",
    surah_ref: "سورة التين: 4",
    tafsir: "مخلوق في أبهى صورة وأعلى درجات التكريم العقلي والروحي والجسدي، يقف كحلقة وصل وتأمل بين عالم الذرات اللامتناهي في الصغر وعوالم المجرات اللامتناهية في الكبر."
  },
  {
    id: "earth",
    scale: 1.27e7,
    name_ar: "كوكب الأرض",
    name_en: "Planet Earth",
    scale_display: "1.27 × 10⁷ متر (12,742 كم)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/512px-The_Earth_seen_from_Apollo_17.jpg",
    ayah: "وَٱلْأَرْضَ مَدَدْنَـٰهَا وَأَلْقَيْنَا فِيهَا رَوَٰسِىَ وَأَنۢبَتْنَا فِيهَا مِن كُلِّ شَىْءٍۢ مَّوْزُونٍ",
    surah_ref: "سورة الحجر: 19",
    tafsir: "واحة الحياة الفريدة المعلقة في ظلمات الفضاء، محاطة بغلاف جوي ومجال مغناطيسي يحفظها، موفورة بالماء والهواء والتربة الموزونة بعناية فائقة."
  },
  {
    id: "sun",
    scale: 1.39e9,
    name_ar: "الشمس",
    name_en: "The Sun",
    scale_display: "1.39 × 10⁹ متر (1,392,700 كم)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/512px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
    ayah: "وَجَعَلْنَا سِرَاجًا وَهَّاجًا",
    surah_ref: "سورة النبأ: 13",
    tafsir: "مفاعل اندماج نووي ضخم تتسع لأكثر من 1.3 مليون أرض، ترسل الطاقة والضوء والدفء لكافة كواكب المجموعة الشمسية بتدبير متقن."
  },
  {
    id: "milky_way",
    scale: 9.46e20,
    name_ar: "مجرة درب التبانة",
    name_en: "Milky Way Galaxy",
    scale_display: "10²¹ متر (100,000 سنة ضوئية)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Messier_101%2C_NGC_5457.jpg/512px-Messier_101%2C_NGC_5457.jpg",
    ayah: "فَلَآ أُقْسِمُ بِمَوَٰقِعِ ٱلنُّجُومِ ۝ وَإِنَّهُۥ لَقَسَمٌ لَّوْ تَعْلَمُونَ عَظِيمٌ",
    surah_ref: "سورة الواقعة: 75-76",
    tafsir: "جزيرة كونية حلزونية عملاقة تضم أكثر من 200 إلى 400 مليار نجم، شمسنا مع كواكبها مجرد نقطة متناهية في الصغر في أحد أذرعها الخارجية."
  },
  {
    id: "supercluster",
    scale: 5e24,
    name_ar: "العنقود المجري لانيابيا (Laniakea)",
    name_en: "Laniakea Supercluster",
    scale_display: "5 × 10²⁴ متر (520 مليون سنة ضوئية)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Web_of_the_Universe.jpg/512px-Web_of_the_Universe.jpg",
    ayah: "وَٱلسَّمَآءَ بَنَيْنَـٰهَا بِأَيْيْدٍۢ وَإِنَّا لَمُوسِعُونَ",
    surah_ref: "سورة الذاريات: 47",
    tafsir: "شبكة كونية عظيمة تضم أكثر من 100,000 مجرة تتدفق نحو مركز جذب مشترك كأنهار ضوئية عملاقة تشهد على اتساع وعظمة البناء الكوني."
  },
  {
    id: "observable_universe",
    scale: 8.8e26,
    name_ar: "الكون المرئي",
    name_en: "Observable Universe",
    scale_display: "8.8 × 10²⁶ متر (93 مليار سنة ضوئية)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg/512px-NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg",
    ayah: "أَءَنتُمْ أَشَدُّ خَلْقًا أَمِ ٱلسَّمَآءُ ۚ بَنَىٰهَا ۝ رَفَعَ سَمْكَهَا فَسَوَّىٰهَا",
    surah_ref: "سورة النازعات: 27-28",
    tafsir: "أفق الكون المرئي المحتوي على تريليوني مجرة. وكل هذا الاتساع الهائل لا يمثل في المنظور الإيماني إلا السماء الدنيا المزينة بالمصابيح، وما وراء ذلك لا يعلمه إلا الخالق العظيم سبحانه."
  }
];
