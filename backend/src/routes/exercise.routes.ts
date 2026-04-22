import { Router } from 'express';
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  getExercises,
  updateExercise,
} from '../controllers/admin-academics.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createExerciseSchema,
  exerciseParamSchema,
  updateExerciseSchema,
} from '../validators/admin-academics.validator';

const router = Router();

router.post('/', validate(createExerciseSchema), createExercise);
router.get('/', getExercises);
router.get('/:exerciseId', validate(exerciseParamSchema), getExerciseById);
router.patch('/:exerciseId', validate(updateExerciseSchema), updateExercise);
router.delete('/:exerciseId', validate(exerciseParamSchema), deleteExercise);

export default router;
