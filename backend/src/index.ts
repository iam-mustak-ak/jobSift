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
import companyRouter from "./routes/compnay.routes";
import imageRouter from "./routes/image.routes";
import jobRouter from "./routes/job.routes";
import jobCategoryRouter from "./routes/jobCategory.routes";
import matchjobRoute from "./routes/matchJob.routes";
import resumeRouter from "./routes/resume.routes";
import analyzeRouter from "./routes/resumeAnalyze.route";
import skillRouter from "./routes/skill.routes";
import userRouter from "./routes/user.routes";

import http from "http";
import multer from "multer";
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes";
import uploadRouter from "./routes/uploadResume.routes";
dotenv.config();

import "./cron";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3000/*",
            "https://job-sift.vercel.app",
            "https://job-sift.vercel.app/*",
            "*",
        ],
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
const upload = multer({ storage: multer.memoryStorage() });
app.use("/auth", userRouter);
app.use("/job-category", jobCategoryRouter);
app.use("/skill", skillRouter);
app.use("/job", jobRouter);
app.use("/company", companyRouter);
app.use("/resume", resumeRouter);
app.use("/image", imageRouter);
app.use("/analyze", analyzeRouter);
app.use("/match-job", matchjobRoute);
app.use("/upload-resume", uploadRouter);
app.use("/notification", notificationRouter);

app.use(globalErrorHandler);

const mongoUi = process.env.MONGO_URI!;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://job-sift.vercel.app"],
        credentials: true,
    },
});

// --- store online users ---
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("register", (userId: string) => {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`✅ User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("❌ User disconnected:", socket.id);
    });
});

// --- attach io to express ---
app.use((req: any, res, next) => {
    req.io = io;
    next();
});

const startServer = async () => {
    try {
        await connnectMongo(mongoUi);
        console.log("✅ MongoDB connected");
        await Session.syncIndexes();
        console.log("✅ Session indexes synced");

        server.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
