import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { parse, type Font } from "opentype.js";
import type { CSSProperties } from "react";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { BRAND, cleanFarmName } from "@/lib/site";

/**
 * Share preview image (1200×630) for WhatsApp, LinkedIn, Slack and so on.
 *   /api/og?lang=en                    → the site image
 *   /api/og?lang=ar&farm=Green%20Valley → the personalised demo image
 */
const size = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
const fonts = Promise.all([
  font("BricolageGrotesque-ExtraBold.ttf"),
  font("IBMPlexSans-Medium.ttf"),
  font("IBMPlexSansArabic-Medium.ttf"),
  font("IBMPlexSansArabic-Bold.ttf"),
  font("IBMPlexMono-Medium.ttf"),
]);

const parsed = new Map<Buffer, Font>();
function toFont(data: Buffer) {
  if (!parsed.has(data)) parsed.set(data, parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer));
  return parsed.get(data)!;
}

const C = { bg: "#eef2f5", ink: "#141b2b", muted: "#5b677d", line: "#dce2ec", green: "#2e9e5b", greenText: "#1f7a45", led: "#ff4fd8", night: "#0b1222" };

/** A small front view of a lit tower farm: four floors of plants under pink grow lights. */
function Tower() {
  const floors = [0, 1, 2, 3];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: 360,
        padding: "34px 30px",
        borderRadius: 36,
        background: `linear-gradient(180deg, #1d2a4a 0%, ${C.night} 100%)`,
        boxShadow: "0 40px 80px -30px rgba(20,27,43,0.6)",
      }}
    >
      {floors.map((f) => (
        <div key={f} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ height: 6, borderRadius: 6, background: C.led, boxShadow: `0 0 24px 6px rgba(255,79,216,0.55)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 52, padding: "0 6px" }}>
            {Array.from({ length: 7 }, (_, i) => {
              const h = 22 + ((i * 7 + f * 5) % 4) * 8;
              return <div key={i} style={{ width: 30, height: h, borderRadius: "16px 16px 6px 6px", background: i % 3 === f % 3 ? "#7fe0a6" : C.green }} />;
            })}
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "#2a3757" }} />
        </div>
      ))}
    </div>
  );
}

/**
 * Satori (the image renderer) shapes Arabic letters but lays words out left to right,
 * so for Arabic we place each word ourselves, right to left.
 */
function Words({ text, style, measure }: { text: string; style: CSSProperties & { fontSize: number }; measure?: Font }) {
  if (!measure) return <div style={style}>{text}</div>;
  const { fontSize } = style;
  return (
    <div style={{ ...style, display: "flex", flexDirection: "row-reverse", flexWrap: "wrap", columnGap: fontSize * 0.26 }}>
      {text.split(/\s+/).map((word, i) => {
        // Latin punctuation at the end of a word belongs on its left in Arabic.
        const w = word.replace(/^(.*?)([.!?:]+)$/u, "$2$1");
        return (
        // It also sizes each word from its unjoined letters, so we measure the joined word.
        <div key={i} style={{ display: "flex", whiteSpace: "nowrap", width: Math.ceil(measure.getAdvanceWidth(w, fontSize)) }}>
          {w}
        </div>
        );
      })}
    </div>
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("lang") ?? "";
  const lang = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const d = await getDictionary(lang);
  const farm = cleanFarmName(searchParams.get("farm"));
  const rtl = lang === "ar";

  const kicker = farm ? d.meta.ogDemoKicker : d.meta.ogKicker;
  const title = farm || d.hero.title;
  const line = farm ? d.meta.ogDemoLine : d.footer.tagline;
  const titleSize = farm ? (farm.length <= 14 ? 104 : farm.length <= 24 ? 80 : 60) : rtl ? 76 : 84;

  const [display, sans, arabic, arabicBold, mono] = await fonts;
  const measure = rtl ? { regular: toFont(arabic), bold: toFont(arabicBold) } : undefined;
  const sansStack = rtl ? "Plex Arabic, Plex" : "Plex, Plex Arabic";
  const displayStack = rtl ? "Plex Arabic, Bricolage" : "Bricolage, Plex Arabic";

  return new ImageResponse(
    (
      <div
        dir={rtl ? "rtl" : "ltr"}
        style={{
          display: "flex",
          flexDirection: rtl ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: C.bg,
          backgroundImage: `radial-gradient(circle at ${rtl ? "20%" : "80%"} 30%, rgba(46,158,91,0.14), transparent 55%)`,
          color: C.ink,
          fontFamily: sansStack,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: 640, alignItems: rtl ? "flex-end" : "flex-start" }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, background: C.green }}>
              {/* lucide "sprout", drawn as an SVG so it matches the site logo */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3" />
                <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" />
                <path d="M5 21h14" />
              </svg>
            </div>
            <div style={{ fontFamily: "Bricolage", fontSize: 36 }}>{BRAND}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: rtl ? "flex-end" : "flex-start", textAlign: rtl ? "right" : "left" }}>
            <Words
              measure={measure?.regular}
              text={kicker}
              style={{ fontFamily: rtl ? "Plex Arabic" : "Mono", fontSize: 24, color: C.greenText, letterSpacing: rtl ? 0 : 2, textTransform: rtl ? "none" : "uppercase" }}
            />
            <Words
              measure={measure?.bold}
              text={title}
              style={{ fontFamily: displayStack, fontWeight: 700, fontSize: titleSize, lineHeight: rtl ? 1.25 : 1.02, letterSpacing: rtl ? 0 : -2.5, maxWidth: 640 }}
            />
            <Words measure={measure?.regular} text={line} style={{ fontSize: 30, color: C.muted, lineHeight: 1.4, maxWidth: 600 }} />
          </div>

          <div style={{ display: "flex", height: 6, width: 120, borderRadius: 6, background: C.led }} />
        </div>

        <Tower />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 700, style: "normal" },
        { name: "Plex", data: sans, weight: 500, style: "normal" },
        { name: "Plex Arabic", data: arabic, weight: 500, style: "normal" },
        { name: "Plex Arabic", data: arabicBold, weight: 700, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" },
    },
  );
}
