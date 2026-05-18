import api from "./client";
import type { ApiResponse, User } from "@/types/auth";

type TeacherRankedStudent = {
  rank: number;
  studentId: string;
  name: string;
  email: string;
  username: string;
  total_xp: number;
  total_points: number;
  completed_lessons_count: number;
  current_streak: number;
  highest_streak: number;
};

type TeacherDashboardOverview = {
  summary: {
    totalAssignments: number;
    totalUsers: number;
    totalStudents: number;
    assignedStudents: number;
  };
  ranking: TeacherRankedStudent[];
};

type UserProgressRow = {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  progress: {
    total_xp: number;
    total_points: number;
    current_streak: number;
    highest_streak: number;
    completed_lessons_count: number;
    assignment_average: number;
  };
};

type TeacherUsersProgress = {
  total: number;
  users: UserProgressRow[];
};

export const teacherService = {
  applyVerification: async (data: FormData): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/teachers/apply-verification",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const user = response?.data?.data.user;
    return user;
  },

  updatePassword: async (data: { oldPassword: string; newPassword: string }): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      "/teachers/update-password",
      data,
    );
    const user = response?.data?.data.user;
    return user;
  },

  fetchDashboardOverview: async (): Promise<TeacherDashboardOverview> => {
    const response = await api.get<ApiResponse<TeacherDashboardOverview>>(
      "/teachers/dashboard-overview",
    );
    return response?.data?.data;
  },

  fetchUsersProgress: async (): Promise<TeacherUsersProgress> => {
    const response = await api.get<ApiResponse<TeacherUsersProgress>>(
      "/teachers/users-progress",
    );
    return response?.data?.data;
  },
};
