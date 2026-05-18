import mongoose, { Model, Schema } from "mongoose";
import { IAssignment } from "../types/assignment.type";

const assignmentSchema = new Schema<IAssignment>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    start_date: {
      type: Date,
      required: true,
      index: true,
    },
    end_date: {
      type: Date,
      required: true,
      index: true,
    },
    total_marks: {
      type: Number,
      required: true,
      min: 1,
    },
    xp_total: {
      type: Number,
      required: false,
      min: 1,
    },
    is_published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

assignmentSchema.index({ teacher: 1, createdAt: -1 });

export const Assignment = mongoose.model<IAssignment, Model<IAssignment>>(
  "Assignment",
  assignmentSchema,
);
