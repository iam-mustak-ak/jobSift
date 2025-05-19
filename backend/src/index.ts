import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import connnectMongo from "./config/dbConfig";
import EmailTemplates from "./libs/email-template";
dotenv.config();

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("Trust Proxy", 1);
app.use(morgan("tiny"));

interface limiterReq extends Request {
    user?: Record<string, any>;
}

const limitrer = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req: limiterReq) => (req.user ? 1000 : 100),
    message: {
        error: "Too many request, Please try again later!",
    },
    standardHeaders: true,
    legacyHeaders: true,
    keyGenerator: (req: Request) => req.ip!,
});
app.use(limitrer);

const port = process.env.PORT || 3001;
app.get("/", async (req: Request, res: Response) => {
    await new EmailTemplates("otp-verification")
        .setOtp("1234")
        .sendEmail("mustakahmedkhan32@gmail.com");
    res.status(200).json({
        status: 200,
        message: "jobsift api is running and healthy",
    });
});
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "jobsift api is healthy",
    });
});

const mongoUi = process.env.MONGO_URI!;

connnectMongo(mongoUi);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
