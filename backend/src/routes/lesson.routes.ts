import { Router } from 'express';
import {
  deleteLesson,
} from '../controllers/admin-academics.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createLessonSchema,
  lessonParamSchema,
  updateLessonSchema,
} from '../validators/admin-academics.validator';
import { verifyJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { createLesson, getLessonById, getLessons, updateLesson } from '../controllers/lessons.controller';

const router = Router();

router.post('/', validate(createLessonSchema), createLesson);
// router.get('/', getLessons);
router.get('/', verifyJWT, authorizeRoles('admin'), getLessons);
router.get('/:id', getLessonById);
router.patch('/:lessonId', updateLesson);
router.delete('/:lessonId', validate(lessonParamSchema), deleteLesson);

export default router;
