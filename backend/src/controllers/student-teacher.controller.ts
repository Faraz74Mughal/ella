import { Request, Response } from "express";
import { StudentTeacherService } from "../services/student-teacher.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const addTeacherToStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user._id.toString();
    const { teacherId } = req.body;

    const relation = await StudentTeacherService.addTeacher(studentId, teacherId);

    return res
      .status(201)
      .json(new ApiResponse(201, "Teacher assigned successfully.", relation));
  },
);

export const removeTeacherFromStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user._id.toString();
    const teacherId = req.params.teacherId as string;

    const result = await StudentTeacherService.removeTeacher(studentId, teacherId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Teacher removed successfully.", result));
  },
);

export const getMyTeachers = asyncHandler(async (req: Request, res: Response) => {
  const studentId = (req as any).user._id.toString();

  const teachers = await StudentTeacherService.getStudentTeachers(studentId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Student teachers fetched successfully.", teachers));
});

export const getMyStudents = asyncHandler(async (req: Request, res: Response) => {
  const teacherId = (req as any).user._id.toString();

  const students = await StudentTeacherService.getTeacherStudents(teacherId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Teacher students fetched successfully.", students));
});

export const getAssignedStudentDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const teacherId = (req as any).user._id.toString();
    const studentId = req.params.studentId as string;

    const student = await StudentTeacherService.getTeacherStudentDetails(
      teacherId,
      studentId,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Assigned student details fetched.", student));
  },
);
