#!/usr/bin/env python3
from pathlib import Path
from xml.sax.saxutils import escape
import shutil
import subprocess
import sys
import tempfile

import cairosvg
from PIL import ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "assets/Juan_David_Colorado_CV.pdf"
PREVIEW = Path(sys.argv[2]) if len(sys.argv) > 2 else None

PAGE_W, PAGE_H = 612, 792
INK = "#101412"
INK_2 = "#1A211D"
PAPER = "#F7F7F3"
WHITE = "#FFFEFA"
BLUE = "#315FD8"
BLUE_SOFT = "#E9EEFC"
MUTED = "#58615C"
MUTED_DARK = "#AEB8B2"
LINE = "#D8DDD9"
FONT = "Helvetica Neue LT Std"
MONO = "Menlo"

REGULAR_PATH = str(Path.home() / "Library/Fonts/Helvetica Neue LT Std 55 Roman.otf")
BOLD_PATH = str(Path.home() / "Library/Fonts/Helvetica Neue LT Std 75 Bold.otf")


def font(size, bold=False):
    return ImageFont.truetype(BOLD_PATH if bold else REGULAR_PATH, max(1, round(size)))


def wrap(value, width, size, bold=False):
    words = value.split()
    lines, current = [], ""
    face = font(size, bold)
    for word in words:
        candidate = f"{current} {word}".strip()
        if face.getlength(candidate) <= width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


class Canvas:
    def __init__(self, page_number, page_label):
        self.page_number = page_number
        self.page_label = page_label
        self.parts = [
            f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="816" height="1056" viewBox="0 0 {PAGE_W} {PAGE_H}">',
            f'<rect width="{PAGE_W}" height="{PAGE_H}" fill="{PAPER}"/>',
        ]

    def rect(self, x, y, width, height, fill, radius=0, stroke=None, stroke_width=1):
        stroke_attr = f' stroke="{stroke}" stroke-width="{stroke_width}"' if stroke else ""
        self.parts.append(
            f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}"{stroke_attr}/>'
        )

    def line(self, x1, y1, x2, y2, color=LINE, stroke=1):
        self.parts.append(
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{stroke}"/>'
        )

    def text(self, x, y, value, size=8, color=INK, weight=400, family=FONT, spacing=0, anchor="start", href=None):
        node = (
            f'<text x="{x}" y="{y}" fill="{color}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" letter-spacing="{spacing}" text-anchor="{anchor}">{escape(value)}</text>'
        )
        self.parts.append(f'<a xlink:href="{escape(href)}">{node}</a>' if href else node)

    def paragraph(self, x, y, value, width, size=8, leading=11.2, color=MUTED, bold=False):
        rows = wrap(value, width, size, bold)
        for index, row in enumerate(rows):
            self.text(x, y + index * leading, row, size, color, 700 if bold else 400)
        return y + len(rows) * leading

    def bullet(self, x, y, value, width, size=7.9, leading=11.0, color=MUTED):
        rows = wrap(value, width - 13, size)
        self.rect(x, y - 5.5, 5, 2, BLUE, 1)
        for index, row in enumerate(rows):
            self.text(x + 13, y + index * leading, row, size, color)
        return y + len(rows) * leading

    def section(self, x, y, label, width):
        self.text(x, y, label.upper(), 6.5, BLUE, 700, MONO, 0.75)
        self.line(x, y + 8, x + width, y + 8, LINE, 1)
        return y + 25

    def job(self, x, y, title, company, dates, bullets, width):
        self.text(x, y, title, 10.6, INK, 700)
        y += 13
        self.text(x, y, company, 7.3, BLUE, 700)
        company_width = font(7.3, True).getlength(company)
        self.text(x + company_width + 7, y, f"/ {dates}", 6.6, MUTED, 400, MONO, 0.08)
        y += 15
        for item in bullets:
            y = self.bullet(x, y, item, width) + 2
        return y + 9

    def metric(self, x, y, width, number, label):
        self.rect(x, y, width, 57, WHITE, 13, LINE)
        self.text(x + 12, y + 21, number, 17.5, BLUE, 700)
        self.paragraph(x + 12, y + 36, label, width - 24, 6.6, 8.5, MUTED)
        return y + 67

    def footer(self):
        self.line(32, 756, 580, 756, INK, 1)
        self.text(32, 773, "JUAN COLORADO / PRODUCT DESIGN LEAD", 5.7, MUTED, 700, MONO, 0.55)
        self.text(580, 773, f"{self.page_label}  /  0{self.page_number}", 5.7, BLUE, 700, MONO, 0.5, "end")

    def svg(self):
        self.parts.append("</svg>")
        return "".join(self.parts).encode("utf-8")


