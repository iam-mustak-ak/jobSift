import { NextFunction, Request, Response } from "express";
import Company from "../models/company.model";
import customError from "../utils/customError";

export const createCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {} = req.body;
    } catch (err) {
        next(err);
    }
};

export const getAllCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const allCompnay = await Company.find();

        res.status(200).json({
            success: true,
            message: "Fetched All Company",
            data: allCompnay,
        });
    } catch (err) {
        next(err);
    }
};

export const getCompanybyId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { companyId } = req.params;

    try {
        const company = await Company.findById(companyId);

        if (!company) {
            return next(customError(404, "Compnay not found"));
        }

        res.status(200).json({
            success: true,
            message: "Company fetched",
            data: company,
        });
    } catch (err) {
        next(err);
    }
};
