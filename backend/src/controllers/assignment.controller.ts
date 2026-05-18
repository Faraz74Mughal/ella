import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AssignmentService } from "../services/assignment.service";

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const teacherId = (req as any).user._id;
  const assignment = await AssignmentService.createAssignment(teacherId, req.body);

  return res.status(201).json(new ApiResponse(201, "Assignment created successfully", { assignment }));
});

export const getTeacherAssignments = asyncHandler(async (req: Request, res: Response) => {
  const teacherId = (req as any).user._id;
  const assignments = await AssignmentService.getTeacherAssignments(teacherId);

  return res.status(200).json(new ApiResponse(200, "Assignments fetched successfully", { assignments }));
});

export const getAdminAssignments = asyncHandler(async (req: Request, res: Response) => {
  const assignments = await AssignmentService.getAdminAssignments();

  return res.status(200).json(new ApiResponse(200, "Assignments fetched successfully", { assignments }));
});

export const getStudentAssignments = asyncHandler(async (req: Request, res: Response) => {
  const studentId = (req as any).user._id;
  const assignments = await AssignmentService.getStudentAssignments(studentId);

  return res.status(200).json(new ApiResponse(200, "Assignments fetched successfully", { assignments }));
});

export const submitAssignment = asyncHandler(async (req: Request, res: Response) => {
  const studentId = (req as any).user._id;
  const { assignmentId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "Document file is required.");
  }

  const submission = await AssignmentService.submitAssignment(studentId, assignmentId as string, req.file);

  return res.status(201).json(new ApiResponse(201, "Assignment submitted successfully", { submission }));
});

export const getTeacherSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const teacherId = (req as any).user._id;
  const submissions = await AssignmentService.getTeacherSubmissions(teacherId);

  return res.status(200).json(new ApiResponse(200, "Submissions fetched successfully", { submissions }));
});

export const gradeSubmission = asyncHandler(async (req: Request, res: Response) => {
  const teacherId = (req as any).user._id;
  const { submissionId } = req.params;
  const submission = await AssignmentService.gradeSubmission(teacherId, submissionId as string, req.body);

  return res.status(200).json(new ApiResponse(200, "Submission graded successfully", { submission }));
});
