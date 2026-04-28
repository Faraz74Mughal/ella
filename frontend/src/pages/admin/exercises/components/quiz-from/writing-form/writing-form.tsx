import { FormInput } from "@/components/ui/form-input";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { useFormContext } from "react-hook-form";

const WritingForm = () => {
  const { control } = useFormContext<ExerciseInput>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-5">
      <FormInput
        control={control}
        label="Topic"
        name="content.topic"
        placeholder="Enter topic..."
      />
      <FormInput
        control={control}
        label="Time Limit (in minutes)"
        name="content.timeLimit"
        type="number"
        placeholder="Enter time limit..."
      />
      <FormInput
        control={control}
        label="Minimum Word"
        name="content.minimumWords"
        type="number"
        placeholder="Enter minimum word count..."
      />
      <FormInput
        control={control}
        label="Maximum Word"
        name="content.maximumWords"
        type="number"
        placeholder="Enter maximum word count..."
      />
    </div>
  );
};

export default WritingForm;
