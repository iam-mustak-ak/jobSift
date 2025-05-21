import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>;
        }
    }
}

const authecticationMiddleware: RequestHandler = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access Denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default authecticationMiddleware;
