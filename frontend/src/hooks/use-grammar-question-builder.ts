import { useEffect, useMemo, useState } from "react";
import type { SubQuestion } from "../types/grammar-question";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createDefaultQuestion = (): SubQuestion => ({
  id: generateId(),
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 10,
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
    updateState((prev) => [
      ...prev,
      {
        id: generateId(),
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 10,
      },
    ]);
  };

  const updateQuestion = (id: string, field: keyof SubQuestion, value: any) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

       if (field === "type") {
  if (value === "matching") {
    return {
      id: q.id,
      type: "matching",
      question: "",
      pairs: [{ id: generateId(), left: "", right: "" }],
      shuffleOptions: true,
      correctAnswer: [],
      points: q.points,
    };
  }

  if (value === "mcq") {
    return {
      id: q.id,
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: q.points,
    };
  }

  if (value === "fill_blank") {
    return {
      id: q.id,
      type: "fill_blank",
      question: "",
      correctAnswer: "",
      alternatives: [],
      points: q.points,
    };
  }
}
        console.log("LOAS", id, field, value);
        return { ...q, [field]: value };
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
        if (q.id === qId && q.options) {
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
        q.id === qId && q.options ? { ...q, options: [...q.options, ""] } : q,
      ),
    );
  };

  const removeOption = (qId: string, index: number) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id === qId && q.options && q.options.length > 2) {
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
        q.id === qId && q.pairs
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
        q.id === qId && q.pairs
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
        q.id === qId && q.pairs && q.pairs.length > 1
          ? { ...q, pairs: q.pairs.filter((p) => p.id !== pairId) }
          : q,
      ),
    );
  };

  const clearQuestions = () => {
    updateState([
      {
        id: generateId(),
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 10,
      },
    ]);
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
