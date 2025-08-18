"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const morgan_1 = __importDefault(require("morgan"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
require("./config/googleSIgnStrategy");
const globalError_middleware_1 = __importDefault(require("./middlewares/globalError.middleware"));
const session_model_1 = __importDefault(require("./models/session.model"));
const compnay_routes_1 = __importDefault(require("./routes/compnay.routes"));
const image_routes_1 = __importDefault(require("./routes/image.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const jobCategory_routes_1 = __importDefault(require("./routes/jobCategory.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
// import "./cron";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3000/*", "*"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.set("Trust Proxy", 1);
app.use((0, morgan_1.default)("tiny"));
app.use(express_useragent_1.default.express());
const limitrer = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: (req) => (req.user ? 10000 : 500),
    message: {
        error: "Too many request, Please try again later!",
    },
    standardHeaders: true,
    legacyHeaders: true,
    keyGenerator: (req) => req.ip,
});
app.use(limitrer);
const port = process.env.PORT || 3001;
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        status: 200,
        message: "jobsift api is running and healthy",
    });
}));
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "jobsift api is healthy",
    });
});
app.use("/auth", user_routes_1.default);
app.use("/job-category", jobCategory_routes_1.default);
app.use("/skill", skill_routes_1.default);
app.use("/job", job_routes_1.default);
app.use("/company", compnay_routes_1.default);
app.use("/resume", resume_routes_1.default);
app.use("/image", image_routes_1.default);
app.use(globalError_middleware_1.default);
const mongoUi = process.env.MONGO_URI;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, dbConfig_1.default)(mongoUi);
        console.log("MongoDB connected");
        yield session_model_1.default.syncIndexes();
        console.log("Session indexes synced");
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
});
startServer();
