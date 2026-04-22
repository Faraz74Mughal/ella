import { Document, Types } from "mongoose";
import { LEVEL, VISIBILITY } from "../constants/lesson.constant";

export interface IGrandQuiz extends Document {
  title: string;
  level: (typeof LEVEL)[keyof typeof LEVEL];
  passing_percentage: number;
  exercises: {
    exercise_id: Types.ObjectId;
  }[];
  created_by: Types.ObjectId;
  visibility: (typeof VISIBILITY)[keyof typeof VISIBILITY];
  createdAt: Date;
  updatedAt: Date;
}
