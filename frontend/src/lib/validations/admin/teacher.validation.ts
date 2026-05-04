import * as z from "zod";

export const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export type TeacherInput = z.infer<typeof teacherSchema>;



export const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 error goes to this field
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;