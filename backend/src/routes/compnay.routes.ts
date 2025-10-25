import { Router } from "express";
import {
    getAllCompany,
    getCompanybyId,
} from "../controllers/company.controller";
const companyRouter = Router();

companyRouter.get("/get-all-compnay", getAllCompany);
companyRouter.get("/get-company/:companyId", getCompanybyId);

export default companyRouter;
