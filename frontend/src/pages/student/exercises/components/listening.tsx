import { Mic } from "lucide-react";
import React from "react";

const Listening = ({ q }: { q: any }) => {
  return (
    <div className="space-y-4">
      {q.speaker && (
        <p className="text-xs font-semibold text-indigo-600 uppercase">
          {q.speaker}
        </p>
      )}
      <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
      <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-300 transition-colors">
        <button className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center mx-auto mb-2">
          <Mic size={24} className="text-white" />
        </button>
        <p className="text-sm text-slate-500">Tap to record your response</p>
      </div>
      <p className="text-xs text-slate-400">Expected: {q.expectedAnswer}</p>
    </div>
  );
};

export default Listening;
