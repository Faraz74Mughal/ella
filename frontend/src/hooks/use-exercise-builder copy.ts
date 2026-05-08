import { CATEGORY, VISIBILITY } from "@/constants/lesson.constant";
import {
  exerciseSchema,
  type ExerciseInput,
} from "@/lib/validations/admin/exercise.validation";
import type { IExercise } from "@/types/exercise";
import type {
  DialogueQuestion,
  ExerciseQuestion,
  FollowUpQuestion,
  ListeningQuestion,
  MCQQuestion,
} from "@/types/exercise-question";
import { generateId } from "@/utils/helpers";
import { optionsOfObject } from "@/utils/options";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  comprehensionQuestions: [defaultMCQQuestion],
};

const defaultDialogQuestion: DialogueQuestion = {
  id: generateId(),
  type: "dialogue",
  question: "",
  speaker: "",
  expectedAnswer: "",
  alternative: "",
  points: 1,
};

const defaultFollowUpQuestion: FollowUpQuestion = {
  id: generateId(),
  type: "follow_up",
  question: "",
  expectedAnswer: "",
  points: 1,
};

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
  value,
  onChange,
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
  }, [ready]);

  const categoryChange = useWatch({ control: form.control, name: "category" });
  const level = useWatch({ control: form.control, name: "level" });
  const content = useWatch({ control: form.control, name: "content" });

  const { data: filteredLessons } = useGetFilteredLessons({
    category: categoryChange,
    level,
  });

  const type = useWatch({
    control: form.control,
    name: `content.${contentIdx}.type`,
  });
  const prevType = useRef(true);
  useEffect(() => {
    if (prevType.current) {
      prevType.current = false;
      return;
    }
    if (!type) return;
    if (type === "mcq") {
      form.setValue(`content.${contentIdx}.id`, generateId());
      form.setValue(`content.${contentIdx}.question`, "");
      form.setValue(`content.${contentIdx}.options`, ["", "", "", ""]);
      form.setValue(`content.${contentIdx}.correctAnswer`, "");
      form.setValue(`content.${contentIdx}.points`, 1);
    }
    if (type === "matching") {
      form.setValue(`content.${contentIdx}.id`, generateId());
      form.setValue(`content.${contentIdx}.pairs`, [
        { id: generateId(), left: "", right: "" },
      ]);
      form.setValue(`content.${contentIdx}.points`, 1);
    }
  }, [type, contentIdx]);

  // Initialize questions with default if empty
  const questions = useMemo(
    () => (value?.length ? value : [defaultQuestion(category ?? "")]),
    [value, category],
  );

  // Update React state and propagate changes up
  const updateState = (
    updater:
      | ExerciseQuestion[]
      | ((prev: ExerciseQuestion[]) => ExerciseQuestion[]),
  ) => {
    const newState =
      typeof updater === "function" ? updater(questions) : updater;

    onChange?.(newState);
  };

  // Add, update, remove question handlers
  const addQuestion = () => {
    updateState((prev) => [...prev, defaultQuestion(category ?? "")]);
  };
  const updateQuestion = (id: string, field: string, value: any) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        return (q = { ...q, [field]: value });
      }),
    );
  };
  const removeQuestion = (id: string) => {
    updateState((prev) =>
      prev.length > 1 ? prev.filter((q) => q.id !== id) : prev,
    );
  };

  // ------------------------
  // MCQ OPTIONS
  // ------------------------

  const addOption = (qId: string) => {
    

    updateState((prev) =>
      prev.map((q) => {
        console.log("WHAT IS CONDITION:",q);
        
        if (q.id === qId && q.type === "mcq") {
          return { ...q, options: [...q.options, ""] };
        }
        return q;
      }),
    );
  };

  const updateOption = (qId: string, index: number, value: string) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id === qId && q.type === "mcq") {
          const options = [...q.options];
          options[index] = value;
          return { ...q, options };
        }
        return q;
      }),
    );
  };

  const removeOption = (qId: string, index: number) => {
    console.log("WHAT IS QID:", qId, index);

    updateState((prev) =>
      prev.map((q) => {

    console.log("WHAT IS CONDITION:",q);
        
        if (q.id === qId && q.type === "mcq" && q.options.length > 2) {
          return {
            ...q,
            options: q.options.filter((_, i) => i !== index),
          };
        }
        return q;
      }),
    );
  };

  // ------------------------
  // MATCHING
  // ------------------------

  const addPair = (qId: string) => {
    updateState((prev) =>
      prev.map((q) => {
        console.log("WHAT IS Q", q);

        return q.id === qId && q.type === "matching"
          ? {
              ...q,
              pairs: [...q.pairs, { id: generateId(), left: "", right: "" }],
            }
          : q;
      }),
    );
  };

  const updatePair = (
    qId: string,
    pairId: string,
    field: "left" | "right",
    value: string,
  ) => {
    updateState((prev) =>
      prev.map((q) =>
        q.id === qId && q.type === "matching"
          ? {
              ...q,
              pairs: q.pairs.map((p) =>
                p.id === pairId ? { ...p, [field]: value } : p,
              ),
            }
          : q,
      ),
    );
  };

  const removePair = (qId: string, pairId: string) => {
    updateState((prev) =>
      prev.map((q) =>
        q.id === qId && q.type === "matching" && q.pairs.length > 1
          ? {
              ...q,
              pairs: q.pairs.filter((p) => p.id !== pairId),
            }
          : q,
      ),
    );
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
    updateQuestion,
    addOption,
    updateOption,
    removeOption,
    addPair,
    updatePair,
    removePair,
  };
};

export default useExerciseBuilder;
