import mongoose from "mongoose";
import { ACCOUNT_STATUS, USER_ROLES } from "../constants/user.constant";
import {
  buildParticipantKey,
  ChatConversation,
  migrateChatConversationIndexes,
} from "../models/chat-conversation.model";
import { ChatMessage } from "../models/chat-message.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

const participantFields = "name username email image role accountStatus";

const normalizeUserId = (id: unknown): string => {
  if (!id) return "";
  return String(id);
};

const isChatEligibleStudent = (user: { role?: string; accountStatus?: string } | null | undefined) =>
  user?.role === USER_ROLES.STUDENT && user?.accountStatus === ACCOUNT_STATUS.ACTIVE;

const studentPeerFilter = {
  role: USER_ROLES.STUDENT,
  accountStatus: ACCOUNT_STATUS.ACTIVE,
};

const sortParticipantIds = (a: string, b: string): [mongoose.Types.ObjectId, mongoose.Types.ObjectId] => {
  const idA = new mongoose.Types.ObjectId(a);
  const idB = new mongoose.Types.ObjectId(b);
  return idA.toString() < idB.toString() ? [idA, idB] : [idB, idA];
};

const findOtherParticipant = <T extends { _id?: unknown }>(
  participants: T[],
  currentUserId: string,
): T | undefined => {
  const current = normalizeUserId(currentUserId);
  return participants.find((participant) => normalizeUserId(participant._id) !== current);
};

const isSelfConversation = (participants: mongoose.Types.ObjectId[] | unknown[]): boolean => {
  if (!Array.isArray(participants) || participants.length !== 2) return true;
  return normalizeUserId(participants[0]) === normalizeUserId(participants[1]);
};

let indexesMigrated = false;

const ensureChatIndexes = async () => {
  if (indexesMigrated) return;
  await migrateChatConversationIndexes();
  indexesMigrated = true;
};

const findConversationByParticipantKey = async (participantKey: string) => {
  return ChatConversation.findOne({ participantKey }).populate("participants", participantFields);
};

export class ChatService {
  /** Removes broken conversations where both participants are the same user. */
  static async removeInvalidConversations(studentId: string) {
    const currentId = normalizeUserId(studentId);
    const conversations = await ChatConversation.find({ participants: currentId });

    await Promise.all(
      conversations
        .filter((conversation) => isSelfConversation(conversation.participants))
        .map(async (conversation) => {
          await ChatMessage.deleteMany({ conversation: conversation._id });
          await conversation.deleteOne();
        }),
    );
  }

  static async getPeers(studentId: string, search?: string) {
    const currentId = normalizeUserId(studentId);

    const filter: Record<string, unknown> = {
      _id: { $ne: currentId },
      ...studentPeerFilter,
    };

    if (search?.trim()) {
      const term = search.trim();
      filter.$and = [
        {
          $or: [
            { name: new RegExp(term, "i") },
            { username: new RegExp(term, "i") },
            { email: new RegExp(term, "i") },
          ],
        },
      ];
    }

    const peers = await User.find(filter).select(participantFields).sort({ name: 1 }).limit(50);
    return peers.filter(
      (peer: { _id: unknown; role?: string; accountStatus?: string }) =>
        isChatEligibleStudent(peer) && normalizeUserId(peer._id) !== currentId,
    );
  }

  static async getConversations(studentId: string) {
    await ensureChatIndexes();

    const currentId = normalizeUserId(studentId);
    await ChatService.removeInvalidConversations(currentId);

    const conversations = await ChatConversation.find({
      participants: currentId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate("participants", participantFields);

    return conversations
      .filter((conversation) => !isSelfConversation(conversation.participants))
      .map((conversation) => {
        const doc = conversation.toObject();
        const otherParticipant = findOtherParticipant(doc.participants as any[], currentId);
        return {
          ...doc,
          peer: otherParticipant,
        };
      })
      .filter(
        (conversation) =>
          conversation.peer &&
          normalizeUserId(conversation.peer._id) !== currentId &&
          isChatEligibleStudent(conversation.peer),
      );
  }

  static async getOrCreateConversation(studentId: string, peerId: string) {
    await ensureChatIndexes();

    const currentId = normalizeUserId(studentId);
    const otherId = normalizeUserId(peerId);

    if (!currentId || !otherId) {
      throw new ApiError(400, "Invalid user selected for chat.");
    }

    if (currentId === otherId) {
      throw new ApiError(400, "You cannot start a chat with yourself.");
    }

    const peer = await User.findOne({
      _id: otherId,
      ...studentPeerFilter,
    }).select(participantFields);

    if (!peer || !isChatEligibleStudent(peer)) {
      throw new ApiError(404, "Only active students can be added to a chat.");
    }

    const participants = sortParticipantIds(currentId, otherId);
    const participantKey = buildParticipantKey(currentId, otherId);

    let conversation = await findConversationByParticipantKey(participantKey);

    if (!conversation) {
      try {
        const created = await ChatConversation.create({
          participants,
          participantKey,
          lastMessage: "",
        });
        conversation = await ChatConversation.findById(created._id).populate(
          "participants",
          participantFields,
        );
      } catch (error: any) {
        if (error?.code === 11000) {
          conversation = await findConversationByParticipantKey(participantKey);
        } else {
          throw error;
        }
      }
    }

    if (!conversation || isSelfConversation(conversation.participants)) {
      throw new ApiError(500, "Failed to create conversation.");
    }

    const doc = conversation.toObject();
    const resolvedPeer = findOtherParticipant(doc.participants as any[], currentId) || peer;

    if (normalizeUserId(resolvedPeer._id) === currentId) {
      throw new ApiError(400, "You cannot start a chat with yourself.");
    }

    return {
      ...doc,
      peer: resolvedPeer,
    };
  }

  static async assertParticipant(conversationId: string, studentId: string) {
    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, "Conversation not found.");
    }

    if (isSelfConversation(conversation.participants)) {
      throw new ApiError(400, "This conversation is invalid.");
    }

    const currentId = normalizeUserId(studentId);
    const isParticipant = conversation.participants.some(
      (participant) => normalizeUserId(participant) === currentId,
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not allowed to access this conversation.");
    }

    return conversation;
  }

  static async getMessages(
    conversationId: string,
    studentId: string,
    options: { limit?: number; before?: string },
  ) {
    await ChatService.assertParticipant(conversationId, studentId);

    const limit = options.limit ?? 50;
    const filter: Record<string, unknown> = { conversation: conversationId };

    if (options.before) {
      filter.createdAt = { $lt: new Date(options.before) };
    }

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("sender", participantFields);

    return messages.filter((message) => isChatEligibleStudent(message.sender as any)).reverse();
  }

  static async sendMessage(conversationId: string, studentId: string, content: string) {
    const conversation = await ChatService.assertParticipant(conversationId, studentId);
    const currentId = normalizeUserId(studentId);

    const trimmed = content.trim();
    if (!trimmed) {
      throw new ApiError(400, "Message cannot be empty.");
    }

    const message = await ChatMessage.create({
      conversation: conversationId,
      sender: currentId,
      content: trimmed,
    });

    conversation.lastMessage = trimmed.slice(0, 500);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    await message.populate("sender", participantFields);

    const populatedConversation = await ChatConversation.findById(conversationId).populate(
      "participants",
      participantFields,
    );

    const peer = findOtherParticipant(
      (populatedConversation?.participants as any[]) || [],
      currentId,
    );

    return {
      message,
      conversation: {
        ...populatedConversation?.toObject(),
        peer,
      },
    };
  }
}
