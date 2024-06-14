import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "verification code of the app",
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {
            success: true,message: "Verification email sent successfully."
        }
    } catch (emailError) {
        console.log("Error sending verification email", emailError)
        return {success: false, message: "failed to send verification email."}
    }
}