import type { ITypes, SubQuestion } from "@/types/grammar-question";

interface TypeOptionsProps {
  types: ITypes[];
  question: SubQuestion;
  updateQuestion: (
    questionId: string,
    field: keyof SubQuestion,
    value: any,
  ) => void;
}


const TypesSelect = ({ types, question, updateQuestion }: TypeOptionsProps) => {
  return (
    <select
      value={question.type}
      onChange={(e) => updateQuestion(question.id, "type", e.target.value)}
      className="px-2 py-1 border rounded-md text-sm"
    >
      {types.map((option: ITypes) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default TypesSelect