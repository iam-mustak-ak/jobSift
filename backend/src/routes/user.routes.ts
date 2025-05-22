import { Router } from "express";
import {
    createUser,
    getProfile,
    loginUser,
    verifyUser,
} from "../controllers/user.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
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

export default userRouter;
