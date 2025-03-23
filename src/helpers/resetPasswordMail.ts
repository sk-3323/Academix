import { ApiResponse } from "../../types/ApiResponse";
import nodemailer from "nodemailer";
import { transporter } from "./sendVerificationMail";
import logo from "../../public/assets/logos/light-h-logo-with-name.svg";
import { NODE_APP_URL } from "@/constants/config";
export async function sendResetPasswordLink(
  email: string,
  username: string,
  link: string
): Promise<ApiResponse> {
  try {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acedemix OTP Email</title>
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
 .logo{
       display: flex;
       justify-content:center;
       align-items: center;
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

        .header {
            color: #27e0b3;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin: 16px 0;
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
    
    <div class="content-section">
            <div class="logo">
                <img src="https://utfs.io/f/5de60556-de08-43ed-ae96-1248d5892fe8-al67x0.svg" alt="Academix Logo"/>
            </div>
            <h2 class="subheader">Reset Password Link</h2>
            
            <p class="text">Hello ${username}</p>
            
            <p class="text">Your Password Reset Link:</p>
            
            <a href="${link}">Click for Password Reset</a>
            
            <p class="text">This LINK is valid for 2 minutes.</p>
            
            <p class="text">
                If you didn't request this LINK, please ignore this email.
            </p>
        </div>
        
        <p class="footer">© ${new Date().getFullYear()} <a href="https://academix-learning.netlify.app/">Academix</a>. All rights reserved.</p>
    </div>
</body>
</html>`;

    const emailResponse = await transporter.sendMail({
      from: `"Acedemix" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Link | Acedemix",
      html: content,
    });

    return {
      status: true,
      message: "Password reset link sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending link", emailError);
    throw emailError;
  }
}
