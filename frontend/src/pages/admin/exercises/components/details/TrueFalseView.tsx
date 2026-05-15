
const TrueFalseView = ({ q }: any) => {
  return (
    <div className="space-y-2">
      <p>{q.question}</p>

      {/* <Badge variant={q.correctAnswer ? "secondary" : "destructive"}>
        {q.correctAnswer ? "True" : "False"}
      </Badge> */}
      <div className="p-2 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
        Answer: {q.correctAnswer ? "True" : "False"}
      </div>
    </div>
  );
};

export default TrueFalseView;
