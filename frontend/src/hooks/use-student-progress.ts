import { studentProgressService } from "@/api/student-progress.service";
import { useMutation ,useQuery} from "@tanstack/react-query";

export function useFetchLessonsForStudent() {
  //   const setAuth = useAuthStore((state) => state.setAuth);

  return useQuery({
    queryKey: ['lessons'],
    queryFn: studentProgressService.fetchLessonsForStudent,
  });
}
