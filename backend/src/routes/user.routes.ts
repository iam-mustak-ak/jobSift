import { Request, Response, Router } from "express";
import passport from "passport";
import { FRONTEND_URL } from "../config/env";
import {
    changePassword,
    checkAuth,
    createUser,
    forgotPassword,
    getProfile,
    googleMainController,
    loginUser,
    logoutUser,
    resendOtp,
    resetPassword,
    updateProfile,
    updateSocialLinks,
    verifyUser,
} from "../controllers/user.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
import generateTokens from "../utils/generateTokens";
import setTokenCookies from "../utils/setTokenCookies";
const userRouter = Router();

userRouter.post("/create-user", createUser);
userRouter.post(
    "/login",

    loginUser
);
userRouter.post("/verify-user", verifyUser);
userRouter.get(
    "/me/:id",
    setAuthorization,
    authecticationMiddleware,
    getProfile
);

userRouter.post("/resend-email", resendOtp);
userRouter.get("/google", googleMainController);
userRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=OAuthFailed`,
    }),
    async function (req: Request, res: Response) {
        if (!req.user) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=OAuthFailed`
            );
        }

        const { refreshToken, accessToken } = await generateTokens(
            req.user as Record<string, any>,
            req
        );
        setTokenCookies(res, accessToken, refreshToken);

        // You might want to set tokens in cookies or session here

        res.redirect(`${FRONTEND_URL}`);
    }
);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post(
    "/change-password",
    setAuthorization,
    authecticationMiddleware,
    changePassword
);
userRouter.get(
    "/check-auth",
    setAuthorization,
    authecticationMiddleware,
    checkAuth
);
userRouter.get(
    "/logout",
    setAuthorization,
    authecticationMiddleware,
    logoutUser
);
userRouter.patch(
    "/update-social-links",
    setAuthorization,
    authecticationMiddleware,
    updateSocialLinks
);
userRouter.patch(
    "/update-social-links",
    setAuthorization,
    authecticationMiddleware,
    updateSocialLinks
);
userRouter.patch(
    "/update-profile",
    setAuthorization,
    authecticationMiddleware,
    updateProfile
);

export default userRouter;
