import type { ApiResponse } from "@/types/auth";
import api from "./client";
import type { IPagination } from "@/types/pagination";
import type { IExercise } from "@/types/exercise";

export const exerciseService = {
  fetchExercisesByAdmin: async (
    tableData: IPagination,
  ): Promise<{ exercises: IExercise[]; pagination: IPagination }> => {
    const response = await api.get<
      ApiResponse<{ exercises: IExercise[]; pagination: IPagination }>
    >("/exercises?page=" + tableData.currentPage + "&limit=" + tableData.limit);

    const data = response?.data.data.exercises;
    const pagination = response?.data.data.pagination;

    return { exercises: data || [], pagination };
  },

  fetchSingleExerciseByAdmin: async (id: string): Promise<IExercise> => {
    const response = await api.get<ApiResponse<{ exercise: IExercise }>>(
      `/exercises/${id}`,
    );

    return response?.data.data.exercise;
  },

  createExercisesByAdmin: async (data: IExercise): Promise<IExercise> => {
    const response = await api.post<ApiResponse<{ exercise: IExercise }>>(
      "/exercises",
      data,
    );

    return response?.data.data.exercise;
  },

  updateExercisesByAdmin: async ({
    id,
    data,
  }: {
    id: string;
    data: IExercise;
  }): Promise<IExercise> => {
    const response = await api.patch<ApiResponse<{ exercise: IExercise }>>(
      `/exercises/${id}`,
      data,
    );

    return response?.data.data.exercise;
  },

  deleteExercisesByAdmin: async (id: string): Promise<IExercise> => {
    const response = await api.delete<ApiResponse<{ exercise: IExercise }>>(
      `/exercises/${id}`,
    );

    return response?.data.data.exercise;
  },

  
};
