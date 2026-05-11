import { CATEGORY, VISIBILITY } from "@/constants/lesson.constant";
import {
  exerciseSchema,
  type ExerciseInput,
} from "@/lib/validations/admin/exercise.validation";
import type { IExercise } from "@/types/exercise";
import type {
  ExerciseQuestion,
  FollowUpQuestion,
  ListeningQuestion,
  MCQQuestion,
  WritingQuestion,
} from "@/types/exercise-question";
import { generateId } from "@/utils/helpers";
import { optionsOfObject } from "@/utils/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useGetFilteredLessons } from "./use-lesson";

// Type of hook

type ExerciseBuilderProps = {
  exercise?: IExercise | null;
  value?: ExerciseQuestion[];
  onChange?: (val: ExerciseQuestion[]) => void;
  category?: string;
  contentIdx?: number;
};

const grammarTypes = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "matching", label: "Match the following" },
  { value: "fill_blank", label: "Fill in the Blank" },
];

// Default content generators

const defaultMCQQuestion: MCQQuestion = {
  id: generateId(),
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: null as any,
  points: 1,
};

const defaultListeningQuestion: ListeningQuestion = {
  id: generateId(),
  type: "listening",
  file: null,
  transcript: "",
  points: 1,
  comprehensionQuestions: [
    { ...defaultMCQQuestion, parentType: "listening" } as any,
  ],
};

const defaultFollowUpQuestion: FollowUpQuestion = {
  id: generateId(),
  type: "follow_up",
  question: "",
  expectedAnswer: "",
  points: 1,
};

const defaultWritingQuestion = (): WritingQuestion => ({
  id: generateId(),
  type: "writing",
  topic: "",
  timeLimit: 1,
  minimumWords: 1,
  maximumWords: 1,
  points: 1,
});

const defaultQuestion = (category: string): any => {
  switch (category) {
    case CATEGORY.GRAMMAR:
      return defaultMCQQuestion;
    case CATEGORY.LISTENING:
      return defaultListeningQuestion;
    case CATEGORY.SPEAKING:
      return defaultFollowUpQuestion;
    default:
      return defaultMCQQuestion;
  }
};

const optionsCategories = optionsOfObject(CATEGORY);

// Default exercise generators

const defaultExercise = (category: string): ExerciseInput => ({
  lesson_id: "",
  title: "",
  category: "",
  level: "",
  visibility: VISIBILITY.PRIVATE,
  content: [defaultQuestion(category ?? "")],
  passing_percentage: 70,
  description: "",
});

// Hook

