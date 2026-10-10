import en from "@/i18n/en";
import pages from "@/i18n/pages-en";
import { PAGE, SOLUTION_TYPES, solutionPath } from "@/lib/routes";
import { BRAND, BRAND_AR, CONTACT_EMAIL, baseUrl } from "@/lib/site";

/**
 * /llms.txt: a short plain-text summary of Lamina and its pages for AI assistants
 * (the llms.txt convention). Built from the English page copy, so it never drifts.
 */
export const dynamic = "force-static";

export function GET() {
  const u = (p: string) => new URL(`/en${p}`, baseUrl()).href;
  const ar = (p: string) => new URL(`/ar${p}`, baseUrl()).href;
  const line = (title: string, path: string, note: string) => `- [${title}](${u(path)}): ${note}`;
  const s = pages.solutions.items;
  const faq = pages.faq.groups.flatMap((g) => g.items);
  const body = `# ${BRAND} (${BRAND_AR})

> ${pages.product.lead}

${BRAND} is based in Amman, Jordan, and works with indoor farms in Jordan, the UAE, Saudi Arabia and the Gulf. ${pages.pilot.price} Contact: ${CONTACT_EMAIL}. Every page is also in Arabic (replace /en/ with /ar/).

## Pages

${line(pages.product.meta.title, PAGE.product, pages.product.meta.description)}
${line(pages.solutions.meta.title, PAGE.solutions, pages.solutions.meta.description)}
${SOLUTION_TYPES.map((t) => line(s[t].meta.title, solutionPath(t), s[t].meta.description)).join("\n")}
${line(pages.pilot.meta.title, PAGE.pilot, pages.pilot.meta.description)}
${line(pages.about.meta.title, PAGE.about, pages.about.meta.description)}
${line(pages.faq.meta.title, PAGE.faq, pages.faq.meta.description)}
- [Live demo](${u(PAGE.demo)}): ${en.hero.note} Add ?farm=Your%20Farm to see it with a farm's name, and &type=container, greenhouse or lab for other farm types.
- [Request a pilot](${u(PAGE.request)}): a one-minute form; the team replies within one business day on WhatsApp or email.
- [Arabic home page](${ar(PAGE.home)})

## Key facts

${faq.map((f) => `- ${f.q} ${f.a}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
