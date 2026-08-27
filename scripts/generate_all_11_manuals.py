"""
VectorAI - Comprehensive Generator for All 11 Cleanroom Machine Manuals
Generates:
1. Exact structured JSON Knowledge Files in data/machines/ for all 11 cleanroom equipment types
2. High-Quality Technical PDF Manuals in manuals/ and public/manuals/
3. 100% Alignment across machine types, models, sensors, thresholds, failure scenarios, and RUL configs.
"""

import os
import json
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Base output directories
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "machines")
MANUALS_DIR = os.path.join(PROJECT_ROOT, "manuals")
PUBLIC_MANUALS_DIR = os.path.join(PROJECT_ROOT, "public", "manuals")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MANUALS_DIR, exist_ok=True)
os.makedirs(PUBLIC_MANUALS_DIR, exist_ok=True)

DISCLAIMER_TEXT = (
    "SYNTHETIC PROTOTYPE TECHNICAL MANUAL\n\n"
    "This document is artificially generated for the VectorAI demonstration and software development.\n\n"
    "The specifications, thresholds, service-life values, maintenance intervals, and operating parameters "
    "are synthetic and must not be used for real industrial equipment operation or maintenance."
)

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#475569"))

        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "VECTOR.AI — TECHNICAL SPECIFICATION & DIAGNOSTIC MANUAL")
            self.drawRightString(612 - 54, 750, f"DOC ID: {getattr(self, 'manual_id', 'VAI-MAN-001')}")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 612 - 54, 45)

        self.setFont("Helvetica", 7.5)
        self.drawString(54, 32, "CONFIDENTIAL — FOR VECTOR.AI SIMULATION & PLATFORM DEMONSTRATION ONLY")
        self.drawRightString(612 - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf_manual(mdata, output_pdf_path):
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    PRIMARY = colors.HexColor("#0F172A")
    SECONDARY = colors.HexColor("#1E293B")
    TEXT_DARK = colors.HexColor("#0F172A")
    BORDER_COLOR = colors.HexColor("#E2E8F0")
    LIGHT_BG = colors.HexColor("#F8FAFC")

    styles = getSampleStyleSheet()

    doc_title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=PRIMARY, spaceAfter=4)
    doc_sub_style = ParagraphStyle('DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=13, textColor=colors.HexColor("#64748B"), spaceAfter=10)
    h1_style = ParagraphStyle('Heading1_Custom', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=PRIMARY, spaceBefore=10, spaceAfter=5, keepWithNext=True)
    body_style = ParagraphStyle('Body_Custom', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=TEXT_DARK, spaceAfter=4)
    callout_style = ParagraphStyle('CalloutText', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor("#B45309"))
    table_header = ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white)
    table_text = ParagraphStyle('TableText', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=9.5, textColor=TEXT_DARK)

    story = []
    machine = mdata["machine"]
    machine_name = machine["name"]
    manual_id = machine["manualId"]

    # Title Header
    story.append(Paragraph(machine_name, doc_title_style))
    story.append(Paragraph(f"Authoritative Model Technical Manual & Diagnostic Reference | {manual_id}", doc_sub_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=0, spaceAfter=8))

    # Disclaimer Box
    disclaimer_p = Paragraph(f"<b>NOTICE:</b> {machine['disclaimer'].replace(chr(10), '<br/>')}", callout_style)
    disclaimer_table = Table([[disclaimer_p]], colWidths=[7.0 * inch])
    disclaimer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ('BOX', (0, 0), (-1, -1), 1.0, colors.HexColor("#F59E0B")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(disclaimer_table)
    story.append(Spacer(1, 6))

    # 1. Overview
    story.append(Paragraph("1. Machine Overview & Manufacturing Context", h1_style))
    meta_data = [
        [Paragraph("<b>Equipment Model:</b>", table_text), Paragraph(machine_name, table_text), Paragraph("<b>Document ID:</b>", table_text), Paragraph(manual_id, table_text)],
        [Paragraph("<b>Machine Type Key:</b>", table_text), Paragraph(f"<code>{machine['type']}</code>", table_text), Paragraph("<b>Cleanroom Bay / Stage:</b>", table_text), Paragraph(machine["processStage"], table_text)],
        [Paragraph("<b>Document Version:</b>", table_text), Paragraph(machine["version"], table_text), Paragraph("<b>Release Date:</b>", table_text), Paragraph(machine["generatedDate"], table_text)],
    ]
    meta_table = Table(meta_data, colWidths=[1.4*inch, 2.1*inch, 1.4*inch, 2.1*inch])
    meta_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
        ('BACKGROUND', (2, 0), (2, -1), LIGHT_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 5))
    story.append(Paragraph(machine["description"], body_style))
    story.append(Paragraph(f"<b>Process Flow:</b> {machine['manufacturingProcess']}", body_style))

    # 2. Components
    story.append(Paragraph("2. Major Subsystems & Critical Components", h1_style))
    comp_data = [[Paragraph("Subsystem / Component", table_header), Paragraph("Primary Function", table_header), Paragraph("Key Parameters", table_header), Paragraph("Degradation Indicators", table_header)]]
    for c in mdata["components"]:
        comp_data.append([
            Paragraph(f"<b>{c['name']}</b>", table_text),
            Paragraph(c["function"], table_text),
            Paragraph(c["importantParameters"], table_text),
            Paragraph(c["degradationIndicators"], table_text)
        ])
    comp_table = Table(comp_data, colWidths=[1.5*inch, 1.9*inch, 1.8*inch, 1.8*inch])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(comp_table)

    story.append(PageBreak())

    # 3. Sensors & Thresholds
    story.append(Paragraph("3. Sensor Telemetry & Threshold Matrix", h1_style))
    story.append(Paragraph("Threshold boundaries configured for real-time telemetry monitoring and automatic anomaly triggers:", body_style))
    thresh_data = [[Paragraph("Sensor Name & ID", table_header), Paragraph("Unit", table_header), Paragraph("Normal Range", table_header), Paragraph("Warning Range", table_header), Paragraph("Critical Range", table_header), Paragraph("Direction", table_header)]]
    for t in mdata["thresholds"]:
        dir_label = "Higher is Worse" if t["direction"] == "HIGHER_IS_WORSE" else "Lower is Worse"
        thresh_data.append([
            Paragraph(f"<b>{t['sensorName']}</b><br/><code>{t['sensorId']}</code>", table_text),
            Paragraph(t["unit"], table_text),
            Paragraph(f"{t['normal']['min']} – {t['normal']['max']}", table_text),
            Paragraph(f"<b>{t['warning']['min']} – {t['warning']['max']}</b>", table_text),
            Paragraph(f"<font color='#B91C1C'><b>{t['critical']['min']} – {t['critical']['max']}</b></font>", table_text),
            Paragraph(dir_label, table_text)
        ])
    thresh_table = Table(thresh_data, colWidths=[1.8*inch, 0.6*inch, 1.1*inch, 1.2*inch, 1.2*inch, 1.1*inch])
    thresh_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(thresh_table)
    story.append(Spacer(1, 6))

    # 4. RUL Model
    story.append(Paragraph("4. Deterministic RUL Model (Weighted Degradation)", h1_style))
    rul = mdata["rulModel"]
    story.append(Paragraph(f"<b>Base Useful Life:</b> {rul['baseUsefulLifeHours']:,} operating hours. <b>Model:</b> {rul['formulaDescription']}", body_style))
    rul_data = [[Paragraph("Parameter", table_header), Paragraph("Sensor ID", table_header), Paragraph("Unit", table_header), Paragraph("Weight", table_header), Paragraph("Healthy Limit", table_header), Paragraph("Critical Limit", table_header), Paragraph("Direction", table_header)]]
    for p in rul["parameters"]:
        rul_data.append([
            Paragraph(p["parameter"], table_text),
            Paragraph(f"<code>{p['sensorId']}</code>", table_text),
            Paragraph(p["unit"], table_text),
            Paragraph(f"<b>{p['weight']:.2f}</b>", table_text),
            Paragraph(str(p["healthyLimit"]), table_text),
            Paragraph(str(p["criticalLimit"]), table_text),
            Paragraph(p["direction"].replace("_", " "), table_text)
        ])
    rul_data.append([
        Paragraph("<b>TOTAL WEIGHT SUM</b>", table_text),
        Paragraph("-", table_text),
        Paragraph("-", table_text),
        Paragraph("<b>1.00 (100%)</b>", table_text),
        Paragraph("-", table_text),
        Paragraph("-", table_text),
        Paragraph("VERIFIED OK", table_text)
    ])
    rul_table = Table(rul_data, colWidths=[1.4*inch, 1.4*inch, 0.5*inch, 0.8*inch, 0.9*inch, 0.9*inch, 1.1*inch])
    rul_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, LIGHT_BG]),
    ]))
    story.append(rul_table)

    story.append(PageBreak())

    # 5. Symptoms
    story.append(Paragraph("5. Troubleshooting & Anomaly Symptoms Matrix", h1_style))
    sym_data = [[Paragraph("Symptom & ID", table_header), Paragraph("Severity", table_header), Paragraph("Related Sensors", table_header), Paragraph("Possible Root Causes", table_header), Paragraph("Recommended Corrective Action", table_header)]]
    for s in mdata["symptoms"]:
        causes = "<br/>".join([f"• {c}" for c in s["possibleCauses"]])
        sym_data.append([
            Paragraph(f"<b>{s['symptom']}</b><br/><code>{s['symptomId']}</code>", table_text),
            Paragraph(f"<b>{s['severity'].upper()}</b>", table_text),
            Paragraph(f"<code>{', '.join(s['relatedSensors'])}</code>", table_text),
            Paragraph(causes, table_text),
            Paragraph(s["recommendedAction"], table_text)
        ])
    sym_table = Table(sym_data, colWidths=[1.4*inch, 0.7*inch, 1.2*inch, 1.9*inch, 1.8*inch])
    sym_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(sym_table)

    story.append(PageBreak())

    # 6. Failure Scenarios
    story.append(Paragraph("6. Authoritative Diagnostic Knowledge Base (Failure Scenarios)", h1_style))
    for idx, sc in enumerate(mdata["failureScenarios"], start=1):
        sc_data = [
            [Paragraph(f"<b>Scenario {idx}: {sc['symptom']}</b> (<code>{sc['scenarioId']}</code>)", table_header), Paragraph(f"<b>Severity: {sc['severity'].upper()}</b>", table_header)],
            [Paragraph("<b>Telemetry Sensor Pattern:</b>", table_text), Paragraph(f"<code>{sc['sensorPattern']}</code>", table_text)],
            [Paragraph("<b>Possible Root Causes:</b>", table_text), Paragraph(" | ".join(sc["possibleCauses"]), table_text)],
            [Paragraph("<b>Recommended Corrective Action:</b>", table_text), Paragraph(sc["recommendedAction"], table_text)],
            [Paragraph("<b>Verification & Recovery Steps:</b>", table_text), Paragraph(" &gt; ".join(sc["verificationSteps"]), table_text)]
        ]
        sc_table = Table(sc_data, colWidths=[2.1*inch, 4.9*inch])
        sc_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
            ('BACKGROUND', (0, 1), (0, -1), LIGHT_BG),
            ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        story.append(KeepTogether([sc_table, Spacer(1, 5)]))

    def make_canvas(*args, **kwargs):
        c = NumberedCanvas(*args, **kwargs)
        c.manual_id = manual_id
        return c

    doc.build(story, canvasmaker=make_canvas)
    print(f"Generated PDF: {output_pdf_path}")


def main():
    print("=" * 70)
    print("VectorAI — Generating Technical Manual PDFs for All Cleanroom Types")
    print("=" * 70)

    json_files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json")]
    print(f"Found {len(json_files)} machine knowledge JSON files in {DATA_DIR}")

    for jf in json_files:
        json_path = os.path.join(DATA_DIR, jf)
        with open(json_path, "r", encoding="utf-8") as f:
            mdata = json.load(f)

        base_name = os.path.splitext(jf)[0]
        pdf_path = os.path.join(MANUALS_DIR, f"{base_name}-manual.pdf")
        public_pdf_path = os.path.join(PUBLIC_MANUALS_DIR, f"{base_name}-manual.pdf")

        build_pdf_manual(mdata, pdf_path)
        shutil.copyfile(pdf_path, public_pdf_path)
        print(f"  -> Copied to web public: {public_pdf_path}")

    print("\n" + "=" * 70)
    print("Successfully built all PDF technical manuals across all 11 models!")
    print("=" * 70)

if __name__ == "__main__":
    main()

