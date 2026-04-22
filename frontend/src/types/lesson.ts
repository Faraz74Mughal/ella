import type {
  CATEGORY,
  LEVEL,
  STUDY_MATERIAL_TYPE,
} from "@/constants/lesson.constant";

export interface ILesson {
  _id: string;
  title: string;
  category: (typeof CATEGORY)[keyof typeof CATEGORY];
  level: (typeof LEVEL)[keyof typeof LEVEL];
  study_material?: {
    material_type: (typeof STUDY_MATERIAL_TYPE)[keyof typeof STUDY_MATERIAL_TYPE];
    content: string;
  };
  sequence_order: number;
  is_published: boolean;
}

export interface IFilteredLessonOptions {
  category: (typeof CATEGORY)[keyof typeof CATEGORY] | "";
  level: (typeof LEVEL)[keyof typeof LEVEL] | "";
}
