// import AppSelect from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORY, LEVEL, VISIBILITY } from "@/constants/lesson.constant";
import { useGetFilteredLessons } from "@/hooks/use-lesson";
import {
  exerciseSchema,
  type ExerciseInput,
} from "@/lib/validations/admin/exercise.validation";
import type { IExercise } from "@/types/exercise";
import { options, optionsOfObject } from "@/utils/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GrammarForm from "./quiz-from/grammer-form/grammer-form";
import { FormTextarea } from "@/components/ui/form-textarea";
import SecondHeading from "@/components/shared/second-heading";
import WritingForm from "./quiz-from/writing-form/writing-form";
import SpeakingForm from "./quiz-from/speaking-form/speaking-form";
import ListeningForm from "./quiz-from/listening-form/listening-form";

interface ExerciseFormProps {
  onSubmit: (values: ExerciseInput) => Promise<void>;
  isLoading: boolean;
  exercise?: IExercise | null | undefined;
}

const ExerciseForm = ({ onSubmit, isLoading, exercise }: ExerciseFormProps) => {
  // Form
  const form = useForm<z.input<typeof exerciseSchema>, unknown, ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      lesson_id: "",
      title: "",
      visibility: VISIBILITY.PRIVATE,
      content: [],
      passing_percentage: 70,
    },
  });

  console.log("form", form.formState.errors);

  const { data: filteredLessons } = useGetFilteredLessons({
    category: form.watch("category"),
    level: form.watch("level"),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* TOP SECTION */}
        <div>
          <SecondHeading title="Basic Information" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              control={form.control}
              label="Category"
              name="category"
              disabled={isLoading}
              placeholder="Select category"
              options={optionsOfObject(CATEGORY)}
            />

            <FormSelect
              control={form.control}
              label="Level"
              name="level"
              disabled={isLoading}
              placeholder="Select level"
              options={optionsOfObject(LEVEL)}
            />

            <FormSelect
              control={form.control}
              label="Lesson"
              name="lesson_id"
              disabled={isLoading}
              placeholder="Select lesson"
              options={options(filteredLessons, "title", "_id")}
            />
          </div>
        </div>

        {form.watch("category") && (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 capitalize">
              <SecondHeading title={`${form.watch("category")} Quiz`} />
              <span className="text-xs  text-red-500">
                {" "}
                {form.formState?.errors?.content?.message && (
                  <>( {form.formState?.errors?.content?.message} )</>
                )}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="order-2 md:order-1">
                <FormInput
                  control={form.control}
                  label="Title"
                  name="title"
                  disabled={isLoading}
                  placeholder="Enter exercise title..."
                />
              </div>
              <div className="order-1 md:order-2">
                <FormInput
                  control={form.control}
                  label="Passing Percentage"
                  name="passing_percentage"
                  type="number"
                  disabled={isLoading}
                  placeholder="Enter passing percentage..."
                />
              </div>
              <div className="order-3 col-span-1 md:col-span-2">
                <FormTextarea
                  control={form.control}
                  label={
                    form.watch("category") == CATEGORY.WRITING
                      ? "Prompt"
                      : "Description"
                  }
                  name="description"
                  disabled={isLoading}
                  placeholder="Enter exercise description..."
                />
              </div>
            </div>
            {/* CONTENT SECTION */}
            {form.watch("category") === CATEGORY.GRAMMAR && <GrammarForm />}
            {form.watch("category") === CATEGORY.WRITING && <WritingForm />}
            {form.watch("category") === CATEGORY.SPEAKING && <SpeakingForm />}
            {form.watch("category") === CATEGORY.LISTENING && <ListeningForm />}
          </>
        )}
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
