import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { parseListQuery } from "../utils/listQuery";
import { LessonsService } from "../services/lesson.service";
import { ApiResponse } from "../utils/ApiResponse";

type TSortBy = "title" | "createdAt";

export const getLessons = asyncHandler(async (req: Request, res: Response) => {
  const parsedQuery = parseListQuery<TSortBy>(
    req.query as Record<string, unknown>,
  );

  const level = req.query.role as string | undefined;
  const category = req.query.accountStatus as string | undefined;
  const result = await LessonsService.getAllLessons({
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
    .json(new ApiResponse(200, "Lessons fetched successfully", result));
});

export const getLessonById = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await LessonsService.getLessonById(req.params.id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, "Lesson fetched successfully.", {lesson}));
  },
);

export const createLesson = asyncHandler(
  async (req: Request, res: Response) => {
    const lesson = await LessonsService.createLesson(req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, "Lesson created successfully.", { lesson }));
  },
);


export const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await LessonsService.updateLesson(
    req.params.lessonId as string,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Lesson updated successfully.", {lesson}));
});
