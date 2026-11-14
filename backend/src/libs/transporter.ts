import { createTransport } from "nodemailer";
import { APP_PASSWORD, SMTP_SENDER } from "../config/env";

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
        user: SMTP_SENDER,
        pass: APP_PASSWORD,
    },
});

export default transporter;
