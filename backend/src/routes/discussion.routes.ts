import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  addDiscussionReply,
  createDiscussionCategory,
  createDiscussionThread,
  getDiscussionCategories,
  getDiscussionThreads,
} from "../controllers/discussion.controller";
import {
  createDiscussionCategorySchema,
  createDiscussionReplySchema,
  createDiscussionThreadSchema,
  discussionThreadQuerySchema,
} from "../validators/discussion.validator";

const router = Router();

router.use(verifyJWT);

router.get("/categories", getDiscussionCategories);
router.post("/categories", authorizeRoles("admin"), validate(createDiscussionCategorySchema), createDiscussionCategory);

router.get("/threads", validate(discussionThreadQuerySchema), getDiscussionThreads);
router.post(
  "/threads",
  authorizeRoles("admin", "teacher"),
  validate(createDiscussionThreadSchema),
  createDiscussionThread,
);
router.post(
  "/threads/:threadId/replies",
  authorizeRoles("admin", "teacher", "student"),
  validate(createDiscussionReplySchema),
  addDiscussionReply,
);

export default router;