
import { jsPDF } from "jspdf";
import { formatDate } from "./helpers";

const PAGE_WIDTH = 210; // A4 mm
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_Y = 285;
const CONTINUE_Y = 22; // where content starts on pages after the first
const CLINIC_NAME = "GLT Healthcare";

const COLOR_PRIMARY = [79, 70, 229]; // #4F46E5
const COLOR_NAVY = [20, 20, 43]; // #14142B
const COLOR_SECONDARY = [100, 116, 139]; // #64748B
const COLOR_MUTED = [148, 163, 184]; // #94A3B8
const COLOR_LINE = [226, 232, 240]; // #E2E8F0
const COLOR_BORDER = [203, 213, 225]; // #CBD5E1
const COLOR_HEAD_BG = [238, 242, 255]; // indigo-50
const COLOR_SOFT_BG = [248, 250, 252]; // #F8FAFC

function ensureSpace(doc, y, needed) {
  if (y + needed > FOOTER_Y - 5) {
    doc.addPage();
    return CONTINUE_Y;
  }
  return y;
}

function sectionTitle(doc, label, x, y, needed = 16) {
  y = ensureSpace(doc, y, needed);
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(x, y - 3.4, 1.4, 4.6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(label.toUpperCase(), x + 3.6, y);
  return y + 4;
}

/** Long free text (tests / advice / follow-up) inside a soft bordered box; paginates safely. */
function drawTextBox(doc, text, x, y) {
  const lineH = 4.5;
  const pad = 3.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const lines = doc.splitTextToSize(String(text), CONTENT_WIDTH - 8);
  let i = 0;
  while (i < lines.length) {
    y = ensureSpace(doc, y, pad * 2 + lineH);
    const avail = Math.max(1, Math.floor((FOOTER_Y - 5 - y - pad * 2) / lineH));
    const chunk = lines.slice(i, i + avail);
    const h = chunk.length * lineH + pad * 2;
    doc.setFillColor(...COLOR_SOFT_BG);
    doc.setDrawColor(...COLOR_LINE);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, CONTENT_WIDTH, h, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLOR_NAVY);
    doc.text(chunk, x + 4, y + pad + 3.2);
    y += h;
    i += chunk.length;
  }
  return y + 5;
}

const INFO_HEAD_H = 8;
const INFO_LABEL_W = 30;

function measureInfoBlock(doc, rows, width) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const valueWidth = width - 8 - INFO_LABEL_W;
  let h = INFO_HEAD_H + 3;
  rows.forEach(([, value]) => {
    const lines = doc.splitTextToSize(String(value ?? "-"), valueWidth);
    h += Math.max(1, lines.length) * 4.6 + 2.4;
  });
  return h + 1;
}

function drawInfoBlock(doc, title, rows, x, y, width, height) {
  // header strip + bordered card
  doc.setFillColor(...COLOR_HEAD_BG);
  doc.roundedRect(x, y, width, INFO_HEAD_H, 1.5, 1.5, "F");
  doc.setFillColor(...COLOR_SOFT_BG);
  doc.rect(x, y + INFO_HEAD_H - 1.5, width, 1.5, "F");
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, width, height, 1.5, 1.5, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(title.toUpperCase(), x + 4, y + 5.4);

  const valueWidth = width - 8 - INFO_LABEL_W;
  let cy = y + INFO_HEAD_H + 6;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_SECONDARY);
    doc.text(label, x + 4, cy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLOR_NAVY);
    const lines = doc.splitTextToSize(String(value ?? "-"), valueWidth);
    doc.text(lines, x + 4 + INFO_LABEL_W, cy);
    cy += Math.max(1, lines.length) * 4.6 + 2.4;
  });
}

function drawMedicinesTable(doc, medicines, x, y) {
  const columns = [
    { key: "name", label: "Medicine", width: 44 },
    { key: "dosage", label: "Dosage", width: 24 },
    { key: "frequency", label: "Frequency", width: 30 },
    { key: "duration", label: "Duration", width: 24 },
    { key: "instructions", label: "Instructions", width: CONTENT_WIDTH - (44 + 24 + 30 + 24) },
  ];
  const HEAD_H = 8;
  const PAD = 2.5;

  const drawHeader = (headerY) => {
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(x, headerY, CONTENT_WIDTH, HEAD_H, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    let cx = x;
    columns.forEach((col) => {
      doc.text(col.label, cx + PAD, headerY + 5.4);
      cx += col.width;
    });
    return headerY + HEAD_H;
  };

  // keep header + at least one row together
  y = ensureSpace(doc, y, HEAD_H + 14);
  y = drawHeader(y);

  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);

  if (!medicines.length) {
    doc.setFillColor(255, 255, 255);
    doc.rect(x, y, CONTENT_WIDTH, 11, "FD");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLOR_SECONDARY);
    doc.text("No medicines listed on this prescription.", x + PAD, y + 6.8);
    return y + 11 + 6;
  }

  medicines.forEach((med, index) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const cellLines = columns.map((col) =>
      doc.splitTextToSize(String(med[col.key] || "-"), col.width - PAD * 2)
    );
    const rowHeight = Math.max(...cellLines.map((l) => l.length)) * 4.4 + 5;

    if (y + rowHeight > FOOTER_Y - 5) {
      doc.addPage();
      y = drawHeader(CONTINUE_Y); // repeated header on every new page
    }

    // row background + border
    if (index % 2 === 1) doc.setFillColor(...COLOR_SOFT_BG);
    else doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.rect(x, y, CONTENT_WIDTH, rowHeight, "FD");

    // vertical separators
    let vx = x;
    columns.slice(0, -1).forEach((col) => {
      vx += col.width;
      doc.line(vx, y, vx, y + rowHeight);
    });

    // cell text (medicine name bold)
    doc.setTextColor(...COLOR_NAVY);
    let cx = x;
    columns.forEach((col, i) => {
      doc.setFont("helvetica", col.key === "name" ? "bold" : "normal");
      doc.setFontSize(9.5);
      doc.text(cellLines[i], cx + PAD, y + 5.4);
      cx += col.width;
    });
    y += rowHeight;
  });

  return y + 6;
}

