// import AppSelect from "@/components/ui/app-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormCheckbox } from "@/components/ui/form-checkbox";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { CATEGORY, LEVEL, VISIBILITY } from "@/constants/lesson.constant";
import {
  useExerciseTypeOptions,
  useGetFilteredLessons,
} from "@/hooks/use-lesson";
import {
  exerciseSchema,
  type ExerciseInput,
} from "@/lib/validations/admin/exercise.validation";
import type { IExercise } from "@/types/exercise";
import { options, optionsOfObject } from "@/utils/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import McqForm from "./quiz-from/mcq-form/mcq-form";
import FillBlankForm from "./quiz-from/fill-in-the-blank-form/fill-in-the-blank-form";
import MatchingForm from "./quiz-from/matching-form/matching-form";
import UnifiedQuestionBank from "./result";
import ExerciseTypeTabs from "./exercise-type-selector";
import SpeechRecognitionForm from "./quiz-from/speech-recognition-form/speech-recognition-form";
import DialogueForm from "./quiz-from/dialogue-form/dialogue-form";
import WritingPracticeForm from "./quiz-from/eassy-form/eassy-form";
import FollowUpForm from "./quiz-from/follow-up-form/follow-up-form";
import VideoScenariosForm from "./quiz-from/video-scenarios-form/video-scenarios-form";

interface ExerciseFormProps {
  onSubmit: (values: ExerciseInput) => Promise<void>;
  isLoading: boolean;
  exercise?: IExercise | null | undefined;
}

const ExerciseForm = ({ onSubmit, isLoading, exercise }: ExerciseFormProps) => {
  // Form
  const form = useForm<ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      lesson_id: "",
      title: "",
      visibility: VISIBILITY.PRIVATE,
      // type: "",
      content: null,
      points: 0,
      passing_percentage: 0,
    },
  });

  // const [selectedValue, setSelectedValue] = useState<IFilteredLessonOptions>({
  //   category: "",
  //   level: "",
  // });
  const [selectedExerciseType, setSelectedExerciseType] = useState<string>(""); // For exercise type selection
  const { data: filteredLessons } = useGetFilteredLessons({
    category: form.watch("category"),
    level: form.watch("level"),
  });
  const exerciseTypeOptions = useExerciseTypeOptions(form.watch("category"));
  const [content, setContent] = useState<any[]>([]);
  useEffect(() => {
    if (exerciseTypeOptions.length > 0) {
      setSelectedExerciseType(exerciseTypeOptions[0].value);
    }
  }, [exerciseTypeOptions]);

  // const handleSelect = (
  //   value: string,
  //   name: keyof IFilteredLessonOptions,
  // ): void => {
  //   setSelectedValue((prev) => ({ ...prev, [name]: value }));
  // };

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

            {/* <AppSelect
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
            /> */}

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

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormSelect
              control={form.control}
              label="Exercise Type"
              name="type"
              disabled={isLoading}
              placeholder="Select type"
              options={exerciseTypeOptions || []}
            />
          </div> */}
          {/* <ExerciseFormT
            onSubmit={onSubmit}
            isLoading={isLoading}
            exercise={exercise}
          /> */}
          {console.log(
            "form.watch('category')===CATEGORY.GRAMMAR",
            form.watch("category"),
            CATEGORY.GRAMMAR,
          )}

          {console.log("exerciseTypeOptions", exerciseTypeOptions)}
          <ExerciseTypeTabs
            exerciseTypeOptions={exerciseTypeOptions || []}
            value={selectedExerciseType}
            onValueChange={setSelectedExerciseType}
          />
          {/* {console.log("selectedExerciseType", selectedExerciseType)} */}
          <div className="my-4 border rounded-lg">
            {form.watch("category") === CATEGORY.GRAMMAR &&
              selectedExerciseType === exerciseTypeOptions[0]?.value && (
                <McqForm setContent={setContent} />
              )}
            {form.watch("category") === CATEGORY.GRAMMAR &&
              selectedExerciseType === exerciseTypeOptions[1]?.value && (
                <FillBlankForm setContent={setContent} />
              )}
            {form.watch("category") === CATEGORY.GRAMMAR &&
              selectedExerciseType === exerciseTypeOptions[2]?.value && (
                <MatchingForm setContent={setContent} />
              )}
            {form.watch("category") === CATEGORY.SPEAKING &&
              selectedExerciseType === exerciseTypeOptions[0]?.value && (
                <SpeechRecognitionForm />
              )}
            {form.watch("category") === CATEGORY.SPEAKING &&
              selectedExerciseType === exerciseTypeOptions[1]?.value && (
                <DialogueForm />
              )}
            {selectedExerciseType === exerciseTypeOptions[0]?.value &&
              form.watch("category") === CATEGORY.WRITING && (
                <WritingPracticeForm />
              )}
            {selectedExerciseType === exerciseTypeOptions[0]?.value &&
              form.watch("category") === CATEGORY.LISTENING && <FollowUpForm />}
            {selectedExerciseType === exerciseTypeOptions[1]?.value &&
              form.watch("category") === CATEGORY.LISTENING &&<VideoScenariosForm />}
          </div>
          {/* <McqForm />

          <FillBlankForm />
          <MatchingForm />*/}
          <UnifiedQuestionBank
            content={content || []}
            setContent={setContent}
          />
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
