import type { ApiResponse } from "@/types/auth";

export type QuizCategory =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "speaking"
  | "writing";

export interface StudentQuizSubmissionPayload {
  lesson_id: string;
  exercise_id: string;
  category: QuizCategory;
  score_earned: number;
  max_score: number;
  percentage: number;
  is_passed: boolean;
  submitted_payload?: unknown;
}

export interface StudentQuizSubmissionResult {
  submission: {
    _id: string;
    rewards_applied: boolean;
    points_earned: number;
    xp_earned: number;
  };
  rewardsApplied: boolean;
  rewardSummary: {
    pointsEarned: number;
    xpEarned: number;
  };
  progress: {
    total_points: number;
    total_xp: number;
  };
}

const getSubmissionUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const apiRoot = apiUrl.replace(/\/api\/v1\/?$/, "");

  return `${apiRoot}/api/submissions/save`;
};

export const saveStudentQuizSubmission = async (
  payload: StudentQuizSubmissionPayload,
): Promise<StudentQuizSubmissionResult> => {
  const token = localStorage.getItem("token");

  const response = await fetch(getSubmissionUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<StudentQuizSubmissionResult>;

  if (!response.ok) {
    throw new Error(data?.message || "Failed to save quiz submission.");
  }

  return data.data;
};