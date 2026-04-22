import { exerciseService } from "@/api/exercise.service";
import type { IPagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useGetExercisesByAdmin(tableData: IPagination) {
  return useQuery({
    queryKey: ["admin-exercise-fetch", tableData],
    queryFn: () =>
      exerciseService.fetchExercisesByAdmin(tableData as IPagination),
  });
}

export function useGetSingleExerciseByAdmin(id: string) {
  return useQuery({
    queryKey: ["admin-exercise-fetch-single", id],
    queryFn: () => exerciseService.fetchSingleExerciseByAdmin(id),
  });
}

export function useAddExerciseByAdmin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: exerciseService.createExercisesByAdmin,
    onSuccess: (data) => {
      if (data) navigate("/admin/exercises");
    },
  });
}

export function useUpdateExerciseByAdmin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: exerciseService.updateExercisesByAdmin,
    onSuccess: (data) => {
      if (data) navigate("/admin/exercises");
    },
  });
}

export function useDeleteExerciseByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exerciseService.deleteExercisesByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-exercise-fetch"],
      });
    },
  });
}
