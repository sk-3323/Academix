import { resend } from "@/lib/resend";
import OTPEmailTemplate from "../../email/OTPEmailTemplate";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendEmailVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    let details = await resend.emails.send({
      from: "Verfication by Academix <onboarding@resend.dev>",
      to: [email],
      subject: "OTP Verification | Acedemix",
      react: OTPEmailTemplate({ otp: verifyCode, recipientName: username }),
    });
    return {
      status: true,
      message: "Email Verification Send Successfully",
      result: details,
    };
  } catch (emailError) {
    console.error("Error sending email verification", emailError);
    throw emailError;
  }
}
