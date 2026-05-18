import { Lock } from "lucide-react";
import { useMemo } from "react";
import { ACHIEVEMENTS } from "@/types/achievement";
import { useFetchStudentProgress } from "@/hooks/use-student-progress";

const AchievementCard = () => {
  const { data: studentProgress } = useFetchStudentProgress();

  const achievementsWithStatus = useMemo(() => {
    const unlockedIds = studentProgress?.unlocked_achievements || [];
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
    }));
  }, [studentProgress?.unlocked_achievements]);

  const unlockedCount = achievementsWithStatus.filter((a) => a.unlocked).length;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200">
      <h3 className="font-bold mb-4 flex justify-between items-center">
        <span>Achievements ({unlockedCount}/{ACHIEVEMENTS.length})</span>
        <a href="/student/achievements" className="text-xs text-indigo-600 hover:text-indigo-700">
          View All
        </a>
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {achievementsWithStatus.map((achievement) => (
          <div
            key={achievement.id}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-center transition-all ${
              achievement.unlocked
                ? "bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-md"
                : "bg-slate-100 border-2 border-dashed border-slate-300 opacity-60"
            }`}
            title={achievement.unlocked ? achievement.name : "Locked"}
          >
            <div className="text-3xl mb-1">{achievement.icon}</div>
            {!achievement.unlocked && (
              <Lock size={20} className="text-slate-400" />
            )}
          </div>
        ))}
      </div>
      {unlockedCount > 0 && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-xs text-indigo-700 font-semibold">
            You've unlocked {unlockedCount} achievement{unlockedCount !== 1 ? "s" : ""}!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
