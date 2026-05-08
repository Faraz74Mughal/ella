import { FormInput } from "@/components/ui/form-input";
import type { ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import { useFormContext } from "react-hook-form";

const WritingForm = () => {
  const { control,register } = useFormContext<ExerciseInput>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-5">
    
      <input 
        type="hidden"
        value={"writing"}
        {...register("content.0.type")}
      />
     
      <FormInput
        control={control}
        label="Topic"
        name="content.0.topic"
        placeholder="Enter topic..."
      />
      <FormInput
        control={control}
        label="Points"
        name="content.0.points"
        type="number"
        placeholder="Enter points..."
      />
      <FormInput
        control={control}
        label="Time Limit (in minutes)"
        name="content.0.timeLimit"
        type="number"
        placeholder="Enter time limit..."
      />
      <FormInput
        control={control}
        label="Minimum Word"
        name="content.0.minimumWords"
        type="number"
        placeholder="Enter minimum word count..."
      />
      <FormInput
        control={control}
        label="Maximum Word"
        name="content.0.maximumWords"
        type="number"
        placeholder="Enter maximum word count..."
      />
    </div>
  );
};

export default WritingForm;
