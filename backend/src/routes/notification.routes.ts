import { Router } from "express";
import {
    getNotificationsController,
    markAllNotificationsReadController,
    markNotificationReadController,
} from "../controllers/notification.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";
const notificationRouter = Router();

notificationRouter.get(
    "/",
    setAuthorization,
    authecticationMiddleware,
    getNotificationsController
);
notificationRouter.patch(
    "/read-all",
    setAuthorization,
    authecticationMiddleware,
    markAllNotificationsReadController
);
notificationRouter.patch(
    "/:notificationId/read",
    setAuthorization,
    authecticationMiddleware,
    markNotificationReadController
);

export default notificationRouter;
