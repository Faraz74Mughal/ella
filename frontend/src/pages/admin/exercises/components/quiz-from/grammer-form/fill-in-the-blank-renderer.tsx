import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubQuestion } from "@/types/grammar-question";

interface FillInTheBlankRendererProps {
  question: SubQuestion;
  updateQuestion: (
    questionId: string,
    field: keyof SubQuestion,
    value: any,
  ) => void;
}

const FillInTheBlankRenderer = ({
  question,
  
  updateQuestion,
}: FillInTheBlankRendererProps) => {
  return (
    <div className="space-y-3 pl-6 border-l-2 border-purple-200">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-sm">Correct Answer</Label>
          <Input
            value={question.correctAnswer as string}
            onChange={(e) =>
              updateQuestion(question.id, "correctAnswer", e.target.value)
            }
            placeholder="Expected answer"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm">
            Alternative Answers (comma separated)
          </Label>
          <Input
            value={question.alternatives?.join(", ") || ""}
            onChange={(e) =>
              updateQuestion(
                question.id,
                "alternatives",
                e.target.value.split(",").map((s) => s.trim()),
              )
            }
            placeholder="synonym1, synonym2"
          />
        </div>
      </div>
    </div>
  );
};

export default FillInTheBlankRenderer;
