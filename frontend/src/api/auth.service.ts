import api from "./client";
import type { LoginInput, ApiResponse, User } from "@/types/auth";

export const authService = {
  register: async (credentials: LoginInput): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/auth/register",
      credentials,
    );
    console.log("REGISTER RESPONSE:", response);
    const user = response?.data?.data.user;
    return user;
  },
  login: async (credentials: LoginInput): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/auth/login",
      credentials,
    );
    const user = response?.data?.data.user;
    return user;
  },

  googleLogin: async (googleId: string): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/auth/google-login",
      {
        googleId,
      },
    );
    const user = response?.data?.data.user;
    return user;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    const user = response?.data?.data.user;
    return user;
  },
  assignRole: async (_id: string, role: string): Promise<User> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/auth/assign-role",
      { _id, role },
    );
    const user = response?.data?.data.user;
    return user;
  },

  verifyEmail: async (token: string): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>(
      `/auth/verify-email/${token}`,
    );
    console.log("CHECK ", response);

    return response?.data.data.user;
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await api.post("/auth/resend-verification", {
      email,
    });
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
