#!/usr/bin/env python3
"""Generate Bash Scripting Fundamentals lecture decks (Cookie / Merit Advisory style)."""

from __future__ import annotations

import os
import sys
from datetime import datetime

from reportlab.platypus import KeepTogether, Paragraph, Spacer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
WORKSPACE = os.path.dirname(ROOT)

from training_pdf.lib.slide_builder import (  # noqa: E402
    Deck,
    ML,
    MR,
    code_block,
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


def normalize_sections(raw_sections, chunk_size=7):
    """Regroup 1-topic sections into presentable Section 1..N blocks."""
    sizes = [len(s.get("topics") or []) for s in raw_sections]
    mostly_atomic = sizes and (
        sum(1 for n in sizes if n <= 1) >= max(1, int(0.6 * len(sizes)))
    )
    if not mostly_atomic:
        out = []
        for i, sec in enumerate(raw_sections, start=1):
            out.append(
                {
                    "section": i,
                    "title": sec.get("title") or f"Section {i}",
                    "topics": sec.get("topics") or [],
                }
            )
        return out

    topics = []
    for sec in raw_sections:
        topics.extend(sec.get("topics") or [])

    out = []
    for i in range(0, len(topics), chunk_size):
        chunk = topics[i : i + chunk_size]
        n = len(out) + 1
        first = chunk[0]["title"]
        last = chunk[-1]["title"]
        title = first.split(" - ")[0].split(" — ")[0]
        if len(chunk) > 1:
            title = f"{title} to {last.split(' - ')[0].split(' — ')[0]}"
        out.append({"section": n, "title": title, "topics": chunk})
    return out


def topic_slide(deck: Deck, section_no: int, topic_index: int, topic: dict):
    number = f"{section_no}.{topic_index}"
    title = esc(topic["title"])
    points = [esc(p) for p in (topic.get("points") or [])[:4]]
    examples = topic.get("examples") or []

    def builder(story, s):
        width = PAGE_W - ML - MR
        for i, point in enumerate(points[:2]):
            story.append(
                Paragraph(
                    f"<font color='#356AE6' size='9'><b>•</b></font>&nbsp;&nbsp;{point}",
                    s["bullet"],
                )
            )
            if i < len(examples):
                ex = examples[i]
                code = (ex.get("code") or "").strip()
                lines = code.splitlines()
                if len(lines) > 3:
                    code = "\n".join(lines[:3]) + "\n# ..."
                story.append(Spacer(1, 1))
                if ex.get("label"):
                    story.append(Paragraph(esc(ex.get("label")), s["example_label"]))
                story.append(code_block(s, code, width=width - 4))
                story.append(Spacer(1, 3))

    deck.slide(number, title, builder)


def build_deck(spec):
    sections = normalize_sections(spec["slides"])
    path = os.path.join(OUT_DIR, spec["file"])
    topic_count = sum(len(s["topics"]) for s in sections)
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
                f"{n_topics} topics",
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
    return deck.build(), topic_count, estimate


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Output: {OUT_DIR}")
    for spec in DECKS:
        path, topics, pages_est = build_deck(spec)
        print(f"Wrote {path}  topics={topics}  est_pages~{pages_est}")


if __name__ == "__main__":
    main()
