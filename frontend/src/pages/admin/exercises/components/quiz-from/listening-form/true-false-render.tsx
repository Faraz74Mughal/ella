import type { TrueFalseQuestion } from "@/types/listening-question";
import React from "react";

interface TrueFalseRendererProps {
  question: TrueFalseQuestion;
  listeningId: string;
  updateQuestion: (
    listeningId: string,
    questionId: string,
    field: keyof TrueFalseQuestion,
    value: any,
  ) => void;
}

const TrueFalseRenderer = ({
  question,
  listeningId,
  updateQuestion,
}: TrueFalseRendererProps) => {
  return (
    <div className="space-y-3 pl-6 border-l-2 border-green-200">
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={question.correctAnswer === true}
            onChange={() =>
              updateQuestion(listeningId,question.id, "correctAnswer", true)
            }
            className="w-4 h-4"
          />
          <span>True</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={question.correctAnswer === false}
            onChange={() =>
              updateQuestion(listeningId,question.id, "correctAnswer", false)
            }
            className="w-4 h-4"
          />
          <span>False</span>
        </label>
      </div>
    </div>
  );
};

export default TrueFalseRenderer;
