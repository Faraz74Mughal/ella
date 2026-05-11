// import AppSelect from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
// visibility is a string enum; use a select instead of a checkbox
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORY, LEVEL, VISIBILITY } from "@/constants/lesson.constant";
import { type ExerciseInput } from "@/lib/validations/admin/exercise.validation";
import type { IExercise } from "@/types/exercise";
import { options, optionsOfObject } from "@/utils/options";
import { Loader2 } from "lucide-react";
import GrammarForm from "./quiz-from/grammer-form/grammer-form";
import { FormTextarea } from "@/components/ui/form-textarea";
import SecondHeading from "@/components/shared/second-heading";
import WritingForm from "./quiz-from/writing-form/writing-form";
import SpeakingForm from "./quiz-from/speaking-form/speaking-form";
import ListeningForm from "./quiz-from/listening-form/listening-form";
import useExerciseBuilder from "@/hooks/use-exercise-builder";

interface ExerciseFormProps {
  onSubmit: (values: ExerciseInput) => Promise<void>;
  isLoading: boolean;
  exercise?: IExercise | null | undefined;
}

const ExerciseForm = ({ onSubmit, isLoading, exercise }: ExerciseFormProps) => {
  const eb = useExerciseBuilder({
    exercise,
  });
console.log("ERROR:",eb.form.formState.errors);

  return (
    <Form {...eb.form}>
      <form onSubmit={eb.form.handleSubmit(onSubmit)} className="space-y-10">
        {/* TOP SECTION */}
        <div>
          <SecondHeading title="Basic Information" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              key={`${eb.category}-${exercise?._id}-`}
              control={eb.form.control}
              label="Category"
              name="category"
              disabled={isLoading}
              placeholder="Select category"
              options={eb.optionsCategories}
            />

            <FormSelect
              key={`${eb.level}-${exercise?._id}`}
              control={eb.form.control}
              label="Level"
              name="level"
              disabled={isLoading}
              placeholder="Select level"
              options={optionsOfObject(LEVEL)}
            />

            <FormSelect
              key={`${exercise?._id}-${eb.filteredLessons?.length}`}
              control={eb.form.control}
              label="Lesson"
              name="lesson_id"
              disabled={isLoading}
              placeholder="Select lesson"
              options={options(eb.filteredLessons, "title", "_id")}
            />
          </div>
        </div>

        {eb.category && (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 capitalize">
              <SecondHeading title={`${eb.category} Quiz`} />
              <span className="text-xs  text-red-500">
                {" "}
                {eb.form.formState?.errors?.content?.message && (
                  <>( {eb.form.formState?.errors?.content?.message} )</>
                )}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="order-2 md:order-1">
                <FormInput
                  control={eb.form.control}
                  label="Title"
                  name="title"
                  disabled={isLoading}
                  placeholder="Enter exercise title..."
                />
              </div>
              <div className="order-1 md:order-2">
                <FormInput
                  control={eb.form.control}
                  label="Passing Percentage"
                  name="passing_percentage"
                  type="number"
                  disabled={isLoading}
                  placeholder="Enter passing percentage..."
                />
              </div>
              <div className="order-3 col-span-1 md:col-span-2">
                <FormTextarea
                  control={eb.form.control}
                  label={
                    eb.form.watch("category") == CATEGORY.WRITING
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

            {eb.category === CATEGORY.GRAMMAR && <GrammarForm eb={eb} />}
            {eb.category === CATEGORY.WRITING && <WritingForm />}
            {eb.category === CATEGORY.SPEAKING && <SpeakingForm />}
            {eb.category === CATEGORY.LISTENING && <ListeningForm />}
          </>
        )}
        {/* PUBLISH SECTION */}
        <div className="flex items-center justify-between pt-4 border-t">
          <FormSelect
            control={eb.form.control}
            label="Visibility"
            name="visibility"
            disabled={isLoading}
            placeholder="Select visibility"
            options={optionsOfObject(VISIBILITY)}
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
