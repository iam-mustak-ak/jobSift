import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import passport from "passport";
import User from "../models/user.model";
import customError from "../utils/customError";
import generateTokens from "../utils/generateTokens";
import {
    checkOtpRestrictions,
    sendOtp,
    trackOtpRequest,
    verifyOtp,
} from "../utils/otpHelper";
import setTokenCookies from "../utils/setTokenCookies";
export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const { role, name, email, password } = req.body;

        // Validate the input
        if (!role || !name || !email || !password) {
            next(customError(400, "All fields are required"));
            return;
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            next(customError(400, "User already exists"));
            return;
        }

        // await checkOtpRestrictions(email, res, next);
        // await trackOtpRequest(email, next);
        await sendOtp(email);
        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            role,
            isAvailableForHire: role === "candidate" ? true : false,
        });
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

export const loginUser: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate the input
        if (!email || !password) {
            next(customError(400, "All fields are required"));
            return;
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            next(customError(400, "Invalid credentials"));
            return;
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            next(customError(400, "Invalid credentials"));
            return;
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user, req);

        console.log("Access Token: from sign", accessToken);
        console.log("Refresh Token: from sign", refreshToken);
        // Set the refresh token in a cookie
        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyUser: RequestHandler = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Validate the input
        if (!email || !otp) {
            next(customError(400, "All fields are required"));
            return;
        }

        // Check if the user exists
        const user = await User.findOne({ email }).select("-password");
        if (!user) {
            next(customError(400, "Invalid credentials"));
            return;
        }

        // Verify the OTP
        await verifyOtp(email, otp, next);
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const authUser = req.user;
        // console.log("auth User", authUser?._id.toString());

        // Validate the input
        if (!userId) {
            next(customError(400, "User ID is required"));
            return;
        }

        if (userId) {
            next(customError(400, "Your are not valid user"));
            return;
        }
        // Check if the user exists
        const user = await User.findById(userId).select("-password");
        if (!user) {
            next(customError(400, "User not found"));
            return;
        }

        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const resendOtp: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            next(customError(405, "Email is required"));
            return;
        }

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            next(customError(404, "User Not Found!"));
            return;
        }

        await checkOtpRestrictions(email, res, next);
        await trackOtpRequest(email, next);
        await sendOtp(email);

        res.status(200).json({
            success: true,
            message: "An Otp sent to your provided Email Account",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

export const googleMainController: RequestHandler = (req, res, next) => {
    const { mode, role } = req.query;

    if (!mode || (mode !== "login" && mode !== "register")) {
        res.status(400).json({ error: "Invalid or missing 'mode'" });
        return;
    }

    const params = new URLSearchParams();
    params.set("mode", mode as string);
    if (role) params.set("role", role as string);

    const state = params.toString();

    passport.authenticate("google", {
        session: false,
        scope: ["profile", "email"],
        state,
    })(req, res, next);
};
