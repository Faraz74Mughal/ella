import mongoose, { Types } from "mongoose";

export interface IStudentProgress {
  student: Types.ObjectId;
  completed_lessons: Types.ObjectId[];
  current_level?: string;
  total_points?: number;
  total_xp?: number;
  current_streak?: number;
  highest_streak?: number;
  last_activity_at?: Date;
}
