import { Router } from "express";

import { validate } from "../middlewares/validate.middleware";
import {
  createLessonSchema,
  lessonParamSchema,
  updateLessonSchema,
} from "../validators/admin-academics.validator";
import { verifyJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  createLesson,
  deleteLesson,
  getFilteredLessons,
  getLessonById,
  getLessons,
  updateLesson,
} from "../controllers/lessons.controller";

const router = Router();

router.get("/filtered", getFilteredLessons);
router.post("/", validate(createLessonSchema), createLesson);
// router.get('/', getLessons);
router.get("/", verifyJWT, authorizeRoles("admin"), getLessons);
router.get("/:id", getLessonById);
router.patch("/:lessonId", updateLesson);
router.delete("/:lessonId", deleteLesson);

export default router;