function drawPageChrome(doc, prescription) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // top accent bar on every page
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, PAGE_WIDTH, 3, "F");

    // slim running header on pages after the first
    if (i > 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLOR_PRIMARY);
      doc.text(CLINIC_NAME, MARGIN, 10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLOR_SECONDARY);
      doc.text(`Prescription #${prescription.id}`, PAGE_WIDTH - MARGIN, 10, { align: "right" });
      doc.setDrawColor(...COLOR_LINE);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, 13, PAGE_WIDTH - MARGIN, 13);
    }

    // footer
    doc.setDrawColor(...COLOR_LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, FOOTER_Y, PAGE_WIDTH - MARGIN, FOOTER_Y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text(CLINIC_NAME, MARGIN, FOOTER_Y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_MUTED);
    doc.text("Computer-generated prescription", MARGIN + 28, FOOTER_Y + 5);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, FOOTER_Y + 5, { align: "right" });
  }
}

function buildPrescriptionDoc(prescription, { patient, doctor } = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ---- Letterhead (page 1) ----
  // Logo mark (drawn, so it can never fail to load)
  doc.setFillColor(...COLOR_PRIMARY);
  doc.roundedRect(MARGIN, 9, 14, 14, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("GLT", MARGIN + 7, 17.4, { align: "center" });

  doc.setTextColor(...COLOR_PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(CLINIC_NAME, MARGIN + 18, 16.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text("Prescription", MARGIN + 18, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_NAVY);
  doc.text(`Prescription #${prescription.id}`, PAGE_WIDTH - MARGIN, 15.5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text(`Issued: ${formatDate(prescription.createdAt)}`, PAGE_WIDTH - MARGIN, 21.5, {
    align: "right",
  });

  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 27, PAGE_WIDTH - MARGIN, 27);

  // ---- Patient / Doctor blocks ----
  let y = 34;
  const gap = 6;
  const blockWidth = (CONTENT_WIDTH - gap) / 2;

  const patientRows = [
    ["Patient", patient?.name || "-"],
    ["Mobile", patient?.mobile || "-"],
    ["Age / Gender", `${patient?.age ?? "-"} / ${patient?.gender || "-"}`],
  ];
  const doctorRows = [
    ["Doctor", doctor?.name ? `Dr. ${doctor.name}` : "-"],
    ["Specialization", doctor?.specialization || "-"],
    ["Mobile", doctor?.mobile || "-"],
  ];

  const blockHeight = Math.max(
    measureInfoBlock(doc, patientRows, blockWidth),
    measureInfoBlock(doc, doctorRows, blockWidth)
  );
  drawInfoBlock(doc, "Patient Details", patientRows, MARGIN, y, blockWidth, blockHeight);
  drawInfoBlock(doc, "Doctor Details", doctorRows, MARGIN + blockWidth + gap, y, blockWidth, blockHeight);
  y += blockHeight + 9;

  // ---- Medicines ----
  y = sectionTitle(doc, "Medicines", MARGIN, y, 30);
  y = drawMedicinesTable(doc, prescription.medicines || [], MARGIN, y);

  // ---- Notes ----
  if (prescription.testsRecommended) {
    y = sectionTitle(doc, "Tests Recommended", MARGIN, y);
    y = drawTextBox(doc, prescription.testsRecommended, MARGIN, y);
  }

  if (prescription.additionalAdvice) {
    y = sectionTitle(doc, "Additional Advice", MARGIN, y);
    y = drawTextBox(doc, prescription.additionalAdvice, MARGIN, y);
  }

  if (prescription.followUpDate) {
    y = sectionTitle(doc, "Follow-up Date", MARGIN, y);
    drawTextBox(doc, formatDate(prescription.followUpDate), MARGIN, y);
  }

  drawPageChrome(doc, prescription);
  return doc;
}

function fileNameFor(prescription, patient) {
  const safeName = (patient?.name || "patient").replace(/[^a-z0-9]+/gi, "_");
  return `Prescription-${prescription.id}-${safeName}.pdf`;
}

/** Saves the prescription as a PDF file to the user's Downloads folder. */
export function downloadPrescriptionPdf(prescription, meta = {}) {
  const doc = buildPrescriptionDoc(prescription, meta);
  doc.save(fileNameFor(prescription, meta.patient));
}


export function printPrescriptionPdf(prescription, meta = {}) {
  const doc = buildPrescriptionDoc(prescription, meta);
  const blobUrl = doc.output("bloburl");
  const printWindow = window.open(blobUrl, "_blank");
  if (!printWindow) return;
  try {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  } catch {
    // Auto-print not permitted by the browser — the opened tab is enough.
  }
}

export default { downloadPrescriptionPdf, printPrescriptionPdf };