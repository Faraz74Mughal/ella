import { lessonService } from "@/api/lesson.service";
import type { IPagination } from "@/types/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
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


