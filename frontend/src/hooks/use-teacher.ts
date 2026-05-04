import { teacherService } from "@/api/teacher.service";
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



export function useUpdatePassword() {

  return useMutation({
    mutationFn: teacherService.updatePassword,
    // onSuccess: (data) => {
    //   setAuth(data);
    // },
  });
}
