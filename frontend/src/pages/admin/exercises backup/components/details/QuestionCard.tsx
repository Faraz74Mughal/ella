import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MCQView from "./MCQView";
import FillBlankView from "./FillBlankView";
import TrueFalseView from "./TrueFalseView";
import MatchingView from "./MatchingView";
import WritingView from "./WritingView";
import ListeningView from "./ListeningView";

const QuestionCard = ({ q, index }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          Q{index + 1}
        </CardTitle>

        {"points" in q && (
          <Badge variant="outline">{q.points} pts</Badge>
        )}
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        {q.type === "mcq" && <MCQView q={q} />}
        {q.type === "fill_blank" && <FillBlankView q={q} />}
        {q.type === "true_false" && <TrueFalseView q={q} />}
        {q.type === "matching" && <MatchingView q={q} />}
        {q.type === "writing" && <WritingView q={q} />}
        {q.type === "listening" && <ListeningView q={q} />}
      </CardContent>
    </Card>
  );
};


export default QuestionCard;