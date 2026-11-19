import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/types";

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function generateInvoicePdf(booking: Booking): void {
  const invoiceNumber = `INV-${booking.id.slice(-8).toUpperCase()}`;
  const issueDate = formatDate(new Date().toISOString(), {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const bookingDate = formatDate(booking.date, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeSlot = `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)} (${booking.hours} hrs)`;

  const lines: string[] = [];

  // Background and header banner
  lines.push("0.96 0.94 0.91 rg"); // Soft bone background for header
  lines.push("40 730 515 80 re f");

  // Accent line
  lines.push("0.78 0.95 0.31 rg"); // Brand chartreuse
  lines.push("40 726 515 4 re f");

  // Logo / Brand title
  lines.push("BT");
  lines.push("/F2 22 Tf");
  lines.push("0.08 0.09 0.07 rg"); // Dark charcoal
  lines.push("56 775 Td");
  lines.push(`(StudioSpace) Tj`);
  lines.push("ET");

  // Subtitle
  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.35 0.35 0.35 rg");
  lines.push("56 755 Td");
  lines.push(`(Peer-to-Peer Creative Workspace Platform) Tj`);
  lines.push("ET");

  // Invoice label & number on right
  lines.push("BT");
  lines.push("/F2 16 Tf");
  lines.push("0.08 0.09 0.07 rg");
  lines.push("400 775 Td");
  lines.push(`(OFFICIAL RECEIPT) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.35 0.35 0.35 rg");
  lines.push("400 755 Td");
  lines.push(`(Invoice #: ${escapePdfText(invoiceNumber)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("400 740 Td");
  lines.push(`(Date Issued: ${escapePdfText(issueDate)}) Tj`);
  lines.push("ET");

  // Guest details & Studio details section
  lines.push("0.92 0.92 0.90 rg");
  lines.push("40 630 250 80 re f");
  lines.push("305 630 250 80 re f");

  lines.push("BT");
  lines.push("/F2 10 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push("55 692 Td");
  lines.push(`(RESERVED BY / GUEST) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 10 Tf");
  lines.push("55 674 Td");
  lines.push(`(${escapePdfText(booking.guestName)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.4 0.4 0.4 rg");
  lines.push("55 658 Td");
  lines.push(`(${escapePdfText(booking.guestEmail)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F2 10 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push("320 692 Td");
  lines.push(`(WORKSPACE / STUDIO) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 10 Tf");
  lines.push("320 674 Td");
  lines.push(`(${escapePdfText(booking.studioTitle)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.4 0.4 0.4 rg");
  lines.push("320 658 Td");
  lines.push(`(Host: ${escapePdfText(booking.ownerEmail)}) Tj`);
  lines.push("ET");

  // Reservation details table header
  lines.push("0.1 0.1 0.1 rg");
  lines.push("40 590 515 24 re f");

  lines.push("BT");
  lines.push("/F2 9 Tf");
  lines.push("1 1 1 rg");
  lines.push("55 598 Td");
  lines.push(`(DESCRIPTION) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F2 9 Tf");
  lines.push("1 1 1 rg");
  lines.push("330 598 Td");
  lines.push(`(DATE & TIME) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F2 9 Tf");
  lines.push("1 1 1 rg");
  lines.push("475 598 Td");
  lines.push(`(AMOUNT) Tj`);
  lines.push("ET");

  // Item rows
  lines.push("0.98 0.98 0.98 rg");
  lines.push("40 540 515 45 re f");

  lines.push("BT");
  lines.push("/F2 10 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push("55 565 Td");
  lines.push(`(Studio Reservation - ${escapePdfText(booking.studioTitle)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.4 0.4 0.4 rg");
  lines.push("55 550 Td");
  lines.push(`(Duration: ${booking.hours} hours) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.2 0.2 0.2 rg");
  lines.push("330 565 Td");
  lines.push(`(${escapePdfText(bookingDate)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 8 Tf");
  lines.push("0.4 0.4 0.4 rg");
  lines.push("330 550 Td");
  lines.push(`(${escapePdfText(timeSlot)}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F2 10 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push("475 560 Td");
  lines.push(`(${escapePdfText(formatCurrency(booking.totalPrice))}) Tj`);
  lines.push("ET");

  // Deposit row if any
  if (booking.securityDeposit > 0) {
    lines.push("0.95 0.95 0.95 rg");
    lines.push("40 500 515 35 re f");

    lines.push("BT");
    lines.push("/F1 9 Tf");
    lines.push("0.1 0.1 0.1 rg");
    lines.push("55 515 Td");
    lines.push(`(Refundable Security Deposit) Tj`);
    lines.push("ET");

    lines.push("BT");
    lines.push("/F1 9 Tf");
    lines.push("0.4 0.4 0.4 rg");
    lines.push("330 515 Td");
    lines.push(`(Held by host, refunded post-session) Tj`);
    lines.push("ET");

    lines.push("BT");
    lines.push("/F1 9 Tf");
    lines.push("0.1 0.1 0.1 rg");
    lines.push("475 515 Td");
    lines.push(`(${escapePdfText(formatCurrency(booking.securityDeposit))}) Tj`);
    lines.push("ET");
  }

  // Summary box
  const summaryTop = booking.securityDeposit > 0 ? 470 : 510;
  lines.push("0.96 0.94 0.91 rg");
  lines.push(`350 ${summaryTop - 90} 205 85 re f`);

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.35 0.35 0.35 rg");
  lines.push(`365 ${summaryTop - 25} Td`);
  lines.push(`(Studio Subtotal:) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 9 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push(`475 ${summaryTop - 25} Td`);
  lines.push(`(${escapePdfText(formatCurrency(booking.totalPrice))}) Tj`);
  lines.push("ET");

  if (booking.securityDeposit > 0) {
    lines.push("BT");
    lines.push("/F1 9 Tf");
    lines.push("0.35 0.35 0.35 rg");
    lines.push(`365 ${summaryTop - 45} Td`);
    lines.push(`(Security Deposit:) Tj`);
    lines.push("ET");

    lines.push("BT");
    lines.push("/F1 9 Tf");
    lines.push("0.1 0.1 0.1 rg");
    lines.push(`475 ${summaryTop - 45} Td`);
    lines.push(`(${escapePdfText(formatCurrency(booking.securityDeposit))}) Tj`);
    lines.push("ET");
  }

  // Divider
  lines.push("0.8 0.8 0.8 rg");
  lines.push(`365 ${summaryTop - 55} 175 1 re f`);

  // Total
  const totalWithDeposit = booking.totalPrice + booking.securityDeposit;
  lines.push("BT");
  lines.push("/F2 11 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push(`365 ${summaryTop - 75} Td`);
  lines.push(`(Total Amount:) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F2 12 Tf");
  lines.push("0.1 0.1 0.1 rg");
  lines.push(`475 ${summaryTop - 75} Td`);
  lines.push(`(${escapePdfText(formatCurrency(totalWithDeposit))}) Tj`);
  lines.push("ET");

  // Status badge
  lines.push("BT");
  lines.push("/F2 10 Tf");
  lines.push("0.15 0.55 0.25 rg"); // Green
  lines.push(`55 ${summaryTop - 35} Td`);
  lines.push(`(Booking Status: ${booking.status.toUpperCase()}) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 8 Tf");
  lines.push("0.45 0.45 0.45 rg");
  lines.push(`55 ${summaryTop - 55} Td`);
  lines.push(`(Confirmed reservations are verified directly by the space host.) Tj`);
  lines.push("ET");

  // Footer notes
  lines.push("0.85 0.85 0.85 rg");
  lines.push("40 100 515 1 re f");

  lines.push("BT");
  lines.push("/F1 8 Tf");
  lines.push("0.5 0.5 0.5 rg");
  lines.push("55 80 Td");
  lines.push(`(StudioSpace Platform - Creative Workspace & Production Studio Sharing - hello@studiospace.com) Tj`);
  lines.push("ET");

  lines.push("BT");
  lines.push("/F1 8 Tf");
  lines.push("0.5 0.5 0.5 rg");
  lines.push("55 65 Td");
  lines.push(`(Thank you for choosing StudioSpace. Keep this invoice for your production records.) Tj`);
  lines.push("ET");

  const streamContent = lines.join("\n");
  const streamLength = streamContent.length;

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
  ];

  let currentOffset = 0;
  const offsets: number[] = [0];

  for (const part of pdfParts) {
    currentOffset += part.length;
    offsets.push(currentOffset);
  }

  let xref = `xref\n0 7\n0000000000 65535 f \n`;
  for (let i = 0; i < 6; i++) {
    const offsetStr = String(offsets[i]).padStart(10, "0");
    xref += `${offsetStr} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${currentOffset}\n%%EOF\n`;
  const fullPdf = pdfParts.join("") + xref + trailer;

  const blob = new Blob([fullPdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `StudioSpace-Invoice-${booking.id.slice(-6).toUpperCase()}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

