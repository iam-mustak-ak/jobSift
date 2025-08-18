import { NextFunction, Request, Response } from "express";

import Skill from "../models/skill.model";
import customError from "../utils/customError";

export const creatSkillController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            next(customError(400, "Skill name is required"));
        }

        const newSill = new Skill({
            name,
            description,
        });
        await newSill.save();

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: newSill,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllSkillsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const skills = await Skill.find();

        res.status(200).json({
            success: true,
            message: "Skills fetched successfully",
            data: skills,
        });
    } catch (err) {
        next(err);
    }
};

export const getSkillByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(customError(400, "Skill ID is required"));
        }

        const skill = await Skill.findById(id);

        if (!skill) {
            return next(customError(404, "Skill not found"));
        }

        res.status(200).json({
            success: true,
            message: "Skill fetched successfully",
            data: skill,
        });
    } catch (err) {
        next(err);
    }
};

export const updateSkillController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id) {
            return next(customError(400, "Skill Id is required"));
        }

        const updatedSkill = await Skill.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedSkill) {
            return next(customError(404, "Skill not found"));
        }

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            data: updatedSkill,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteSkillController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(customError(400, "Skill ID is required"));
        }

        const deletedSkill = await Skill.findByIdAndDelete(id);

        if (!deletedSkill) {
            return next(customError(404, "Skill not found"));
        }

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
            data: deletedSkill,
        });
    } catch (err) {
        next(err);
    }
};
