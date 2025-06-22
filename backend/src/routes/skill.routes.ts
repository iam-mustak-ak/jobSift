import { Router } from "express";

import {
    creatSkillController,
    deleteSkillController,
    getAllSkillsController,
    getSkillByIdController,
    updateSkillController,
} from "../controllers/skills.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";

const skillRouter = Router();

skillRouter.post(
    "/create",
    setAuthorization,
    authecticationMiddleware,
    creatSkillController
);

skillRouter.get("/get-all-skills", getAllSkillsController);
skillRouter.get("/get-skill/:id", getSkillByIdController);
skillRouter.patch(
    "/update-skill/:id",
    setAuthorization,
    authecticationMiddleware,
    updateSkillController
);

skillRouter.delete(
    "/delete-skill/:id",
    setAuthorization,
    authecticationMiddleware,
    deleteSkillController
);

export default skillRouter;
