import React from "react";

const DiscussionDormCard = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Discussion Form</h2>
        <button className="text-indigo-600 text-sm font-semibold hover:underline">
          View All
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
        <div className="space-y-4">
          <div className="group cursor-pointer">
            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition line-clamp-1">
              How to use "whom" vs "who"?
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-400">
                12 Replies • Active 2m ago
              </p>
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-slate-200 border border-white"></div>
                <div className="w-4 h-4 rounded-full bg-slate-300 border border-white"></div>
              </div>
            </div>
          </div>
          <hr className="border-slate-50" />
          <div className="group cursor-pointer">
            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition line-clamp-1">
              Tips for IELTS Speaking Part 2
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              5 Replies • Active 1h ago
            </p>
          </div>
        </div>
        <button className="w-full mt-6 bg-slate-100 text-slate-600 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
          Go to Community
        </button>
      </div>
    </section>
  );
};

export default DiscussionDormCard;
