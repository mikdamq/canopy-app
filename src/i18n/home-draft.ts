import type { Locale } from "./config";

/**
 * New copy for the home page draft (/[lang]/home-draft). Everything else on the draft
 * comes from the main dictionaries. Headlines are split into a / hl / b so the middle
 * words can sit in a lime badge. Every number here is a promise already on the site.
 */
const en = {
  meta: {
    title: "Home page draft · Lamina",
    description: "A design draft of the Lamina home page.",
  },
  draft: "Design draft · hidden from Google",
  hero: {
    eyebrow: "Live 3D twins for indoor farms",
    chip: "Free pilots in Jordan and the Gulf",
    live: "Live",
    liveNote: "Drag to look around",
  },
  metrics: {
    eyebrow: "The pilot in numbers",
    a: "Simple promises",
    hl: "you can hold us to",
    b: "",
    items: [
      { v: "04", u: "", l: "farm types", d: "Vertical towers, containers, greenhouses and research labs." },
      { v: "02", u: "wk", l: "to set up", d: "About two weeks after you send us your layout." },
      { v: "03", u: "mo", l: "free pilot", d: "The full product for pilot farms. No card, no lock-in." },
      { v: "01", u: "day", l: "to reply", d: "We reply within one business day, on WhatsApp or email." },
    ],
  },
  how: { a: "From a one-minute form to a", hl: "live farm", b: "in about two weeks" },
  benefits: {
    eyebrow: "What you see",
    a: "Every floor, every crop,",
    hl: "in one view",
    b: "",
    alts: [
      "Close-up of growing floors: strawberries on top, young greens below",
      "A research lab's grow cabinets, one under pink grow light",
      "A container farm's racks beside the packing line",
      "The tower farm at night with the grow lights on",
    ],
  },
  types: {
    eyebrow: "Built for",
    a: "One twin for",
    hl: "every kind",
    b: "of indoor farm",
    open: "Explore",
  },
  pilot: {
    a: "Be one of our",
    hl: "first farms",
    b: "",
    spots: "Pilot spots open",
    free: "3 months free",
    askTitle: "What we ask in return",
    ask: [
      "A 2-minute feedback form every two weeks",
      "Permission to mention you, anonymously if you prefer",
      "Photos of your layout on WhatsApp to start",
    ],
    quote: "From the founder",
  },
  footer: {
    tryTitle: "Try it with your farm's name",
    reach: "Talk to us",
  },
};

export type HomeDraft = typeof en;

const ar: HomeDraft = {
  meta: {
    title: "مسودة الصفحة الرئيسية · لامينا",
    description: "مسودة تصميم للصفحة الرئيسية لموقع لامينا.",
  },
  draft: "مسودة تصميم · مخفية عن Google",
  hero: {
    eyebrow: "نسخ رقمية حيّة ثلاثية الأبعاد للمزارع الداخلية",
    chip: "تجارب مجانية في الأردن والخليج",
    live: "مباشر",
    liveNote: "اسحب لتتجوّل في المزرعة",
  },
  metrics: {
    eyebrow: "التجربة بالأرقام",
    a: "وعود بسيطة",
    hl: "يمكنك محاسبتنا عليها",
    b: "",
    items: [
      { v: "04", u: "", l: "أنواع من المزارع", d: "الأبراج العمودية والحاويات والبيوت المحمية ومختبرات الأبحاث." },
      { v: "02", u: "", l: "أسبوعان للإعداد", d: "نحو أسبوعين بعد أن ترسل لنا مخطط مزرعتك." },
      { v: "03", u: "", l: "أشهر مجانية", d: "المنتج كاملًا لمزارع التجربة. بلا بطاقة دفع وبلا التزام." },
      { v: "01", u: "", l: "يوم عمل للرد", d: "نردّ خلال يوم عمل واحد، عبر واتساب أو البريد." },
    ],
  },
  how: { a: "من نموذج مدته دقيقة إلى", hl: "مزرعة حيّة", b: "في نحو أسبوعين" },
  benefits: {
    eyebrow: "ما الذي تراه",
    a: "كل طابق وكل محصول",
    hl: "في عرض واحد",
    b: "",
    alts: [
      "لقطة قريبة لطوابق الزراعة: فراولة في الأعلى وخضار صغيرة في الأسفل",
      "خزائن الزراعة في مختبر أبحاث، إحداها تحت إضاءة نمو وردية",
      "رفوف مزرعة حاويات بجانب خط التعبئة",
      "المزرعة العمودية ليلًا وإضاءة النمو تعمل",
    ],
  },
  types: {
    eyebrow: "مصمَّمة لـ",
    a: "نسخة رقمية واحدة",
    hl: "لكل أنواع",
    b: "المزارع الداخلية",
    open: "استكشف",
  },
  pilot: {
    a: "كن من",
    hl: "أوائل المزارع",
    b: "معنا",
    spots: "أماكن التجربة متاحة",
    free: "3 أشهر مجانًا",
    askTitle: "ما نطلبه في المقابل",
    ask: [
      "نموذج ملاحظات مدته دقيقتان كل أسبوعين",
      "إذنك بذكر مزرعتك، دون اسمها إن أردت",
      "صور لمخطط مزرعتك عبر واتساب لنبدأ",
    ],
    quote: "من المؤسس",
  },
  footer: {
    tryTitle: "جرّبها باسم مزرعتك",
    reach: "تواصل معنا",
  },
};

export const homeDraft = (lang: Locale): HomeDraft => (lang === "ar" ? ar : en);
