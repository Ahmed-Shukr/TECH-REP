#!/usr/bin/env python3
"""Generate condensed Bash lecture decks (Cookie / Merit Advisory style)."""

from __future__ import annotations

import os
import re
import sys
from datetime import datetime

from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import KeepTogether, Paragraph, Spacer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
WORKSPACE = os.path.dirname(ROOT)

from training_pdf.lib.slide_builder import (  # noqa: E402
    Deck,
    ML,
    MR,
    code_block,
    two_col,
)
from training_pdf.lib.styles import PAGE_W  # noqa: E402
from training_pdf.content.slides_bash_01 import SLIDES as BASH_01  # noqa: E402
from training_pdf.content.slides_bash_02 import SLIDES as BASH_02  # noqa: E402
from training_pdf.content.slides_bash_03 import SLIDES as BASH_03  # noqa: E402
from training_pdf.content.slides_bash_04 import SLIDES as BASH_04  # noqa: E402
from training_pdf.content.slides_bash_05 import SLIDES as BASH_05  # noqa: E402
from training_pdf.content.slides_bash_06 import SLIDES as BASH_06  # noqa: E402
from training_pdf.content.slides_bash_07 import SLIDES as BASH_07  # noqa: E402
from training_pdf.content.slides_bash_08 import SLIDES as BASH_08  # noqa: E402

OUT_DIR = os.path.join(
    WORKSPACE, "learning", "bash-scripting", "presentations"
)

MERGE_SIZE = 2
TERM_COLOR = "#DC2626"  # red for defined terms

DECKS = [
    {
        "file": "01_Shell_Basics.pdf",
        "series": "01 · Shell Basics",
        "section_name": "Shell Basics",
        "title": "Shell Basics",
        "subtitle": "Terminal navigation, commands, PATH, and your first scripts",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_01,
    },
    {
        "file": "02_Variables_and_Quoting.pdf",
        "series": "02 · Variables",
        "section_name": "Variables",
        "title": "Variables & Quoting",
        "subtitle": "Store data safely and avoid word-splitting bugs",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_02,
    },
    {
        "file": "03_Control_Flow.pdf",
        "series": "03 · Control Flow",
        "section_name": "Control Flow",
        "title": "Control Flow",
        "subtitle": "Branching and looping with if, case, for, and while",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_03,
    },
    {
        "file": "04_Functions.pdf",
        "series": "04 · Functions",
        "section_name": "Functions",
        "title": "Functions",
        "subtitle": "Reusable building blocks and clean script structure",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_04,
    },
    {
        "file": "05_Files_Pipes_Redirection.pdf",
        "series": "05 · Files & Pipes",
        "section_name": "Files & Pipes",
        "title": "Files, Pipes & Redirection",
        "subtitle": "Streams, pipelines, and gluing Unix tools together",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_05,
    },
    {
        "file": "06_Text_Processing.pdf",
        "series": "06 · Text Processing",
        "section_name": "Text Processing",
        "title": "Text Processing",
        "subtitle": "grep, sed, awk, cut, sort, and practical pipelines",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_06,
    },
    {
        "file": "07_Errors_and_Debugging.pdf",
        "series": "07 · Errors",
        "section_name": "Errors",
        "title": "Errors & Debugging",
        "subtitle": "Exit codes, strict mode, traps, and tracing",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_07,
    },
    {
        "file": "08_Projects.pdf",
        "series": "08 · Projects",
        "section_name": "Projects",
        "title": "Projects",
        "subtitle": "Build real automation scripts end to end",
        "eyebrow": "Bash Scripting Fundamentals",
        "slides": BASH_08,
    },
]


