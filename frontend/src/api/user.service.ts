import type { ApiResponse, User } from "@/types/auth";
import api from "./client";
import type { IPagination } from "@/types/pagination";

export const userService = {
  updateRole: async (role: "student" | "teacher"): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      "/users/update-role",
      {
        role,
      },
    );
    console.log("response", response);

    const user = response?.data?.data?.user;
    return user;
  },

  fetchUsersByAdmin: async (tableData: IPagination): Promise<{ users: User[]; pagination: IPagination }> => {
    
    const response = await api.get<ApiResponse<{ users : User[],pagination: IPagination }>>(
      "/users?page=" + tableData.currentPage + "&limit=" + tableData.limit,
    );  

    const user = response?.data.data.users;
    const pagination = response?.data.data.pagination;

    return { users: user || [], pagination };
  },
};
