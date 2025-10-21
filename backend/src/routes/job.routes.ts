import { Router } from "express";
import {
    applyJobController,
    createJobController,
    deleteJobController,
    getAllJobsController,
    getBookmarkedJobsController,
    getFeaturedJobs,
    getJobByIdController,
    getRecruiterJobsController,
    toggleBookmarkController,
    updateJobController,
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
jobRouter.get("/recruiter/:recruiterId", getRecruiterJobsController);
jobRouter.patch(
    "/update/:id",
    setAuthorization,
    authecticationMiddleware,
    updateJobController
);
jobRouter.delete(
    "/delete/:id",
    setAuthorization,
    authecticationMiddleware,
    deleteJobController
);

jobRouter.post(
    "/bookmark/:jobId",
    setAuthorization,
    authecticationMiddleware,
    toggleBookmarkController
);
jobRouter.get(
    "/bookmarks",
    setAuthorization,
    authecticationMiddleware,
    getBookmarkedJobsController
);
jobRouter.post(
    "/apply/:jobId",
    setAuthorization,
    authecticationMiddleware,
    applyJobController
);

export default jobRouter;
