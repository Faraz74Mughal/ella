import { Document, Types } from "mongoose";
import {
  CATEGORY,
  LEVEL,
  QUIZ_TYPES,
  VISIBILITY,
} from "../constants/lesson.constant";
import { USER_ROLES } from "../constants/user.constant";

export interface IExercise extends Document {
  lesson_id: Types.ObjectId;
  title: string;
  level: (typeof LEVEL)[keyof typeof LEVEL];
  category: (typeof CATEGORY)[keyof typeof CATEGORY];
  created_by: Types.ObjectId;
  creator_role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
  visibility: (typeof VISIBILITY)[keyof typeof VISIBILITY];
  assigned_to_students?: Types.ObjectId[];
  // type: (typeof QUIZ_TYPES)[keyof typeof QUIZ_TYPES];
  content: any; // Flexible content structure based on quiz type
  points: number;
  passing_percentage: number;
  available_from?: Date;
  available_until?: Date;
  createdAt: Date;
  updatedAt: Date;
}
