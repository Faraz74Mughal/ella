import { ApiError } from "../utils/ApiError";
import { DiscussionCategory } from "../models/discussion-category.model";
import { DiscussionThread } from "../models/discussion-thread.model";
import { User } from "../models/user.model";

type CreateCategoryPayload = {
  name: string;
  description?: string;
};

type CreateThreadPayload = {
  categoryId: string;
  title: string;
  content: string;
};

type CreateReplyPayload = {
  content: string;
};

const normalizeName = (value: string) => value.trim().toLowerCase();

export class DiscussionService {
  static async getCategories() {
    return await DiscussionCategory.find({ isActive: true })
      .sort({ createdAt: 1 })
      .populate("createdBy", "name username email");
  }

  static async createCategory(userId: string, payload: CreateCategoryPayload) {
    const name = payload.name?.trim();
    if (!name) {
      throw new ApiError(400, "Category name is required.");
    }

    const existing = await DiscussionCategory.findOne({
      name: new RegExp(`^${normalizeName(name)}$`, "i"),
    });
    if (existing) {
      throw new ApiError(409, "Category already exists.");
    }

    return await DiscussionCategory.create({
      name,
      description: payload.description?.trim() || "",
      createdBy: userId,
    });
  }

  static async getThreads(categoryId?: string) {
    const filter: Record<string, any> = {};
    if (categoryId) {
      filter.category = categoryId;
    }

    return await DiscussionThread.find(filter)
      .sort({ isPinned: -1, lastReplyAt: -1, createdAt: -1 })
      .populate("category", "name description")
      .populate("createdBy", "name username email role image")
      .populate("replies.author", "name username email role image");
  }

  static async createThread(
    userId: string,
    role: string,
    payload: CreateThreadPayload,
  ) {
    if (!["admin", "teacher"].includes(role)) {
      throw new ApiError(403, "Only teachers and admins can create discussion threads.");
    }

    const category = await DiscussionCategory.findById(payload.categoryId);
    if (!category || !category.isActive) {
      throw new ApiError(404, "Discussion category not found.");
    }

    const user = await User.findById(userId).select("role name username email image");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return await DiscussionThread.create({
      category: payload.categoryId,
      title: payload.title,
      content: payload.content,
      createdBy: userId,
      createdByRole: role,
    });
  }

  static async addReply(userId: string, threadId: string, payload: CreateReplyPayload) {
    const thread = await DiscussionThread.findById(threadId);
    if (!thread) {
      throw new ApiError(404, "Discussion thread not found.");
    }

    if (thread.isLocked) {
      throw new ApiError(423, "This discussion is locked.");
    }

    const user = await User.findById(userId).select("role name username email image");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    thread.replies.push({
      author: userId as any,
      content: payload.content,
    } as any);
    thread.lastReplyAt = new Date();
    await thread.save();

    return await DiscussionThread.findById(threadId)
      .populate("category", "name description")
      .populate("createdBy", "name username email role image")
      .populate("replies.author", "name username email role image");
  }
}