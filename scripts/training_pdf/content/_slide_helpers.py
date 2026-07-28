#!/usr/bin/env python3
"""Helpers for building Bash lecture slide content in Cookie format."""

from __future__ import annotations


def topic(tid: str, title: str, points: list[str], examples: list[tuple[str, str]]) -> dict:
    return {
        "id": tid,
        "title": title,
        "points": points,
        "examples": [{"label": label, "code": code} for label, code in examples],
    }


def section(num: int, title: str, topics: list[dict]) -> dict:
    return {"section": num, "title": title, "topics": topics}


def dump_module(path: str, slides: list[dict]) -> None:
    import pprint

    count = sum(len(s["topics"]) for s in slides)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write('"""Atomic Bash presentation slides for Merit Advisory training."""\n\n')
        fh.write("SLIDES = ")
        fh.write(pprint.pformat(slides, width=100, sort_dicts=False))
        fh.write("\n")
    print(f"Wrote {path} ({count} topics, {len(slides)} sections)")
