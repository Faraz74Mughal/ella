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
        <div className="relative flex w-full flex-col items-center justify-between md:flex-row">
          <div className="order-2 md:order-1 md:w-5/12">
            <div className="relative rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-xl shadow-emerald-100">
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <i className="fas fa-check text-xs"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                01. Basic Greetings
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Learn how to introduce yourself and greet others formally.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                  Score: 95%
                </span>
                <span className="text-xs text-slate-400">10 mins</span>
              </div>
            </div>
          </div>
          <div className="z-10 my-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-emerald-500 shadow-md md:my-0">
            <i className="fas fa-book-open text-sm text-white"></i>
          </div>
          <div className="order-3 md:w-5/12"></div>
        </div>

        <div className="relative flex w-full flex-col items-center justify-between md:flex-row">
          <div className="order-1 hidden md:block md:w-5/12"></div>
          <div className="z-10 my-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full border-4 border-white bg-indigo-600 shadow-xl ring-4 ring-indigo-100 md:my-0">
            <i className="fas fa-play ml-1 text-xl text-white"></i>
          </div>
          <div className="order-2 md:order-3 md:w-5/12">
            <div className="scale-105 rounded-3xl border-2 border-indigo-600 bg-white p-8 shadow-2xl shadow-indigo-100 transition-transform">
              <div className="mb-2 flex items-start justify-between">
                <Badge className="rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
                  In Progress
                </Badge>
                <span className="cursor-pointer text-sm font-bold text-indigo-600 underline">
                  Resume
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                02. Essential Verbs
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Master the 'to-be' verbs and common action words in present
                tense.
              </p>
              <div className="mt-6">
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>Lesson Progress</span>
                  <span>40%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-indigo-600"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="locked-card relative flex w-full flex-col items-center justify-between md:flex-row">
          <div className="order-2 md:order-1 md:w-5/12">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-50/50">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-center shadow-sm">
                  <i className="fas fa-lock mb-2 text-2xl text-slate-400"></i>
                  <p className="text-[10px] leading-none font-bold tracking-widest text-slate-400 uppercase">
                    Locked
                  </p>
                  <p className="mt-1 text-[9px] text-slate-400">
                    Finish Unit 02 to unlock
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-400">
                03. Sentence Structure
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Learn how to build complex sentences using connectors.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                  <i className="fas fa-video text-xs"></i>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                  <i className="fas fa-microphone text-xs"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="z-10 my-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-200 shadow-md md:my-0">
            <i className="fas fa-lock text-sm text-slate-400"></i>
          </div>
          <div className="order-3 md:w-5/12"></div>
        </div>

        <div className="locked-card relative flex w-full flex-col items-center justify-between md:flex-row">
          <div className="order-1 hidden md:block md:w-5/12"></div>
          <div className="z-10 my-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-200 shadow-md md:my-0">
            <i className="fas fa-lock text-sm text-slate-400"></i>
          </div>
          <div className="order-2 md:order-3 md:w-5/12">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-50/50">
                <i className="fas fa-lock text-xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-400">
                04. Pronunciation Lab
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Focus on vowel sounds and word stress patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-[40px] bg-indigo-900 p-8 text-white shadow-2xl shadow-indigo-200 md:flex-row">
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
      </div>
    </div>
    </>
  );
};

export default LessonsPage;


