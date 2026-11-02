import express from "express";
import multer from "multer";
import fs from "node:fs";

const uploadRouter = express.Router();

import path from "path";
import { uploadResume } from "../libs/uploadResume";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
import customError from "../utils/customError";

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const allowedMimes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!allowedMimes.has(file.mimetype)) {
            callback(customError(400, "Only PDF or Word documents are allowed"));
            return;
        }
        callback(null, true);
    },
});
uploadRouter.post("/", setAuthorization, authecticationMiddleware, upload.single("resume"), uploadResume);

export default uploadRouter;
