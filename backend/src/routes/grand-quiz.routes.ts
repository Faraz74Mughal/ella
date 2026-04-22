import { Router } from 'express';
import {
  createGrandQuiz,
  deleteGrandQuiz,
  getGrandQuizById,
  getGrandQuizzes,
  updateGrandQuiz,
} from '../controllers/admin-academics.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createGrandQuizSchema,
  grandQuizParamSchema,
  updateGrandQuizSchema,
} from '../validators/admin-academics.validator';

const router = Router();

router.post('/', validate(createGrandQuizSchema), createGrandQuiz);
router.get('/', getGrandQuizzes);
router.get('/:grandQuizId', validate(grandQuizParamSchema), getGrandQuizById);
router.patch('/:grandQuizId', validate(updateGrandQuizSchema), updateGrandQuiz);
router.delete('/:grandQuizId', validate(grandQuizParamSchema), deleteGrandQuiz);

export default router;
