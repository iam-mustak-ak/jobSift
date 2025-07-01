import { RequestHandler } from "express";
import Company from "../models/company.model";

export const createCompany: RequestHandler = async (req, res, next) => {
    try {
        const {} = req.body;
    } catch (err) {
        next(err);
    }
};

export const getAllCompany: RequestHandler = async (req, res, next) => {
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
