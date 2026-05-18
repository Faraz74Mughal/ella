import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { saveStudentQuizSubmission } from "../controllers/submission.controller";

const router = Router();

router.post(
  "/save",
  verifyJWT,
  authorizeRoles("student"),
  saveStudentQuizSubmission,
);

export default router;