def page_one():
    canvas = Canvas(1, "SELECTED EXPERIENCE")
    canvas.rect(24, 20, 564, 145, INK, 22)
    canvas.rect(44, 40, 9, 9, BLUE, 3)
    canvas.text(61, 48, "JUAN COLORADO", 7.1, WHITE, 700, MONO, 1.0)
    canvas.text(44, 89, "Juan David", 27.5, WHITE, 700)
    canvas.text(44, 116, "Colorado Vargas", 27.5, WHITE, 700)
    canvas.text(45, 139, "SENIOR PRODUCT DESIGNER & DESIGN LEAD", 7.4, "#6F96FF", 700, MONO, 0.8)
    canvas.text(396, 48, "MEDELLIN, COLOMBIA / UTC-5", 5.8, MUTED_DARK, 700, MONO, 0.35)
    canvas.text(396, 83, "AI, healthcare, and enterprise", 8.2, WHITE, 700)
    canvas.text(396, 97, "products - from ambiguity to", 8.2, WHITE, 700)
    canvas.text(396, 111, "validated systems in production.", 8.2, WHITE, 700)
    canvas.text(396, 139, "juancolorado87@gmail.com", 6.7, MUTED_DARK, href="mailto:juancolorado87@gmail.com")
    canvas.text(396, 151, "+57 310 843 0417", 6.7, MUTED_DARK)

    left_x, left_w = 36, 354
    right_x, right_w = 414, 162
    y = canvas.section(left_x, 193, "Selected Experience", left_w)
    y = canvas.job(left_x, y, "Senior Lead UX/UI Designer", "Symplast", "Apr 2026 - Present", [
        "Lead design for a mobile-first EHR and practice-management platform serving 3,500+ aesthetic practices and medical spas.",
        "Own AI-native clinical workflows, the design system, and alignment across product, engineering, and clinical users.",
    ], left_w)
    y = canvas.job(left_x, y, "Senior Product Designer & Lead + Product Owner", "CodeBranch", "Jun 2025 - Apr 2026", [
        "Led product strategy and UX for Nvidia's supply-chain intelligence platform on an enterprise ecosystem managing $2B+ in annual transactions.",
        "Replaced a ten-filter query with conversational AI; 9 of 10 internal test participants found the new flow easier and less error-prone.",
        "Designed YMA's computer-vision ecosystem from zero to one and governed delivery with 5+ engineers and two junior designers.",
    ], left_w)
    y = canvas.job(left_x, y, "Senior Lead UX/UI Designer", "Solving AI", "Jun 2024 - Jun 2025", [
        "Raised first-arrival comprehension of a node-based AI canvas from 2 of 10 to 8 of 10 users through Maze testing and iterative onboarding.",
        "Built a Figma system that shortened the design-to-development handoff cycle from nine days to six.",
        "Simplified multi-step AI interactions into accessible journeys aligned with WCAG AA.",
    ], left_w)
    canvas.job(left_x, y, "UX/UI Senior Designer", "Ideaware / Bucket.io", "Sep 2023 - May 2024", [
        "Turned complex AI configuration into a guided four-step funnel and evaluated two interactive directions before engineering investment.",
    ], left_w)

    ry = canvas.section(right_x, 193, "Profile", right_w)
    ry = canvas.paragraph(
        right_x, ry,
        "Product Designer and Lead with 10+ years building digital experiences and four years leading product design end-to-end. I bring structure to complex systems, validate the direction, and stay close enough to engineering to protect the idea through production.",
        right_w, 7.65, 10.8, INK_2
    ) + 18

    ry = canvas.section(right_x, ry, "Evidence", right_w)
    ry = canvas.metric(right_x, ry, right_w, "9 of 10", "Preferred the simplified Nvidia AI flow")
    ry = canvas.metric(right_x, ry, right_w, "2 to 8", "of 10 understood the AI canvas on arrival")
    ry = canvas.metric(right_x, ry, right_w, "9 to 6", "Days in the design-to-development handoff cycle")

    ry = canvas.section(right_x, ry + 5, "Core Expertise", right_w)
    for item in [
        "Product design & UX strategy",
        "AI / agentic product design",
        "Design systems & design ops",
        "Healthcare UX",
        "Research & prototype testing",
        "Product ownership & design QA",
        "HTML / CSS / JavaScript",
    ]:
        canvas.rect(right_x, ry - 5.5, 4, 4, BLUE, 2)
        canvas.text(right_x + 11, ry, item, 7.1, INK, 500)
        ry += 13

    ry = canvas.section(right_x, ry + 8, "Portfolio", right_w)
    canvas.text(right_x, ry, "juancoloradov.github.io/portfolio", 7.0, BLUE, 700, href="https://juancoloradov.github.io/portfolio/")

    canvas.rect(left_x, 600, left_w, 108, BLUE_SOFT, 16)
    canvas.text(left_x + 16, 624, "SELECTED WORK / PORTFOLIO", 6.2, BLUE, 700, MONO, 0.65)
    for index, (project, description) in enumerate([
        ("NVIDIA", "Decision-first enterprise AI"),
        ("SOLVING AI", "Measured AI product system"),
        ("EPM CARGA VERDE", "Zero-to-one product + front end"),
    ]):
        row_y = 648 + index * 22
        canvas.text(left_x + 16, row_y, project, 7.1, INK, 700)
        canvas.text(left_x + 131, row_y, description, 6.8, MUTED)
        if index < 2:
            canvas.line(left_x + 16, row_y + 9, left_x + left_w - 16, row_y + 9, "#D2D9E9", 1)
    canvas.footer()
    return canvas.svg()


