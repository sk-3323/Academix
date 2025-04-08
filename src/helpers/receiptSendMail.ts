import { paymentDataType } from "@/app/api/course/[id]/approve-payment/[enrollmentId]/route";
import { generatePDFReceipt } from "./generatePDFReceipt";
import fs from "fs";
import path from "path";
import { transporter } from "./sendVerificationMail";
export const sendReceiptEmail = async (receiptData: paymentDataType) => {
  // Generate PDF using the new function
  const doc = await generatePDFReceipt(receiptData);

  // Save PDF to file
  const filePath = path.join(
    process.cwd(),
    `receipt_${receiptData.receipt_number}.pdf`
  );
  const pdfBytes = doc.output();
  fs.writeFileSync(filePath, pdfBytes, "binary");

  // Email HTML content (same as before)
  const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt - Acedemix</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f6f9fc;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #e1e1e1;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #e1e1e1;
            }
                .logo{
       display: flex;
       justify-content: center;
       align-items: center;
       width: 100%;
       }
          .brand{
          color: #27e0b3;
          font-size: 32px;
          font-weight: bold;
          text-align: center;

        }
            .header img {
              max-width: 150px;
            }
            .content {
              padding: 20px 0;
            }
            .content h1 {
              font-size: 24px;
              color: #0ea5e9;
              margin: 0 0 10px;
            }
            .content p {
              font-size: 16px;
              line-height: 1.5;
              margin: 5px 0;
            }
            .highlight {
              font-weight: bold;
              color: #10b981;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e1e1e1;
              font-size: 12px;
              color: #8898aa;
            }
            .footer a {
              color: #0ea5e9;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1 class="brand">Academix</h1>
            </div>
            <div class="content">
              <h1>Payment Receipt</h1>
              <p>Dear <span class="highlight">${receiptData.user_name}</span>,</p>
              <p>Thank you for your purchase! Your enrollment in <span class="highlight">${receiptData.course_title}</span> has been successfully processed.</p>
              <p><strong>Receipt Number:</strong> ${receiptData.receipt_number}</p>
              <p><strong>Amount Paid:</strong> ₹${receiptData.amount?.toFixed(2)}</p>
              <p><strong>Payment ID:</strong> ${receiptData.payment_id || "N/A"}</p>
              <p><strong>Order ID:</strong> ${receiptData.order_id || "N/A"}</p>
              <p><strong>Date:</strong> ${receiptData.date}</p>
              <p>Please find your detailed receipt attached as a PDF. For any queries, feel free to contact us at <a href="mailto:support@acedemix.com">support@acedemix.com</a>.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Acedemix. All rights reserved.</p>
              <p><a href="https://academix-learning.netlify.app/">Visit our website</a> | <a href="mailto:support@acedemix.com">Contact Support</a></p>
            </div>
          </div>
        </body>
        </html>
      `;

  // Send email with PDF attachment
  const mailOptions = {
    from: `"Acedemix" <${process.env.EMAIL_USER}>`,
    to: receiptData.user_email,
    subject: `Payment Receipt for ${receiptData.course_title}`,
    html: emailContent,
    attachments: [
      {
        filename: `receipt_${receiptData.receipt_number}.pdf`,
        path: filePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    // Delete the file after sending
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Failed to send receipt email:", error);
    // Still try to delete the file even if email sending fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};
