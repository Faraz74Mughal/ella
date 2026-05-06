// import AppSelect from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
// visibility is a string enum; use a select instead of a checkbox
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
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import GrammarForm from "./quiz-from/grammer-form/grammer-form";
import { FormTextarea } from "@/components/ui/form-textarea";
import SecondHeading from "@/components/shared/second-heading";
import WritingForm from "./quiz-from/writing-form/writing-form";
import SpeakingForm from "./quiz-from/speaking-form/speaking-form";
import ListeningForm from "./quiz-from/listening-form/listening-form";
import {  useEffect, useRef } from "react";
import { useQuestionBuilder } from "@/hooks/use-grammar-question-builder";

interface ExerciseFormProps {
  onSubmit: (values: ExerciseInput) => Promise<void>;
  isLoading: boolean;
  exercise?: IExercise | null | undefined;
}

const ExerciseForm = ({ onSubmit, isLoading, exercise }: ExerciseFormProps) => {
  const {normalizeContent,questions} = useQuestionBuilder({value: exercise?.content})
  // Form
  const form = useForm<z.input<typeof exerciseSchema>, unknown, ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues:exercise?{...exercise,lesson_id: exercise.lesson_id?._id || "",content:normalizeContent(exercise.content || [])}: {
      lesson_id: "",
      title: "",
      visibility: VISIBILITY.PRIVATE,
      content: [],
      passing_percentage: 70,
      description: "",
    },
  });

  const category = useWatch({ control: form.control, name: "category" });
  const level = useWatch({ control: form.control, name: "level" });

  const { data: filteredLessons } = useGetFilteredLessons({ category, level });
  const optionsCategories = optionsOfObject(CATEGORY);
console.log("exercise form render", exercise?.content,questions );

  // useEffect(() => {
  //   if (!exercise) return;
  //   console.log("exercise2222", exercise);
  //   const values = {
  //     lesson_id: exercise.lesson_id?._id || "",
  //     title: exercise.title || "",
  //     category: exercise.category || "grammar",
  //     level: exercise.level || "",
  //     visibility: exercise.visibility || VISIBILITY.PRIVATE,
  //     content: exercise.content || [],
  //     passing_percentage: exercise.passing_percentage || 70,
  //     description: exercise.description || "",
  //     points: exercise.points || 0,
  //   };

  //   form.reset(values);
  //   console.log("RESET VALUES:", form.getValues());
  // }, [exercise, form]);

  const prevCategoryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevCategoryRef.current && prevCategoryRef.current !== category) {
      form.setValue("content", []);
    }
    prevCategoryRef.current = category;
  }, [category, form]);

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
              options={optionsCategories}
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

        {category && (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 capitalize">
              <SecondHeading title={`${category} Quiz`} />
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
          <FormSelect
            control={form.control}
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