def page_two():
    canvas = Canvas(2, "CAREER & CAPABILITIES")
    canvas.rect(24, 20, 564, 61, INK, 18)
    canvas.rect(43, 39, 8, 8, BLUE, 3)
    canvas.text(59, 47, "JUAN COLORADO", 7.0, WHITE, 700, MONO, 0.95)
    canvas.text(203, 47, "CAREER & CAPABILITIES", 6.2, MUTED_DARK, 700, MONO, 0.65)
    canvas.text(569, 47, "linkedin.com/in/juan-david-colorado-vargas", 5.8, MUTED_DARK, 400, MONO, 0.05, "end", "https://linkedin.com/in/juan-david-colorado-vargas-470b20122")

    canvas.rect(36, 103, 540, 116, BLUE_SOFT, 18)
    canvas.text(55, 128, "SPROUTLOUD / DISTRIBUTED MARKETING PLATFORM", 6.2, BLUE, 700, MONO, 0.65)
    canvas.text(55, 164, "7 years. 3 promotions.", 24, INK, 700)
    canvas.text(55, 189, "Design  /  leadership  /  front-end production", 10.1, INK_2, 700)
    canvas.paragraph(
        391, 148,
        "The experience that built my production discipline: configurable systems for national brands, team leadership, and end-to-end implementation.",
        158, 7.3, 10.2, MUTED
    )

    left_x, left_w = 36, 342
    right_x, right_w = 406, 170
    y = canvas.section(left_x, 251, "Career Foundation", left_w)
    y = canvas.job(left_x, y, "Production Designer -> Team Lead -> Web Developer", "SproutLoud", "Dec 2015 - Nov 2022", [
        "Production design, 2 years: created 20+ configurable campaign templates for DISH, Nvidia, Milwaukee Tool, and Andersen Windows, defining what end users could safely customize.",
        "Team leadership, 2 years: led the design team and built the email template system and its base code.",
        "Web development, 3 years: owned pages end-to-end with HTML, CSS, JavaScript, PHP, and Jinja; shipped through Git and GitLab.",
        "Ran A/B tests with the team before rollout and was promoted three times across the seven-year tenure.",
    ], left_w)
    y = canvas.job(left_x, y, "UI/UX Senior Designer & Team Leader", "Adaptive Tech Solutions", "Dec 2022 - Jun 2023", [
        "Led three designers across three simultaneous B2B accounts and mentored mobile-first and responsive practice.",
    ], left_w)
    y = canvas.job(left_x, y, "Graphic Designer", "Creactiva", "Aug 2014 - Dec 2015", [
        "Designed print and digital campaigns for IMUSA, Corbeta, Levi's, and Cryogas.",
    ], left_w)

    y = canvas.section(left_x, y + 5, "Leadership & Delivery", left_w)
    canvas.paragraph(
        left_x, y,
        "Four years leading product design end-to-end / design-team mentoring / product ownership and user stories / design-system governance / cross-functional design QA / front-end collaboration",
        left_w, 7.45, 10.3, MUTED
    )

    ry = canvas.section(right_x, 251, "Selected Clients", right_w)
    for client in [
        "Nvidia", "DISH", "Milwaukee Tool", "Andersen Windows", "Benjamin Moore", "Generac", "ToughBuilt", "IMUSA", "Levi's"
    ]:
        canvas.text(right_x, ry, client, 7.6, INK, 600)
        ry += 13

    ry = canvas.section(right_x, ry + 10, "Tools & Methods", right_w)
    ry = canvas.paragraph(
        right_x, ry,
        "Figma Variables / Auto Layout / prototyping / Maze / journey mapping / Atomic Design / baseline measurement / usability testing / A/B testing / design QA / Git",
        right_w, 7.15, 10.0, MUTED
    ) + 16

    ry = canvas.section(right_x, ry, "Languages", right_w)
    for label, value in [
        ("Spanish", "Native"),
        ("English", "C1 Advanced / EF SET"),
        ("French & Italian", "Elementary"),
    ]:
        canvas.text(right_x, ry, label, 7.2, INK, 700)
        canvas.text(right_x + right_w, ry, value, 6.7, MUTED, 400, FONT, 0, "end")
        ry += 14

    ry = canvas.section(right_x, ry + 8, "Education", right_w)
    canvas.text(right_x, ry, "Visual Designer", 7.5, INK, 700)
    ry += 12
    ry = canvas.paragraph(right_x, ry, "Interactive Systems / Bellas Artes / 2007 - 2011", right_w, 6.9, 9.5, MUTED) + 16

    ry = canvas.section(right_x, ry, "Selected Certifications", right_w)
    ry = canvas.paragraph(
        right_x, ry,
        "Nvidia Corporate Training, 2025 / Product Design School, Platzi, 2025 / Design Systems Fundamentals, Platzi, 2025 / EF SET English C1",
        right_w, 6.9, 9.5, MUTED
    ) + 16

    ry = canvas.section(right_x, ry, "Contact", right_w)
    for item, href in [
        ("juancolorado87@gmail.com", "mailto:juancolorado87@gmail.com"),
        ("+57 310 843 0417", "tel:+573108430417"),
        ("Medellin, Colombia / UTC-5", None),
        ("juancoloradov.github.io/portfolio", "https://juancoloradov.github.io/portfolio/"),
    ]:
        canvas.text(right_x, ry, item, 6.8, BLUE if href else INK_2, 400, href=href)
        ry += 11.2

    canvas.footer()
    return canvas.svg()


