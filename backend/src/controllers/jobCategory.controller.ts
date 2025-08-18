import { NextFunction, Request, Response } from "express";
import JobCategory from "../models/jobCategory.model";
import customError from "../utils/customError";

export const createCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            next(customError(400, "Category name is required"));
        }

        const newCategory = new JobCategory({
            name,
            description,
        });
        await newCategory.save();

        res.status(201).json({
            success: true,
            message: "Job category created successfully",
            data: newCategory,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllCategoriesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const categories = await JobCategory.find().skip(skip).limit(limit);
        const total = await JobCategory.countDocuments();

        res.status(200).json({
            success: true,
            message: "Job categories fetched successfully",
            data: categories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getCategoryByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(customError(400, "Category ID is required"));
        }

        const category = await JobCategory.findById(id);

        if (!category) {
            return next(customError(404, "Job category not found"));
        }

        res.status(200).json({
            success: true,
            message: "Job category fetched successfully",
            data: category,
        });
    } catch (err) {
        next(err);
    }
};

export const updateCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id) {
            return next(customError(400, "Category ID is required"));
        }

        const updatedCategory = await JobCategory.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedCategory) {
            return next(customError(404, "Job category not found"));
        }

        res.status(200).json({
            success: true,
            message: "Job category updated successfully",
            data: updatedCategory,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(customError(400, "Category ID is required"));
        }

        const deletedCategory = await JobCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return next(customError(404, "Job category not found"));
        }

        res.status(200).json({
            success: true,
            message: "Job category deleted successfully",
            data: deletedCategory,
        });
    } catch (err) {
        next(err);
    }
};
