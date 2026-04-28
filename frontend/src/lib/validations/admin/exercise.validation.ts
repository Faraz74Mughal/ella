import { VISIBILITY } from "@/constants/lesson.constant";
import { z } from "zod";

const mcqSchema = z.object({
  id: z.string(),
  type: z.literal("mcq"),
  question: z.string().min(1, "Question is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Select correct answer"),
  points: z.number().min(1, "Points must be at least 1"),
});

const fillBlankSchema = z.object({
  id: z.string(),
  type: z.literal("fill_blank"),
  question: z.string().min(1, "Question is required"),
  correctAnswer: z.string().min(1, "Answer is required"),
  alternatives: z.array(z.string()).optional(),
  points: z.number().min(1, "Points must be at least 1"),
});

const matchingSchema = z.object({
  id: z.string(),
  type: z.literal("matching"),
  pairs: z
    .array(
      z.object({
        left: z.string().min(1, "Left cannot be empty"),
        right: z.string().min(1, "Right cannot be empty"),
      }),
    )
    .min(1, "At least one pair required"),
  points: z.number().min(1, "Points must be at least 1"),
});

const followUpSchema = z.object({
  id: z.string(),
  type: z.literal("follow_up"),
  question: z.string().min(1, "Question is required"),
  points: z.number().min(1, "Points must be at least 1"),
  expectedAnswer: z.string().min(1, "Expected answer is required"),
});

const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  fillBlankSchema,
  matchingSchema,
  followUpSchema
]);

export const exerciseSchema = z.object({
  lesson_id: z.string().min(1, "Lesson ID is required"),

  title: z.string().min(1, "Title is required"),
  category: z.string("Category is required").nonempty("Category is required"),
  level: z.string("Level is required").nonempty("Level is required"),

  visibility: z
    .enum(Object.values(VISIBILITY) as [string, ...string[]])
    .default(VISIBILITY.PRIVATE)
    .optional(),

  // // type: z.enum(Object.values(QUIZ_TYPES) as [string, ...string[]]),
  content: z.array(questionSchema).min(1, "At least one question is required"),
  // content: z.any().refine((val) => val !== undefined && val !== null, {
  //   message: "Content is required",
  // }),

  points: z.coerce.number().optional(), // Will be calculated on the backend based on question points

  passing_percentage: z.coerce
    .number()
    .min(1, "Must be at least 1")
    .max(100, "Must be between 1 and 100"),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;