def export_page(svg, pdf_path, png_path=None):
    cairosvg.svg2pdf(bytestring=svg, write_to=str(pdf_path))
    if png_path:
        cairosvg.svg2png(bytestring=svg, write_to=str(png_path), output_width=1224, output_height=1584)


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory(prefix="juan-colorado-cv-") as temp_dir:
    temp = Path(temp_dir)
    page_pdfs = [temp / "page-1.pdf", temp / "page-2.pdf"]
    preview_paths = [None, None]
    if PREVIEW:
        preview_paths = [
            PREVIEW.with_name(f"{PREVIEW.stem}-page-1.png"),
            PREVIEW.with_name(f"{PREVIEW.stem}-page-2.png"),
        ]
    export_page(page_one(), page_pdfs[0], preview_paths[0])
    export_page(page_two(), page_pdfs[1], preview_paths[1])
    pdfunite = shutil.which("pdfunite")
    if not pdfunite:
        raise RuntimeError("pdfunite is required to assemble the two-page resume")
    if OUTPUT.exists():
        OUTPUT.unlink()
    subprocess.run([pdfunite, *map(str, page_pdfs), str(OUTPUT)], check=True)

print(f"Exported {OUTPUT}")
if PREVIEW:
    print(f"Rendered {preview_paths[0]} and {preview_paths[1]}")
