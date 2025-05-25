import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User from "../models/user.model";
import customError from "../utils/customError";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const authecticationMiddleware: RequestHandler = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        next(customError(401, "Access Denied. No token provided."));
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            next(customError(404, "User not found"));
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default authecticationMiddleware;
