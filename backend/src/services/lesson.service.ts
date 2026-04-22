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

export class LessonsService {
  static async getAllLessons(params: GetParams) {
    const result = await applyQueryFeatures({
      model: Lesson,
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
    });

    return {
      lessons: result.items,
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

  static async getLessonById(id: string) {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      throw new ApiError(404, "Lesson not found.");
    }

    const exerciseCount = await Exercise.countDocuments({
      lesson_id: id,
    });

    return {
      ...lesson.toObject(),
      exercise_count: exerciseCount,
    };
  }

  static async createLesson(payload: any) {
    try {
      const lastLesson =
        (await Lesson.findOne()
          .sort({ sequence_order: -1 })
          .select("sequence_order")) || 0;

      const nextOrder = lastLesson ? lastLesson.sequence_order + 1 : 1;

      return await Lesson.create({ ...payload, sequence_order: nextOrder });
    } catch (error: any) {
      if (error?.code === 11000 && error?.keyPattern?.sequence_order) {
        throw new ApiError(409, "sequence_order already exists.");
      }
      throw error;
    }
  }

  static async updateLesson(lessonId: string, payload: any) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new ApiError(404, "Lesson not found.");
    }

    if (payload.is_published === true) {
      const exerciseCount = await Exercise.countDocuments({
        lesson_id: lessonId,
      });
      if (exerciseCount < 1) {
        throw new ApiError(
          400,
          "Each lesson must have at least one exercise before publishing.",
        );
      }
    }

    Object.assign(lesson, payload);

    try {
      await lesson.save();
    } catch (error: any) {
      if (error?.code === 11000 && error?.keyPattern?.sequence_order) {
        throw new ApiError(409, "sequence_order already exists.");
      }
      throw error;
    }

    return lesson;
  }
}
