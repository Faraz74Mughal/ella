import { VISIBILITY } from "../constants/lesson.constant";
import { Exercise } from "../models/exercise.model";
import { Lesson } from "../models/lesson.model";
import { ApiError } from "../utils/ApiError";
import { applyQueryFeatures } from "../utils/queryFeatures";

type SortOrder = "asc" | "desc";

type GetParams = {
  page: number;
  limit: number;
  search?: string;
  level?: string;
  category?: string;
  sortBy: "title" | "createdAt";
  sortOrder: SortOrder;
};

export class ExercisesService {
  static async getExercises(params: GetParams) {
    const result = await applyQueryFeatures({
      model: Exercise,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      search: params.search,
      searchFields: ["title"],
      filters: {
        level: params.level,
        category: params.category,
      },
      select: "",
      allowedSortFields: ["createdAt", "title"],
      populate: {
        path: "created_by",
        select: "name role",

      },
    });

    return {
      exercises: result.items,
      pagination: {
        totalResult: result.pagination.total,
        totalPages: result.pagination.totalPages,
        currentPage: result.pagination.page,
        limit: result.pagination.limit,
        hasNextPage: result.pagination.hasNextPage,
        hasPrevPage: result.pagination.hasPrevPage,
      },
    };
  }

  static async createExercise(adminId: string, payload: any) {
    const lesson = await Lesson.findById(payload.lesson_id);
    if (!lesson) {
      throw new ApiError(404, "Lesson not found for this exercise.");
    }

    const exercise = await Exercise.create({
      ...payload,
      created_by: adminId,
      creator_role: "admin",
      visibility: payload.visibility || VISIBILITY.PRIVATE,
      available_from: payload.available_from
        ? new Date(payload.available_from)
        : undefined,
      available_until: payload.available_until
        ? new Date(payload.available_until)
        : undefined,
    });

    return exercise;
  }

  static async getExerciseById(exerciseId: string) {
    const exercise = await Exercise.findById(exerciseId).populate(
      "lesson_id",
      "title sequence_order",
    );

    if (!exercise) {
      throw new ApiError(404, "Exercise not found.");
    }

    return exercise;
  }

  static async updateExercise(exerciseId: string, payload: any) {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      throw new ApiError(404, "Exercise not found.");
    }

    if (payload.available_from)
      payload.available_from = new Date(payload.available_from);
    if (payload.available_until)
      payload.available_until = new Date(payload.available_until);

    Object.assign(exercise, payload);
    await exercise.save();

    return exercise;
  }

  static async deleteExercise(exerciseId: string) {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      throw new ApiError(404, "Exercise not found.");
    }

    // const linkedGrandQuiz = await GrandQuiz.findOne({
    //   "exercises.exercise_id": exerciseId,
    // }).select("_id title");

    // if (linkedGrandQuiz) {
    //   throw new ApiError(
    //     400,
    //     "Cannot delete exercise linked in a grand quiz. Remove it from grand quiz first.",
    //   );
    // }

    await exercise.deleteOne();

    return { exerciseId };
  }
}
