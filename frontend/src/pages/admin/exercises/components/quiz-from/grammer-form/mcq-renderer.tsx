import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubQuestion } from "@/types/grammar-question";
import {  Plus, XCircle } from "lucide-react";

interface MCQRendererProps {
  question: SubQuestion;
  updateOption: (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => void;
  removeOption: (questionId: string, optionIndex: number) => void;
  addOption: (questionId: string) => void;
  updateQuestion: (
    questionId: string,
    field: keyof SubQuestion,
    value: any,
  ) => void;
}

const MCQRenderer = ({
  question,
  updateOption,
  removeOption,
  addOption,
  updateQuestion,
}: MCQRendererProps) => {
  return (
    // <div className="space-y-2">
    //   {question.options?.map((opt, i) => (
    //     <div key={i} className="flex gap-2">
    //       <input
    //         type="radio"
    //         checked={question.correctAnswer === opt}
    //         onChange={() =>
    //           updateQuestion(question.id, "correctAnswer", opt)
    //         }
    //       />
    //       <Input
    //         value={opt}
    //         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    //           updateOption(question.id, i, e.target.value)
    //         }
    //       />
    //       <Button onClick={() => removeOption(question.id, i)}>
    //         <Trash2 />
    //       </Button>
    //     </div>
    //   ))}

    //   <Button onClick={() => addOption(question.id)}>
    //     <Plus /> Add
    //   </Button>
    // </div>
    <div className="space-y-3 pl-6 border-l-2 border-blue-200">
      <Label className="text-sm font-medium">Options</Label>
      {question.options?.map((opt, optIdx) => (
        <div key={optIdx} className="flex gap-2 items-center">
          <input
            type="radio"
            name={`correct-${question.id}`}
            checked={question.correctAnswer === opt}
            onChange={() =>
              updateQuestion(question.id, "correctAnswer", opt)
            }
            className="w-4 h-4"
          />
          <Input
            value={opt}
            onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
            className="flex-1"
          />
          {question.options && question.options.length > 2 && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeOption(question.id, optIdx)}
              className="text-red-500"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      {question.options && question.options.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addOption(question.id)}
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
