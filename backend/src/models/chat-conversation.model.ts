import mongoose, { Model, Schema } from "mongoose";
import { IChatConversation } from "../types/chat.type";

export const buildParticipantKey = (userIdA: string, userIdB: string): string => {
  const a = String(userIdA);
  const b = String(userIdB);
  return a < b ? `${a}:${b}` : `${b}:${a}`;
};

const chatConversationSchema = new Schema<IChatConversation>(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: {
        validator: (value: unknown[]) => {
          if (!Array.isArray(value) || value.length !== 2) return false;
          return String(value[0]) !== String(value[1]);
        },
        message: "A conversation must have two different participants.",
      },
    },
    participantKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastMessage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Non-unique index so a student can be in many conversations
chatConversationSchema.index({ participants: 1 });
chatConversationSchema.index({ lastMessageAt: -1 });

export const ChatConversation = mongoose.model<IChatConversation, Model<IChatConversation>>(
  "ChatConversation",
  chatConversationSchema,
);

/** Drop legacy unique index that blocked multiple chats per student */
export const migrateChatConversationIndexes = async () => {
  const collection = ChatConversation.collection;
  try {
    await collection.dropIndex("participants_1");
  } catch {
    // Index may not exist or already dropped
  }

  const existing = await ChatConversation.find({
    $or: [{ participantKey: { $exists: false } }, { participantKey: "" }],
  });

  await Promise.all(
    existing.map(async (conversation) => {
      if (conversation.participants.length === 2) {
        conversation.participantKey = buildParticipantKey(
          String(conversation.participants[0]),
          String(conversation.participants[1]),
        );
        await conversation.save();
      }
    }),
  );
};
