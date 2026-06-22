import { jsPDF } from 'jspdf';
import type { ItineraryDay } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from './places';

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [34, 34, 34];
}

export async function exportItineraryPdf(days: ItineraryDay[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // --- HEADER ---
  doc.setFillColor(239, 51, 64);
  doc.rect(0, 0, pageWidth, 4, 'F');

  y = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(34, 34, 34);
  doc.text('Explore Singapore', margin, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(113, 113, 113);
  doc.text('Your Trip Itinerary', margin, y);

  const totalPlaces = days.reduce((sum, d) => sum + d.places.length, 0);
  const dateStr = new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' });
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  doc.text(`${days.length} days · ${totalPlaces} places · Generated ${dateStr}`, margin, y);

  // Divider
  y += 8;
  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- DAYS ---
  for (const day of days) {
    if (day.places.length === 0) continue;

    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = margin;
    }

    // Day header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(34, 34, 34);
    doc.text(day.label.toUpperCase(), margin, y);

    // Day subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(160, 160, 160);
    doc.text(`${day.places.length} places`, margin + doc.getTextWidth(day.label.toUpperCase()) + 4, y);
    y += 10;

    // Places
    for (let i = 0; i < day.places.length; i++) {
      const place = day.places[i];

      // Check if we need a new page
      if (y > 260) {
        doc.addPage();
        y = margin;
      }

      // Number circle
      const catColor = hexToRgb(CATEGORY_COLORS[place.category] || '#222222');
      doc.setFillColor(catColor[0], catColor[1], catColor[2]);
      doc.circle(margin + 4, y - 1, 3.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(String(i + 1), margin + 4 - doc.getTextWidth(String(i + 1)) / 2, y + 0.5);

      // Place name
      const nameX = margin + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(34, 34, 34);
      doc.text(place.name, nameX, y);

      // Rating + Category
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 113);
      const ratingText = `★ ${place.rating}`;
      doc.text(ratingText, nameX, y);

      const catLabel = CATEGORY_LABELS[place.category] || place.category;
      doc.setTextColor(catColor[0], catColor[1], catColor[2]);
      doc.text(` · ${catLabel}`, nameX + doc.getTextWidth(ratingText), y);

      // Address
      if (place.address) {
        y += 5;
        doc.setTextColor(160, 160, 160);
        doc.setFontSize(8.5);
        doc.text(place.address, nameX, y);
      }

      // Google Maps link
      y += 5;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
      doc.setTextColor(0, 102, 204);
      doc.setFontSize(8);
      doc.textWithLink('Open in Google Maps →', nameX, y, { url: mapsUrl });

      // Spacing between places
      y += 12;
    }

    // Spacing between days
    y += 6;
  }

  // --- FOOTER ---
  if (y > 260) {
    doc.addPage();
    y = margin;
  }

  y += 5;
  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  doc.text('Made with Explore Singapore', margin, y);
  doc.setTextColor(0, 102, 204);
  doc.textWithLink('app.exploresg.info', margin + doc.getTextWidth('Made with Explore Singapore '), y, { url: 'https://app.exploresg.info' });

  // --- OUTPUT ---
  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], 'exploresg-itinerary.pdf', { type: 'application/pdf' });

  // Try native share on mobile
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: 'My Singapore Itinerary',
        text: 'Check out my Singapore trip plan!',
      });
      return;
    } catch {
      // User cancelled or share failed — fall through to download
    }
  }

  // Fallback: download
  doc.save('exploresg-itinerary.pdf');
}
