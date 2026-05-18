import type { User } from "./auth";

export type ChatPeer = Pick<User, "_id" | "name" | "username" | "email" | "image" | "role">;

export const isStudentChatPeer = (peer?: ChatPeer | null) => peer?.role === "student";

export const normalizeChatUserId = (id?: string | null) => (id ? String(id) : "");

export const isSameChatUser = (a?: string | null, b?: string | null) =>
  normalizeChatUserId(a) === normalizeChatUserId(b) && Boolean(normalizeChatUserId(a));

export interface IChatMessage {
  _id: string;
  conversation: string;
  sender: ChatPeer;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChatConversation {
  _id: string;
  participants: ChatPeer[];
  peer?: ChatPeer;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateConversationPayload = {
  peerId: string;
};

export type SendMessagePayload = {
  content: string;
};
