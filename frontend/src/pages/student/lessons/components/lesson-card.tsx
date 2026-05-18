import React from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Check, Lock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LessonStatus = "completed" | "current" | "next" | "locked";

interface Props {
  lesson: {
    _id?:string
    sequence_order: number;
    title: string;
    description: string;
    status: LessonStatus;
    score?: number;
    duration?: string;
    progress?: number;
  };
  idx: number;
}

const Circle = ({
  status,
  icon,
}: {
  status: LessonStatus;
  icon: React.ReactNode;
}) => {
  return (
    <div
      className={`z-10 my-4 flex ${status === "current" ? "h-16 w-16" : "h-12 w-12"} items-center justify-center rounded-full border-4 border-white ${status === "current" ? "bg-indigo-500" : status === "next" ? "bg-slate-100" : "bg-emerald-500"} shadow-md md:my-0`}
    >
      {icon}
    </div>
  );
};

export default function LessonCard({ lesson, idx }: Props) {
  const navigate = useNavigate()
  const isCompleted = lesson.status === "completed";
  const isCurrent = lesson.status === "current";
  const isNext = lesson.status === "next";
  const icon = isCompleted ? (
    <BookOpen className="text-sm text-white" />
  ) : isNext ? (
    <Lock className="text-sm text-gray-400" />
  ) : (
    <Play className="ml-1 text-sm text-white" />
  );
  const even = idx % 2 === 0;
  return (
    <div className={`${isNext&&"locked-card"}  relative flex w-full flex-col items-center justify-between md:flex-row`}>
      {!even && (
        <>
          <div className="order-1 hidden md:block md:w-5/12"></div>
          <Circle status={lesson.status} icon={icon} />
          {/* <div
            className={`z-10 my-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white ${isCurrent ? "bg-indigo-600  animate-pulse" : "bg-emerald-500"} shadow-xl ring-4 ring-indigo-100 md:my-0`}
          >
            <Play className="ml-1 text-xl text-white" />
          </div> */}
        </>
      )}
      <div
        className={
          !even
            ? "order-2 md:order-1 md:w-5/12"
            : "order-2 md:order-3 md:w-5/12"
        }
      >
        <div
        onClick={()=>navigate(`/student/lessons/${lesson?._id}`)}
          className={`relative rounded-3xl border-2   p-6 shadow-xl  ${isCompleted ? "border-emerald-500 shadow-emerald-100" : isCurrent ? (isNext ? "border-slate-200 bg-white" : "border-indigo-500 shadow-indigo-100 ") : ""}`}
        >
          {isNext && (
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
          )}
          <div className="mb-2 flex items-start justify-between">
            {isCurrent && (
              <>
                <Badge className="rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
                  In Progress
                </Badge>

                {/* <span className="cursor-pointer text-sm font-bold text-indigo-600 underline">
                  Resume
                </span> */}
              </>
            )}
          </div>
          {isCompleted && (
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
              <Check />
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-800">{lesson.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{lesson.description}</p>
          {isCompleted && (
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                Score: {lesson.score}%
              </span>
              <span className="text-xs text-slate-400">{lesson.duration}</span>
            </div>
          )}
          {/* {isCurrent && (
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
          )} */}
        </div>
      </div>
      {even && (
        <>
          <Circle status={lesson.status} icon={icon} />
          <div className="order-3 md:w-5/12"></div>
        </>
      )}
    </div>
  );
}
