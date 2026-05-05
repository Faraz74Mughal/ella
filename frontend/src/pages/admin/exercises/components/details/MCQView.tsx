import { CheckCircle } from "lucide-react";

const MCQView = ({ q }: any) => {
  return (
    <div className="space-y-3">
      <p className="font-medium">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt: string, i: number) => {
          const isCorrect = opt === q.correctAnswer;

          return (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-md border ${
                isCorrect
                  ? "border-green-500 bg-green-50"
                  : "bg-muted/40"
              }`}
            >
              <span>{opt}</span>
              {isCorrect && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MCQView;