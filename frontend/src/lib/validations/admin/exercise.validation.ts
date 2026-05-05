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

const trueFalseSchema = z.object({
  id: z.string(),
  type: z.literal("true_false"),
  question: z.string().min(1, "Question is required"),
  correctAnswer: z.boolean(),
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

const dialogueSchema = z.object({
  id: z.string(),
  type: z.literal("dialogue"),
  question: z.string().min(1, "Question is required"),
  speaker: z.string().min(1, "Speaker is required"),
  expectedAnswer: z.string().min(1, "Expected answer is required"),
  alternative: z.string().optional(),
  points: z.number(),
});

const listeningSchema = z.object({
  id: z.string(),
  type: z.literal("listening"),
  file: z.string().nullable(),
  transcript: z.string().optional(),
  points: z.coerce.number().optional(),
  comprehensionQuestions: z
    .array(
      z.discriminatedUnion("type", [
        mcqSchema,
        fillBlankSchema,
        trueFalseSchema,
      ]),
    )
    .min(1, "At least one comprehension question is required"),
});

const writingSchema = z.object({
  type: z.literal("writing"),
  topic: z.string().min(1, "Topic is required"),
  timeLimit: z.number().min(1, "Time limit must be at least 1"),
  minimumWords: z.number().min(1, "Minimum word count must be at least 1"),
  maximumWords: z.number().min(1, "Maximum word count must be at least 1"),
  points: z.number().min(1, "Points must be at least 1"),
});

const questionSchema = z.discriminatedUnion("type", [
  mcqSchema,
  fillBlankSchema,
  matchingSchema,
  followUpSchema,
  dialogueSchema,
  listeningSchema,
  trueFalseSchema,
  writingSchema
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
