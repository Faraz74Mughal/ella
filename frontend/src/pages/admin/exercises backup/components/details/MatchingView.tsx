const MatchingView = ({ q }: any) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {q.pairs.map((pair: any, i: number) => (
        <div key={i} className="contents">
          <div className="p-2 bg-muted rounded border">
            {pair.left}
          </div>
          <div className="p-2 bg-green-50 rounded border border-green-200">
            {pair.right}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchingView;