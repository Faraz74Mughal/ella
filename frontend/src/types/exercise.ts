import type { CATEGORY, LEVEL, VISIBILITY } from "@/constants/lesson.constant";

export interface IExercise extends Document {
  _id?: string;
  lesson_id: string;
  title: string;
  level: (typeof LEVEL)[keyof typeof LEVEL];
  category: (typeof CATEGORY)[keyof typeof CATEGORY];
  created_by: {
    _id: string;
    name: string;
    role: string;
  };
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
