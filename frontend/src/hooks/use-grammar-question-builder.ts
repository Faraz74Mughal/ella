import { useMemo } from "react";
import type {
  FillBlankQuestion,
  MatchingQuestion,
  MCQQuestion,
  SubQuestion,
} from "../types/grammar-question";
import { generateId } from "../utils/helpers";

const createDefaultQuestion = (): SubQuestion => ({
  id: generateId(),
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 1,
});

export const useQuestionBuilder = ({
  value,
  onChange,
}: {
  value?: SubQuestion[];
  onChange?: (val: SubQuestion[]) => void;
}) => {
  const questions = useMemo(
    () => (value?.length ? value : [createDefaultQuestion()]),
    [value],
  );
  const updateState = (
    updater: SubQuestion[] | ((prev: SubQuestion[]) => SubQuestion[]),
  ) => {
    const newState =
      typeof updater === "function" ? updater(questions) : updater;

    onChange?.(newState);
  };

  const types = [
    { value: "mcq", label: "Multiple Choice" },
    { value: "matching", label: "Match the following" },
    { value: "fill_blank", label: "Fill in the Blank" },
  ];

  // ------------------------
  // QUESTION LEVEL
  // ------------------------

  const addQuestion = () => {
    updateState((prev) => [...prev, createDefaultQuestion()]);
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        // 🔥 Type switching (RESET shape properly)
        if (field === "type") {
          if (value === "matching") {
            const newQ: MatchingQuestion = {
              id: q.id,
              type: "matching",
              pairs: [{ id: generateId(), left: "", right: "" }],
              shuffleOptions: true,
              points: q.points,
            };
            return newQ;
          }

          if (value === "mcq") {
            const newQ: MCQQuestion = {
              id: q.id,
              type: "mcq",
              question: "",
              options: ["", "", "", ""],
              correctAnswer: "",
              points: q.points,
            };
            return newQ;
          }

          if (value === "fill_blank") {
            const newQ: FillBlankQuestion = {
              id: q.id,
              type: "fill_blank",
              question: "",
              correctAnswer: "",
              alternatives: [],
              points: q.points,
            };
            return newQ;
          }
        }

        // then cast the result back to the specific Type.
        if (q.type === "mcq") {
          return { ...q, [field]: value } as any as MCQQuestion;
        }

        if (q.type === "fill_blank") {
          return { ...q, [field]: value } as any as FillBlankQuestion;
        }

        if (q.type === "matching") {
          return { ...q, [field]: value } as any as MatchingQuestion;
        }

        return q;
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

  const addOption = (qId: string) => {
    updateState((prev) =>
      prev.map((q) =>
        q.id === qId && q.type === "mcq"
          ? { ...q, options: [...q.options, ""] }
          : q,
      ),
    );
  };

  const removeOption = (qId: string, index: number) => {
    updateState((prev) =>
      prev.map((q) => {
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
      prev.map((q) =>
        q.id === qId && q.type === "matching"
          ? {
              ...q,
              pairs: [...q.pairs, { id: generateId(), left: "", right: "" }],
            }
          : q,
      ),
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

  const clearQuestions = () => {
    updateState([createDefaultQuestion()]);
  };

  return {
    questions,
    types,
    addQuestion,
    updateQuestion,
    removeQuestion,

    updateOption,
    addOption,
    removeOption,

    addPair,
    updatePair,
    removePair,
    clearQuestions,
  };
};
