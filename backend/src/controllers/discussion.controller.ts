import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { DiscussionService } from "../services/discussion.service";

export const getDiscussionCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await DiscussionService.getCategories();
  return res.status(200).json(new ApiResponse(200, "Categories fetched successfully", { categories }));
});

export const createDiscussionCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const category = await DiscussionService.createCategory(userId, req.body);
  return res.status(201).json(new ApiResponse(201, "Category created successfully", { category }));
});

export const getDiscussionThreads = asyncHandler(async (req: Request, res: Response) => {
  const threads = await DiscussionService.getThreads(req.query.categoryId as string | undefined);
  return res.status(200).json(new ApiResponse(200, "Threads fetched successfully", { threads }));
});

export const createDiscussionThread = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const role = (req as any).user.role;
  const thread = await DiscussionService.createThread(userId, role, req.body);
  return res.status(201).json(new ApiResponse(201, "Discussion created successfully", { thread }));
});

export const addDiscussionReply = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { threadId } = req.params;
  const thread = await DiscussionService.addReply(userId, threadId, req.body);
  return res.status(200).json(new ApiResponse(200, "Reply added successfully", { thread }));
});