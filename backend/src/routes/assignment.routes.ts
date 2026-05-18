import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  createAssignment,
  getAdminAssignments,
  getStudentAssignments,
  getTeacherAssignments,
  getTeacherSubmissions,
  gradeSubmission,
  submitAssignment,
} from "../controllers/assignment.controller";

const router = Router();

router.use(verifyJWT);

router.get("/student", authorizeRoles("student"), getStudentAssignments);
router.post("/student/:assignmentId/submit", authorizeRoles("student"), upload.single("document"), submitAssignment);

router.get("/teacher", authorizeRoles("teacher"), getTeacherAssignments);
router.get("/teacher/submissions", authorizeRoles("teacher"), getTeacherSubmissions);
router.post("/teacher", authorizeRoles("teacher"), createAssignment);
router.patch("/teacher/submissions/:submissionId/grade", authorizeRoles("teacher"), gradeSubmission);

router.get("/admin", authorizeRoles("admin"), getAdminAssignments);

export default router;
