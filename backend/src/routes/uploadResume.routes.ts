import express from "express";
import multer from "multer";
import fs from "node:fs";

const uploadRouter = express.Router();

import path from "path";
import { uploadResume } from "../libs/uploadResume";

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
const upload = multer({ storage });
uploadRouter.post("/", upload.single("resume"), uploadResume);

export default uploadRouter;
