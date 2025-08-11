import { Router } from "express";
import {
    createResume,
    deleteResume,
    getAllResume,
    getResumeById,
    saveResume,
} from "../controllers/resume.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";

const resumeRouter = Router();

resumeRouter.post(
    "/create",
    setAuthorization,
    authecticationMiddleware,
    createResume
);

resumeRouter.get(
    "/get-all-resume",
    setAuthorization,
    authecticationMiddleware,
    getAllResume
);

resumeRouter.get(
    "/get-resume/:resumeId",
    setAuthorization,
    authecticationMiddleware,
    getResumeById
);

resumeRouter.patch(
    "/save-resume/:resumeUpdateId",
    setAuthorization,
    authecticationMiddleware,
    saveResume
);

resumeRouter.delete(
    "/delete-resume/:deleteResumeId",
    setAuthorization,
    authecticationMiddleware,
    deleteResume
);

export default resumeRouter;
