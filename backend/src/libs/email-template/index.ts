import transporter from "../transporter";
import { htmlTemplates } from "./htmlTemplates";

class EmailTemplates {
    private htmlContent: string = "";
    constructor(public template: "otp-verification" | "password-reset") {
        this.template = template;
    }

    setOtp(otp: string): this {
        switch (this.template) {
            case "otp-verification":
                this.htmlContent = htmlTemplates["otp-verification"].html(otp);
                break;
            case "password-reset":
                this.htmlContent = "password-reset";
                break;
            default:
                throw new Error("Invalid template type");
        }
        return this;
    }

    async sendEmail(to: string): Promise<this> {
        await transporter.sendMail({
            from: "mustakahmedkhan0@gmail.com",
            to: to,
            subject: "OTP Verification",
            html: this.htmlContent,
        });
        return this;
    }
}

export default EmailTemplates;
