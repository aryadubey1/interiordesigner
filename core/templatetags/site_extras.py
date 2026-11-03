"""Small template helpers: Cloudinary delivery transforms, rupee amounts, clean quotes."""
from decimal import Decimal, InvalidOperation

from django import template

register = template.Library()


@register.filter
def cld(url, transform):
    """Insert a Cloudinary delivery transform: {{ img.url|cld:"f_auto,q_auto,w_800" }}.
    Non-Cloudinary URLs pass through unchanged."""
    url = str(url or "")
    if "res.cloudinary.com" not in url or "/upload/" not in url:
        return url
    return url.replace("/upload/", f"/upload/{transform}/", 1)


@register.filter
def cld_poster(url, transform="so_1,c_fill,ar_16:9,w_1600,q_auto"):
    """A still frame of a Cloudinary video as a JPG (for posters and no-JS fallbacks)."""
    url = cld(url, transform)
    if "res.cloudinary.com" not in url:
        return ""
    return url.rsplit(".", 1)[0] + ".jpg" if url.rsplit("/", 1)[-1].count(".") else url + ".jpg"


@register.filter
def inr(value):
    """12000.00 -> 12,000 (Indian digit grouping, no paise when whole)."""
    try:
        d = Decimal(str(value))
    except (InvalidOperation, TypeError):
        return value
    whole = int(d)
    paise = d - whole
    s = str(abs(whole))
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        groups = []
        while len(head) > 2:
            groups.insert(0, head[-2:])
            head = head[:-2]
        if head:
            groups.insert(0, head)
        s = ",".join(groups + [tail])
    out = ("-" if whole < 0 else "") + s
    if paise:
        out += f"{paise:.2f}"[1:]
    return out


@register.filter
def unquote(text):
    """Strip straight/curly quotes that editors type around a testimonial."""
    return str(text or "").strip().strip('"“”\'').strip()


@register.filter
def clean_desc(text):
    """Drop stray 'Icon: …' lines that were pasted into descriptions."""
    lines = [ln for ln in str(text or "").splitlines() if not ln.strip().lower().startswith("icon:")]
    return "\n".join(lines).strip()
