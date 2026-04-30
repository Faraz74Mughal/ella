import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import type { MCQQuestion } from "@/types/grammar-question";
import { Plus, XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface MCQRendererProps {
  question: MCQQuestion;
  listeningId: string;
  updateOption: (
    listeningId: string,
    questionId: string,
    optionIndex: number,
    value: string,
  ) => void;
  removeOption: (listeningId: string, questionId: string, optionIndex: number) => void;
  addOption: (listeningId: string, questionId: string) => void;
  updateQuestion: (
    listeningId: string,
    questionId: string,
    field: keyof MCQQuestion,
    value: any,
  ) => void;
  idx: number;
}

const MCQRenderer = ({
  question,
  listeningId,
  updateOption,
  removeOption,
  addOption,
  updateQuestion,
  idx,
}: MCQRendererProps) => {
  console.log("question", question);

  const { formState } = useFormContext<ExerciseInput>();
  return (
    <div className="space-y-3 pl-6 border-l-2 border-blue-200">
      <Label className="text-sm font-medium">
        Options
        {(formState?.errors?.content?.[idx] as { correctAnswer: string })
          ?.correctAnswer && (
          <span className="text-xs ml-6 text-red-500">
            (
            {Array.isArray(formState?.errors?.content) &&
              formState?.errors?.content?.[idx]?.correctAnswer?.message}
            )
          </span>
        )}
      </Label>
      {question.options?.map((opt, optIdx) => (
        <div key={optIdx}>
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              name={`correct-${question.id}`}
              checked={question.correctAnswer === opt}
              onChange={() =>
                updateQuestion(listeningId, question.id, "correctAnswer", opt)
              }
              className="w-4 h-4"
            />
            <Input
              value={opt}
              onChange={(e) =>
                updateOption(listeningId, question.id, optIdx, e.target.value)
              }
              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
              className="flex-1"
            />
            {question.options && question.options.length > 2 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeOption(listeningId, question.id, optIdx)}
                className="text-red-500"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>

          <span className="text-xs ml-6 text-red-500">
            {Array.isArray(formState?.errors?.content) &&
              formState?.errors?.content?.[idx]?.options?.[optIdx]?.message}
          </span>
        </div>
      ))}
      {question.options && question.options.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addOption(listeningId,question.id)}
          className="mt-2"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Option
        </Button>
      )}
    </div>
  );
};

export default MCQRenderer;
