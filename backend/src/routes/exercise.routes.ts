import { Router } from "express";

import {
  getExercises,
  createExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "../controllers/exercises.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/",verifyJWT,authorizeRoles('admin'), createExercise);
router.get("/", getExercises);
router.get("/:exerciseId",  getExerciseById);
router.patch("/:exerciseId",  updateExercise);
router.delete("/:exerciseId",  deleteExercise);

export default router;
