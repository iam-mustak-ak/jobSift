import { Router } from "express";
import {
    createUser,
    loginUser,
    verifyUser,
} from "../controllers/user.controller";
const userRouter = Router();

userRouter.post("/create-user", createUser);
userRouter.post(
    "/login",

    loginUser
);
userRouter.post("/verify-user", verifyUser);

export default userRouter;
