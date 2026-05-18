import { Lock } from "lucide-react";
import { useMemo } from "react";
import { ACHIEVEMENTS } from "@/types/achievement";
import { useFetchStudentProgress } from "@/hooks/use-student-progress";

const StudentAchievementsPage = () => {
  const { data: studentProgress } = useFetchStudentProgress();

  const achievementsWithStatus = useMemo(() => {
    const unlockedIds = studentProgress?.unlocked_achievements || [];
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
    }));
  }, [studentProgress?.unlocked_achievements]);

  const unlockedCount = achievementsWithStatus.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Achievements 🏆</h1>
        <p className="text-slate-500 mt-2">
          Complete challenges and unlock badges to show your progress!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Your Progress</h2>
            <span className="text-2xl font-bold text-indigo-600">
              {unlockedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4">
            <div
              className="bg-linear-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-600">
            {progressPercentage}% Complete - Keep learning to unlock more achievements!
          </p>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievementsWithStatus.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-2xl border-2 p-6 transition-all ${
              achievement.unlocked
                ? "bg-linear-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-md"
                : "bg-slate-50 border-slate-300 opacity-75"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`text-5xl shrink-0 ${
                  achievement.unlocked ? "" : "opacity-40 grayscale"
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-800">
                    {achievement.name}
                  </h3>
                  {!achievement.unlocked && (
                    <Lock size={18} className="text-slate-400" />
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                    ✓ Unlocked
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unlock Tips */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-3">💡 Tips to Unlock More Achievements</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Complete lessons regularly to build your streak</li>
          <li>✓ Focus on weak categories to improve your performance scores</li>
          <li>✓ Keep learning and earning XP to reach the Scholar badge</li>
          <li>✓ Maintain consistency - your daily progress matters!</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentAchievementsPage;
