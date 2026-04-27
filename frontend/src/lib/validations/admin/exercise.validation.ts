import { QUIZ_TYPES, VISIBILITY } from "@/constants/lesson.constant";
import { z } from "zod";

export const exerciseSchema = z.object({
  // lesson_id: z.string().min(1, "Lesson ID is required"),

  title: z.string().min(1, "Title is required"),
  category: z.string("Category is required").nonempty( "Category is required"),
  level: z.string("Level is required").nonempty( "Level is required"),

  visibility: z
    .enum(Object.values(VISIBILITY) as [string, ...string[]])
    .default(VISIBILITY.PRIVATE).optional(),

  // type: z.enum(Object.values(QUIZ_TYPES) as [string, ...string[]]),

  content: z.any().refine((val) => val !== undefined && val !== null, {
    message: "Content is required",
  }),

  // points: z.number().min(1, "Points must be 1 or greater"),

  // passing_percentage: z.number().min(1).max(100, "Must be between 1 and 100"),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;