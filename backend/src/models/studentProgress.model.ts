import mongoose, { Model, Schema } from "mongoose";
import { IStudentProgress } from "../types/student-progress.type";

const studentProgressSchema = new Schema<IStudentProgress>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Keep ONLY if this is a 1-to-1 Profile Extension table
    },
    completed_lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    // Track individual exercises completed to prevent double-claiming points
    completed_exercises: [
      {
        type: Schema.Types.ObjectId,
      }
    ],
    // Track lessons the student has passed
    passed_lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      }
    ],
    // Track lessons that are unlocked for the student
    unlocked_lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      }
    ],
    assignment_best_scores: [
      {
        assignment_id: {
          type: Schema.Types.ObjectId,
          ref: "Assignment",
          required: true,
        },
        best_percentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        best_points: {
          type: Number,
          default: 0,
        },
        best_xp: {
          type: Number,
          default: 0,
        },
      },
    ],
    assignment_performance: {
      average_percentage: {
        type: Number,
        default: 0,
      },
      completed_count: {
        type: Number,
        default: 0,
      },
    },
    lesson_best_percentages: [
      {
        lesson_id: {
          type: Schema.Types.ObjectId,
          ref: "Lesson",
          required: true,
        },
        category: {
          type: String,
          enum: ["grammar", "vocabulary", "listening", "speaking", "writing"],
          required: true,
        },
        best_percentage: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
      },
    ],
    category_performance: {
      grammar: {
        type: Number,
        default: 0,
      },
      vocabulary: {
        type: Number,
        default: 0,
      },
      listening: {
        type: Number,
        default: 0,
      },
      speaking: {
        type: Number,
        default: 0,
      },
      writing: {
        type: Number,
        default: 0,
      },
    },
    current_level: {
      type: String, // e.g., "beginner"
    },
    total_points: {
      type: Number,
      default: 0,
    },
    total_xp: {
      type: Number,
      default: 0,
    },
    current_streak: {
      type: Number,
      default: 0,
    },
    highest_streak: {
      type: Number,
      default: 0,
    },
    last_activity_at: {
      type: Date, // CRITICAL for calculating if streak has broken today
    },
    unlocked_achievements: [
      {
        type: String,
        enum: [
          "first-step",
          "ten-day-streak",
          "flame-master",
          "vocabulary-master",
          "grammar-master",
          "listening-expert",
          "speaking-star",
          "scholar",
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const StudentProgress = mongoose.model<
  IStudentProgress,
  Model<IStudentProgress>
>("StudentProgress", studentProgressSchema);
