import React from "react";

const PerformanceCard = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
      <h3 className="font-black text-slate-800 mb-6">Your Performance</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-slate-400 uppercase">Speaking</span>
            <span className="text-indigo-600">82%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full"
              style={{ width: `${82}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-slate-400 uppercase">Vocabulary</span>
            <span className="text-emerald-500">45%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${45}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100">
        <button className="w-full py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
          View Detailed Analytics
        </button>
      </div>
    </section>
  );
};

export default PerformanceCard;
