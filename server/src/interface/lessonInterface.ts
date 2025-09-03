import mongoose, { Document } from 'mongoose';
import { IUser } from './userInterface';
import { IExercise } from './exerciseInterface';

export interface ILesson extends Document {
  _id: string|mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  content: string;
  level: ELevel;
  category: ECategory;
  order: number;
  multimedia: unknown[];
  createdBy: IUser|mongoose.Schema.Types.ObjectId;
  isPublished: boolean;
  exercises: IExercise[] | mongoose.Schema.Types.ObjectId[];
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
