import { IExercise } from './exerciseInterface';
import { IUser } from './userType';

export interface ILesson {
  _id: string
  title: string;
  description: string;
  content: string;
  level: ELevel;
  category: ECategory;
  order: number;
  multimedia: unknown[];
  createdBy: IUser
  isPublished: boolean;
  exercises: IExercise[] 
}

export enum ELevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ECategory {
  GRAMMAR_VOCABULARY = 'GRAMMAR_VOCABULARY',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
}

export enum EContentType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FLASHCARD = 'FLASHCARD',
}
