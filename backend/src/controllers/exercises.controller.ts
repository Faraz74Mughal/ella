import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { parseListQuery } from "../utils/listQuery";
import { LessonsService } from "../services/lesson.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ExercisesService } from "../services/exercise.service";

type TSortBy = "title" | "createdAt";



export const createExercise = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user._id.toString();
  const exercise = await ExercisesService.createExercise(adminId, req.body);


  
  return res
    .status(201)
    .json(new ApiResponse(201, "Exercise created successfully.", exercise));
});

export const getExercises = asyncHandler(async (req: Request, res: Response) => {
  const parsedQuery = parseListQuery<TSortBy>(
      req.query as Record<string, unknown>,
    );
    const level = req.query.role as string | undefined;
    const category = req.query.accountStatus as string | undefined;
    const result = await ExercisesService.getExercises({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        level,
        category,
        sortBy: parsedQuery.sortBy ?? "createdAt",
        sortOrder: parsedQuery.sortOrder,
      });


  return res
    .status(200)
    .json(new ApiResponse(200, "Exercises fetched successfully", result));
});

export const getExerciseById = asyncHandler(
  async (req: Request, res: Response) => {
    const exercise = await ExercisesService.getExerciseById(req.params.id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, "Exercise fetched successfully.", {exercise}));
  },
);


export const updateExercise = asyncHandler(async (req: Request, res: Response) => {
  const exercise = await ExercisesService.updateExercise(
    req.params.exerciseId as string,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Exercise updated successfully.", exercise));
});

export const deleteExercise = asyncHandler(async (req: Request, res: Response) => {
  const result = await ExercisesService.deleteExercise(
    req.params.exerciseId as string,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Exercise deleted successfully.", result));
});
