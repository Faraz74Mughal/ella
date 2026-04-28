import mongoose, { Model, Schema } from "mongoose";
import {
  CATEGORY,
  LEVEL,
  QUIZ_TYPES,
  VISIBILITY,
} from "../constants/lesson.constant";
import { USER_ROLES } from "../constants/user.constant";
import { IExercise } from "../types/exercise.type";

const exerciseSchema = new Schema<IExercise>(
  {
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Exercise title is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: Object.values(LEVEL),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(CATEGORY),
      required: true,
    },
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
    assigned_to_students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // type: {
    //   type: String,
    //   enum: Object.values(QUIZ_TYPES),
    //   required: true,
    // },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: [1, "Points must be at least 1"],
    },
    passing_percentage: {
      type: Number,
      required: true,
      min: [0, "Passing percentage must be at least 0"],
      max: [100, "Passing percentage cannot exceed 100"],
    },
    available_from: {
      type: Date,
    },
    available_until: {
      type: Date,
      validate: {
        validator: function (this: IExercise, value: Date) {
          if (!value || !this.available_from) return true;
          return value >= this.available_from;
        },
        message: "available_until must be greater than or equal to available_from",
      },
    },
  },
  {
    timestamps: true,
  },
);

exerciseSchema.index({ lesson_id: 1, createdAt: -1 });

export const Exercise = mongoose.model<IExercise, Model<IExercise>>(
  "Exercise",
  exerciseSchema,
);
