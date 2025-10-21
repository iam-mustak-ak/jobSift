import express from "express";
import multer from "multer";
import { uploadResume } from "../libs/uploadResume";

const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/", upload.single("resume"), uploadResume);

export default uploadRouter;
