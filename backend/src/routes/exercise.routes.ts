import { Router } from "express";

import {
  getExercises,
  createExercise,
  getExerciseById,
  updateExercise,
  deleteExercise,
} from "../controllers/exercises.controller";

const router = Router();

router.post("/", createExercise);
router.get("/", getExercises);
router.get("/:exerciseId",  getExerciseById);
router.patch("/:exerciseId",  updateExercise);
router.delete("/:exerciseId",  deleteExercise);

export default router;
