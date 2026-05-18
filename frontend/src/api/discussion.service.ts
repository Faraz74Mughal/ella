import api from "./client";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateDiscussionCategoryPayload,
  CreateDiscussionReplyPayload,
  CreateDiscussionThreadPayload,
  IDiscussionCategory,
  IDiscussionThread,
} from "@/types/discussion";

const discussionBase = "/discussions";

export const discussionService = {
  fetchCategories: async (): Promise<IDiscussionCategory[]> => {
    const response = await api.get<ApiResponse<{ categories: IDiscussionCategory[] }>>(
      `${discussionBase}/categories`,
    );
    return response?.data?.data?.categories || [];
  },

  createCategory: async (payload: CreateDiscussionCategoryPayload): Promise<IDiscussionCategory> => {
    const response = await api.post<ApiResponse<{ category: IDiscussionCategory }>>(
      `${discussionBase}/categories`,
      payload,
    );
    return response?.data?.data?.category;
  },

  fetchThreads: async (categoryId?: string): Promise<IDiscussionThread[]> => {
    const response = await api.get<ApiResponse<{ threads: IDiscussionThread[] }>>(
      `${discussionBase}/threads${categoryId ? `?categoryId=${categoryId}` : ""}`,
    );
    return response?.data?.data?.threads || [];
  },

  createThread: async (payload: CreateDiscussionThreadPayload): Promise<IDiscussionThread> => {
    const response = await api.post<ApiResponse<{ thread: IDiscussionThread }>>(
      `${discussionBase}/threads`,
      payload,
    );
    return response?.data?.data?.thread;
  },

  addReply: async ({
    threadId,
    payload,
  }: {
    threadId: string;
    payload: CreateDiscussionReplyPayload;
  }): Promise<IDiscussionThread> => {
    const response = await api.post<ApiResponse<{ thread: IDiscussionThread }>>(
      `${discussionBase}/threads/${threadId}/replies`,
      payload,
    );
    return response?.data?.data?.thread;
  },
};