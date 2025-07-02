import { Router } from "express";
import { getAllCompany } from "../controllers/company.controller";
const companyRouter = Router();

companyRouter.get("/get-all-compnay", getAllCompany);

export default companyRouter;
