import { lessonService } from "@/api/lesson.service";
import { CATEGORY_QUIZ_MAP, QUIZ_TYPES } from "@/constants/lesson.constant";
import type { IFilteredLessonOptions } from "@/types/lesson";
import type { IPagination } from "@/types/pagination";
import { optionsOfObject } from "@/utils/options";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function useGetLessonsByAdmin(tableData: IPagination) {
  return useQuery({
    queryKey: ["admin-lesson-fetch", tableData],
    queryFn: () => lessonService.fetchLessonsByAdmin(tableData as IPagination),
  });
}

export function useGetSingleLessonByAdmin(id: string) {
  return useQuery({
    queryKey: ["admin-lesson-fetch-single", id],
    queryFn: () => lessonService.fetchSingleLessonByAdmin(id),
  });
}

export function useAddLessonByAdmin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: lessonService.createLessonsByAdmin,
    onSuccess: (data) => {
      if (data) navigate("/admin/lessons");
    },
  });
}

export function useUpdateLessonByAdmin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: lessonService.updateLessonsByAdmin,
    onSuccess: (data) => {
      if (data) navigate("/admin/lessons");
    },
  });
}

export function useDeleteLessonByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonService.deleteLessonsByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-lesson-fetch"],
      });
    },
  });
}

export function useGetFilteredLessons(selectedValue: IFilteredLessonOptions) {
  return useQuery({
    queryKey: ["filtered-lessons", selectedValue.level, selectedValue.category],
    queryFn: () =>
      lessonService.fetchFilteredLessonsByAdmin({
        level: selectedValue.level,
        category: selectedValue.category,
      }),
    enabled: !!selectedValue.level && !!selectedValue.category,
  });
}

export const useExerciseTypeOptions = (
  category: string,
) => {
  return useMemo(() => {
    const keys = CATEGORY_QUIZ_MAP[category]||[];
    
    const result: any = {};
    keys.forEach((key) => {
      result[key] = QUIZ_TYPES[key as keyof typeof QUIZ_TYPES];
    });
    return optionsOfObject(result) || [];
  }, [category]);
};
