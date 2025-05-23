import dotenv from "dotenv";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // 👈 make sure this path is correct
import customError from "../utils/customError";
import generateTokens from "../utils/generateTokens";
import isTokenExpires from "../utils/isTokenExpires";
import setTokenCookies from "../utils/setTokenCookies";

dotenv.config();

const setAuthorization: RequestHandler = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;

        if (!process.env.JWT_SECRET) {
            next(customError(500, "JWT secret not defined"));
            return;
        }

        if (accessToken && !isTokenExpires(accessToken)) {
            try {
                req.headers.authorization = `Bearer ${accessToken}`;
                return next();
            } catch (err) {
                console.warn("Invalid access token:", err);
            }
        }

        // If no accessToken or expired, use refreshToken
        if (refreshToken) {
            try {
                const decoded: any = jwt.verify(
                    refreshToken,
                    process.env.JWT_SECRET
                );
                const user = await User.findById(decoded.id); // 👈 fetch fresh user
                if (!user) throw new Error("User not found");

                const {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                } = await generateTokens(user, req);

                setTokenCookies(res, newAccessToken, newRefreshToken);
                req.headers.authorization = `Bearer ${newAccessToken}`;
                return next();
            } catch (err) {
                console.warn("Refresh token failed:", err);
            }
        }

        throw new Error("Authentication required");
    } catch (error) {
        return next(error);
    }
};

export default setAuthorization;
