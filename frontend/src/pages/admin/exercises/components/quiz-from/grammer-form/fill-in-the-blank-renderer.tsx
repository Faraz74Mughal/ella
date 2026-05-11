import { FormInput } from "@/components/ui/form-input";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

interface FillInTheBlankRendererProps {
  idx: number;
}

const FillInTheBlankRenderer = ({ idx }: FillInTheBlankRendererProps) => {
  const { formState, control, setValue, getValues } = useFormContext<ExerciseInput>();

  const alternativesInputValue = useWatch({
    control,
    name: `content.${idx}.alternativesInput`,
  });

  const alternativesArr: string[] =
    useWatch({ control, name: `content.${idx}.alternatives` }) || [];

  useEffect(() => {
    const current = getValues(`content.${idx}.alternativesInput` as const);
    const arr = getValues(`content.${idx}.alternatives` as const) || [];
    if (!current && Array.isArray(arr) && arr.length > 0) {
      setValue(`content.${idx}.alternativesInput`, arr.join(", "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const removeAlternative = (removeIndex: number) => {
    const newArr = alternativesArr.filter((_, i) => i !== removeIndex);
    setValue(`content.${idx}.alternatives`, newArr);
    setValue(`content.${idx}.alternativesInput`, newArr.join(", "));
  };
  return (
    <div className="space-y-3 pl-6 border-l-2 border-purple-200">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="space-y-1">
            <FormInput
              control={control}
              name={`content.[${idx}].correctAnswer`}
              label="Correct Answer"
              placeholder="Expected answer"
            />
          </div>
          <span className="text-xs  text-red-500">
            {Array.isArray(formState?.errors?.content) &&
              formState?.errors?.content?.[idx]?.correctAnswer?.message}
          </span>
        </div>
        <div className="space-y-1">
          <FormInput
            control={control}
            name={`content.${idx}.alternativesInput`}
            label="Alternative Answers (comma separated)"
            placeholder="synonym1, synonym2"
            onChange={(e) => {
              const value = e.target.value;

              // keep input string visible
              setValue(`content.${idx}.alternativesInput`, value);

              // create array separately
              const arr = value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

              setValue(`content.${idx}.alternatives`, arr);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = alternativesInputValue || getValues(`content.${idx}.alternativesInput` as const) || "";
                const arr = value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);
                setValue(`content.${idx}.alternatives`, arr);
                setValue(`content.${idx}.alternativesInput`, arr.join(", "));
              }
            }}
          />
          {Array.isArray(alternativesArr) && alternativesArr.length > 0 && (
            <div className="mt-1">
              <div className="flex flex-wrap gap-2">
                {alternativesArr.map((alt, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-gray-200 text-sm"
                  >
                    <span className="max-w-xs truncate">{alt}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${alt}`}
                      onClick={() => removeAlternative(i)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FillInTheBlankRenderer;
