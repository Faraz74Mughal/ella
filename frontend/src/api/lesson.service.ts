import type { ApiResponse } from "@/types/auth";
import api from "./client";
import type { IPagination } from "@/types/pagination";
import type { ILesson } from "@/types/lesson";

export const lessonService = {
  fetchLessonsByAdmin: async (
    tableData: IPagination,
  ): Promise<{ lessons: ILesson[]; pagination: IPagination }> => {
    const response = await api.get<
      ApiResponse<{ lessons: ILesson[]; pagination: IPagination }>
    >("/lessons?page=" + tableData.currentPage + "&limit=" + tableData.limit);

    const data = response?.data.data.lessons;
    const pagination = response?.data.data.pagination;

    return { lessons: data || [], pagination };
  },

  fetchSingleLessonByAdmin: async (id: string): Promise<ILesson> => {
    const response = await api.get<ApiResponse<{ lesson: ILesson }>>(
      `/lessons/${id}`,
    );

    return response?.data.data.lesson;
  },

  createLessonsByAdmin: async (data: ILesson): Promise<ILesson> => {
    const response = await api.post<ApiResponse<{ lesson: ILesson }>>(
      "/lessons",
      data,
    );

    return response?.data.data.lesson;
  },

  updateLessonsByAdmin: async ({
    id,
    data,
  }: {
    id: string;
    data: ILesson;
  }): Promise<ILesson> => {
    const response = await api.patch<ApiResponse<{ lesson: ILesson }>>(
      `/lessons/${id}`,
      data,
    );

    return response?.data.data.lesson;
  },
};
