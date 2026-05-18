import mongoose, { Model, Schema } from "mongoose";
import { IChatMessage } from "../types/chat.type";

const chatMessageSchema = new Schema<IChatMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "ChatConversation",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 4000,
    },
  },
  { timestamps: true },
);

chatMessageSchema.index({ conversation: 1, createdAt: -1 });

export const ChatMessage = mongoose.model<IChatMessage, Model<IChatMessage>>(
  "ChatMessage",
  chatMessageSchema,
);
