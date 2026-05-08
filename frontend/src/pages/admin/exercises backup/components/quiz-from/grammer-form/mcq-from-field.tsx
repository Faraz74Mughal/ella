import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";

const McqFromField = ({ idx, question, removeOption }: { idx: number; question: any; removeOption: any }) => {
  const { formState, control } = useFormContext<ExerciseInput>();
  return (
    <FormField
      control={control}
      name={`content.${idx}.correctAnswer`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              value={field.value as string ?? ""}
              onValueChange={field.onChange}
              className="space-y-2"
            >
              {question.options?.map((opt: string, optIdx: number) => (
                <div key={optIdx}>
                  <div className="flex gap-2 items-center">
                    <RadioGroupItem
                      value={opt.toString()}
                      id={`content-${idx}-${optIdx}`}
                    />

                    <FormInput
                      itemClassName="flex-1"
                      control={control}
                      name={`content.${idx}.options.${optIdx}`}
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

                  <span className="text-xs ml-6 text-red-500">
                    {Array.isArray(formState?.errors?.content) &&
                      formState?.errors?.content?.[idx]?.options?.[optIdx]
                        ?.message}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default McqFromField;