def esc(text: str) -> str:
    """Escape text for ReportLab Paragraph XML/HTML parsing."""
    return (
        (text or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def short_title(title: str) -> str:
    for sep in (" - ", " — ", " – "):
        if sep in title:
            return title.split(sep, 1)[0].strip()
    return title.strip()


def combine_titles(titles: list[str]) -> str:
    parts = []
    seen = set()
    for title in titles:
        bit = short_title(title)
        key = bit.lower()
        if key not in seen:
            parts.append(bit)
            seen.add(key)
    combined = " · ".join(parts)
    if len(combined) > 72:
        combined = " · ".join(parts[:2])
        if len(parts) > 2:
            combined += f" · +{len(parts) - 2} more"
    return combined


def terms_from_title(title: str) -> list[str]:
    """Collect highlightable terms from a slide title."""
    terms = []
    for part in re.split(r"\s*[·|/]\s*|\s+to\s+", title or ""):
        part = short_title(part)
        part = re.sub(
            r"^(What Is|Using|Intro(?:duction)? to|The|A|An)\s+",
            "",
            part,
            flags=re.I,
        ).strip()
        part = re.sub(r"^(a|an|the)\s+", "", part, flags=re.I).strip()
        if not part:
            continue
        token = part.split()[0].strip("()[]{}.,:;\"'")
        if len(token) >= 2 and token.lower() not in {"and", "for", "with", "from"}:
            terms.append(token)
        # Keep short multi-word concepts like "working directory"
        words = part.split()
        if 1 < len(words) <= 3:
            terms.append(part)
    uniq = []
    seen = set()
    for t in sorted(terms, key=len, reverse=True):
        key = t.lower()
        if key not in seen:
            uniq.append(t)
            seen.add(key)
    return uniq


def detect_definition_terms(text: str) -> list[str]:
    """Pull the defined word from common definition sentence shapes."""
    patterns = [
        r"^(?:A|An|The)\s+([A-Za-z][\w./+-]*)\s+(?:is|are|means|stands)\b",
        r"^([A-Za-z][\w./+-]*)\s+(?:is|are|means|stands for)\b",
        r"^(?:The)\s+([A-Za-z][\w./+-]*)\s+command\b",
        r"^([A-Za-z][\w./+-]*)\s+command\b",
        r"^([A-Za-z][\w./+-]*)\s+option\b",
        r"^([A-Za-z][\w./+-]*)\s+variable\b",
    ]
    found = []
    for pat in patterns:
        m = re.match(pat, text.strip(), flags=re.I)
        if m:
            found.append(m.group(1))
    return found


def highlight_terms(text: str, terms: list[str]) -> str:
    """Bold + red the first occurrence of each definition term (no nested tags)."""
    out = text
    used = set()
    for term in terms:
        key = term.lower()
        if key in used or len(term) < 2:
            continue
        pattern = re.compile(rf"(?<![\w/>])({re.escape(term)})(?![\w/<])", re.I)
        match = pattern.search(out)
        if not match:
            continue
        start = match.start()
        before = out[:start]
        # Skip if already inside a colored font span.
        if before.rfind(f'<font color="{TERM_COLOR}">') > before.rfind("</font>"):
            continue
        replacement = (
            f'<font color="{TERM_COLOR}" face="NotoSC-Bold"><b>{match.group(1)}</b></font>'
        )
        out = out[:start] + replacement + out[match.end() :]
        used.add(key)
    return out


def colorize_point(point: str, title_terms: list[str]) -> str:
    """Escape, then color-bold the defined term in the sentence."""
    raw = point or ""
    defined = detect_definition_terms(raw)
    if defined:
        terms = defined[:1]  # primary definition word only
    else:
        # Fallback: first title term that appears in this sentence.
        terms = []
        lower = raw.lower()
        for t in title_terms:
            if t.lower() in lower:
                terms = [t]
                break
    return highlight_terms(esc(raw), terms)


def merge_topics(topics: list[dict], group_size: int = MERGE_SIZE) -> list[dict]:
    if group_size <= 1 or len(topics) <= 1:
        return [dict(t, source_count=1) for t in topics]

    merged = []
    i = 0
    while i < len(topics):
        take = min(group_size, len(topics) - i)
        chunk = topics[i : i + take]
        i += take
        if len(chunk) == 1:
            merged.append(dict(chunk[0], source_count=1))
            continue
        points, examples, ids = [], [], []
        for topic in chunk:
            ids.append(topic.get("id") or "")
            points.extend(topic.get("points") or [])
            examples.extend(topic.get("examples") or [])
        merged.append(
            {
                "id": "+".join(x for x in ids if x) or f"merged-{len(merged)+1}",
                "title": combine_titles([t["title"] for t in chunk]),
                "points": points,
                "examples": examples,
                "source_count": len(chunk),
            }
        )
    return merged


def normalize_sections(raw_sections) -> list[dict]:
    out = []
    for i, sec in enumerate(raw_sections, start=1):
        out.append(
            {
                "section": i,
                "title": sec.get("title") or f"Section {i}",
                "topics": merge_topics(sec.get("topics") or [], MERGE_SIZE),
            }
        )
    return out


def examples_to_code(examples: list[dict], max_lines: int = 12) -> str:
    blocks = []
    for ex in examples:
        label = (ex.get("label") or "").strip()
        code = (ex.get("code") or "").strip("\n")
        if not code:
            continue
        chunk = []
        if label:
            chunk.append(f"# {label}")
        rows = code.splitlines()
        if len(rows) > 2:
            chunk.extend(rows[:2])
            chunk.append("# ...")
        else:
            chunk.extend(rows)
        blocks.append(chunk)

    lines = []
    for chunk in blocks:
        if lines and len(lines) + len(chunk) > max_lines:
            cmd_only = [row for row in chunk if not row.startswith("# ")] or chunk[:1]
            lines.extend(cmd_only)
        else:
            lines.extend(chunk)
    return "\n".join(lines)


def professional_bullets(s, items: list[str], width=None):
    """
    Drawn disc + text column.
    Wrapped lines stay in the text column (aligned under the first text glyph).
    """
    from reportlab.platypus import Table, TableStyle
    from training_pdf.lib.slide_builder import BulletDisc

    avail = width or (PAGE_W - ML - MR)
    disc_w = 11
    text_w = max(48, avail - disc_w)
    body = ParagraphStyle(
        "bash_bullet_text",
        parent=s["bullet_body"],
        fontSize=10.0,
        leading=12.8,
        leftIndent=0,
        firstLineIndent=0,
        spaceBefore=0,
        spaceAfter=0,
    )
    out = []
    for item in items:
        row = Table(
            [[BulletDisc(diameter=3.0, pad_top=2.8), Paragraph(item, body)]],
            colWidths=[disc_w, text_w],
        )
        row.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (0, 0), 2),
                    ("RIGHTPADDING", (1, 0), (1, 0), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3.0),
                ]
            )
        )
        out.append(row)
    return out


