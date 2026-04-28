import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import type { MatchingQuestion } from "@/types/grammar-question";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface MatchingRendererProps {
  question: MatchingQuestion;
  addPair: (questionId: string) => void;
  updatePair: (
    questionId: string,
    pairId: string,
    field: "left" | "right",
    value: string,
  ) => void;
  removePair: (questionId: string, pairId: string) => void;
  updateQuestion: (
    questionId: string,
    field: keyof MatchingQuestion,
    value: any,
  ) => void;
  idx: number;
}

const MatchingRenderer = ({
  question,
  addPair,
  updatePair,
  removePair,
  updateQuestion,
  idx,
}: MatchingRendererProps) => {
  const { formState } = useFormContext<ExerciseInput>();
  return (
    <div className="space-y-4 pl-6 border-l-2 border-orange-200">
      {/* Shuffle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={question.shuffleOptions || false}
          onChange={(e) =>
            updateQuestion(question.id, "shuffleOptions", e.target.checked)
          }
        />
        <Label className="text-sm">Shuffle right column</Label>
      </div>

      {/* Pairs */}
      {question.pairs?.map((pair, index) => (
        <div key={pair.id}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={pair.left}
              onChange={(e) => {
                if (question.type == "matching" && pair.id)
                  updatePair(question.id, pair.id, "left", e.target.value);
              }}
              placeholder={`Left ${index + 1}`}
            />
            <div className="flex gap-2">
              <Input
                value={pair.right}
                onChange={(e) => {
                  if (question.type == "matching" && pair.id)
                    updatePair(question.id, pair.id, "right", e.target.value);
                }}
                placeholder={`Right ${index + 1}`}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (question.type == "matching" && pair.id)
                    removePair(question.id, pair.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <span className="text-xs  text-red-500">
              {Array.isArray(formState?.errors?.content) &&
                formState?.errors?.content?.[idx]?.pairs?.[index]?.left
                  ?.message}
            </span>
            <span className="text-xs  text-red-500">
              {Array.isArray(formState?.errors?.content) &&
                formState?.errors?.content?.[idx]?.pairs?.[index]?.right
                  ?.message}
            </span>
          </div>
        </div>
      ))}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => addPair(question.id)}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Pair
      </Button>
    </div>
  );
};

export default MatchingRenderer;
