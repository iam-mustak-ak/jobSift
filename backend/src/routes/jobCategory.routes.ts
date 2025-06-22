import { Router } from "express";
import {
    createCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
} from "../controllers/jobCategory.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";

const jobCategoryRouter = Router();

jobCategoryRouter.post(
    "/create",
    setAuthorization,
    authecticationMiddleware,
    createCategoryController
);

jobCategoryRouter.get("/get-all-categories", getAllCategoriesController);
jobCategoryRouter.get("/get-category/:id", getCategoryByIdController);
jobCategoryRouter.patch(
    "/update-category/:id",
    setAuthorization,
    authecticationMiddleware,
    updateCategoryController
);

jobCategoryRouter.delete(
    "/delete-category/:id",
    setAuthorization,
    authecticationMiddleware,
    deleteCategoryController
);

export default jobCategoryRouter;
