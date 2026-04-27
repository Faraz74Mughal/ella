import type { CATEGORY, LEVEL, QUIZ_TYPES, VISIBILITY } from "@/constants/lesson.constant";
import type { USER_ROLES } from "@/constants/user.constant";


export interface IExercise extends Document {
  lesson_id:string;
  title: string;
  level: (typeof LEVEL)[keyof typeof LEVEL];
  category: (typeof CATEGORY)[keyof typeof CATEGORY];
  created_by: string;
  creator_role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
  visibility: (typeof VISIBILITY)[keyof typeof VISIBILITY];
  assigned_to_students?: string[];
  // type: (typeof QUIZ_TYPES)[keyof typeof QUIZ_TYPES];
  content: any; 
  points: number;
  passing_percentage: number;
  available_from?: Date;
  available_until?: Date;
  createdAt: Date;
  updatedAt: Date;
}

