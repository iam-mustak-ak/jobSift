import { Router } from "express";
import {
    createJobController,
    getAllJobsController,
    getFeaturedJobs,
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

    getAllJobsController
);

jobRouter.get(
    "/get-job/:id",

    getJobByIdController
);

jobRouter.get("/get-featured", getFeaturedJobs);

export default jobRouter;
