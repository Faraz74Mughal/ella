import mongoose, { Model, Schema } from "mongoose";
import { IStudentProgress } from "../types/student-progress.type";

const studentProgressSchema = new Schema<IStudentProgress>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    completed_lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    current_level: {
      type: String,
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
      type: Date,
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
