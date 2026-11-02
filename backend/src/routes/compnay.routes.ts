import { Router } from "express";
import {
    createCompany,
    getAllCompany,
    getCompanybyId,
    updateCompany,
} from "../controllers/company.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
const companyRouter = Router();

companyRouter.get("/get-all-compnay", getAllCompany);
companyRouter.get("/get-company/:companyId", getCompanybyId);
companyRouter.post("/create-company", setAuthorization, authecticationMiddleware, createCompany);
companyRouter.patch("/update-company", setAuthorization, authecticationMiddleware, updateCompany);

export default companyRouter;
