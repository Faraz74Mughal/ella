import type { User } from "./auth";

export interface IDiscussionCategory {
  _id: string;
  name: string;
  description?: string;
  createdBy?: User;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDiscussionReply {
  _id?: string;
  author: User;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDiscussionThread {
  _id: string;
  category: IDiscussionCategory;
  title: string;
  content: string;
  createdBy: User;
  createdByRole: "admin" | "teacher" | "student";
  isPinned?: boolean;
  isLocked?: boolean;
  lastReplyAt?: string;
  replies: IDiscussionReply[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDiscussionCategoryPayload = {
  name: string;
  description?: string;
};

export type CreateDiscussionThreadPayload = {
  categoryId: string;
  title: string;
  content: string;
};

export type CreateDiscussionReplyPayload = {
  content: string;
};