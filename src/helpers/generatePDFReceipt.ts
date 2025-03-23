import { paymentDataType } from "@/app/api/course/[id]/approve-payment/[enrollmentId]/route";
import jsPDF from "jspdf";

export const generatePDFReceipt = async (receiptData: paymentDataType) => {
  // Create a new jsPDF instance (A4 paper, portrait)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set up some constants for positioning
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const textWidth = pageWidth - 2 * margin;

  // Set initial y position
  let y = 20;

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233); // #0ea5e9 in RGB
  doc.text("Acedemix Payment Receipt", pageWidth / 2, y, { align: "center" });
  y += 10;

  // Company Info
  doc.setFontSize(10);
  doc.setTextColor(51, 51, 51); // #333333
  doc.text("Acedemix", pageWidth / 2, y, { align: "center" });
  y += 5;
  doc.text(
    "CB Patel Computer College, Surat, Gujarat, India",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 5;
  doc.text(
    "Email: support@acedemix.com | Phone: +91-8780361401",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 10;

  // Add divider
  doc.setDrawColor(225, 225, 225); // #e1e1e1
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Receipt Details
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51); // #333333

  const details = [
    { label: "Receipt Number", value: receiptData.receipt_number || "N/A" },
    { label: "Student Name", value: receiptData.user_name },
    { label: "Course Title", value: receiptData.course_title },
    {
      label: "Amount Paid",
      value: `₹${receiptData.amount?.toFixed(2) || "0.00"}`,
    },
    { label: "Payment ID", value: receiptData.payment_id || "N/A" },
    { label: "Order ID", value: receiptData.order_id || "N/A" },
    { label: "Date", value: receiptData.date },
  ];

  details.forEach((item) => {
    doc.text(`${item.label}:`, margin, y);
    doc.text(item.value, margin + 60, y);
    y += 8;
  });

  // Add another divider
  y += 5;
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Thank You Note
  doc.setTextColor(16, 185, 129); // #10b981
  doc.text("Thank you for choosing Acedemix!", pageWidth / 2, y, {
    align: "center",
  });
  y += 15;

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(136, 152, 170); // #8898aa
  doc.text(
    `© ${new Date().getFullYear()} Acedemix. All rights reserved.`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 5;
  doc.text(
    "For support, contact us at support@acedemix.com",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  return doc;
};
