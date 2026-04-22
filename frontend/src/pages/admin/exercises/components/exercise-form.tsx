import AppSelect from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import {
  CATEGORY,
  LEVEL,
  VISIBILITY,
} from "@/constants/lesson.constant";
import {
  useExerciseTypeOptions,
  useGetFilteredLessons,
} from "@/hooks/use-lesson";
import {
  exerciseSchema,
  type ExerciseInput,
} from "@/lib/validations/admin/exercise.validation";
import type { IExercise } from "@/types/exercise";
import type { IFilteredLessonOptions } from "@/types/lesson";
import { options, optionsOfObject } from "@/utils/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import McqForm from "./mcq-form";

interface ExerciseFormProps {
  onSubmit: (values: ExerciseInput) => Promise<void>;
  isLoading: boolean;
  exercise?: IExercise | null | undefined;
}

const ExerciseForm = ({ onSubmit, isLoading, exercise }: ExerciseFormProps) => {
  const [selectedValue, setSelectedValue] = useState<IFilteredLessonOptions>({
    category: "",
    level: "",
  });
  const { data: filteredLessons } = useGetFilteredLessons(selectedValue);
  const exerciseTypeOptions = useExerciseTypeOptions(selectedValue.category);
  const form = useForm<ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      lesson_id: "",
      title: "",
      visibility: VISIBILITY.PRIVATE,
      type: "",
      content: null,
      points: 0,
      passing_percentage: 0,
    },
  });

  const handleSelect = (
    value: string,
    name: keyof IFilteredLessonOptions,
  ): void => {
    setSelectedValue((prev) => ({ ...prev, [name]: value }));
  };

  // useEffect(() => {
  //   if (exercise) {
  //     form.reset({
  //       title: exercise.title || "",
  //       lesson_id: exercise.level || "",
  //       category: exercise.category || "",
  //       study_material: {
  //         content: exercise.study_material?.content || "",
  //         material_type: exercise.study_material?.material_type || "",
  //       },
  //       is_published: exercise.is_published || false,
  //     });
  //   }
  // }, [exercise, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* TOP SECTION */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              control={form.control}
              label="Title"
              name="title"
              disabled={isLoading}
              placeholder="Enter exercise title..."
            />

            <AppSelect
              label="Category"
              className="w-full h-10!"
              options={optionsOfObject(CATEGORY)}
              onChange={(value) => handleSelect(value as string, "category")}
              placeholder="Select category"
              value={selectedValue.category}
            />

            <AppSelect
              label="Level"
              options={optionsOfObject(LEVEL)}
              className="w-full! h-10!"
              onChange={(value) => handleSelect(value as string, "level")}
              placeholder="Select level"
              value={selectedValue.level}
            />

            <FormSelect
              control={form.control}
              label="Lesson"
              name="lesson_id"
              disabled={isLoading}
              placeholder="Select lesson"
              options={options(filteredLessons, "title", "_id")}
            />

            <FormInput
              control={form.control}
              label="Points"
              name="points"
              type="number"
              disabled={isLoading}
              placeholder="Enter exercise points..."
            />

            <FormInput
              control={form.control}
              label="Passing Percentage"
              name="passing_percentage"
              type="number"
              disabled={isLoading}
              placeholder="Enter passing percentage..."
            />
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">
            Exercise Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              control={form.control}
              label="Exercise Type"
              name="type"
              disabled={isLoading}
              placeholder="Select type"
              options={exerciseTypeOptions || []}
            />
          </div>

<McqForm/>
          

          {/* <div className="mt-6">
            {materialType === "audio" || materialType === "video" ? (
              <FormMedia
                control={form.control}
                label="Media Content"
                name="study_material.content"
                type={(materialType as MediaType) || "image"}
              />
            ) : (
              <FormTextarea
                control={form.control}
                label="Content"
                name="study_material.content"
                disabled={isLoading}
                rows={12}
              />
            )}
          </div> */}
        </div>

        {/* PUBLISH SECTION */}
        <div className="flex items-center justify-between pt-4 border-t">
          <FormCheckbox
            control={form.control}
            label="Visibility"
            name="visibility"
            disabled={isLoading}
          />

          <Button type="submit" disabled={isLoading} className="px-6">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {exercise ? "Update exercise" : "Create exercise"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExerciseForm;
