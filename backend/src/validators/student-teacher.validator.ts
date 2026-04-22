import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id format");

export const addTeacherSchema = z.object({
  body: z.object({
    teacherId: objectIdSchema,
  }),
});

export const removeTeacherSchema = z.object({
  params: z.object({
    teacherId: objectIdSchema,
  }),
});

export const getTeacherStudentDetailsSchema = z.object({
  params: z.object({
    studentId: objectIdSchema,
  }),
});
