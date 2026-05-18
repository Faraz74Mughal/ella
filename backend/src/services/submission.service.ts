import mongoose from "mongoose";
import { Exercise } from "../models/exercise.model";
import { Lesson } from "../models/lesson.model";
import Submission from "../models/submission.model";
import { StudentProgressService } from "./student-progress.service";
import { checkAndUnlockAchievements } from "../utils/achievements";
import { ApiError } from "../utils/ApiError";

type QuizCategory =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "speaking"
  | "writing";

type CategoryPerformance = {
  grammar: number;
  vocabulary: number;
  listening: number;
  speaking: number;
  writing: number;
};

type SubmissionPayload = {
  lesson_id: any;
  exercise_id: string;
  category: QuizCategory;
  score_earned: number;
  max_score: number;
  percentage: number;
  is_passed: boolean;
  submitted_payload?: Record<string, unknown>;
};

export class SubmissionService {
  static async saveStudentSubmission(
    studentId: string,
    payload: SubmissionPayload,
  ) {
    if (!payload?.exercise_id) {
      throw new ApiError(400, "exercise_id is required.");
    }

    if (!payload?.lesson_id) {
      throw new ApiError(400, "lesson_id is required.");
    }

    const exercise = await Exercise.findById(payload.exercise_id).select(
      "lesson_id category points passing_percentage",
    );

    if (!exercise) {
      throw new ApiError(404, "Exercise not found.");
    }

    const exerciseLessonId = exercise.lesson_id?.toString();
    
    if (exerciseLessonId && exerciseLessonId != payload.lesson_id?._id) {
      throw new ApiError(400, "lesson_id does not match the selected exercise.");
    }

    if (exercise.category !== payload.category) {
      throw new ApiError(400, "category does not match the selected exercise.");
    }

    const scoreEarned = Number(payload.score_earned);
    if (!Number.isFinite(scoreEarned) || scoreEarned < 0) {
      throw new ApiError(400, "score_earned must be a valid non-negative number.");
    }

    const maxScore = Number(payload.max_score);
    const safeMaxScore = Number.isFinite(maxScore) && maxScore > 0 ? maxScore : 0;
    const rawPercentage = Number.isFinite(Number(payload.percentage))
      ? Number(payload.percentage)
      : safeMaxScore > 0
        ? (scoreEarned / safeMaxScore) * 100
        : 0;
    const percentage = Math.max(0, Math.min(100, Number(rawPercentage.toFixed(2))));

    const pointsEarned = scoreEarned;
    const xpEarned = Math.max(0, Number((percentage * 0.7).toFixed(2)));

    const progress = await StudentProgressService.getStudentProgress(studentId);
    const exerciseObjectId = new mongoose.Types.ObjectId(payload.exercise_id);
    const lessonId = typeof payload.lesson_id === "string" ? payload.lesson_id : payload.lesson_id?._id;
    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);

    const alreadyRewarded = (progress.completed_exercises || []).some(
      (completedExerciseId) => completedExerciseId.toString() === payload.exercise_id,
    );

    if (!progress.lesson_best_percentages) {
      progress.lesson_best_percentages = [];
    }

    if (!progress.category_performance) {
      progress.category_performance = {
        grammar: 0,
        vocabulary: 0,
        listening: 0,
        speaking: 0,
        writing: 0,
      };
    }

    const lessonPerformanceIndex = progress.lesson_best_percentages.findIndex(
      (entry: any) =>
        entry.lesson_id?.toString() === lessonId && entry.category === payload.category,
    );

    let performanceUpdated = false;

    if (lessonPerformanceIndex === -1) {
      progress.lesson_best_percentages.push({
        lesson_id: lessonObjectId,
        category: payload.category,
        best_percentage: percentage,
      } as any);
      performanceUpdated = true;
    } else {
      const existingBest =
        Number(progress.lesson_best_percentages[lessonPerformanceIndex].best_percentage) || 0;
      if (percentage > existingBest) {
        progress.lesson_best_percentages[lessonPerformanceIndex].best_percentage = percentage;
        performanceUpdated = true;
      }
    }

