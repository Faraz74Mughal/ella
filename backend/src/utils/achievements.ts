export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your first lesson",
    icon: "🎯",
    condition: (progress) => (progress.completed_lessons?.length || 0) >= 1,
  },
  {
    id: "speaking-star",
    name: "Speaking Star",
    description: "Complete 5 lessons",
    icon: "⭐",
    condition: (progress) => (progress.completed_lessons?.length || 0) >= 5,
  },
  {
    id: "ten-day-streak",
    name: "10 Day Streak",
    description: "Maintain a 10-day learning streak",
    icon: "🔥",
    condition: (progress) => (progress.current_streak || 0) >= 10,
  },
  {
    id: "flame-master",
    name: "Flame Master",
    description: "Reach a 30-day streak",
    icon: "🔥🔥",
    condition: (progress) => (progress.highest_streak || 0) >= 30,
  },
  {
    id: "vocabulary-master",
    name: "Vocabulary Master",
    description: "Achieve 90%+ in vocabulary",
    icon: "📚",
    condition: (progress) => (progress.category_performance?.vocabulary || 0) >= 90,
  },
  {
    id: "grammar-master",
    name: "Grammar Master",
    description: "Achieve 90%+ in grammar",
    icon: "✏️",
    condition: (progress) => (progress.category_performance?.grammar || 0) >= 90,
  },
  {
    id: "listening-expert",
    name: "Listening Expert",
    description: "Achieve 85%+ in listening",
    icon: "👂",
    condition: (progress) => (progress.category_performance?.listening || 0) >= 85,
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Earn 1000 XP",
    icon: "🎓",
    condition: (progress) => (progress.total_xp || 0) >= 1000,
  },
];

export const checkAndUnlockAchievements = (progress: any) => {
  const currentUnlocked = progress.unlocked_achievements || [];
  let updated = false;

  ACHIEVEMENTS.forEach((achievement) => {
    const isUnlocked = currentUnlocked.includes(achievement.id);
    const shouldUnlock = achievement.condition(progress);

    if (shouldUnlock && !isUnlocked) {
      currentUnlocked.push(achievement.id);
      updated = true;
    }
  });

  progress.unlocked_achievements = currentUnlocked;
  return updated;
};

export const getUnlockedAchievements = (progress: any) => {
  const unlockedIds = progress.unlocked_achievements || [];
  return ACHIEVEMENTS.filter((achievement) => unlockedIds.includes(achievement.id));
};

export const getAllAchievements = (progress: any) => {
  const unlockedIds = progress.unlocked_achievements || [];
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
  }));
};
