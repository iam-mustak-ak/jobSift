import { createTransport } from "nodemailer";
import { APP_PASSWORD, SMTP_SENDER } from "../config/env";

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_SENDER,
        pass: APP_PASSWORD,
    },
});

export default transporter;
