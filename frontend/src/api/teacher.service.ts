import api from "./client";
import type { ApiResponse, User } from "@/types/auth";

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
};
