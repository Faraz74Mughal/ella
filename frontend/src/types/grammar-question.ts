export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface ITypes {
  label: string;
  value: string;
}
export type QuestionType =
  | "mcq"
  | "fill_blank"
  | "true_false"
  | "matching";

export interface SubQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  alternatives?: string[];
  points: number;
  timestamp?: number;

  pairs?: MatchingPair[];
  shuffleOptions?: boolean;
}

