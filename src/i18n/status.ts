import type { Locale } from "./config";

/**
 * Copy for the 404 and error pages. These run in the browser, so their few strings live
 * here instead of in the full dictionaries (which would add both languages to every page).
 */
const status = {
  en: {
    notFoundTitle: "This shelf is empty",
    notFoundSub: "The page you're looking for isn't here. It may have moved, or the link has a typo.",
    errorTitle: "Something went wrong",
    errorSub: "Part of the page didn't load. Try again, or come back in a minute.",
    retry: "Try again",
    home: "Back to the homepage",
    demo: "Open the demo",
    help: "Still stuck? Email {email}",
  },
  ar: {
    notFoundTitle: "هذا الرف فارغ",
    notFoundSub: "الصفحة التي تبحث عنها غير موجودة. ربما نُقلت، أو أن في الرابط خطأ.",
    errorTitle: "حدث خطأ ما",
    errorSub: "لم يكتمل تحميل جزء من الصفحة. حاول مرة أخرى، أو عد بعد دقيقة.",
    retry: "حاول مرة أخرى",
    home: "العودة إلى الصفحة الرئيسية",
    demo: "افتح العرض",
    help: "ما زلت تواجه مشكلة؟ راسلنا على {email}",
  },
} satisfies Record<Locale, Record<string, string>>;

export default status;
export type StatusCopy = (typeof status)["en"];
