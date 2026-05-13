import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { parseListQuery } from "../utils/listQuery";
import { LessonsService } from "../services/lesson.service";
import { ApiResponse } from "../utils/ApiResponse";
import { StudentProgressService } from "../services/student-progress.service";

type TSortBy = "title" | "createdAt";

export const getLessonsForStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user._id;

    const lessons = await StudentProgressService.getLessons(studentId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Lessons fetched successfully", { lessons }));
  },
);

export const getLessonById = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user._id.toString();
    const lesson = await LessonsService.getLessonById(req.params.id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, "Lesson fetched successfully.", { lesson }));
  },
);

export const completeLessonForStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user._id;

    const lessonId = req.params.lessonId as string;

    const data = await StudentProgressService.completeLesson(
      studentId,
      lessonId,
    );

    return res
      .status(201)
      .json(new ApiResponse(201, "Lesson completed successfully.", { data }));
  },
);
