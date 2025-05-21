import { Response } from "express";

const setTokenCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    const accessTokenOptions: Record<string, string | boolean | number> = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60 * 1000,
    };

    const refreshTokenOptions: Record<string, string | boolean | number> = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
};

export default setTokenCookies;
