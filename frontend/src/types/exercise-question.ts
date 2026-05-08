export interface ITypes {
  label: string;
  value: string;
}

interface BaseQuestion {
  id: string;
  type: string;
  points: number;
}

/* ------------------
        Grammar 
   ------------------ */
export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill_blank";
  question: string;
  correctAnswer: string;
  alternatives?: string[];
}

export interface MatchingPair {
  id?: string;
  left: string;
  right: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  pairs: MatchingPair[];
  shuffleOptions?: boolean;
}

/* ------------------
        Listening
   ------------------ */

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true_false";
  question: string;
  correctAnswer: boolean;
}

export type ComprehensionQuestions =
  | (FillBlankQuestion & { parentType: "listening" })
  | (TrueFalseQuestion & { parentType: "listening" })
  | (MCQQuestion & { parentType: "listening" });

export interface ListeningQuestion extends BaseQuestion {
  type: "listening";
  file?: File | null;
  transcript: string;
  comprehensionQuestions: ComprehensionQuestions[];
}

/* ------------------
        Speaking 
   ------------------ */

export interface FollowUpQuestion extends BaseQuestion {
  type: "follow_up";
  question: string;
  expectedAnswer: string;
}

export interface DialogueQuestion extends BaseQuestion {
  type: "dialogue";
  question: string;
  speaker: string;
  expectedAnswer: string;
  alternative: string;
}

export interface WritingQuestion extends BaseQuestion {
  type: "writing";
  topic: string;
  timeLimit: number;
  minimumWords: number;
  maximumWords: number;
}
export type ExerciseQuestion =
  | MCQQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | TrueFalseQuestion
  | ListeningQuestion
  | FollowUpQuestion
  | DialogueQuestion
  | WritingQuestion;
