import { STORAGE_KEY } from "@/config";
import userService from "@/services/api/teacherApi/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useFetchCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await userService.getCurrentUser(),
  });
};


export const useSignOut = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => await userService.signOut(),
    onSuccess: (response) => {
      if (response.success) {
        localStorage.removeItem(STORAGE_KEY);
        navigate("/sign-in");
      }
      return response;
    }
  });
};
