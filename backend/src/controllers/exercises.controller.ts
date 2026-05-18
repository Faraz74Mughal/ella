import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { parseListQuery } from "../utils/listQuery";
import { LessonsService } from "../services/lesson.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ExercisesService } from "../services/exercise.service";
import { ApiError } from "../utils/ApiError";
import { saveOnCloudinary } from "../config/cloudinary";
import { cleanupRemovedMedia } from "../utils/removeListeningMedia";
type TSortBy = "title" | "createdAt";

const resolveExercisePayload = async (req: Request) => {
  const payloadRaw =
    typeof req.body?.payload === "string" ? req.body.payload : req.body;

  const payload =
    typeof payloadRaw === "string" ? JSON.parse(payloadRaw) : payloadRaw;

  const incomingFiles = Array.isArray(req.files)
    ? (req.files as Express.Multer.File[])
    : req.file
      ? [req.file]
      : [];

  const files = incomingFiles.filter(
    (file) => file.fieldname === "listeningFiles" || file.fieldname === "file",
  );

  if (!files.length) return payload;

  const tokenUrlMap: Record<
    string,
    {
      url: string;
      public_id: string;
      resource_type: string;
    }
  > = {};

  for (let index = 0; index < files.length; index += 1) {
    const uploadedFile = await saveOnCloudinary(
      files[index].path,
      "exercises/listening",
    );

    if (!uploadedFile?.url) {
      throw new ApiError(500, "Failed to upload listening media file.");
    }

    tokenUrlMap[`__LISTENING_FILE_${index}__`] = uploadedFile;
  }

  if (Array.isArray(payload?.content)) {
    payload.content = payload.content.map((question: any) => {
      if (question?.type !== "listening") {
        return question;
      }

      if (typeof question?.file !== "string") {
        return question;
      }

      const storedMedia = tokenUrlMap[question.file];

      if (!storedMedia) {
        return question;
      }

      return {
        ...question,
        file: storedMedia,
      };
    });
  }

  return payload;
};

export const createExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const adminId = (req as any).user._id.toString();
    console.log("Admin ID:", adminId);
    console.log("Request Files:", req.files);
    console.log("Request Body:", req.body);
    const payload = await resolveExercisePayload(req);
    const exercise = await ExercisesService.createExercise(adminId, payload);

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Exercise created successfully.", { exercise }),
      );
  },
);

export const getExercises = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const getExerciseById = asyncHandler(
  async (req: Request, res: Response) => {
    const exercise = await ExercisesService.getExerciseById(
      req.params.exerciseId as string,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Exercise fetched successfully.", { exercise }),
      );
  },
);

export const getExerciseByLessonId = asyncHandler(
  async (req: Request, res: Response) => {
    const exercise = await ExercisesService.getExerciseByLessonId(
      req.params.exerciseId as string,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Exercise fetched successfully.", { exercise }),
      );
  },
);

export const updateExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = await resolveExercisePayload(req);
    const response = await ExercisesService.updateExercise(
      req.params.exerciseId as string,
      payload,
    );
    await cleanupRemovedMedia(response?.oldContent, payload.content);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Exercise updated successfully.", { exercise:response?.exercise }),
      );
  },
);

export const deleteExercise = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await ExercisesService.deleteExercise(
      req.params.exerciseId as string,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Exercise deleted successfully.", result));
  },
);