const useExerciseBuilder = ({
  exercise,
  category,
  contentIdx = 0,
}: ExerciseBuilderProps) => {
  const form = useForm<z.input<typeof exerciseSchema>, unknown, ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: defaultExercise(category ?? ""),
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
  }, [ready, exercise, form]);

  const categoryChange = useWatch({ control: form.control, name: "category" });
  const level = useWatch({ control: form.control, name: "level" });
  const content = useWatch({ control: form.control, name: "content" });
  const previousCategoryRef = useRef<string | undefined>(undefined);

  const { data: filteredLessons } = useGetFilteredLessons({
    category: categoryChange,
    level,
  });

  useEffect(() => {
    if (!categoryChange) return;
    if (previousCategoryRef.current === categoryChange) return;

    previousCategoryRef.current = categoryChange;

    const currentContent = form.getValues("content");
    const firstContentType = Array.isArray(currentContent)
      ? currentContent[0]?.type
      : undefined;

    if (categoryChange === CATEGORY.WRITING) {
      if (firstContentType !== "writing") {
        form.setValue("content", [defaultWritingQuestion()] as any);
      }
      return;
    }

    if (categoryChange === CATEGORY.LISTENING) {
      if (firstContentType !== "listening") {
        form.setValue("content", [defaultListeningQuestion] as any);
      }
      return;
    }

    if (categoryChange === CATEGORY.SPEAKING) {
      if (firstContentType !== "follow_up") {
        form.setValue("content", [defaultFollowUpQuestion] as any);
      }
      return;
    }

    if (categoryChange === CATEGORY.GRAMMAR) {
      const grammarTypes = ["mcq", "matching", "fill_blank"];
      if (!grammarTypes.includes(firstContentType || "")) {
        form.setValue("content", [defaultMCQQuestion] as any);
      }
    }
  }, [categoryChange, form]);

  const type = useWatch({
    control: form.control,
    name: `content.${contentIdx}.type`,
  });
  const previousTypesRef = useRef<Record<string, string | undefined>>({});
  useEffect(() => {
    const currentContent = form.getValues("content");
    if (!Array.isArray(currentContent)) return;

    currentContent.forEach((question, index) => {
      const questionId = question?.id;
      const currentType = question?.type;
      if (!questionId || !currentType) return;

      const previousType = previousTypesRef.current[questionId];

      if (previousType === undefined) {
        previousTypesRef.current[questionId] = currentType;
        return;
      }

      if (previousType === currentType) return;

      if (currentType === "mcq") {
        form.setValue(`content.${index}.id`, generateId());
        form.setValue(`content.${index}.question`, "");
        form.setValue(`content.${index}.options`, ["sssss", "", "", ""]);
        form.setValue(`content.${index}.correctAnswer`, "");
        form.setValue(`content.${index}.points`, 1);
      }

      if (currentType === "matching") {
        form.setValue(`content.${index}.id`, generateId());
        form.setValue(`content.${index}.pairs`, [
          { id: generateId(), left: "", right: "" },
          { id: generateId(), left: "", right: "" },
        ]);
        form.setValue(`content.${index}.points`, 1);
      }

      if (currentType === "fill_blank") {
        form.setValue(`content.${index}.id`, generateId());
        form.setValue(`content.${index}.question`, "");
        form.setValue(`content.${index}.correctAnswer`, "");
        form.setValue(`content.${index}.alternatives`, []);
        form.setValue(`content.${index}.alternativesInput`, "");
        form.setValue(`content.${index}.points`, 1);
      }

      previousTypesRef.current[questionId] = currentType;
    });

    previousTypesRef.current = currentContent.reduce<Record<string, string | undefined>>(
      (acc, question) => {
        if (question?.id) {
          acc[question.id] = question.type;
        }
        return acc;
      },
      {},
    );
  }, [form, content]);

  const {
    fields: questions,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: "content",
    keyName: "fieldId",
  });

  const addQuestion = () => {
    append(defaultQuestion(category ?? ""));
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    remove(idx);
  };
  // ------------------------
  // MCQ OPTIONS
  // ------------------------

  const addOption = (questionIndex: number) => {
    const question = form.getValues(`content.${questionIndex}`);

    if (question.type !== "mcq") return;
    if (question.options.length >= 4) return;
    const newOptions = [...question.options, ""];
    update(questionIndex, {
      ...question,
      options: newOptions,
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = form.getValues(`content.${questionIndex}`);
    if (question.type !== "mcq") return;
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    update(questionIndex, {
      ...question,
      options: newOptions,
    });
  };

  // ------------------------
  // MATCHING
  // ------------------------

  const addPair = (questionIndex: number) => {
    const question = form.getValues(`content.${questionIndex}`);

    if (question.type !== "matching") return;
    // if (question.pairs.length >= 4) return;
    const newPairs = [
      ...question.pairs,
      { id: generateId(), left: "", right: "" },
    ];
    update(questionIndex, {
      ...question,
      pairs: newPairs,
    });
  };

  const removePair = (questionIndex: number, pairIndex: number) => {
    
    const question = form.getValues(`content.${questionIndex}`);
    if (question.type !== "matching") return;
    if (question.pairs.length <= 2) return;
    const newPairs = question.pairs.filter((_, i) => i !== pairIndex);
    update(questionIndex, {
      ...question,
      pairs: newPairs,
    });
  };

  return {
    form,
    questions,
    category: categoryChange,
    level,
    content,
    filteredLessons,
    optionsCategories,
    grammarTypes,
    type,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    addPair,
    removePair,
  };
};

export default useExerciseBuilder;
