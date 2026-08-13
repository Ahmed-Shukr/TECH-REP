#!/usr/bin/env python3
"""Generate public/resume.pdf from the portfolio identity."""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "resume.pdf"
ACCENT = HexColor("#1e3a8a")
INK = HexColor("#171717")
MUTED = HexColor("#5c5c57")


def heading(c, text, y):
    c.setFillColor(ACCENT)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, text.upper())
    c.setStrokeColor(HexColor("#e4e4df"))
    c.setLineWidth(0.6)
    c.line(22 * mm, y - 3, 188 * mm, y - 3)
    return y - 10 * mm


def bullet(c, text, y, width=166 * mm):
    c.setFillColor(INK)
    c.setFont("Times-Roman", 10)
    c.drawString(24 * mm, y, "•")
    y = draw_wrapped(c, text, 29 * mm, y, width)
    return y - 3.2 * mm


def draw_wrapped(c, text, x, y, width):
    c.setFont("Times-Roman", 10)
    words = text.split()
    line = ""
    for word in words:
        trial = f"{line} {word}".strip()
        if c.stringWidth(trial, "Times-Roman", 10) < width:
            line = trial
        else:
            c.drawString(x, y, line)
            y -= 4.4 * mm
            line = word
    if line:
        c.drawString(x, y, line)
    return y


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    width, height = A4

    c.setFillColor(ACCENT)
    c.rect(0, height - 32 * mm, width, 32 * mm, fill=1, stroke=0)
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Times-Bold", 20)
    c.drawString(22 * mm, height - 16 * mm, "Ahmed Muhumed")
    c.setFont("Times-Roman", 10)
    c.drawString(
        22 * mm,
        height - 23 * mm,
        "ERP Developer  ·  Odoo Specialist  ·  Technical Consultant  ·  Telecom Engineer",
    )

    y = height - 42 * mm
    c.setFillColor(MUTED)
    c.setFont("Times-Roman", 9)
    c.drawString(
        22 * mm,
        y,
        "Hargeisa, Somaliland   ·   ahmetoshukr@gmail.com   ·   github.com/Ahmed-Shukr   ·   linkedin.com/in/ahmed-muhumed",
    )

    y = heading(c, "Profile", y - 10 * mm)
    c.setFillColor(INK)
    y = draw_wrapped(
        c,
        "I design, develop and implement business systems, combining ERP engineering, software development, telecom engineering and technical consulting. The work is requirements, architecture, implementation, deployment and support — not generic software demos.",
        22 * mm,
        y,
        166 * mm,
    )

    y = heading(c, "Experience", y - 8 * mm)
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, "Software Engineer / Technical Consultant")
    c.setFont("Times-Italic", 9)
    c.setFillColor(MUTED)
    c.drawRightString(188 * mm, y, "2023 — Present")
    y -= 5 * mm
    for item in [
        "Custom Odoo module development across hospital, education, registrar and service workflows.",
        "Requirements analysis, system architecture, access control and operational dashboards.",
        "Deployment on Linux with Docker, PostgreSQL and multi-database Odoo environments.",
    ]:
        y = bullet(c, item, y)

    y -= 1 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, "Software Developer — Merit Advisory Services LLP")
    y -= 5 * mm
    for item in [
        "Design, development and testing of Odoo modules, products and interfaces.",
        "Server configuration and maintenance of multi-database Odoo/Ubuntu environments.",
    ]:
        y = bullet(c, item, y)

    y -= 1 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, "RNPO Engineer — Telesom")
    c.setFont("Times-Italic", 9)
    c.setFillColor(MUTED)
    c.drawRightString(188 * mm, y, "2019 — Present")
    y -= 5 * mm
    for item in [
        "2G, 3G, 4G and 5G radio network planning and optimization.",
        "KPI analysis, coverage and quality investigation, network troubleshooting.",
        "Field engineering across Somaliland / Somalia.",
    ]:
        y = bullet(c, item, y)

    y -= 1 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, "RNPO Engineer — Amtel")
    y -= 5 * mm
    y = bullet(c, "Radio network planning and optimization preceding the Telesom role.", y)

    y -= 1 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, "Guest Lecturer — Gollis University")
    c.setFont("Times-Italic", 9)
    c.setFillColor(MUTED)
    c.drawRightString(188 * mm, y, "2024")
    y -= 5 * mm
    y = bullet(
        c,
        "Technical training on cellular systems from 1G through 5G NR for telecommunication engineering students.",
        y,
    )

    y = heading(c, "Selected work", y - 6 * mm)
    for item in [
        "Hospital Management ERP — Odoo, Python, PostgreSQL, OWL.",
        "Business Registrar Dashboard — Odoo, OWL, Chart.js, PostgreSQL.",
        "Exam Management Platform — Odoo examination workflows for technical training.",
        "AI Helpdesk — LLM-assisted classification and drafts under agent control.",
        "School Management System — public high-school administration in Hargeisa.",
        "Telecom optimization practice — live-network RNPO method across 2G–5G.",
    ]:
        y = bullet(c, item, y)

    y = heading(c, "Skills", y - 6 * mm)
    c.setFillColor(INK)
    c.setFont("Times-Roman", 10)
    skills = [
        "ERP: Odoo 17/18 · Python · PostgreSQL · ORM · XML · Security · Workflows",
        "Frontend: JavaScript · OWL · Chart.js · HTML · CSS · Tailwind",
        "DevOps: Linux · Docker · Git · Deployment",
        "Telecom: 2G · 3G · 4G · 5G · RNPO · RF / KPI analysis",
        "AI: LLM integrations · AI-assisted workflows · Automation",
    ]
    for line in skills:
        c.drawString(22 * mm, y, line)
        y -= 5 * mm

    y = heading(c, "Education", y - 3 * mm)
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(22 * mm, y, "Bachelor's Degree — Telecommunication Systems Engineering")

    c.save()
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
