"""Lamina 'Twin' logo system: symbol tiers, outlined wordmarks, lockups, colour versions."""
import math, os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../assets/fonts/")
GREEN, LEAF, LED, INK, NIGHT, WHITE = "#1f7a45", "#2e9e5b", "#ff4fd8", "#141b2b", "#0b1222", "#ffffff"

f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
P = lambda p: f"{f(p[0])} {f(p[1])}"


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    return tuple(u**3 * a + 3 * u * u * t * b + 3 * u * t * t * c + t**3 * d for a, b, c, d in zip(p0, p1, p2, p3))


def rot(p, deg, c=(32, 32)):
    a = math.radians(deg)
    x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * math.cos(a) - y * math.sin(a), c[1] + x * math.sin(a) + y * math.cos(a))


# The leaf, upright, on a 64 grid; tilted DEG degrees clockwise.
TIP, BASE = (32, 4), (32, 60)
RC1, RC2, LC1, LC2 = (50, 16), (52, 40), (14, 16), (12, 40)
DEG = 32
r = lambda p: rot(p, DEG)


def symbol(tier="full", leaf=LEAF, wire=LEAF, dot=LED, gap=0.0, sw=None):
    """tier: full (48 px and up), medium (24-47 px), small (under 24 px)."""
    sw = sw or {"full": 2.2, "medium": 3.2, "small": 5}[tier]
    # Solid half, nudged away from the midrib by `gap` (perpendicular, towards the left edge).
    ang = math.radians(DEG)
    dx, dy = -math.cos(ang) * gap, -math.sin(ang) * gap
    sh = lambda p: (r(p)[0] + dx, r(p)[1] + dy)
    solid = f'<path d="M{P(sh(TIP))} C{P(sh(LC1))} {P(sh(LC2))} {P(sh(BASE))}Z" fill="{leaf}"/>'
    edge = f"M{P(r(TIP))} C{P(r(RC1))} {P(r(RC2))} {P(r(BASE))}"
    lines = [edge]
    dots = []
    if tier in ("full", "medium"):
        lines.append(f"M{P(r(TIP))} L{P(r(BASE))}")
        ts = (0.22, 0.48, 0.74)
        e = [bez(TIP, RC1, RC2, BASE, t) for t in ts]
        m = [(32, y) for y in (14, 30, 46)]
        if tier == "full":
            for i in range(3):
                lines.append(f"M{P(r(m[i]))} L{P(r(e[i]))}")
                if i < 2:
                    lines.append(f"M{P(r(e[i]))} L{P(r(m[i + 1]))}")
            dots = e
        else:
            lines.append(f"M{P(r(e[0]))} L{P(r(m[1]))}")
            lines.append(f"M{P(r(e[1]))} L{P(r(m[2]))}")
            dots = e[:2]
    else:
        dots = [bez(TIP, RC1, RC2, BASE, 0.42)]
    dr = {"full": 2.4, "medium": 3.4, "small": 5.6}[tier]
    if tier == "small":
        # pull the single dot inside the outline so it reads at 16 px
        d0 = r(dots[0])
        c = r((32, 30))
        dots_svg = f'<circle cx="{f((d0[0]+c[0])/2+1)}" cy="{f((d0[1]+c[1])/2)}" r="{f(dr)}" fill="{dot}"/>'
    else:
        dots_svg = "".join(f'<circle cx="{f(r(d)[0])}" cy="{f(r(d)[1])}" r="{f(dr)}" fill="{dot}"/>' for d in dots)
    wire_svg = (f'<g fill="none" stroke="{wire}" stroke-width="{f(sw)}" stroke-linecap="round" stroke-linejoin="round">'
                + "".join(f'<path d="{d}"/>' for d in lines) + "</g>")
    return solid + wire_svg + dots_svg


# ---------- outlined text via HarfBuzz ----------
_cache = {}


def font(name):
    if name not in _cache:
        path = FONTS + name
        blob = hb.Blob.from_file_path(path)
        face = hb.Face(blob)
        _cache[name] = (hb.Font(face), TTFont(path), face.upem)
    return _cache[name]


def text_path(txt, name, size, tracking=0.0, rtl=False):
    """Returns (svg path d, width, ascent-ish top, baseline) for `txt` at `size` px, baseline at y=0."""
    hbf, tt, upem = font(name)
    buf = hb.Buffer()
    buf.add_str(txt)
    buf.guess_segment_properties()
    hb.shape(hbf, buf, {"kern": True, "liga": True})
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    s = size / upem
    pen = SVGPathPen(gs)
    x = 0
    infos, pos = buf.glyph_infos, buf.glyph_positions
    for i, (gi, gp) in enumerate(zip(infos, pos)):
        name_g = order[gi.codepoint]
        tp = TransformPen(pen, (s, 0, 0, -s, (x + gp.x_offset) * s, -gp.y_offset * s))
        gs[name_g].draw(tp)
        x += gp.x_advance + (tracking * upem if i < len(infos) - 1 else 0)
    return pen.getCommands(), x * s


def text_box(txt, name, size, tracking=0.0):
    """(path d, advance width, (xmin, ymin, xmax, ymax)) with the baseline at y=0, y down."""
    hbf, tt, upem = font(name)
    buf = hb.Buffer()
    buf.add_str(txt)
    buf.guess_segment_properties()
    hb.shape(hbf, buf, {"kern": True, "liga": True})
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    s = size / upem
    pen, bp = SVGPathPen(gs), BoundsPen(gs)
    x = 0
    infos, pos = buf.glyph_infos, buf.glyph_positions
    for i, (gi, gp) in enumerate(zip(infos, pos)):
        g = gs[order[gi.codepoint]]
        m = (s, 0, 0, -s, (x + gp.x_offset) * s, -gp.y_offset * s)
        g.draw(TransformPen(pen, m))
        g.draw(TransformPen(bp, m))
        x += gp.x_advance + (tracking * upem if i < len(infos) - 1 else 0)
    return pen.getCommands(), x * s, bp.bounds
