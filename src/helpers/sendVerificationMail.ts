import { resend } from "@/lib/resend";
import OTPEmailTemplate from "../../email/OTPEmailTemplate";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendEmailVerification(email: string,username: string,verifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: 'OTP Verification | Acedemix',
            react: OTPEmailTemplate({otp:verifyCode,recipientName:username}),
          });
        return {
            success:true,
            message: "Email Verification Send Successfully"
        }        
    } catch (emailError) {
        console.error("Error sending email verification",emailError);
return {
    success:false,
    message: "An error occurred while sending the email verification."
}
    }
}