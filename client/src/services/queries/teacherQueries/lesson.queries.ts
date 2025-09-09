import lessonService from "@/services/api/teacherApi/lesson.service";
import { ILesson } from "@/types/lessonInterface";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchLessons = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: async () => await lessonService.getLessons(),
  });
};


export const useCreateLesson = () => {
  return useMutation({
    mutationFn: async (data:ILesson) => await lessonService.addLesson(data),
    onSuccess: (response) => response
  });
};
