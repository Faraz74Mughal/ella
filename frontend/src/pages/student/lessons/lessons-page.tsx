import { Badge } from "@/components/ui/badge";
import { useFetchLessonsForStudent } from "@/hooks/use-student-progress";
// import { CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";
// import { useState } from "react";
import LessonCard from "./components/lesson-card";



const LessonsPage = () => {
  const { data: lessons } = useFetchLessonsForStudent();

  return (
    <>
   
    <div className="mx-auto max-w-5xl p-6 md:p-12">
      <div className="mb-12 text-center">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black tracking-widest text-indigo-700 uppercase">
          Category
        </span>
        <h1 className="mt-2 text-4xl font-black text-slate-800">
          English Foundations
        </h1>
        <p className="mt-2 text-slate-500">
          Complete lessons in order to unlock advanced challenges.
        </p>
      </div>

      <div className="relative space-y-12">
        <div className="absolute top-0 bottom-0 left-1/2 hidden w-1 -translate-x-1/2 bg-slate-200 md:block"></div>
        {(lessons||[]).map((lesson:any, idx:number) => (
          <LessonCard key={lesson._id} lesson={lesson} idx={idx} />
        ))}
       

        
      </div>

      {/* <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-[40px] bg-indigo-900 p-8 text-white shadow-2xl shadow-indigo-200 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500 bg-indigo-700">
            <i className="fas fa-award text-3xl text-amber-400"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold">Unit 1 Certificate</h4>
            <p className="text-xs text-indigo-300">
              Complete all 4 lessons to earn your first badge!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full border-2 border-indigo-900 bg-slate-200"></div>
            <div className="h-8 w-8 rounded-full border-2 border-indigo-900 bg-slate-300"></div>
            <div className="h-8 w-8 rounded-full border-2 border-indigo-900 bg-slate-400"></div>
          </div>
          <p className="text-xs font-medium">+240 students learning this now</p>
        </div>
      </div> */}
    </div>
    </>
  );
};

export default LessonsPage;


