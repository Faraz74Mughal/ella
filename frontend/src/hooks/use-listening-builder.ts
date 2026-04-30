import type {
  ComprehensionQuestions,
  ListeningQuestion,
} from "@/types/listening-question";
import { generateId } from "@/utils/helpers";
import { useMemo } from "react";

const types = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "true_false", label: "True or False" },
  { value: "fill_blank", label: "Fill in the Blank" },
];

const createComprehensionQuestionDefault = (): ComprehensionQuestions => ({
  id: generateId(),
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 1,
});

const createDefaultQuestion = (): ListeningQuestion => ({
  id: generateId(),
  type: "listening",
  file: null,
  transcript: "",
  points: 1,
  comprehensionQuestions: [createComprehensionQuestionDefault()],
});

const useListeningBuilder = ({
  value,
  onChange,
}: {
  value?: ListeningQuestion[];
  onChange?: (val: ListeningQuestion[]) => void;
} = {}) => {
  const questions = useMemo(
    () => (value?.length ? value : [createDefaultQuestion()]),
    [value],
  );

  const updateState = (
    updater:
      | ListeningQuestion[]
      | ((prev: ListeningQuestion[]) => ListeningQuestion[]),
  ) => {
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

  const addComprehensionQuestion = (listeningId: string) => {
    const newQuestion = createComprehensionQuestionDefault();
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== listeningId) return q;
        return {
          ...q,
          comprehensionQuestions: [...q.comprehensionQuestions, newQuestion],
        };
      }),
    );
  };

  const updateComprehensionQuestion = (
    listeningId: string,
    questionId: string,
    field: string,
    value: any,
  ) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== listeningId) return q;
        return {
          ...q,
          comprehensionQuestions: q.comprehensionQuestions.map((cq) =>
            cq.id !== questionId ? cq : { ...cq, [field]: value },
          ),
        };
      }),
    );
  };

  const removeComprehensionQuestion = (
    listeningId: string,
    questionId: string,
  ) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== listeningId) return q;
        return {
          ...q,
          comprehensionQuestions: q.comprehensionQuestions.filter(
            (cq) => cq.id !== questionId,
          ),
        };
      }),
    );
  };

  const addOption = (listeningId: string, questionId: string) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== listeningId) return q;
        return {
          ...q,
          comprehensionQuestions: q.comprehensionQuestions.map((cq) => {
            if (cq.id === questionId && cq.type === "mcq") {
              return { ...cq, options: [...cq.options, ""] };
            }
            return cq;
          }),
        };
      }),
    );
  };

  const updateOption = (listeningId: string, questionId: string, index: number, value: string) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id === listeningId) {
          return {
            ...q,
            comprehensionQuestions: q.comprehensionQuestions.map((cq) => {
              if (cq.id === questionId && cq.type === "mcq") {
                const options = [...cq.options];
                options[index] = value;
                return { ...cq, options };
              }
              return cq;
            }),
          };
        }
        return q;
      }),
    );
  };

  const removeOption = (listeningId: string, questionId: string, index: number) => {
    updateState((prev) =>
      prev.map((q) => {
        if (q.id !== listeningId) return q;
        return {
          ...q,
          comprehensionQuestions: q.comprehensionQuestions.map((cq) => {
            if (cq.id === questionId && cq.type === "mcq") {
              const options = [...cq.options];
              options.splice(index, 1);
              return { ...cq, options };
            }
            return cq;
          }),
        };
      }),
    );
  };

  return {
    questions,
    types,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addComprehensionQuestion,
    updateComprehensionQuestion,
    removeComprehensionQuestion,
    updateOption,
    addOption,
    removeOption,
  };
};

export default useListeningBuilder;




//  updateOption,
//   removeOption,
//   addOption,
//   updateQuestion,
