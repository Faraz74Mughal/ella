import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { Report } from '../models/report.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { upload } from '../middlewares/multer.middleware';
import { applyAsTeacher, reportStudent } from '../controllers/teacher.controller';
import {
  getAssignedStudentDetails,
  getMyStudents,
} from '../controllers/student-teacher.controller';
import { validate } from '../middlewares/validate.middleware';
import { getTeacherStudentDetailsSchema } from '../validators/student-teacher.validator';

const router = Router();


router.post(
  '/apply-verification',  
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 }
  ]), 
  applyAsTeacher
);


router.use(verifyJWT);
router.use(authorizeRoles('teacher'));

router.post('/report-student', reportStudent);
router.get('/me/students', getMyStudents);
router.get(
  '/me/students/:studentId',
  validate(getTeacherStudentDetailsSchema),
  getAssignedStudentDetails,
);

export default router;