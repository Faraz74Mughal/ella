import { Document } from "mongoose";
import { CATEGORY, LEVEL, STUDY_MATERIAL_TYPE } from "../constants/lesson.constant";

export interface ILesson extends Document {
  title: string;
  level: (typeof LEVEL)[keyof typeof LEVEL];
  category: (typeof CATEGORY)[keyof typeof CATEGORY];
  study_material?: {
    material_type?: (typeof STUDY_MATERIAL_TYPE)[keyof typeof STUDY_MATERIAL_TYPE];
    content?: string;
  };
  sequence_order: number;
  is_published: boolean;
  exercise_count?: number;
  createdAt: Date;
  updatedAt: Date;
}
