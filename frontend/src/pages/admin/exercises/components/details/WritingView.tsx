const WritingView = ({ q }: any) => {
  return (
    <div className="space-y-2 text-sm">
      <p><strong>Topic:</strong> {q.topic}</p>
      <p>Time Limit: {q.timeLimit} mins</p>
      <p>
        Words: {q.minimumWords} - {q.maximumWords}
      </p>
    </div>
  );
};

export default WritingView;