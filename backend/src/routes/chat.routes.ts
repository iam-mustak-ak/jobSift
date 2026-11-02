import { Router } from "express";
import {
    getConversationMessagesController,
    getConversationsController,
    startConversationController,
    updateConversationStatusController,
} from "../controllers/chat.controller";
import authecticationMiddleware from "../middlewares/authentication.middleware";
import setAuthorization from "../middlewares/setAuthorization.middleware";

const chatRouter = Router();
const authenticated = [setAuthorization, authecticationMiddleware];

chatRouter.get("/conversations", ...authenticated, getConversationsController);
chatRouter.post("/conversations", ...authenticated, startConversationController);
chatRouter.get("/conversations/:conversationId/messages", ...authenticated, getConversationMessagesController);
chatRouter.patch("/conversations/:conversationId/status", ...authenticated, updateConversationStatusController);

export default chatRouter;
