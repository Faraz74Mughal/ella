import { ECategory, ELevel, ILesson } from './lessonInterface';

export interface IExercise extends Document {
  _id: string;
  title: string;
  description?: string;
  attemptsAllowed?: number;
  totalPoints?: number;
  totalTime?: number;
  level: ELevel;
  category: ECategory;
  createdBy: string 
  lesson?: ILesson 
  questions?: IQuestion[] ;

}

export interface IQuestion extends Document {
  _id: string 
  type: EType;
  subType: EGrammer | ESpeaking | EListening | EWriting;

  question: string;
  options?: string[];
  answer?: string;

  maxWord?: number;
  mark?: number;
  time?: number;
  exercise?: string 
}

export enum EType {
  GRAMMAR_VOCABULARY = 'GRAMMAR_VOCABULARY',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  LISTENING = 'LISTENING',
}

export enum EGrammer {
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export enum ESpeaking {
  SPEECH_RECOGNITION = 'SPEECH_RECOGNITION',
  DIALOGUE = 'DIALOGUE',
}

export enum EWriting {
  ESSAY = 'ESSAY',
}

export enum EListening {
  QUESTION_ANSWER = 'QUESTION_ANSWER',
  ARRANGE_WORD = 'ARRANGE_WORD',
}
