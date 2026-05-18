import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createChatConversation,
  getChatConversations,
  getChatMessages,
  getChatPeers,
  sendChatMessage,
} from "../controllers/chat.controller";
import {
  conversationIdParamSchema,
  createConversationSchema,
  getMessagesQuerySchema,
  sendMessageSchema,
} from "../validators/chat.validator";

const router = Router();

router.use(verifyJWT, authorizeRoles("student"));

router.get("/peers", getChatPeers);
router.get("/conversations", getChatConversations);
router.post("/conversations", validate(createConversationSchema), createChatConversation);
router.get(
  "/conversations/:conversationId/messages",
  validate(getMessagesQuerySchema),
  getChatMessages,
);
router.post(
  "/conversations/:conversationId/messages",
  validate(sendMessageSchema),
  sendChatMessage,
);

export default router;
