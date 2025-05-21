import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import generateTokens from "../utils/generateTokens";
import isTokenExpires from "../utils/isTokenExpires";
import setTokenCookies from "../utils/setTokenCookies";

const setAuthorization: RequestHandler = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken || !isTokenExpires(accessToken)) {
            const decodedToken: any = jwt.verify(accessToken, JWT_SECRET!);
            if (!decodedToken) {
                throw new Error("Invalid access token");
            }

            req.headers.authorization = `Bearer ${accessToken}`;
        }

        if (!accessToken || isTokenExpires(accessToken)) {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error("Refresh token not found");
            }

            const decodedToken: any = jwt.verify(refreshToken, JWT_SECRET!);
            if (!decodedToken) {
                throw new Error("Invalid refresh token");
            }

            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshtoken,
            } = await generateTokens(decodedToken, req);
            setTokenCookies(res, newAccessToken, newRefreshtoken);

            req.headers.authorization = `Bearer ${newAccessToken}`;
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default setAuthorization;
