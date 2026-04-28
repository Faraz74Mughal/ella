import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import type { FillBlankQuestion } from "@/types/grammar-question";
import { useFormContext } from "react-hook-form";

interface FillInTheBlankRendererProps {
  question: FillBlankQuestion;
  updateQuestion: (
    questionId: string,
    field: keyof FillBlankQuestion,
    value: any,
  ) => void;
  idx: number;
}

const FillInTheBlankRenderer = ({
  question,
  idx,
  updateQuestion,
}: FillInTheBlankRendererProps) => {
  const { formState } = useFormContext<ExerciseInput>();
  return (
    <div className="space-y-3 pl-6 border-l-2 border-purple-200">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="space-y-1">
            <Label className="text-sm">Correct Answer</Label>
            <Input
              value={question.correctAnswer as string}
              onChange={(e) => {
                if (question.type == "fill_blank") {
                  updateQuestion(question.id, "correctAnswer", e.target.value);
                }
              }}
              placeholder="Expected answer"
            />
          </div>
          <span className="text-xs  text-red-500">
            {Array.isArray(formState?.errors?.content) &&
              formState?.errors?.content?.[idx]?.correctAnswer?.message}
          </span>
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
        </div>{" "}
      </div>
    </div>
  );
};

export default FillInTheBlankRenderer;
