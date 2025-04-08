import { ApiResponse } from "../../types/ApiResponse";
import nodemailer from "nodemailer";
import { transporter } from "./sendVerificationMail";

export async function sendContactus(
  email: string,
  name: string,
  message: string
): Promise<ApiResponse> {
  try {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acedemix Contact Us</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background-color: #f6f9fc;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            margin: 0 auto;
            padding: 20px 0 48px;
            width: 580px;
        }

        .content-section {
            background-color: #ffffff;
            border: 1px solid #e1e1e1;
            border-radius: 5px;
            margin: 16px 0;
            padding: 24px;
        }

   
        .subheader {
            color: #333;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 24px 0;
        }

        .text {
            color: #333;
            font-size: 16px;
            line-height: 24px;
            margin: 16px 0;
        }

        .otp-container {
            background: #f0f7ff;
            border: 1px solid #cce5ff;
            border-radius: 4px;
            margin: 24px 0;
            padding: 16px;
            text-align: center;
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
        .otp-text {
            color: #0066cc;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 0;
        }

        .footer {
            color: #8898aa;
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            margin: 48px 0 0;
        }
    </style>
</head>
<body>
    <div class="container">
       <div class="logo">
        <h1 class="brand">Academix</h1>
       </div>
        
        <div class="content-section">
            <h2 class="subheader">Academix Contact</h2>
            
            
            <div class="otp-container">
                 <p class="text">From : Name = ${name} & Email = ${email}</p>
            <p class="text">Message : ${message}</p>
           
            </div>
            
            <p class="text">This Person is Trying To Reach You</p>
            
            
        </div>
        
        <p class="footer">© ${new Date().getFullYear()} <a href="https://academix-learning.netlify.app/">Academix</a>. All rights reserved.</p>
    </div>
</body>
</html>`;

    const emailResponse = await transporter.sendMail({
      from: `"Acedemix" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "Contact Us",
      html: content,
    });

    console.log("Email sent: %s", emailResponse);

    return {
      status: true,
      message: "Email Sent Successfully",
    };
  } catch (emailError) {
    console.error("Error sending email verification", emailError);
    throw emailError;
  }
}
