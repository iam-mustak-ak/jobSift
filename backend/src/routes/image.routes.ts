import { Router } from "express";
import { getImageById, postImage } from "../controllers/image.controller";

import multer from "multer";
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
            callback(new Error("Only image files are allowed"));
            return;
        }
        callback(null, true);
    },
});

const imageRouter = Router();

imageRouter.post("/", upload.single("image"), postImage);
imageRouter.get("/:id", getImageById);

export default imageRouter;
