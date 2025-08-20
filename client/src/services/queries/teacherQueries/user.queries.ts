import userService from "@/services/api/teacherApi/user.service";
import { useMutation } from "@tanstack/react-query";

export const useSignOut = () => {
    return useMutation({
      mutationFn: async() =>await userService.signOut()
    });
  };