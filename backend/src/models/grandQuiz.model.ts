import mongoose, { Model, Schema } from "mongoose";
import { LEVEL, VISIBILITY } from "../constants/lesson.constant";
import { IGrandQuiz } from "../types/grand-quiz.type";

const grandQuizSchema = new Schema<IGrandQuiz>(
  {
    title: {
      type: String,
      required: [true, "Grand quiz title is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: Object.values(LEVEL),
      required: true,
    },
    passing_percentage: {
      type: Number,
      required: true,
      min: [0, "Passing percentage must be at least 0"],
      max: [100, "Passing percentage cannot exceed 100"],
    },
    exercises: [
      {
        exercise_id: {
          type: Schema.Types.ObjectId,
          ref: "Exercise",
          required: true,
        },
      },
    ],
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: Object.values(VISIBILITY),
      default: VISIBILITY.PRIVATE,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

grandQuizSchema.path("exercises").validate(function (value: unknown[]) {
  return Array.isArray(value) && value.length > 0;
}, "Grand quiz must include at least one exercise.");

export const GrandQuiz = mongoose.model<IGrandQuiz, Model<IGrandQuiz>>(
  "GrandQuiz",
  grandQuizSchema,
);
