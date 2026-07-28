#!/usr/bin/env python3
"""Generate condensed Bash lecture decks (Cookie / Merit Advisory style)."""

from __future__ import annotations

import os
import sys
from datetime import datetime

from reportlab.platypus import Paragraph, Spacer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
WORKSPACE = os.path.dirname(ROOT)

from training_pdf.lib.slide_builder import (  # noqa: E402
    Deck,
    ML,
    MR,
    code_block,
    pro_bullets,
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

# Merge this many atomic topics onto each content slide (keeps all content).
MERGE_SIZE = 2

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
    """Prefer the concept name before a dash separator."""
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


def merge_topics(topics: list[dict], group_size: int = MERGE_SIZE) -> list[dict]:
    """
    Combine consecutive atomic topics so each slide is denser.
    All points and examples are preserved on the merged slide.
    """
    if group_size <= 1 or len(topics) <= 1:
        return topics

    merged = []
    i = 0
    while i < len(topics):
        remaining = len(topics) - i
        take = min(group_size, remaining)
        chunk = topics[i : i + take]
        i += take

        if len(chunk) == 1:
            merged.append(dict(chunk[0], source_count=1))
            continue

        points = []
        examples = []
        ids = []
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
    """Keep authored section grouping; condense topics inside each section."""
    out = []
    for i, sec in enumerate(raw_sections, start=1):
        topics = merge_topics(sec.get("topics") or [], MERGE_SIZE)
        out.append(
            {
                "section": i,
                "title": sec.get("title") or f"Section {i}",
                "topics": topics,
            }
        )
    return out


def examples_to_code(examples: list[dict], max_lines: int = 16) -> str:
    """Pack labeled examples into one compact code snapshot (keeps every example)."""
    blocks = []
    for ex in examples:
        label = (ex.get("label") or "").strip()
        code = (ex.get("code") or "").strip("\n")
        if not code:
            continue
        chunk = []
        if label:
            chunk.append(f"# {label}")
        # Keep examples short on Cookie frames, but never drop an example entirely.
        rows = code.splitlines()
        if len(rows) > 2:
            chunk.extend(rows[:2])
            chunk.append("# ...")
        else:
            chunk.extend(rows)
        blocks.append(chunk)

    lines = []
    for chunk in blocks:
        # If adding this block would overflow, compress earlier labels only as last resort.
        if lines and len(lines) + len(chunk) > max_lines:
            # Still include: drop comment labels from this point to fit commands.
            cmd_only = [row for row in chunk if not row.startswith("# ")]
            if not cmd_only:
                cmd_only = chunk[:1]
            lines.extend(cmd_only)
        else:
            lines.extend(chunk)
    return "\n".join(lines)


def topic_slide(deck: Deck, section_no: int, topic_index: int, topic: dict):
    """Dense Cookie slide: professional disc bullets + packed examples."""
    number = f"{section_no}.{topic_index}"
    title = esc(topic["title"])
    points = [esc(p) for p in (topic.get("points") or [])]
    examples = topic.get("examples") or []
    source_count = int(topic.get("source_count") or 1)

    def builder(story, s):
        width = PAGE_W - ML - MR
        code = examples_to_code(examples, max_lines=14)

        # Combined topics: two-column dense layout.
        if source_count >= 2 and code:
            col_w = (width - 8) / 2
            left = pro_bullets(s, points, width=col_w - 2)
            right = [
                Paragraph("Examples", s["example_label"]),
                code_block(s, code, width=col_w - 4),
            ]
            story.append(two_col(left, right, gap=8))
            return

        # Single leftover topic: stacked compact layout.
        story.extend(pro_bullets(s, points, width=width - 2))
        if code:
            story.append(Spacer(1, 2))
            story.append(Paragraph("Examples", s["example_label"]))
            story.append(code_block(s, code, width=width - 4))

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
