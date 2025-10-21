import { Router } from "express";
import { getNotificationsController } from "../controllers/notification.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
const notificationRouter = Router();

notificationRouter.get(
    "/",
    setAuthorization,
    authecticationMiddleware,
    getNotificationsController
);

export default notificationRouter;