    if (performanceUpdated) {
      const categoryEntries = (progress.lesson_best_percentages || []).filter(
        (entry: any) => entry.category === payload.category,
      );
      const averageBestPercentage =
        categoryEntries.length > 0
          ? categoryEntries.reduce(
              (sum: number, entry: any) => sum + (Number(entry.best_percentage) || 0),
              0,
            ) / categoryEntries.length
          : 0;

      const nextCategoryPerformance: CategoryPerformance = {
        grammar: Number(progress.category_performance.grammar || 0),
        vocabulary: Number(progress.category_performance.vocabulary || 0),
        listening: Number(progress.category_performance.listening || 0),
        speaking: Number(progress.category_performance.speaking || 0),
        writing: Number(progress.category_performance.writing || 0),
      };

      nextCategoryPerformance[payload.category] = Number(averageBestPercentage.toFixed(2));
      progress.category_performance = nextCategoryPerformance as any;
    }

    const lessonAlreadyCompleted = (progress.completed_lessons || []).some(
      (completedLessonId) => completedLessonId.toString() === lessonId,
    );

    let rewardsApplied = false;

    if (!alreadyRewarded) {
      progress.completed_exercises = [
        ...(progress.completed_exercises || []),
        exerciseObjectId,
      ];
      progress.total_points = (progress.total_points || 0) + pointsEarned;
      progress.total_xp = (progress.total_xp || 0) + xpEarned;
      rewardsApplied = true;
    }

    if (payload.is_passed) {
      if (!lessonAlreadyCompleted) {
        progress.completed_lessons = [
          ...(progress.completed_lessons || []),
          lessonObjectId,
        ];
      }

      const lessonAlreadyPassed = (progress.passed_lessons || []).some(
        (passedLessonId) => passedLessonId.toString() === lessonId,
      );

      if (!lessonAlreadyPassed) {
        progress.passed_lessons = [
          ...(progress.passed_lessons || []),
          lessonObjectId,
        ];
        StudentProgressService.applyLessonCompletionStreak(progress);

        // Find the current lesson to get its sequence_order
        const currentLesson = await Lesson.findById(lessonId).select("sequence_order");
        if (currentLesson) {
          // Find and unlock the next lesson
          const nextLesson = await Lesson.findOne({
            sequence_order: currentLesson.sequence_order + 1,
            is_published: true,
          });

          if (nextLesson) {
            const nextLessonAlreadyUnlocked = (progress.unlocked_lessons || []).some(
              (unlockedId) => unlockedId.toString() === nextLesson._id.toString(),
            );

            if (!nextLessonAlreadyUnlocked) {
              progress.unlocked_lessons = [
                ...(progress.unlocked_lessons || []),
                nextLesson._id,
              ];
            }
          }
        }
      }
    }

    if (rewardsApplied || payload.is_passed || performanceUpdated) {
      checkAndUnlockAchievements(progress);
      await progress.save();
    }

    const submission = await Submission.create({
      student: studentId,
      lesson_id: payload.lesson_id,
      exercise_id: payload.exercise_id,
      category: payload.category,
      score_earned: scoreEarned,
      max_score: safeMaxScore || payload.max_score,
      percentage,
      is_passed: payload.is_passed,
      points_earned: pointsEarned,
      xp_earned: xpEarned,
      rewards_applied: rewardsApplied,
      submitted_payload: payload.submitted_payload || {},
    });

    return {
      submission,
      rewardsApplied,
      rewardSummary: {
        pointsEarned,
        xpEarned,
      },
      progress: {
        total_points: progress.total_points || 0,
        total_xp: progress.total_xp || 0,
        current_streak: progress.current_streak || 0,
        highest_streak: progress.highest_streak || 0,
        category_performance: progress.category_performance || {
          grammar: 0,
          vocabulary: 0,
          listening: 0,
          speaking: 0,
          writing: 0,
        },
      },
    };
  }
}