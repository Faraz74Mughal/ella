import mongoose, { Model, Schema } from "mongoose";
import { IAssignmentSubmission } from "../types/assignment-submission.type";

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    document_url: {
      type: String,
      required: true,
    },
    document_public_id: {
      type: String,
    },
    document_name: {
      type: String,
    },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
      index: true,
    },
    score_obtained: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    points_awarded: {
      type: Number,
      default: 0,
    },
    xp_awarded: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
    },
    graded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
    graded_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const AssignmentSubmission = mongoose.model<
  IAssignmentSubmission,
  Model<IAssignmentSubmission>
>("AssignmentSubmission", assignmentSubmissionSchema);
