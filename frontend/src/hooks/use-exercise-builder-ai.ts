import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  exerciseSchema,
  type ExerciseInput,
} from "@/lib/validations/admin/exercise.validation";
import { CATEGORY, VISIBILITY } from "@/constants/lesson.constant";
import type { IExercise } from "@/types/exercise";
import type {
  DialogueQuestion,
  ExerciseQuestion,
  FillBlankQuestion,
  FollowUpQuestion,
  ListeningQuestion,
  MatchingQuestion,
  MCQQuestion,
  TrueFalseQuestion,
} from "@/types/exercise-question";
import { generateId } from "@/utils/helpers";
import { optionsOfObject } from "@/utils/options";
import { useGetFilteredLessons } from "./use-lesson";
/* =====================================================
 TYPES
===================================================== */
type UseExerciseBuilderProps = {
  exercise?: IExercise | null;
};
/* =====================================================
 QUESTION TYPES
===================================================== */
export const QUESTION_TYPES = {
  MCQ: "mcq",
  MATCHING: "matching",
  FILL_BLANK: "fill_blank",
  TRUE_FALSE: "true_false",
  LISTENING: "listening",
  FOLLOW_UP: "follow_up",
  DIALOGUE: "dialogue",
} as const;
/* =====================================================
 DEFAULT QUESTION FACTORIES
===================================================== */
export const createMCQQuestion = (): MCQQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.MCQ,
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 1,
});
export const createFillBlankQuestion = (): FillBlankQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.FILL_BLANK,
  question: "",
  correctAnswer: "",
  alternatives: [],
  points: 1,
});
export const createMatchingQuestion = (): MatchingQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.MATCHING,
  pairs: [
    {
      id: generateId(),
      left: "",
      right: "",
    },
  ],
  shuffleOptions: false,
  points: 1,
});
export const createTrueFalseQuestion = (): TrueFalseQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.TRUE_FALSE,
  question: "",
  correctAnswer: false,
  points: 1,
});
export const createListeningQuestion = (): ListeningQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.LISTENING,
  file: null,
  transcript: "",
  points: 1,
  comprehensionQuestions: [createMCQQuestion()],
});
export const createFollowUpQuestion = (): FollowUpQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.FOLLOW_UP,
  question: "",
  expectedAnswer: "",
  points: 1,
});
export const createDialogueQuestion = (): DialogueQuestion => ({
  id: generateId(),
  type: QUESTION_TYPES.DIALOGUE,
  question: "",
  speaker: "",
  expectedAnswer: "",
  alternative: "",
  points: 1,
});
/* =====================================================
 HELPERS
===================================================== */
const createDefaultQuestion = (category?: string): ExerciseQuestion => {
  switch (category) {
    case CATEGORY.GRAMMAR:
      return createMCQQuestion();
    case CATEGORY.LISTENING:
      return createListeningQuestion();
    case CATEGORY.SPEAKING:
      return createFollowUpQuestion();
    default:
      return createMCQQuestion();
  }
};
const createDefaultExercise = (category?: string): ExerciseInput => ({
  lesson_id: "",
  title: "",
  category: category ?? "",
  level: "",
  visibility: VISIBILITY.PRIVATE,
  content: [createDefaultQuestion(category)],
  passing_percentage: 70,
  description: "",
});
/* =====================================================
 HOOK
===================================================== */
const useExerciseBuilder = ({ exercise }: UseExerciseBuilderProps) => {
  const form = useForm<z.input<typeof exerciseSchema>, unknown, ExerciseInput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: createDefaultExercise(),
  });
  const { control, reset, getValues, setValue } = form;
  /* =====================================================
 FIELD ARRAY
 ===================================================== */
  const {
    fields: questions,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "content",
  });
  /* =====================================================
 WATCHERS
 ===================================================== */
  const category = useWatch({
    control,
    name: "category",
  });
  const level = useWatch({
    control,
    name: "level",
  });
  const content = useWatch({
    control,
    name: "content",
  });
  /* =====================================================
 FILTERED LESSONS
 ===================================================== */
  const { data: filteredLessons } = useGetFilteredLessons({
    category,
    level,
  });
  /* =====================================================
 INITIALIZE EDIT DATA
 ===================================================== */
  useEffect(() => {
    if (!exercise) return;
    const ex: any = (exercise as any)?.exercise ?? exercise;
    const lessonId =
      typeof ex.lesson_id?._id === "string" ? ex.lesson_id._id : "";
    let contentData = Array.isArray(ex.content) ? [...ex.content] : [];
    contentData = contentData.map((item) => {
      if (item.type === QUESTION_TYPES.MCQ) {
        return {
          ...item,
          correctAnswer:
            item.options
              ?.findIndex((opt: string) => opt === item.correctAnswer)
              ?.toString() ?? "",
        };
      }
      return item;
    });
    reset({
      lesson_id: lessonId,
      title: ex.title ?? "",
      category: ex.category ?? "",
      level: ex.level ?? "",
      visibility: ex.visibility ?? VISIBILITY.PRIVATE,
      content: contentData,
      passing_percentage: ex.passing_percentage ?? 70,
      description: ex.description ?? "",
    });
  }, [exercise, reset]);
  /* =====================================================
 QUESTION ACTIONS
 ===================================================== */
  const addQuestion = () => {
    append(createDefaultQuestion(category));
  };
  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    remove(idx);
  };
  const changeQuestionType = (idx: number, type: string) => {
    switch (type) {
      case QUESTION_TYPES.MCQ:
        update(idx, createMCQQuestion());
        break;
      case QUESTION_TYPES.MATCHING:
        update(idx, createMatchingQuestion());
        break;
      case QUESTION_TYPES.FILL_BLANK:
        update(idx, createFillBlankQuestion());
        break;
      default:
        break;
    }
  };
  /* =====================================================
 MCQ OPTIONS
 ===================================================== */
  const addOption = (idx: number) => {
    const question = getValues(`content.${idx}`);
    if (question?.type !== QUESTION_TYPES.MCQ) return;
    setValue(`content.${idx}.options`, [...question.options, ""]);
  };
  const removeOption = (idx: number, optionIdx: number) => {
    const question = getValues(`content.${idx}`);
    if (question?.type !== QUESTION_TYPES.MCQ) return;
    if (question.options.length <= 2) return;
    setValue(
      `content.${idx}.options`,
      question.options.filter((_, i) => i !== optionIdx),
    );
  };
  /* =====================================================
 MATCHING PAIRS
 ===================================================== */
  const addPair = (idx: number) => {
    const question = getValues(`content.${idx}`);
    if (question?.type !== QUESTION_TYPES.MATCHING) return;
    setValue(`content.${idx}.pairs`, [
      ...question.pairs,
      {
        id: generateId(),
        left: "",
        right: "",
      },
    ]);
  };
  const removePair = (idx: number, pairIdx: number) => {
    const question = getValues(`content.${idx}`);

    if (question?.type !== QUESTION_TYPES.MATCHING) return;
    if (question.pairs.length <= 1) return;
    setValue(
      `content.${idx}.pairs`,
      question.pairs.filter((_, i) => i !== pairIdx),
    );
  };
  /* =====================================================
 OPTIONS
 ===================================================== */
  const grammarTypes = useMemo(
    () => [
      {
        value: QUESTION_TYPES.MCQ,
        label: "Multiple Choice",
      },
      {
        value: QUESTION_TYPES.MATCHING,
        label: "Matching",
      },
      {
        value: QUESTION_TYPES.FILL_BLANK,
        label: "Fill Blank",
      },
    ],
    [],
  );
  const optionsCategories = useMemo(() => optionsOfObject(CATEGORY), []);
  /* =====================================================
 RETURN
 ===================================================== */
  return {
    form,
    questions,
    content,
    category,
    level,
    filteredLessons,
    grammarTypes,
    optionsCategories,
    addQuestion,
    removeQuestion,
    changeQuestionType,
    addOption,
    removeOption,
    addPair,
    removePair,
  };
};
export default useExerciseBuilder;
