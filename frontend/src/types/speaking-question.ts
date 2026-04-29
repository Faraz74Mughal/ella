export interface FolloWUpQuestion {
  id: string;
  type: string;
  question: string;
  expectedAnswer: string;
  points: number;
}

export interface DialogueQuestion {
  id: string;
  type: string;
  speakers: string[];
  lines: DialogueLine[];
  timePerResponse: number;
  allowHints: boolean;
  showFeedback: boolean;
  passingScore: number;
  tags: string[];
}

export interface DialogueLine {
  id: string;
  speaker: string;
  type: string;
  question: string;
  expectedAnswer: string;
  alternative: string;
}
