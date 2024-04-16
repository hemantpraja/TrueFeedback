import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResonse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResonse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'TrueFeedback account verification code',
            react: VerificationEmail({ username,otp: verifyCode}),
        });

        return { success: true, message: "Verification email sended successfully" }
    } catch (emailError) {
        console.error("Error while sending verification email: ", emailError);
        return { success: false, message: "Failed to send verification email" }
    }
}