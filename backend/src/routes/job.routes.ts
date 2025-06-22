import { Router } from "express";
import {
    createJobController,
    getAllJobsController,
    getJobByIdController,
} from "../controllers/job.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
const jobRouter = Router();

jobRouter.post(
    "/create",
    setAuthorization,
    authecticationMiddleware,
    createJobController
);
jobRouter.get(
    "/get-all-jobs",
    setAuthorization,
    authecticationMiddleware,
    getAllJobsController
);

jobRouter.get(
    "/get-job/:id",
    setAuthorization,
    authecticationMiddleware,
    getJobByIdController
);

export default jobRouter;
