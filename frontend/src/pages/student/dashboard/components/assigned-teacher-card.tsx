import { Clock, ListCheck } from "lucide-react";
import React from "react";

const AssignedTeacherCard = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800">
          Assigned by Teacher
        </h2>
        <a href="#" className="text-xs font-bold text-indigo-600 underline">
          View all
        </a>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
        <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition cursor-pointer group">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-bold">
            <Clock />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
              Pronunciation Peer Review
            </h4>
            <p className="text-xs text-slate-400">Due: Tomorrow, 10:00 AM</p>
          </div>
          <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black">
            START
          </button>
        </div>
        <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition cursor-pointer group">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center font-bold">
            <ListCheck />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">Unit 4: Mock Quiz</h4>
            <p className="text-xs text-slate-400">Practice for Final Exam</p>
          </div>
          <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black">
            START
          </button>
        </div>
      </div>
    </section>
  );
};

export default AssignedTeacherCard;
