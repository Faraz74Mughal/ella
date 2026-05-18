import mongoose, { Types } from "mongoose";

export type QuizCategory =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "speaking"
  | "writing";

export interface ILessonBestPercentage {
  lesson_id: Types.ObjectId;
  category: QuizCategory;
  best_percentage: number;
}

export interface ICategoryPerformance {
  grammar: number;
  vocabulary: number;
  listening: number;
  speaking: number;
  writing: number;
}

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface IStudentProgress {
  student: Types.ObjectId;
  completed_lessons: Types.ObjectId[];
  completed_exercises?: Types.ObjectId[];
  passed_lessons?: Types.ObjectId[];
  unlocked_lessons?: Types.ObjectId[];
  assignment_best_scores?: {
    assignment_id: Types.ObjectId;
    best_percentage: number;
    best_points?: number;
    best_xp?: number;
  }[];
  assignment_performance?: {
    average_percentage: number;
    completed_count: number;
  };
  lesson_best_percentages?: ILessonBestPercentage[];
  category_performance?: ICategoryPerformance;
  current_level?: string;
  total_points?: number;
  total_xp?: number;
  current_streak?: number;
  highest_streak?: number;
  last_activity_at?: Date;
  unlocked_achievements?: string[];
}
