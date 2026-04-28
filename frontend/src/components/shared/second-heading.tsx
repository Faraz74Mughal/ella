
const SecondHeading = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-4 w-1 bg-primary rounded-full"></div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
    </div>
  );
};

export default SecondHeading;
