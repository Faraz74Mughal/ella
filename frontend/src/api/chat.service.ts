import api from "./client";
import type { ApiResponse } from "@/types/auth";
import type {
  ChatPeer,
  CreateConversationPayload,
  IChatConversation,
  IChatMessage,
  SendMessagePayload,
} from "@/types/chat";

const chatBase = "/chat";

export const chatService = {
  fetchPeers: async (search?: string): Promise<ChatPeer[]> => {
    const response = await api.get<ApiResponse<{ peers: ChatPeer[] }>>(`${chatBase}/peers`, {
      params: search ? { search } : undefined,
    });
    return response?.data?.data?.peers || [];
  },

  fetchConversations: async (): Promise<IChatConversation[]> => {
    const response = await api.get<ApiResponse<{ conversations: IChatConversation[] }>>(
      `${chatBase}/conversations`,
    );
    return response?.data?.data?.conversations || [];
  },

  getOrCreateConversation: async (
    payload: CreateConversationPayload,
  ): Promise<IChatConversation> => {
    const response = await api.post<ApiResponse<{ conversation: IChatConversation }>>(
      `${chatBase}/conversations`,
      payload,
    );
    return response?.data?.data?.conversation;
  },

  fetchMessages: async (conversationId: string): Promise<IChatMessage[]> => {
    const response = await api.get<ApiResponse<{ messages: IChatMessage[] }>>(
      `${chatBase}/conversations/${conversationId}/messages`,
    );
    return response?.data?.data?.messages || [];
  },

  sendMessage: async (
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<{ message: IChatMessage; conversation: IChatConversation }> => {
    const response = await api.post<
      ApiResponse<{ message: IChatMessage; conversation: IChatConversation }>
    >(`${chatBase}/conversations/${conversationId}/messages`, payload);
    return response?.data?.data;
  },
};
