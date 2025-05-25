import bcrypt from "bcrypt";
import { error } from "console";
import { RequestHandler } from "express";
import passport from "passport";
import { FRONTEND_URL } from "../config/env";
import redis from "../libs/redis";
import User from "../models/user.model";
import EmailTemplates from "../services/email-template";
import customError from "../utils/customError";
import generateTokens from "../utils/generateTokens";
import {
    checkOtpRestrictions,
    sendOtp,
    trackOtpRequest,
    verifyOtp,
} from "../utils/otpHelper";
import { trackResetEmail } from "../utils/resetPasswordHelper";
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
        const authUser = req.user as { _id?: { toString: () => string } };
        // console.log("auth User", authUser?._id.toString());

        // Validate the input
        if (!userId) {
            next(customError(400, "User ID is required"));
            return;
        }

        if (userId !== authUser?._id?.toString()) {
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

export const forgotPassword: RequestHandler = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            next(customError(400, "Please provide a valid email"));
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            next(customError(404, "User not found with that email!"));
            return;
        }
        await trackResetEmail(email, next);

        if (await redis.get(`reset_lock${email}`)) {
            next(
                customError(
                    429,
                    "You have reached the maximum number of Reset requests. Please try after 1 hour."
                )
            );
            return;
        }
        const hexValue = crypto.randomUUID();

        await redis.set(`reset-password${email}`, hexValue, "EX", 300);

        const emailTemplate = new EmailTemplates("password-reset");

        await emailTemplate
            .setOtp(
                `${FRONTEND_URL}/reset-password?email=${email}&resetId=${hexValue}`
            )
            .sendEmail(email);

        res.status(200).json({
            success: true,
            message: "An email sent to you Email with reset link",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        const { email, resetId, password, confirmPassword } = req.body;

        if (!email || !resetId || !password || !confirmPassword) {
            next(customError(400, "Parameter Missing"));
            return;
        }
        if (password !== confirmPassword) {
            next(
                customError(204, "Password and confirm password do not match")
            );
        }

        const storedResetId = await redis.get(`reset-password${email}`);

        if (storedResetId !== resetId) {
            next(customError(400, "Invalid Or expired Link"));
            return;
        }

        let user = await User.findOne({ email });
        if (!user) {
            next(customError(404, "Invalid or Expired Link"));
            return;
        }

        user.password = password;
        user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfull",
            data: null,
        });
    } catch (err) {
        next(error);
    }
};

export const checkAuth: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            next(
                customError(
                    404,
                    "User not found or invalid token or expired token"
                )
            );
            return;
        }

        res.status(200).json({
            success: true,
            message: "User Is Valid",
            data: user,
        });
    } catch (err) {
        next(err);
    }
};
