import { Router } from "express";
import { getImageById, postImage } from "../controllers/image.controller";

import multer from "multer";
const upload = multer();

const imageRouter = Router();

imageRouter.post("/", upload.single("image"), postImage);
imageRouter.get("/:id", getImageById);

export default imageRouter;
