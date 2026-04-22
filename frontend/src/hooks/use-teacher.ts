import { teacherService } from "@/api/teacher.services";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

export function useApplyTeacher() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: teacherService.applyVerification,
    onSuccess: (data) => {
      setAuth(data);
    },
  });
}
