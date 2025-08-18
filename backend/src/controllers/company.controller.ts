import { NextFunction, Request, Response } from "express";
import Company from "../models/company.model";

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
