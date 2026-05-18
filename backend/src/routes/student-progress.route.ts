import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  completeLessonForStudent,
  getLessonsForStudent,
  getStudentProgress,
} from "../controllers/student-progress.controller";

const router = Router();

router.get("/", verifyJWT, authorizeRoles("student"), getLessonsForStudent);
router.get("/progress", verifyJWT, authorizeRoles("student"), getStudentProgress);

router.post(
  "/:lessonId/complete",
  verifyJWT,
  authorizeRoles("student"),
  completeLessonForStudent,
);

export default router;
