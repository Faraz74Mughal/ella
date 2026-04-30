export interface FillBlankQuestion {
  id: string;
  type: "fill_blank";
  question: string;
  correctAnswer: string;
  alternatives?: string[];
  points: number;
}

export interface MCQQuestion {
  id: string;
  type: "mcq";
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface TrueFalseQuestion {
  id: string;
  type: "true_false";
  question: string;
  correctAnswer: boolean;
  points: number;
}

export type ComprehensionQuestions = FillBlankQuestion | TrueFalseQuestion | MCQQuestion;

export interface ListeningQuestion {
  id: string;
  type: string;
  file?: File | null;
  transcript: string;
  points: number;
  comprehensionQuestions: ComprehensionQuestions[];
}
