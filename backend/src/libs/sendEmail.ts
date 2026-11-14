import transporter from "./transporter";
import customError from "../utils/customError";

export default async function sendEmail(message: {
    to: string;
    subject: string;
    html: string;
}): Promise<void> {
    try {
        await transporter.sendMail({ ...message, from: process.env.SMTP_SENDER });
    } catch (error) {
        console.error("[email] SMTP delivery failed", { code: (error as { code?: string }).code });
        throw customError(503, "We couldn’t send your email. Please try again later.");
    }
}
