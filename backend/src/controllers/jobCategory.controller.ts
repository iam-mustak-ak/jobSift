import { RequestHandler } from "express";
import JobCategory from "../models/jobCategory.model";
import customError from "../utils/customError";

export const createCategoryController: RequestHandler = async (
    req,
    res,
    next
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

export const getAllCategoriesController: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const categories = await JobCategory.find();

        res.status(200).json({
            success: true,
            message: "Job categories fetched successfully",
            data: categories,
        });
    } catch (err) {
        next(err);
    }
};

export const getCategoryByIdController: RequestHandler = async (
    req,
    res,
    next
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

export const updateCategoryController: RequestHandler = async (
    req,
    res,
    next
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

export const deleteCategoryController: RequestHandler = async (
    req,
    res,
    next
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
