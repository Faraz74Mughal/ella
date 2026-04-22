import mongoose from "mongoose";
import { VISIBILITY } from "../constants/lesson.constant";
import { Exercise } from "../models/exercise.model";
import { GrandQuiz } from "../models/grandQuiz.model";
import { Lesson } from "../models/lesson.model";
import { ApiError } from "../utils/ApiError";

export class AdminAcademicsService {
  static async createLesson(payload: any) {
    try {
      const lastLesson = await Lesson.findOne()
        .sort({ sequence_order: -1 })
        .select("sequence_order");

      const nextOrder = lastLesson ? lastLesson.sequence_order + 1 : 1;
      return await Lesson.create({...payload,sequence_order:nextOrder});
    } catch (error: any) {
      if (error?.code === 11000 && error?.keyPattern?.sequence_order) {
        throw new ApiError(409, "sequence_order already exists.");
      }
      throw error;
    }
  }

  static async getLessons() {
    return Lesson.aggregate([
      {
        $lookup: {
          from: "exercises",
          localField: "_id",
          foreignField: "lesson_id",
          as: "exercise_docs",
        },
      },
      {
        $addFields: {
          exercise_count: { $size: "$exercise_docs" },
        },
      },
      {
        $project: {
          exercise_docs: 0,
        },
      },
      {
        $sort: {
          sequence_order: 1,
        },
      },
    ]);
  }

  static async getLessonById(lessonId: string) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new ApiError(404, "Lesson not found.");
    }

    const exerciseCount = await Exercise.countDocuments({
      lesson_id: lessonId,
    });

    return {
      ...lesson.toObject(),
      exercise_count: exerciseCount,
    };
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

  static async deleteLesson(lessonId: string) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new ApiError(404, "Lesson not found.");
    }

    const exerciseCount = await Exercise.countDocuments({
      lesson_id: lessonId,
    });
    if (exerciseCount > 0) {
      throw new ApiError(
        400,
        "Cannot delete lesson with linked exercises. Delete exercises first.",
      );
    }

    await lesson.deleteOne();

    return { lessonId };
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

  static async getExercises(lessonId?: string) {
    const query: Record<string, any> = {};
    if (lessonId) {
      query.lesson_id = lessonId;
    }

    return Exercise.find(query)
      .populate("lesson_id", "title sequence_order")
      .sort({ createdAt: -1 });
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

    const linkedGrandQuiz = await GrandQuiz.findOne({
      "exercises.exercise_id": exerciseId,
    }).select("_id title");

    if (linkedGrandQuiz) {
      throw new ApiError(
        400,
        "Cannot delete exercise linked in a grand quiz. Remove it from grand quiz first.",
      );
    }

    await exercise.deleteOne();

    return { exerciseId };
  }

  static async createGrandQuiz(adminId: string, payload: any) {
    const exerciseIds: string[] = payload.exercises.map(
      (item: { exercise_id: string }) => item.exercise_id,
    );
    const uniqueExerciseIds = Array.from(new Set<string>(exerciseIds));
    const exerciseObjectIds = uniqueExerciseIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const validExerciseCount = await Exercise.countDocuments({
      _id: { $in: exerciseObjectIds },
    });

    if (validExerciseCount !== uniqueExerciseIds.length) {
      throw new ApiError(400, "One or more exercise ids are invalid.");
    }

    const grandQuiz = await GrandQuiz.create({
      ...payload,
      exercises: uniqueExerciseIds.map((exerciseId) => ({
        exercise_id: exerciseId,
      })),
      created_by: adminId,
      visibility: payload.visibility || VISIBILITY.PRIVATE,
    });

    return grandQuiz;
  }

  static async getGrandQuizzes() {
    return GrandQuiz.find()
      .populate("exercises.exercise_id", "title type level category")
      .sort({ createdAt: -1 });
  }

  static async getGrandQuizById(grandQuizId: string) {
    const grandQuiz = await GrandQuiz.findById(grandQuizId).populate(
      "exercises.exercise_id",
      "title type level category",
    );

    if (!grandQuiz) {
      throw new ApiError(404, "Grand quiz not found.");
    }

    return grandQuiz;
  }

  static async updateGrandQuiz(grandQuizId: string, payload: any) {
    const grandQuiz = await GrandQuiz.findById(grandQuizId);
    if (!grandQuiz) {
      throw new ApiError(404, "Grand quiz not found.");
    }

    if (payload.exercises) {
      const exerciseIds: string[] = payload.exercises.map(
        (item: { exercise_id: string }) => item.exercise_id,
      );
      const uniqueExerciseIds = Array.from(new Set<string>(exerciseIds));
      const exerciseObjectIds = uniqueExerciseIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      );

      const validExerciseCount = await Exercise.countDocuments({
        _id: { $in: exerciseObjectIds },
      });

      if (validExerciseCount !== uniqueExerciseIds.length) {
        throw new ApiError(400, "One or more exercise ids are invalid.");
      }

      payload.exercises = uniqueExerciseIds.map((exerciseId) => ({
        exercise_id: exerciseId,
      }));
    }

    Object.assign(grandQuiz, payload);
    await grandQuiz.save();

    return grandQuiz;
  }

  static async deleteGrandQuiz(grandQuizId: string) {
    const grandQuiz = await GrandQuiz.findById(grandQuizId);
    if (!grandQuiz) {
      throw new ApiError(404, "Grand quiz not found.");
    }

    await grandQuiz.deleteOne();

    return { grandQuizId };
  }
}
