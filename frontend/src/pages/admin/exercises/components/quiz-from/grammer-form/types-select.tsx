import type { ITypes, SubQuestion } from "@/types/grammar-question";
import type { ComprehensionQuestions } from "@/types/listening-question";

interface TypeOptionsProps {
  types: ITypes[];
  question: any;
  updateQuestion: (
    questionId: string,
    field: any,
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