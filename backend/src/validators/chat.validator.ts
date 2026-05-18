import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

export const createConversationSchema = z.object({
  body: z.object({
    peerId: objectIdSchema,
  }),
});

export const conversationIdParamSchema = z.object({
  params: z.object({
    conversationId: objectIdSchema,
  }),
});

export const sendMessageSchema = z.object({
  params: z.object({
    conversationId: objectIdSchema,
  }),
  body: z.object({
    content: z.string().min(1).max(4000).trim(),
  }),
});

export const getMessagesQuerySchema = z.object({
  params: z.object({
    conversationId: objectIdSchema,
  }),
  query: z.object({
    limit: z.coerce.number().min(1).max(100).optional(),
    before: z.string().optional(),
  }),
});
