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
import { useEffect } from "react";

interface ExerciseFormProps {
  onSubmit: (values: ExerciseInput) => Promise<void>;
  isLoading: boolean;
  exercise?: IExercise | null | undefined;
}
const optionsCategories = optionsOfObject(CATEGORY);

const ExerciseForm = ({ onSubmit, isLoading, exercise }: ExerciseFormProps) => {
  // Form
  const form = useForm<z.input<typeof exerciseSchema>, unknown, ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      lesson_id: "",
      title: "",
      category: "",
      level: "",
      visibility: VISIBILITY.PRIVATE,
      content: [],
      passing_percentage: 70,
      description: "",
    },
  });
  const ready = !!exercise && optionsCategories.length > 0;
  useEffect(() => {
    if (!ready) return;

    const ex: any = (exercise as any)?.exercise ?? exercise;

    const lessonId =
      typeof ex.lesson_id?._id === "string" ? ex.lesson_id?._id : "";

    let content = Array.isArray(ex.content) ? [...ex.content] : [];
    if (Array.isArray(ex.content)) {
      content = content.map((cont) => {
        if (cont.type === "mcq") {
          return {
            ...cont,
            correctAnswer: cont.options
              ?.findIndex((opt: string) => opt === cont.correctAnswer)
              ?.toString(),
          };
        }
        return cont;
      });
    }
    form.reset({
      lesson_id: lessonId,
      title: ex.title ?? "",
      category: ex.category ?? "",
      level: ex.level ?? "",
      visibility: ex.visibility ?? VISIBILITY.PRIVATE,
      content: content,
      passing_percentage: ex.passing_percentage ?? 70,
      description: ex.description ?? "",
    });
  }, [ready]);
  const category = useWatch({ control: form.control, name: "category" });
  const level = useWatch({ control: form.control, name: "level" });

  const { data: filteredLessons } = useGetFilteredLessons({ category, level });

  // useEffect(() => {
  //   if (category || "") form.setValue("content", []);
  // }, [category, form.setValue]);
console.log("Form Errors", form.formState.errors);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* TOP SECTION */}
        <div>
          <SecondHeading title="Basic Information" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              key={`${category}-${exercise?._id}-`}
              control={form.control}
              label="Category"
              name="category"
              disabled={isLoading}
              placeholder="Select category"
              options={optionsCategories}
            />

            <FormSelect
              key={`${level}-${exercise?._id}`}
              control={form.control}
              label="Level"
              name="level"
              disabled={isLoading}
              placeholder="Select level"
              options={optionsOfObject(LEVEL)}
            />

            <FormSelect
              key={`${exercise?._id}-${filteredLessons?.length}`}
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

            {category === CATEGORY.GRAMMAR && <GrammarForm />}
            {category === CATEGORY.WRITING && <WritingForm />}
            {category === CATEGORY.SPEAKING && <SpeakingForm />}
            {category === CATEGORY.LISTENING && <ListeningForm />}
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
