import { Router } from "express";
import multer from "multer";
import { analyzeReumeController } from "../controllers/resumeAnalyze.controller";

const analyzeRouter = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

analyzeRouter.post("/", upload.single("file"), analyzeReumeController);

export default analyzeRouter;
