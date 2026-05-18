import mongoose, { Model, Schema } from "mongoose";
import { IDiscussionThread } from "../types/discussion.type";

const replySchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 4000,
    },
  },
  { timestamps: true },
);

const discussionThreadSchema = new Schema<IDiscussionThread>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "DiscussionCategory",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 6000,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastReplyAt: {
      type: Date,
      default: null,
    },
    replies: [replySchema],
  },
  { timestamps: true },
);

discussionThreadSchema.index({ category: 1, createdAt: -1 });

export const DiscussionThread = mongoose.model<IDiscussionThread, Model<IDiscussionThread>>(
  "DiscussionThread",
  discussionThreadSchema,
);