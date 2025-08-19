import authService from "@/services/api/teacherApi/auth.service";
import { TSignIn, TToken } from "@/types/userType";
import { useMutation } from "@tanstack/react-query";

export const useSignIn = () => {
  return useMutation({
    mutationFn: (data: TSignIn) => authService.signIn(data)
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: (data: TSignIn) => authService.signUp(data)
  });
};

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: (data:TToken) => authService.verifyUser(data)
  });
};
