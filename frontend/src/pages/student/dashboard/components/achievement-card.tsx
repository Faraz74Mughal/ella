import { Brain, Flame, Lock } from "lucide-react";
import React from "react";

const AchievementCard = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200">
      <h3 className="font-bold mb-4 flex justify-between items-center">
        Achievements
        <a href="#" className="text-xs text-indigo-600">
          View All
        </a>
      </h3>
      <div className="grid grid-cols-4 gap-2">
        <div
          className="aspect-square bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 shadow-sm"
          title="10 Day Streak"
        >
          <Flame />
        </div>
        <div
          className="aspect-square bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shadow-sm"
          title="Vocabulary Master"
        >
          <Brain />
        </div>
        <div
          className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 border-2 border-dashed"
          title="Locked"
        >
          <Lock />
        </div>
        <div
          className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 border-2 border-dashed"
          title="Locked"
        >
          <Lock />
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
