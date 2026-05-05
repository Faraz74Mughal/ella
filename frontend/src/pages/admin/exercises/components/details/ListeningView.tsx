const ListeningView = ({ q }: any) => {
  return (
    <div className="space-y-4">
      {q.file && (
        <audio controls className="w-full">
          <source src={q.file} />
        </audio>
      )}

      <div className="space-y-2">
        {q.comprehensionQuestions.map((cq: any, i: number) => (
          <div key={i} className="p-3 border rounded-md">
            <p className="text-sm font-medium">
              {i + 1}. {cq.question}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningView;