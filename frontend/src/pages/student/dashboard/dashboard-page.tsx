import { BookOpen, Flame, Star, Trophy } from "lucide-react";
import StatCard from "./components/stat-card";
import LiveSessionsCard from "./components/live-sessions-card";
import PerformanceCard from "./components/performance-card";
import DiscussionDormCard from "./components/discussion-form-card";
import AssignedTeacherCard from "./components/assigned-teacher-card";

import ContinueLearningCard from "./components/continue-learning-card";
import AchievementCard from "./components/achievement-card";
import { useFetchStudentProgress } from "@/hooks/use-student-progress";
import { useGetSingleLessonByAdmin } from "@/hooks/use-lesson";

const StudentDashboardPage = () => {


  const { data: studentProgress } = useFetchStudentProgress();
  const { data: lesson } = useGetSingleLessonByAdmin(
    studentProgress?.unlocked_lessons?.[1] || "",
  );
  console.log("studentProgress", studentProgress, lesson);

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            You've learned 85% more this week. Keep it up!
          </p>
        </div>
        {/* <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Flame size={18} /> Daily Challenge
        </button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat}  />
          ))} */}
        <StatCard
          stat={{
            label: "Current Streak",
            value: `${studentProgress?.current_streak || 0} Days`,
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-100",
          }}
        />
        <StatCard
          stat={{
            label: "Total XP",
            value: `${studentProgress?.total_xp || 0}`,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-100",
          }}
        />
        <StatCard
          stat={{
            label: "Lesson Complete",
            value: (studentProgress?.completed_lessons || [])?.length || 0,
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-100",
          }}
        />
        <StatCard
          stat={{
            label: "Rank",
            value: "#42",
            icon: Trophy,
            color: "text-purple-500",
            bg: "bg-purple-100",
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* <DailyGoal  /> */}
          <AssignedTeacherCard />
          {lesson && <ContinueLearningCard lesson={lesson} />}
          <DiscussionDormCard />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <AchievementCard />
          {studentProgress?.category_performance && (
            <PerformanceCard
              performance={studentProgress?.category_performance}
            />
          )}
          <LiveSessionsCard />
        </div>
      </div>
      {/* <button
        onClick={handleLogout}
        className="bg-white text-black rounded-lg px-3 py-2"
      >
        Logout
      </button> */}
    </div>
  );
};

export default StudentDashboardPage;
