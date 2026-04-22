import type { ApiResponse, User } from "@/types/auth";
import api from "./client";

export const userService = {
  updateRole: async (role: "student" | "teacher"): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>("/users/update-role", {
      role,
    });
    console.log("response",response);
    
    const  user =  response?.data?.data?.user;
    return user;
  },
  
};
