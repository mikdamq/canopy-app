"""Writes the Lamina logo files (all text outlined) into <out>/ and a review sheet."""
import os, sys
from twin import symbol, text_box, f, LEAF, LED, INK, NIGHT, WHITE, GREEN

OUT = sys.argv[1]
GAP = 1.4
T = 100  # wordmark size the lockups are drawn at
AR = 1.095  # Arabic size relative to the Latin
LATIN, ARABIC = "BricolageGrotesque-ExtraBold.ttf", "IBMPlexSansArabic-Bold.ttf"
CAP = 0.754 * T  # height of "L" above the baseline
os.makedirs(OUT, exist_ok=True)

COLOURS = {
    "colour": dict(leaf=LEAF, wire=LEAF, dot=LED),
    "ink": dict(leaf=INK, wire=INK, dot=INK),
    "green": dict(leaf=GREEN, wire=GREEN, dot=GREEN),
    "white": dict(leaf=WHITE, wire=WHITE, dot=WHITE),
}


def save(name, w, h, body, x0=0, y0=0, title="Lamina"):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x0)} {f(y0)} {f(w)} {f(h)}" '
           f'width="{f(w)}" height="{f(h)}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')
    with open(f"{OUT}/{name}.svg", "w") as fh:
        fh.write(svg)
    return svg


def mark(size, x, y, tier="full", **c):
    s = size / 64
    return f'<g transform="translate({f(x)} {f(y)}) scale({f(s)})">{symbol(tier, gap=GAP, **c)}</g>'


# 1. Symbols: three size tiers in colour, and the full tier in one colour.
for tier in ("full", "medium", "small"):
    save(f"lamina-symbol-{tier}", 64, 64, symbol(tier, gap=GAP), title="Lamina symbol")
for k in ("ink", "green", "white"):
    save(f"lamina-symbol-{k}", 64, 64, symbol("full", gap=GAP, **COLOURS[k]), title="Lamina symbol")

# 2. Wordmarks.
lat_d, lat_w, (lx0, ly0, lx1, ly1) = text_box("Lamina", LATIN, T, -0.02)
ar_d, ar_w, (ax0, ay0, ax1, ay1) = text_box("لامينا", ARABIC, T * AR, 0)
for name, d, (x0, y0, x1, y1) in (("lamina-wordmark", lat_d, (lx0, ly0, lx1, ly1)), ("lamina-wordmark-ar", ar_d, (ax0, ay0, ax1, ay1))):
    for k, col in (("", INK), ("-white", WHITE)):
        save(name + k, x1 - x0, y1 - y0, f'<path d="{d}" fill="{col}"/>', x0, y0)

# 3. Lockups. Mark box = T, centred on the cap height; gap = 0.2 T.
M = T * 1.0
G = 0.12 * T
mid = -CAP / 2
lock = {}


def horizontal(text_col, c):
    mx = 0
    tx = M + G - lx0
    body = mark(M, mx, mid - M / 2, **c) + f'<path transform="translate({f(tx)} 0)" d="{lat_d}" fill="{text_col}"/>'
    return body, (0, mid - M / 2, tx + lx1, M)


def horizontal_ar(text_col, c):
    # Arabic reads right to left: word first, mark on its right.
    tx = -ax0
    mx = tx + ax1 + G
    amid = ay0 / 2 * 0.86  # visual middle of the Arabic letters (lam-alef height, no descender)
    body = f'<path transform="translate({f(tx)} 0)" d="{ar_d}" fill="{text_col}"/>' + mark(M, mx, amid - M / 2, **c)
    top = min(amid - M / 2, ay0)
    return body, (0, top, mx + M, max(amid + M / 2, ay1) - top)


def stacked(text_col, c):
    w = lx1 - lx0
    body = mark(M * 1.6, w / 2 - M * 0.8, -CAP - G - M * 1.6, **c) + f'<path transform="translate({f(-lx0)} 0)" d="{lat_d}" fill="{text_col}"/>'
    return body, (0, -CAP - G - M * 1.6, w, M * 1.6 + G + CAP + ly1)


def bilingual(text_col, c):
    b1, (x, y, w1, h1) = horizontal(text_col, c)
    rule_x = w1 + G * 1.2
    ax = rule_x + G * 1.2 - ax0
    body = b1 + f'<rect x="{f(rule_x)}" y="{f(-CAP)}" width="{f(T*0.03)}" height="{f(CAP)}" fill="{text_col}" opacity=".25"/>'
    body += f'<path transform="translate({f(ax)} 0)" d="{ar_d}" fill="{text_col}"/>'
    return body, (0, y, ax + ax1, max(h1, ay1 - y))


for name, fn in (("lamina-horizontal", horizontal), ("lamina-horizontal-ar", horizontal_ar), ("lamina-stacked", stacked), ("lamina-bilingual", bilingual)):
    for suffix, text_col, c in (("", INK, COLOURS["colour"]), ("-on-dark", WHITE, COLOURS["colour"]), ("-ink", INK, COLOURS["ink"]), ("-white", WHITE, COLOURS["white"])):
        body, (x0, y0, w, h) = fn(text_col, c)
        lock[name + suffix] = save(name + suffix, w - x0, h, body, x0, y0)

# 4. App icon and favicon.
icon = f'<rect width="512" height="512" rx="112" fill="{NIGHT}"/>' + mark(340, 86, 86)
save("lamina-app-icon", 512, 512, icon, title="Lamina")
save("lamina-favicon", 64, 64, symbol("small", gap=0), title="Lamina")
print("written", len(os.listdir(OUT)), "files")
