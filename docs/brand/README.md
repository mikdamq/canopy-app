# Lamina brand identity

## The logo: "Twin" (chosen 20 Oct 2026)

One leaf in two states. The left half is the real, growing plant (solid green). The right half is its digital twin: a wireframe with sensor points in grow-light pink. A small gap between the halves keeps the two states apart. It says what Lamina is: a live digital copy of a living farm.

Concept board, with the system boards: https://claude.ai/artifact/DbbG4UNHyWNZDpSGBjpiTp

### Files (`logo/`)

Every file is a plain SVG with the text turned into outlines, so it looks the same everywhere and needs no fonts.

| File | Use |
|---|---|
| `lamina-horizontal.svg` | The main logo: symbol + "Lamina". Site header, documents, emails |
| `lamina-horizontal-ar.svg` | Arabic: لامينا + symbol (the symbol sits on the right) |
| `lamina-bilingual.svg` | Both names, for things seen in both languages (one-pager, events) |
| `lamina-stacked.svg` | Symbol above the name, for square spaces |
| `lamina-symbol-full.svg` | The symbol alone, 48 px and up |
| `lamina-symbol-medium.svg` | 24–47 px: fewer wireframe lines, two sensor points |
| `lamina-symbol-small.svg` | Under 24 px: outline and one point |
| `lamina-wordmark.svg`, `lamina-wordmark-ar.svg` | The name alone, where the symbol is already nearby |
| `lamina-app-icon.svg` | Rounded ink square with the symbol |
| `lamina-favicon.svg` | Browser tab (small tier) |

Colour versions: no suffix = for light backgrounds; `-on-dark` = full colour with white text; `-ink` = one colour, ink; `-white` = one colour, white; `lamina-symbol-green.svg` = one colour, green.

`logo/png/`: ready-made images: `linkedin-logo-400.png`, `avatar-1080.png` (WhatsApp, Instagram), `lamina-app-icon-1024.png` / `-512.png`, `apple-touch-icon-180.png`, `favicon-32.png` / `-16.png`, and transparent lockups at 1200–1600 px wide.

### Rules

- **Wordmark:** "Lamina" with a capital L, set in Bricolage Grotesque ExtraBold, tracking −2%. Arabic: لامينا in IBM Plex Sans Arabic Bold, about 10% larger than the English so both carry the same weight.
- **Clear space:** keep empty space around the logo of at least **a quarter of the symbol's height** on every side.
- **Minimum sizes:** symbol 16 px (use the small tier under 24 px, the medium tier from 24 to 47 px); horizontal logo 96 px wide on screens, 25 mm in print; stacked logo 64 px wide.
- **Colours:** leaf `#2e9e5b` for the symbol, LED pink `#ff4fd8` only for the sensor points, ink `#141b2b` or white for the name. On busy photos use the one-colour white or ink version.
- **Don't:** recolour the halves differently, add shadows or gradients, rotate the leaf, put pink anywhere else in the logo, stretch it, or set the name in another font.

### Re-making the files

`source/build.py` (with `source/twin.py`) writes every SVG from the geometry, using the fonts in `assets/fonts/`: `pip install uharfbuzz fonttools`, then `python3 build.py <outDir>`. The PNGs are rendered from those SVGs with Playwright.

## Round 1: logo concepts (19 Oct 2026)

Five directions were explored; the files are in `concepts/`:

| File | Direction | Idea |
|---|---|---|
| `concepts/a-strata.svg` | A · Strata | "Lamina" means layer: a leaf built from four horizontal floors |
| `concepts/b-blade.svg` | B · Blade | The blade of a leaf; veins on a square grid ending in data points |
| `concepts/c-twin.svg` | C · Twin | One leaf, half grown and half its wireframe twin (**chosen**) |
| `concepts/d-leafdot.svg` | D · Leaf dot | Wordmark-led: the dot of the i (and the Arabic ن) becomes a leaf |
| `concepts/e-floors.svg` | E · Floors | Two farm floors in 3D, a grow-light strip, a leaf on top |
