import { SMTP_SENDER } from "../../config/env";
import transporter from "../../libs/transporter";
import { htmlTemplates } from "./htmlTemplates";

class EmailTemplates {
    private htmlContent: string = "";
    private subject: string = "";
    constructor(public template: "otp-verification" | "password-reset") {
        this.template = template;
    }

    setOtp(otp: string): this {
        switch (this.template) {
            case "otp-verification":
                this.htmlContent = htmlTemplates["otp-verification"].html(otp);
                this.subject = htmlTemplates["otp-verification"].subject;
                break;
            case "password-reset":
                this.htmlContent = htmlTemplates["password-reset"].html(otp);
                this.subject = htmlTemplates["password-reset"].subject;
                break;
            default:
                throw new Error("Invalid template type");
        }
        return this;
    }

    async sendEmail(to: string): Promise<this> {
        await transporter.sendMail({
            from: SMTP_SENDER,
            to: to,
            subject: this.subject,
            html: this.htmlContent,
        });
        return this;
    }
}

export default EmailTemplates;
