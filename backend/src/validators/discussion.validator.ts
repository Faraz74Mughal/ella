import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

export const createDiscussionCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).trim(),
    description: z.string().max(400).trim().optional(),
  }),
});

export const discussionThreadQuerySchema = z.object({
  query: z.object({
    categoryId: objectIdSchema.optional(),
  }),
});

export const createDiscussionThreadSchema = z.object({
  body: z.object({
    categoryId: objectIdSchema,
    title: z.string().min(3).max(200).trim(),
    content: z.string().min(5).max(6000).trim(),
  }),
});

export const createDiscussionReplySchema = z.object({
  params: z.object({
    threadId: objectIdSchema,
  }),
  body: z.object({
    content: z.string().min(2).max(4000).trim(),
  }),
});
