import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { getUsers, updateRole } from '../controllers/user.controller';
import {
	addTeacherToStudent,
	getMyTeachers,
	removeTeacherFromStudent,
} from '../controllers/student-teacher.controller';
import {
	addTeacherSchema,
	removeTeacherSchema,
} from '../validators/student-teacher.validator';
import { getUsersSchema } from '../validators/user.validator';

const router = Router();

router.get('/', verifyJWT, authorizeRoles('admin'), validate(getUsersSchema), getUsers);

// PATCH is better than POST here because we are partially updating the user
router.patch('/update-role', verifyJWT, updateRole);

router.post(
	'/me/teachers',
	verifyJWT,
	authorizeRoles('student'),
	validate(addTeacherSchema),
	addTeacherToStudent,
);

router.delete(
	'/me/teachers/:teacherId',
	verifyJWT,
	authorizeRoles('student'),
	validate(removeTeacherSchema),
	removeTeacherFromStudent,
);

router.get('/me/teachers', verifyJWT, authorizeRoles('student'), getMyTeachers);

export default router;