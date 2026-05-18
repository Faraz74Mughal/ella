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
    // ADD THIS: Track individual exercises completed to prevent double-claiming points
    completed_exercises: [
      {
        type: Schema.Types.ObjectId,
      }
    ],
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
  },
  {
    timestamps: true,
  },
);

export const StudentProgress = mongoose.model<
  IStudentProgress,
  Model<IStudentProgress>
>("StudentProgress", studentProgressSchema);
