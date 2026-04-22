import { Request, Response } from "express";
import { AdminAcademicsService } from "../services/admin-academics.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await AdminAcademicsService.createLesson(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Lesson created successfully.", lesson));
});

export const getLessons = asyncHandler(async (_: Request, res: Response) => {
  const lessons = await AdminAcademicsService.getLessons();

  return res
    .status(200)
    .json(new ApiResponse(200, "Lessons fetched successfully.", lessons));
});

export const getLessonById = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await AdminAcademicsService.getLessonById(req.params.lessonId as string);

  return res
    .status(200)
    .json(new ApiResponse(200, "Lesson fetched successfully.", lesson));
});

export const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await AdminAcademicsService.updateLesson(
    req.params.lessonId as string,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Lesson updated successfully.", lesson));
});

export const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminAcademicsService.deleteLesson(req.params.lessonId as string);

  return res
    .status(200)
    .json(new ApiResponse(200, "Lesson deleted successfully.", result));
});

export const createExercise = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user._id.toString();
  const exercise = await AdminAcademicsService.createExercise(adminId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Exercise created successfully.", exercise));
});

export const getExercises = asyncHandler(async (req: Request, res: Response) => {
  const lessonId = req.query.lessonId as string | undefined;
  const exercises = await AdminAcademicsService.getExercises(lessonId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Exercises fetched successfully.", exercises));
});

export const getExerciseById = asyncHandler(async (req: Request, res: Response) => {
  const exercise = await AdminAcademicsService.getExerciseById(
    req.params.exerciseId as string,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Exercise fetched successfully.", exercise));
});

export const updateExercise = asyncHandler(async (req: Request, res: Response) => {
  const exercise = await AdminAcademicsService.updateExercise(
    req.params.exerciseId as string,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Exercise updated successfully.", exercise));
});

export const deleteExercise = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminAcademicsService.deleteExercise(
    req.params.exerciseId as string,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Exercise deleted successfully.", result));
});

export const createGrandQuiz = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user._id.toString();
  const grandQuiz = await AdminAcademicsService.createGrandQuiz(adminId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Grand quiz created successfully.", grandQuiz));
});

export const getGrandQuizzes = asyncHandler(async (_: Request, res: Response) => {
  const quizzes = await AdminAcademicsService.getGrandQuizzes();

  return res
    .status(200)
    .json(new ApiResponse(200, "Grand quizzes fetched successfully.", quizzes));
});

export const getGrandQuizById = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await AdminAcademicsService.getGrandQuizById(
    req.params.grandQuizId as string,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Grand quiz fetched successfully.", quiz));
});

export const updateGrandQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await AdminAcademicsService.updateGrandQuiz(
    req.params.grandQuizId as string,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Grand quiz updated successfully.", quiz));
});

export const deleteGrandQuiz = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminAcademicsService.deleteGrandQuiz(
    req.params.grandQuizId as string,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Grand quiz deleted successfully.", result));
});
