import { Badge } from "@/components/ui/badge";

const TrueFalseView = ({ q }: any) => {
  return (
    <div className="space-y-2">
      <p>{q.question}</p>

      <Badge variant={q.correctAnswer ? "default" : "destructive"}>
        {q.correctAnswer ? "True" : "False"}
      </Badge>
    </div>
  );
};

export default TrueFalseView;