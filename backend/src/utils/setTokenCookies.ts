import { Response } from "express";

const setTokenCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    const isProduction = process.env.NODE_ENV === "production";

    const accessTokenOptions: Record<string, string | boolean | number> = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 5 * 60 * 1000,
        path: "/",
    };

    const refreshTokenOptions: Record<string, string | boolean | number> = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 5 * 24 * 60 * 60 * 1000,
        path: "/",
    };

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
};

export default setTokenCookies;
