import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { SubmissionService } from "../services/submission.service";

export const saveStudentQuizSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user._id.toString();
    const result = await SubmissionService.saveStudentSubmission(
      studentId,
      req.body,
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Student quiz submission saved successfully.", result),
      );
  },
);