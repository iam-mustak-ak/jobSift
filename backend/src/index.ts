import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import userAgent from "express-useragent";
import morgan from "morgan";
import connnectMongo from "./config/dbConfig";
import "./config/googleSIgnStrategy";
import globalErrorHandler from "./middlewares/globalError.middleware";
import Session from "./models/session.model";
import jobRouter from "./routes/job.routes";
import jobCategoryRouter from "./routes/jobCategory.routes";
import skillRouter from "./routes/skill.routes";
import userRouter from "./routes/user.routes";
dotenv.config();

// import "./cron";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3000/*", "*"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("Trust Proxy", 1);
app.use(morgan("tiny"));
app.use(userAgent.express());

interface limiterReq extends Request {
    user?: Record<string, any>;
}

const limitrer = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req: limiterReq) => (req.user ? 10000 : 500),
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

app.use("/auth", userRouter);
app.use("/job-category", jobCategoryRouter);
app.use("/skill", skillRouter);
app.use("/job", jobRouter);

app.use(globalErrorHandler);

const mongoUi = process.env.MONGO_URI!;

const startServer = async () => {
    try {
        connnectMongo(mongoUi);
        console.log("MongoDB connected");
        await Session.syncIndexes();
        console.log("Session indexes synced");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
