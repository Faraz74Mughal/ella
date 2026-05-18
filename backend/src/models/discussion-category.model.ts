import mongoose, { Model, Schema } from "mongoose";
import { IDiscussionCategory } from "../types/discussion.type";

const discussionCategorySchema = new Schema<IDiscussionCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const DiscussionCategory = mongoose.model<
  IDiscussionCategory,
  Model<IDiscussionCategory>
>("DiscussionCategory", discussionCategorySchema);