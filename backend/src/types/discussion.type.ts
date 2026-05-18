import { Document, Types } from "mongoose";

export interface IDiscussionCategory extends Document {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscussionReply {
  author: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDiscussionThread extends Document {
  category: Types.ObjectId;
  title: string;
  content: string;
  createdBy: Types.ObjectId;
  createdByRole: "admin" | "teacher" | "student";
  isPinned: boolean;
  isLocked: boolean;
  lastReplyAt?: Date;
  replies: IDiscussionReply[];
  createdAt: Date;
  updatedAt: Date;
}