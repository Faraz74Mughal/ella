import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { TeacherService } from "../services/teacher.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const reportStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId, reason } = req.body;
    const reporterId = (req as any).user._id;

    if (!studentId || !reason) {
      throw new ApiError(
        400,
        "Student ID and reason for reporting are required.",
      );
    }

    const report = await TeacherService.reportStudent(
      reporterId,
      studentId,
      reason,
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Report submitted successfully to the admin team.",
          report,
        ),
      );
  },
);

export const applyAsTeacher = asyncHandler(
  async (req: Request, res: Response) => {

    // 1. Validation: Ensure files exist on the request object (populated by Multer)
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new ApiError(400, "No documents were uploaded");
    }

    // 2. Call Service: Handle Cloudinary upload and DB update
    const updatedUser = await TeacherService.applyAsTeacher(
      req.body as { userId: string; bio: string },
      req.files,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Application submitted for review", updatedUser),
      );
  },
);
