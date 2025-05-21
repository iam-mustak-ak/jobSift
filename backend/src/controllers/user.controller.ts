import { RequestHandler } from "express";
import User from "../models/user.model";
import {
    checkOtpRestrictions,
    sendOtp,
    trackOtpRequest,
} from "../utils/otpHelper";
export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate the input
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        await checkOtpRestrictions(email, res);
        await trackOtpRequest(email);
        await sendOtp(email);
        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};
