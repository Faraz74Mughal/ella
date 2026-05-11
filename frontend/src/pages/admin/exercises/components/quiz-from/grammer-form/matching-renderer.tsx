import { Button } from "@/components/ui/button";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormInput } from "@/components/ui/form-input";
import type useExerciseBuilder from "@/hooks/use-exercise-builder";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import type { MatchingQuestion } from "@/types/grammar-question";
import { Plus, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

interface MatchingRendererProps {
  question: MatchingQuestion;
  eb: ReturnType<typeof useExerciseBuilder>;
  idx: number;
}

const MatchingRenderer = ({ question, idx, eb }: MatchingRendererProps) => {
  const { formState, control } = useFormContext<ExerciseInput>();
  const liveQuestion = useWatch({
    control,
    name: `content.${idx}`,
  }) as MatchingQuestion | undefined;

  const currentQuestion = liveQuestion ?? question;
  const pairs = currentQuestion.pairs ?? [];
  return (
    <div className="space-y-4 pl-6 border-l-2 border-orange-200">
      {/* Shuffle */}
      <FormCheckbox
        control={control}
        label="Shuffle right column"
        name={`content.[${idx}].shuffleOptions`}
      />
      {/* <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={question.shuffleOptions || false}
          onChange={(e) =>
            updateQuestion(question.id, "shuffleOptions", e.target.checked)
          }
        />
        <Label className="text-sm">Shuffle right column</Label>
      </div> */}
      {/* Pairs */}
      {pairs.map((pair, index) => (
        <div key={index}>
          <div className="grid grid-cols-2 gap-3">
            {/* <Input
              value={pair.left}
              onChange={(e) => {
                if (question.type == "matching" && pair.id)
                  updatePair(question.id, pair.id, "left", e.target.value);
              }}
              placeholder={`Left ${index + 1}`}
            /> */}
            <FormInput
              control={control}
              name={`content.[${idx}].pairs.[${index}].left`}
              placeholder={`Left ${index + 1}`}
            />
            <div className="flex  gap-2">
              <FormInput
                itemClassName="flex-1"
                control={control}
                name={`content.[${idx}].pairs.[${index}].right`}
                placeholder={`Right ${index + 1}`}
              />

              {currentQuestion.type === "matching" && pairs.length > 2 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    eb.removePair(idx, index);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
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
        onClick={() => eb.addPair(idx)}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Pair
      </Button>
    </div>
  );
};

export default MatchingRenderer;
