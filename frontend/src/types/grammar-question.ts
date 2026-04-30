
export interface ITypes {
  label: string;
  value: string;
}
export type QuestionType =
  | "mcq"
  | "fill_blank"
  | "true_false"
  | "matching";


export interface MCQQuestion {
  id: string;
  type: "mcq";
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface FillBlankQuestion {
  id: string;
  type: "fill_blank";
  question: string;
  correctAnswer: string;
  alternatives?: string[];
  points: number;
}

export interface MatchingPair {
  id?: string;
  left: string;
  right: string;
}

export interface MatchingQuestion {
  id: string;
  type: "matching";
  pairs: MatchingPair[];
  shuffleOptions?: boolean;
  points: number;
}


export type SubQuestion =
  | MCQQuestion
  | FillBlankQuestion
  | MatchingQuestion;
