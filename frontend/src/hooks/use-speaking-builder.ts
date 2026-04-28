import type { FolloWUpQuestion } from "@/types/speaking-question";
import { generateId } from "@/utils/helpers";
import { useMemo } from "react";

const createDefaultQuestion = (): FolloWUpQuestion => ({
  id: generateId(),
  type: "follow_up",
  question: "",
  expectedAnswer: "",
  points: 1,
});

export const useSpeakingBuilder = ({
  value,
  onChange,
}: {
  value: FolloWUpQuestion[];
  onChange: (value: FolloWUpQuestion[]) => void;
}) => {
  const questions = useMemo(
    () => (value?.length ? value : [createDefaultQuestion()]),
    [value],
  );

  const updateState = (updater: FolloWUpQuestion[] | ((prev: FolloWUpQuestion[]) => FolloWUpQuestion[])) => {
    const newState =
      typeof updater === "function" ? updater(questions) : updater;

    onChange?.(newState);
  };

  const addQuestion = () => {
    updateState((prev) => [...prev, createDefaultQuestion()]);
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

  return {
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
  };
};
