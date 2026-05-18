export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your first lesson",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "speaking-star",
    name: "Speaking Star",
    description: "Complete 5 lessons",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: "ten-day-streak",
    name: "10 Day Streak",
    description: "Maintain a 10-day learning streak",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "flame-master",
    name: "Flame Master",
    description: "Reach a 30-day streak",
    icon: "🔥🔥",
    unlocked: false,
  },
  {
    id: "vocabulary-master",
    name: "Vocabulary Master",
    description: "Achieve 90%+ in vocabulary",
    icon: "📚",
    unlocked: false,
  },
  {
    id: "grammar-master",
    name: "Grammar Master",
    description: "Achieve 90%+ in grammar",
    icon: "✏️",
    unlocked: false,
  },
  {
    id: "listening-expert",
    name: "Listening Expert",
    description: "Achieve 85%+ in listening",
    icon: "👂",
    unlocked: false,
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Earn 1000 XP",
    icon: "🎓",
    unlocked: false,
  },
];
