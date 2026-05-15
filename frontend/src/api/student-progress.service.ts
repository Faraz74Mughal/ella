import type { ApiResponse, User } from "@/types/auth";
import api from "./client";
import type { IPagination } from "@/types/pagination";
import type { ITeacherForm, IUser } from "@/types/user";

export const studentProgressService = {
  fetchLessonsForStudent: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ lessons: any }>>(
      "/student-progress",
    );
    console.log("response", response);

    const lessons = response?.data?.data?.lessons;
    return lessons;
  },

  fetchUsersByAdmin: async (
    tableData: IPagination,
  ): Promise<{ users: User[]; pagination: IPagination }> => {
    const response = await api.get<
      ApiResponse<{ users: User[]; pagination: IPagination }>
    >("/users?page=" + tableData.currentPage + "&limit=" + tableData.limit);

    const user = response?.data.data.users;
    const pagination = response?.data.data.pagination;

    return { users: user || [], pagination };
  },

  createTeacherByAdmin: async (
    body: ITeacherForm,
  ): Promise<{ user: IUser }> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/teacher/add",
      body,
    );

    const user = response?.data.data.user;

    return { user: user || ({} as IUser) };
  },
};
