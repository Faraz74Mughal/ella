import React from "react";

const LiveSessionsCard = () => {
  return (
    <section className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-slate-800">Live Sessions</h3>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl">
            👩‍🏫
          </div>
          <div>
            <h5 className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition">
              Grammar Q&A
            </h5>
            <p className="text-[10px] text-slate-400 mt-1">Starts in 15 mins</p>
          </div>
        </div>
        <div className="flex gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl">
            🗣️
          </div>
          <div>
            <h5 className="text-xs font-black text-slate-800">
              Peer Practice Room
            </h5>
            <p className="text-[10px] text-slate-400 mt-1">8 Students active</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSessionsCard;
