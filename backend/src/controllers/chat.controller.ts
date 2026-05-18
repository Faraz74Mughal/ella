import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ChatService } from "../services/chat.service";

const getStudentId = (req: Request) => String((req as any).user._id);

export const getChatPeers = asyncHandler(async (req: Request, res: Response) => {
  const studentId = getStudentId(req);
  const search = req.query.search as string | undefined;
  const peers = await ChatService.getPeers(studentId, search);
  return res.status(200).json(new ApiResponse(200, "Peers fetched successfully", { peers }));
});

export const getChatConversations = asyncHandler(async (req: Request, res: Response) => {
  const studentId = getStudentId(req);
  const conversations = await ChatService.getConversations(studentId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Conversations fetched successfully", { conversations }));
});

export const createChatConversation = asyncHandler(async (req: Request, res: Response) => {
  const studentId = getStudentId(req);
  const conversation = await ChatService.getOrCreateConversation(studentId, req.body.peerId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Conversation ready", { conversation }));
});

export const getChatMessages = asyncHandler(async (req: Request, res: Response) => {
  const studentId = getStudentId(req);
  const conversationId = String(req.params.conversationId);
  const messages = await ChatService.getMessages(conversationId, studentId, {
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    before: req.query.before as string | undefined,
  });
  return res.status(200).json(new ApiResponse(200, "Messages fetched successfully", { messages }));
});

export const sendChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const studentId = getStudentId(req);
  const conversationId = String(req.params.conversationId);
  const result = await ChatService.sendMessage(conversationId, studentId, req.body.content);
  return res.status(201).json(new ApiResponse(201, "Message sent successfully", result));
});
