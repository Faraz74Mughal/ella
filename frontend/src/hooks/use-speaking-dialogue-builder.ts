import type { DialogueLine } from "@/types/speaking-question";
import { generateId } from "@/utils/helpers";
import { useMemo, useState } from "react";

const createDefaultQuestion = (): DialogueLine => ({
  id: generateId(),
  type: "dialogue",
  speaker: "",
  question: "",
  expectedResponse: "",
  alternative: "",
});

export const useSpeakingDialogueBuilder = ({
  value,
  onChange,
}: {
  value?: DialogueLine[];
  onChange?: (value: DialogueLine[]) => void;
} = {}) => {
  const [error, setError] = useState<string>("");
  const [speakers, setSpeakers] = useState<string[]>(["Teacher", "Mentor"]);
  const [newSpeaker, setNewSpeaker] = useState("");

  const questions = useMemo(
    () => (value?.length ? value : [createDefaultQuestion()]),
    [value],
  );

  const updateState = (
    updater: DialogueLine[] | ((prev: DialogueLine[]) => DialogueLine[]),
  ) => {
    const newState =
      typeof updater === "function" ? updater(questions) : updater;

    onChange?.(newState);
  };

  const moveLine = (id: string, direction: "up" | "down") => {
    updateState((prev) => {
      const index = prev.findIndex((line) => line.id === id);
      if (index === -1) return prev;

      const newLines = [...prev];

      if (direction === "up" && index > 0) {
        [newLines[index - 1], newLines[index]] = [
          newLines[index],
          newLines[index - 1],
        ];
      } else if (direction === "down" && index < prev.length - 1) {
        [newLines[index + 1], newLines[index]] = [
          newLines[index],
          newLines[index + 1],
        ];
      }

      return newLines;
    });
  };

  const addQuestion = () => {
    if (speakers.length < 1) {
      setError("Please add at least one speakers.");
      return;
    }
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

  const addSpeaker = () => {
    const trimmed = newSpeaker.trim();

    if (!trimmed) return;

    if (speakers.includes(trimmed)) {
      setError("Speaker already exists");
      return;
    }

    setSpeakers((prev) => [...prev, trimmed]);
    setNewSpeaker("");
    setError("");
  };

  const removeSpeaker = (speaker: string) => {
    setSpeakers((prev) => prev.filter((s) => s !== speaker));
  };

  return {
    questions,
    speakers,
    error,
    newSpeaker,
    addSpeaker,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setNewSpeaker,
    setSpeakers,
    removeSpeaker,
    moveLine,
  };
};
