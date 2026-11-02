import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import Company from "../models/company.model";
import User from "../models/user.model";
import customError from "../utils/customError";

const normalizeUrl = (value: unknown, label: string) => {
    if (value == null || value === "") return "";
    if (typeof value !== "string") throw customError(400, `${label} must be a valid URL`);
    try {
        const url = new URL(value.trim());
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
        return url.toString();
    } catch {
        throw customError(400, `${label} must be a valid http or https URL`);
    }
};

const normalizeCompanyFields = (body: Record<string, any>) => {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) throw customError(400, "Company name is required");

    const foundedYear = body.foundedYear === "" || body.foundedYear == null
        ? undefined
        : Number(body.foundedYear);
    const currentYear = new Date().getFullYear();
    if (foundedYear !== undefined && (!Number.isInteger(foundedYear) || foundedYear < 1800 || foundedYear > currentYear)) {
        throw customError(400, "Enter a valid company founding year");
    }

    const sizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001+"];
    const size = typeof body.size === "string" ? body.size.trim() : "";
    if (size && !sizeOptions.includes(size)) throw customError(400, "Select a valid company size");

    if (typeof body.description === "string" && body.description.length > 5000) {
        throw customError(400, "Company description must be 5,000 characters or fewer");
    }

    const socialLinks = Array.isArray(body.socialLinks)
        ? body.socialLinks
            .filter((item: any) => item && typeof item.platform === "string" && typeof item.url === "string" && item.url.trim())
            .map((item: any) => ({ platform: item.platform.trim().slice(0, 40), url: normalizeUrl(item.url, `${item.platform} link`) }))
        : [];

    return {
        name,
        website: normalizeUrl(body.website, "Company website"),
        industry: typeof body.industry === "string" ? body.industry.trim().slice(0, 100) : "",
        size,
        foundedYear,
        location: typeof body.location === "string" ? body.location.trim().slice(0, 160) : "",
        description: typeof body.description === "string" ? body.description.trim() : "",
        logo: normalizeUrl(body.logo, "Logo URL"),
        banner: normalizeUrl(body.banner, "Banner URL"),
        socialLinks,
    };
};

export const createCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authUser = req.user as unknown as { _id?: Types.ObjectId; role?: string; company?: Types.ObjectId } | undefined;
        if (!authUser?._id) return next(customError(401, "Authentication required"));
        if (authUser.role !== "recruiter") return next(customError(403, "Only recruiters can create a company profile"));
        if (authUser.company) return next(customError(409, "Your recruiter account is already linked to a company"));

        const fields = normalizeCompanyFields(req.body);
        const company = await Company.create(fields);
        const user = await User.findById(authUser._id);
        if (!user) {
            await company.deleteOne();
            return next(customError(404, "Recruiter account not found"));
        }
        user.company = company._id;
        await user.save();

        res.status(201).json({
            success: true,
            message: "Company profile created",
            data: company,
        });
    } catch (err) {
        next(err);
    }
};

export const updateCompany = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authUser = req.user as unknown as { _id?: Types.ObjectId; role?: string; company?: Types.ObjectId } | undefined;
        if (!authUser?._id) return next(customError(401, "Authentication required"));
        if (authUser.role !== "recruiter" || !authUser.company) {
            return next(customError(403, "A recruiter company profile is required"));
        }

        const fields = normalizeCompanyFields(req.body);
        const company = await Company.findByIdAndUpdate(
            authUser.company,
            { $set: fields },
            { new: true, runValidators: true },
        );
        if (!company) return next(customError(404, "Company profile not found"));

        res.status(200).json({
            success: true,
            message: "Company profile updated",
            data: company,
        });
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
