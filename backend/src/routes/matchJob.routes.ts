import { Router } from "express";
import { matchJobsController } from "../controllers/jobMatching.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";

const matchjobRoute = Router();

matchjobRoute.get(
    "/",
    setAuthorization,
    authecticationMiddleware,
    matchJobsController
);

export default matchjobRoute;
