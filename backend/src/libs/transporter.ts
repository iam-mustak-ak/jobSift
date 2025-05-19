import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "mustakahmedkhan0@gmail.com",
        pass: "huypbxvdtktczftm",
    },
});

export default transporter;
