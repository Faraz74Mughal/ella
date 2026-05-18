import { Types } from "mongoose";
import type { IUser } from "./user.type";

export interface IChatMessage {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatConversation {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  /** Sorted pair key — one conversation per student pair */
  participantKey: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ChatPeer = Pick<IUser, "_id" | "name" | "username" | "email" | "image">;

export type PopulatedChatMessage = Omit<IChatMessage, "sender"> & {
  sender: ChatPeer;
};

export type PopulatedChatConversation = Omit<IChatConversation, "participants"> & {
  participants: ChatPeer[];
  unreadCount?: number;
};
