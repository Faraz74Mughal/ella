import { z } from "zod";
import { USER_ROLES } from "../constants/user.constant";

export const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z.object({
  body: z
    .object({
      username: z.string().min(3).max(20).trim(),
      email: z.string().email("Invalid email format").lowercase(),
      password: z.string().regex(strongPassword, {
        message:
          "Password must contain 8+ chars, uppercase, lowercase, number, special char",
      }),
      name: z.string().min(2, "Name is required"),
      role: z.enum([USER_ROLES.STUDENT, USER_ROLES.TEACHER]),
      dob: z.string().optional(),
      contactNo: z.string().optional(),
      language: z.string().optional(),

      // Conditional validation for Teachers
      teacherProfile: z
        .object({
          resumeUrl: z.string().url("Invalid Resume URL"),
          educationDocuments: z.array(z.string().url()),
          idProof: z.object({
            front: z.string().url("Front ID image is required"),
            back: z.string().url("Back ID image is required"),
          }),
        })
        .optional(),
    })
    .refine(
      (data) => {
        // Logic: If role is TEACHER, teacherProfile MUST exist
        if (data.role === USER_ROLES.TEACHER && !data.teacherProfile) {
          return false;
        }
        return true;
      },
      {
        message:
          "Teacher profile details are required for teacher registration",
        path: ["teacherProfile"],
      },
    ),
});

export const updateCurrentUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(120).trim().optional(),
      username: z.string().min(3).max(30).trim().optional(),
      bio: z.string().max(500).trim().optional(),
      contactNo: z.string().max(30).trim().optional(),
      language: z.string().max(60).trim().optional(),
      image: z.string().url("Invalid image URL").optional(),
      dob: z.union([z.string(), z.date()]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one profile field is required",
      path: ["body"],
    }),
});
