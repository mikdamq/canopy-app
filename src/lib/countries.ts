/**
 * Countries offered in the request form, in display order (the launch markets first).
 * `name` is what gets saved (English, so emails and the database stay consistent);
 * the visitor sees `request.countries[code]` from the dictionaries.
 * `dial` turns a local number such as 0791234567 into +962791234567.
 */
export const COUNTRIES = [
  { code: "JO", name: "Jordan", dial: "962" },
  { code: "AE", name: "United Arab Emirates", dial: "971" },
  { code: "SA", name: "Saudi Arabia", dial: "966" },
  { code: "QA", name: "Qatar", dial: "974" },
  { code: "KW", name: "Kuwait", dial: "965" },
  { code: "BH", name: "Bahrain", dial: "973" },
  { code: "OM", name: "Oman", dial: "968" },
  { code: "EG", name: "Egypt", dial: "20" },
  { code: "LB", name: "Lebanon", dial: "961" },
  { code: "IQ", name: "Iraq", dial: "964" },
  { code: "PS", name: "Palestine", dial: "970" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export const countryByName = (name: string) => COUNTRIES.find((c) => c.name === name);

/**
 * Add the country code to a local number: "0791234567" in Jordan becomes "+962791234567",
 * and "00962…" becomes "+962…". Numbers that already start with + are left as typed.
 */
export function withCountryCode(phone: string, countryName: string) {
  const raw = phone.trim();
  if (!raw || raw.startsWith("+")) return raw;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  const c = countryByName(countryName);
  if (!c) return raw;
  if (digits.startsWith(c.dial) && digits.length > c.dial.length + 6) return `+${digits}`;
  return `+${c.dial}${digits.replace(/^0+/, "")}`;
}
