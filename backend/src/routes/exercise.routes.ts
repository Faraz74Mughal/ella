import { Router } from "express";

import {
  getExercises,
  createExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
  getExerciseByLessonId,
} from "../controllers/exercises.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/", verifyJWT, authorizeRoles("admin"), upload.array("listeningFiles"), createExercise);
router.get("/", getExercises);
router.get("/:exerciseId",  getExerciseById);
router.patch("/:exerciseId", upload.array("listeningFiles"), updateExercise);
router.delete("/:exerciseId",  deleteExercise);
router.get("/lesson/:exerciseId",  getExerciseByLessonId);

export default router;
