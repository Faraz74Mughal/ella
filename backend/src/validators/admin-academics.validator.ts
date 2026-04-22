import { z } from "zod";
import {
  CATEGORY,
  LEVEL,
  QUIZ_TYPES,
  STUDY_MATERIAL_TYPE,
  VISIBILITY,
} from "../constants/lesson.constant";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

const levelValues = Object.values(LEVEL) as [string, ...string[]];
const categoryValues = Object.values(CATEGORY) as [string, ...string[]];
const materialTypeValues = Object.values(STUDY_MATERIAL_TYPE) as [
  string,
  ...string[],
];
const visibilityValues = Object.values(VISIBILITY) as [string, ...string[]];
const quizTypeValues = Object.values(QUIZ_TYPES) as [string, ...string[]];

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    level: z.enum(levelValues),
    category: z.enum(categoryValues),
    study_material: z
      .object({
        material_type: z.enum(materialTypeValues).optional(),
        content: z.string().min(1).optional(),
      })
      .optional(),
    // sequence_order: z.number().int().min(1),
    is_published: z.boolean().optional(),
  }),
});

export const updateLessonSchema = z.object({
  params: z.object({
    lessonId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    level: z.enum(levelValues).optional(),
    category: z.enum(categoryValues).optional(),
    study_material: z
      .object({
        material_type: z.enum(materialTypeValues).optional(),
        content: z.string().min(1).optional(),
      })
      .optional(),
    sequence_order: z.number().int().min(1).optional(),
    is_published: z.boolean().optional(),
  }),
});

export const lessonParamSchema = z.object({
  params: z.object({
    lessonId: objectIdSchema,
  }),
});

export const createExerciseSchema = z.object({
  body: z.object({
    lesson_id: objectIdSchema,
    title: z.string().min(2),
    level: z.enum(levelValues),
    category: z.enum(categoryValues),
    visibility: z.enum(visibilityValues).optional(),
    type: z.enum(quizTypeValues),
    content: z.any(),
    points: z.number().min(1),
    passing_percentage: z.number().min(0).max(100),
    available_from: z.string().datetime().optional(),
    available_until: z.string().datetime().optional(),
    assigned_to_students: z.array(objectIdSchema).optional(),
  }),
});

export const updateExerciseSchema = z.object({
  params: z.object({
    exerciseId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    level: z.enum(levelValues).optional(),
    category: z.enum(categoryValues).optional(),
    visibility: z.enum(visibilityValues).optional(),
    type: z.enum(quizTypeValues).optional(),
    content: z.any().optional(),
    points: z.number().min(1).optional(),
    passing_percentage: z.number().min(0).max(100).optional(),
    available_from: z.string().datetime().optional(),
    available_until: z.string().datetime().optional(),
    assigned_to_students: z.array(objectIdSchema).optional(),
  }),
});

export const exerciseParamSchema = z.object({
  params: z.object({
    exerciseId: objectIdSchema,
  }),
});

export const createGrandQuizSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    level: z.enum(levelValues),
    passing_percentage: z.number().min(0).max(100),
    visibility: z.enum(visibilityValues).optional(),
    exercises: z
      .array(
        z.object({
          exercise_id: objectIdSchema,
        }),
      )
      .min(1),
  }),
});

export const updateGrandQuizSchema = z.object({
  params: z.object({
    grandQuizId: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    level: z.enum(levelValues).optional(),
    passing_percentage: z.number().min(0).max(100).optional(),
    visibility: z.enum(visibilityValues).optional(),
    exercises: z
      .array(
        z.object({
          exercise_id: objectIdSchema,
        }),
      )
      .min(1)
      .optional(),
  }),
});

export const grandQuizParamSchema = z.object({
  params: z.object({
    grandQuizId: objectIdSchema,
  }),
});
