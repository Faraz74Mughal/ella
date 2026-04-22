import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { getPendingTeachers, getReports, reviewTeacher, toggleUserBlock } from '../controllers/admin.controller';
import adminLessonRoutes from './lesson.routes';
import adminExerciseRoutes from './exercise.routes';
import adminGrandQuizRoutes from './grand-quiz.routes';

const router = Router();

// All routes here require Login AND Admin Role
router.use(verifyJWT);
router.use(authorizeRoles('admin'));

router.get('/teachers/pending', getPendingTeachers);
router.patch('/teachers/review/:teacherId', reviewTeacher);
router.get('/reports', getReports);
router.patch('/users/block/:userId', toggleUserBlock);

router.use('/lessons', adminLessonRoutes);
router.use('/exercises', adminExerciseRoutes);
router.use('/grand-quizzes', adminGrandQuizRoutes);

export default router;