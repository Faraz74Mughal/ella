import { CATEGORY, LEVEL } from "@/constants/lesson.constant";
import * as z from "zod";

export const lessonSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters"),
  level:  z.enum(Object.values(LEVEL) as [string, ...string[]]),
  category:  z.enum(Object.values(CATEGORY) as [string, ...string[]]),
  study_material: z
    .object({
      content: z.string().optional(),
      material_type: z.string().optional(),
    })
    .optional(),

  is_published: z.boolean().optional(),
});

export type LessonInput = z.infer<typeof lessonSchema>;
