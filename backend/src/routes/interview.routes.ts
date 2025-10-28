import { Router } from "express";
import {
    generateInterview,
    interViewHealth,
} from "../controllers/interview.controller";

const interViewRouter = Router();

interViewRouter.get("/generate", interViewHealth);
interViewRouter.post("/generate", generateInterview);

export default interViewRouter;