def topic_slide(deck: Deck, section_no: int, topic_index: int, topic: dict):
    """Full-width slide: larger type, aligned discs, bold red definition terms."""
    number = f"{section_no}.{topic_index}"
    title = esc(topic["title"])
    title_terms = terms_from_title(topic["title"])
    points = [colorize_point(p, title_terms) for p in (topic.get("points") or [])]
    examples = topic.get("examples") or []

    def builder(story, s):
        width = PAGE_W - ML - MR
        # Full width reduces wrapping, so larger fonts still fit on one frame.
        story.extend(professional_bullets(s, points, width=width - 2))
        code = examples_to_code(examples, max_lines=8)
        if code:
            story.append(Spacer(1, 2))
            story.append(Paragraph("Examples", s["example_label"]))
            story.append(code_block(s, code, width=width - 2))

    deck.slide(number, title, builder)


def build_deck(spec):
    sections = normalize_sections(spec["slides"])
    path = os.path.join(OUT_DIR, spec["file"])
    topic_count = sum(len(s["topics"]) for s in sections)
    raw_topic_count = sum(len(s.get("topics") or []) for s in spec["slides"])
    estimate = topic_count + len(sections) + 4

    deck = Deck(
        path,
        spec["series"],
        spec["title"],
        spec["subtitle"],
        author_lines=[
            "Merit Advisory",
            "Bash Scripting Fundamentals Bootcamp",
            "Beginner-friendly lecture materials",
            datetime.now().strftime("%B %Y"),
        ],
        total_estimate=estimate,
        section_name=spec["section_name"],
        eyebrow=spec.get("eyebrow") or spec["subtitle"],
    )

    deck.title_slide()

    agenda_items = []
    for sec in sections:
        n_topics = len(sec["topics"])
        agenda_items.append(
            (
                f"Section {sec['section']}: {esc(sec['title'])}",
                f"{n_topics} slides",
            )
        )
    deck.agenda_slide(agenda_items, title="Agenda", eyebrow="What we will cover")

    for sec in sections:
        deck.section(sec["section"], f"Section {sec['section']}", esc(sec["title"]))
        for idx, topic in enumerate(sec["topics"], start=1):
            topic_slide(deck, sec["section"], idx, topic)

    deck.closing(
        "Practice every example in your terminal",
        "Then open the next module deck",
    )
    out = deck.build()
    return out, topic_count, estimate, raw_topic_count


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Output: {OUT_DIR}")
    print(f"Merge size: {MERGE_SIZE} atomic topics per content slide")
    for spec in DECKS:
        path, slides, pages_est, raw = build_deck(spec)
        print(
            f"Wrote {path}  content_slides={slides}  "
            f"raw_topics={raw}  est_pages~{pages_est}"
        )


if __name__ == "__main__":
    main()
