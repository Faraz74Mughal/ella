import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormField } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";

import { Plus, XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import useExerciseBuilder from "@/hooks/use-exercise-builder";
import type { MCQQuestion } from "@/types/exercise-question";

interface MCQRendererProps {
  idx: number;
  question: MCQQuestion;
  eb: ReturnType<typeof useExerciseBuilder>;
}

const MCQRenderer = ({ idx, question, eb }: MCQRendererProps) => {
  return (
    <div className="space-y-3 pl-6 border-l-2 border-blue-200">
      <Label className="text-sm font-medium">
        Options
        {(
          eb.form.formState?.errors?.content?.[idx] as { correctAnswer: string }
        )?.correctAnswer && (
          <span className="text-xs ml-6 text-red-500">
            (
            {Array.isArray(eb.form.formState?.errors?.content) &&
              eb.form.formState?.errors?.content?.[idx]?.correctAnswer?.message}
            )
          </span>
        )}
      </Label>

      <FormField
        control={eb.form.control}
        name={`content.${idx}.correctAnswer`}
        render={({ field }) => (
          <RadioGroup
            value={field.value ? String(field.value) : ""}
            onValueChange={field.onChange}
          >
            {question.options?.map((opt, optIdx) => (
              <div key={optIdx} className="space-y-2 mb-3">
                <div className="flex gap-2 items-center">
                  <RadioGroupItem
                    value={optIdx?.toString()}
                    id={`option-${idx}-${optIdx}`}
                  />
                  <FormInput
                    itemClassName="flex-1"
                    control={eb.form.control}
                    name={`content.${idx}.options.${optIdx}`}
                  />
                  {question.options && question.options.length > 2 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => eb.removeOption(idx, optIdx)}
                      className="text-red-500"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <span className="text-xs ml-6 text-red-500">
                  {Array.isArray(eb.form.formState?.errors?.content) &&
                    eb.form.formState?.errors?.content?.[idx]?.options?.[optIdx]
                      ?.message}
                </span>
              </div>
            ))}
          </RadioGroup>
        )}
      />
      {question.options && question.options.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => eb.addOption(idx )}
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
