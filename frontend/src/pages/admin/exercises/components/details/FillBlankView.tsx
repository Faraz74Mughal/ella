const FillBlankView = ({ q }: any) => {
  return (
    <div className="space-y-2">
      <p>{q.question}</p>

      <div className="p-2 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
        Answer: {q.correctAnswer}
      </div>
    </div>
  );
};

export default FillBlankView;