import React from "react";

const DailyGoal = () => {
  return (
    <section className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
      <i className="fas fa-star absolute -right-4 -top-4 text-white/10 text-9xl"></i>
      <div className="relative">
        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded">
          Daily Goal
        </span>
        <h3 className="text-xl font-bold mt-4">
          Complete 3 Speaking Exercises
        </h3>
        <p className="text-indigo-100 text-xs mt-1">
          Earn 50 bonus coins today!
        </p>
      </div>
      <div className="w-full bg-white/20 h-2 rounded-full relative">
        <div className="bg-white h-2 rounded-full w-2/3"></div>
      </div>
    </section>
  );
};

export default DailyGoal;
